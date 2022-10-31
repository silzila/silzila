// This component is used to retrive a specific dataset to be edited
// The information about this dataset is loaded to store
// users can update existing dataset / re-define relationships in dataset

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ShortUniqueId from "short-unique-id";
import {
	setDatabaseNametoState,
	setServerName,

	setUserTable,
	setValuesToState,
} from "../../redux/DataSet/datasetActions";
import FetchData from "../ServerCall/FetchData";
import { FindShowHeadAndShowTail } from "../CommonFunctions/FindIntegrityAndCordinality";
import MenuBar from "../DataViewer/MenuBar";
import Canvas from "./Canvas";
import Sidebar from "./Sidebar";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import {
	ArrowsProps,
	DataSetStateProps,
	RelationshipsProps,
	tableObjProps,
	UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfacse";
import { Dispatch } from "redux";
import { CanvasIndividualTableProps, Columns, ColumnsWithUid } from "./DatasetInterfaces";
import { EditDatasetProps } from "./EditDataSetInterfaces";


const EditDataSet = ({
	//state
	token,
	dsId,
	databaseName,

	//dispatch
	setValuesToState,
	setUserTable,
	setDatabaseNametoState,
	setServerName,

}: EditDatasetProps) => {
	var dbName: string = "";
	var server: string = "";
	const [loadPage, setloadPage] = useState<boolean>(false);
	const [editMode, seteditMode] = useState<boolean>(true);
	const [connectionList, setConnectionList] = useState<any[]>([]);
	useEffect(() => {
		setAllInfo();
	}, []);

	const setAllInfo = async () => {
		// TODO:need to specify type
		var res: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "dataset/" + dsId,
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status) {
			var getDc: any = await FetchData({
				requestType: "noData",
				method: "GET",
				url: "database-connection",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (getDc.status) {
				console.log(getDc.data);
				getDc.data.map((dc: any) => {
					if (dc.id === res.data.connectionId) {
						dbName = dc.database;
						server = dc.vendor;
					}
				});
			}
			// console.log(res.data);
			// const uid = new ShortUniqueId({ length: 8 });

			const canvasTables: tableObjProps[] = await Promise.all(
				res.data.dataSchema.tables?.map(async (tbl: CanvasIndividualTableProps) => {
					return {
						table_uid: tbl.schema.concat(tbl.table),
						tableName: tbl.table,
						alias: tbl.alias,
						dcId: res.data.id,
						schema: tbl.schema,
						columns: await getColumns(res.data.connectionId, tbl.schema, tbl.table),
						isSelected: true,
						id: tbl.id,
						isNewTable: false,
						tablePositionX: tbl.tablePositionX ? tbl.tablePositionX : null,
						tablePositionY: tbl.tablePositionY ? tbl.tablePositionY : null,
					};
				})
			);

			console.log(canvasTables);

			// ======================== set tables & schema ====================================================

			var schema_list: string[] = res.data.dataSchema.tables.map(
				(table: CanvasIndividualTableProps) => {
					return table.schema;
				}
			);

			var uniqueSchema: string[] = Array.from(new Set(schema_list));
			// console.log(uniqueSchema);

			let userTable: UserTableProps[] = [];

			const getTables = async () => {
				var url: string = "";
				if (server === "mysql") {
					url = `metadata-tables/${res.data.connectionId}?database=${dbName}`;
				} else {
					url = `metadata-tables/${res.data.connectionId}?database=${dbName}&schema=${uniqueSchema[0]}`;
				}
				// TODO: need to specify type
				var res1: any = await FetchData({
					requestType: "noData",
					method: "GET",
					url: url,
					// url: `metadata-tables/${res.data.connectionId}?database=landmark&schema=${uniqueSchema[0]}`,
					headers: { Authorization: `Bearer ${token}` },
					token: token,
				});
				console.log(res1);
				if (res1.status) {
					const uid = new ShortUniqueId({ length: 8 });

					userTable = res1.data.tables.map((el: any) => {
						var id = "";
						var tableAlreadyChecked = canvasTables.filter(
							tbl =>
								tbl.dcId === res.data.dc_uid &&
								tbl.schema === uniqueSchema[0] &&
								tbl.tableName === el
						)[0];
						canvasTables.forEach((tbl: any) => {
							if (
								tbl.dcId === res.data.dc_uid &&
								tbl.schema === uniqueSchema[0] &&
								tbl.tableName === el
							) {
								id = tbl.id;
							}
						});
						if (tableAlreadyChecked) {
							return {
								tableName: el,
								isSelected: true,
								table_uid: uniqueSchema[0].concat(el),
								id: id,
								isNewTable: false,
							};
						}
						return {
							tableName: el,
							isSelected: false,
							table_uid: uniqueSchema[0].concat(el),
							id: uid(),
							isNewTable: true,
						};
					});
					// console.log(userTable, "$$$$$$$$$$$$$ user Table $$$$$$$$$$$$$$$");
					setUserTable(userTable);
				}
			};

			await getTables();

			// ====================================================================================

			// ============================= set relationships and arrows ==========================
			let arrowsArray: any = [];
			let relationshipsArray: any = [];
			let arrowObj: any = [];
			let relObject: any = [];

			res.data.dataSchema.relationships.map((obj: any) => {
				const uid = new ShortUniqueId({ length: 8 });

				const valuesForshowHeadAndshowTail: any = FindShowHeadAndShowTail(obj.cardinality);

				// x  - array of start tables
				const x = res.data.dataSchema.tables.filter((el: CanvasIndividualTableProps) => {
					return el.id === obj.table1;
				});

				// y - array of endTables
				const y = res.data.dataSchema.tables.filter((el: CanvasIndividualTableProps) => {
					return el.id === obj.table2;
				});

				let columns_in_relationships: any = [];
				let relationUniqueId: any = "";

				obj.table1Columns.map((el: any, index: number) => {
					var table2_col = obj.table2Columns[index];
					let rel = { tab1: el, tab2: table2_col };
					columns_in_relationships.push(rel);
					relationUniqueId = uid();
				});

				// console.log(columns_in_relationships);

				arrowObj = columns_in_relationships.map((el: any) => {
					return {
						isSelected: false,

						start: x[0].schema.concat(x[0].table).concat(el.tab1),
						table1_uid: x[0].schema.concat(x[0].table),
						startTableName: x[0].table,
						startColumnName: el.tab1,
						startSchema: x[0].schema,
						startId: x[0].id,

						end: y[0].schema.concat(y[0].table).concat(el.tab2),
						table2_uid: y[0].schema.concat(y[0].table),
						endTableName: y[0].table,
						endColumnName: el.tab2,
						endSchema: y[0].schema,
						endId: y[0].id,

						integrity: obj.refIntegrity,
						cardinality: obj.cardinality,
						showHead: valuesForshowHeadAndshowTail.showHead,
						showTail: valuesForshowHeadAndshowTail.showTail,
						relationId: relationUniqueId,
					};
				});

				// console.log(arrowObj);
				// console.log(arrowsArray);
				arrowsArray.push(...arrowObj);

				relObject = {
					startId: x[0].id,
					endId: y[0].id,
					integrity: obj.refIntegrity,
					cardinality: obj.cardinality,
					showHead: valuesForshowHeadAndshowTail.showHead,
					showTail: valuesForshowHeadAndshowTail.showTail,
					relationId: relationUniqueId,
				};
				relationshipsArray.push(relObject);
			});

			// ====================================================================================
			// setTempTables(canvasTables);
			setValuesToState(
				res.data.connectionId,
				res.data.datasetName,
				canvasTables,
				uniqueSchema[0],
				relationshipsArray,
				arrowsArray
			);

			setDatabaseNametoState(dbName);
			setServerName(server);
			setloadPage(true);
		} else {
			// console.log(res.data.detail);
		}
	};

	const getColumns = async (connection: string, schema: string, tableName: string) => {
		console.log(dbName, server);
		var url: string = "";
		if (server === "mysql") {
			url = `metadata-columns/${connection}?database=${dbName}&table=${tableName}`;
		} else {
			url = `metadata-columns/${connection}?database=${dbName}&schema=${schema}&table=${tableName}`;
		}
		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			// url: "metadata-columns/" + connection + "?schema=" + schema + "&table=" + tableName,
			url: url,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			const arrayWithUid: ColumnsWithUid[] = result.data.map((data: Columns) => {
				return { uid: schema.concat(tableName).concat(data.columnName), ...data };
			});
			return arrayWithUid;
		}
	};

	return (
		<div className="dataHome">
			{/* <MenuBar from="dataSet" /> */}

			<div className="createDatasetPage">
				{loadPage ? (
					<>
						<Sidebar editMode={editMode} />
						<Canvas editMode={editMode} />
					</>
				) : null}
			</div>
		</div>
	);
};
const mapStateToProps = (state: isLoggedProps & DataSetStateProps) => {
	return {
		token: state.isLogged.accessToken,
		dsId: state.dataSetState.dsId,
		databaseName: state.dataSetState.databaseName,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setValuesToState: (
			conId: string,
			fname: string,
			canvasTables: tableObjProps[],

			schema: string,
			relationshipsArray: RelationshipsProps[],
			arrowsArray: ArrowsProps[]
		) =>
			dispatch(
				setValuesToState(
					conId,
					fname,
					// canvasTables,
					schema,
					relationshipsArray,
					arrowsArray
				)
			),
		setServerName: (name: string) => dispatch(setServerName(name)),
		setDatabaseNametoState: (name: string) => dispatch(setDatabaseNametoState(name)),
		setUserTable: (payload: UserTableProps[]) => dispatch(setUserTable(payload)),

	};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDataSet);
