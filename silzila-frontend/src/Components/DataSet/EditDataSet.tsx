// This component is used to retrive a specific dataset to be edited
// The information about this dataset is loaded to store
// users can update existing dataset / re-define relationships in dataset

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ShortUniqueId from "short-unique-id";
import {
	setCreateDsFromFlatFile,
	setDatabaseNametoState,
	setServerName,
	setUserTable,
	setValuesToState,
	setViews,
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
} from "../../redux/DataSet/DatasetStateInterfaces";
import { Dispatch } from "redux";
import { Columns, ColumnsWithUid } from "./DatasetInterfaces";
import { CanvasIndividualTableProps, EditDatasetProps } from "./EditDataSetInterfaces";
import Logger from "../../Logger";

const EditDataSet = ({
	//state
	token,
	dsId,

	//dispatch
	setValuesToState,
	setUserTable,
	setDatabaseNametoState,
	setServerName,
	setViews,
	setCreateDsFromFlatFile,
}: EditDatasetProps) => {
	var dbName: string = "";
	var server: string = "";

	const [loadPage, setloadPage] = useState<boolean>(false);

	var count: number = 0;

	useEffect(() => {
		setAllInfo();
	}, []);

	const setAllInfo = async () => {
		var res: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "dataset/" + dsId,
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status) {
			if (res.data.isFlatFileData) {
				setCreateDsFromFlatFile(true);
			}

			if (!res.data.isFlatFileData) {
				var getDc: any = await FetchData({
					requestType: "noData",
					method: "GET",
					url: "database-connection",
					headers: { Authorization: `Bearer ${token}` },
				});
				if (getDc.status) {
					getDc.data.forEach((dc: any) => {
						if (dc.id === res.data.connectionId) {
							server = dc.vendor;
							setServerName(server);
						}
					});
				}
			}
			dbName = res.data.dataSchema.tables[0].database;

			// canvasTables - tables that are droped & used in canvas for creating dataset
			const canvasTables: tableObjProps[] = await Promise.all(
				res.data.dataSchema.tables?.map(async (tbl: any) => {
					count++;
					if (tbl) {
						return {
							table_uid: res.data.isFlatFileData
								? tbl.flatFileId
								: tbl.schema.concat(tbl.table),
							tableName: tbl.table,
							alias: tbl.alias,
							dcId: res.data.connectionId,
							columns: await getColumns(
								res.data.connectionId,
								tbl.schema,
								tbl.table,
								tbl.database,
								tbl.flatFileId
							),
							isSelected: true,
							id: tbl.id,
							isNewTable: false,
							tablePositionX: tbl.tablePositionX ? tbl.tablePositionX : null,
							tablePositionY: tbl.tablePositionY ? tbl.tablePositionY : null,
							schema: tbl.schema,
							databaseName: tbl.database,
						};
					}
				})
			);

			// ======================== set tables & schema ====================================================

			var schema_list: string[] = res.data.dataSchema.tables.map(
				(table: CanvasIndividualTableProps) => {
					return table.schema;
				}
			);

			// getting unique schema used in dataset
			var uniqueSchema: string[] = Array.from(new Set(schema_list));

			const getTables = async () => {
				var url: string = "";
				if (res.data.isFlatFileData) {
					url = `file-data`;
				} else {
					if (server === "mysql") {
						url = `metadata-tables/${res.data.connectionId}?database=${dbName}`;
					} else {
						url = `metadata-tables/${res.data.connectionId}?database=${dbName}&schema=${uniqueSchema[0]}`;
					}
				}

				var res1: any = await FetchData({
					requestType: "noData",
					method: "GET",
					url: url,
					headers: { Authorization: `Bearer ${token}` },
					token: token,
				});

				if (res1.status) {
					let userTable: UserTableProps[] = [];
					let views: any[] = [];
					const uid = new ShortUniqueId({ length: 8 });
					if (!res.data.isFlatFileData) {
						if (res1.data.views.length > 0) {
							views = res1.data.views.map((el: any) => {
								var id = "";
								var schema = "";
								var databaseName = "";
								var tableAlreadyChecked = canvasTables.filter(
									(tbl: any) =>
										tbl.dcId === res.data.connectionId &&
										tbl.schema === uniqueSchema[0] &&
										tbl.tableName === el
								)[0];
								canvasTables.forEach((tbl: any) => {
									if (
										tbl.dcId === res.data.connectionId &&
										tbl.schema === uniqueSchema[0] &&
										tbl.tableName === el
									) {
										id = tbl.id;
										schema = tbl.schema;
										databaseName = tbl.databaseName;
									}
								});
								if (tableAlreadyChecked) {
									return {
										isView: true,
										tableName: el,
										isSelected: true,
										table_uid: uniqueSchema[0].concat(el),
										id: id,
										isNewTable: false,
										schema: schema,
										database: databaseName,
									};
								}
								return {
									isView: true,
									tableName: el,
									isSelected: false,
									table_uid: uniqueSchema[0].concat(el),
									id: uid(),
									isNewTable: true,
									schema: uniqueSchema[0],
									database: dbName,
								};
							});
						}

						userTable = res1.data.tables.map((el: any) => {
							var id = "";
							var schema = "";
							var databaseName = "";

							var tableAlreadyChecked1 = canvasTables.filter(
								(tbl: any) =>
									tbl.dcId === res.data.connectionId &&
									tbl.schema === uniqueSchema[0] &&
									tbl.tableName === el
							)[0];
							canvasTables.forEach((tbl: any) => {
								if (
									tbl.dcId === res.data.connectionId &&
									tbl.schema === uniqueSchema[0] &&
									tbl.tableName === el
								) {
									id = tbl.id;
									schema = tbl.schema;
									databaseName = tbl.databaseName;
								}
							});
							if (tableAlreadyChecked1) {
								return {
									schema: schema,
									database: databaseName,
									tableName: el,
									isSelected: true,
									table_uid: uniqueSchema[0].concat(el),
									id: id,
									isNewTable: false,
								};
							}
							return {
								schema: uniqueSchema[0],
								database: dbName,
								tableName: el,
								isSelected: false,
								table_uid: uniqueSchema[0].concat(el),
								id: uid(),
								isNewTable: true,
							};
						});
					} else {
						userTable = res1.data.map((el: any) => {
							var id = "";
							var bool = false;

							var tableAlreadyChecked: any = canvasTables.filter(
								(tbl: any) => tbl.table_uid === el.id
							)[0];

							canvasTables.forEach((tbl: any) => {
								if (tbl.table_uid === el.id) {
									id = tbl.id;
									bool = tbl.isNewTable;
								}
							});

							if (tableAlreadyChecked) {
								return {
									schema: "",
									database: "",
									tableName: el.name,
									isSelected: true,
									table_uid: el.id,
									id: id,
									isNewTable: bool,
								};
							}

							return {
								schema: "",
								database: "",
								tableName: el.name,
								isSelected: false,
								table_uid: el.id,
								id: uid(),
								isNewTable: true,
							};
						});
					}

					setUserTable(userTable);
					if (!res.data.isFlatFileData) {
						setViews(views);
					}
				}
			};

			await getTables();

			// ====================================================================================

			// ============================= set relationships and arrows ==========================
			let arrowsArray: any = [];
			let relationshipsArray: any = [];
			let arrowObj: any = [];
			let relObject: any = [];

			res.data.dataSchema.relationships.forEach((obj: any) => {
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

				var startTableName = "";
				var endTableName = "";

				let columns_in_relationships: any = [];
				let relationUniqueId: any = "";

				obj.table1Columns.forEach((el: any, index: number) => {
					var table2_col = obj.table2Columns[index];
					let rel = { tab1: el, tab2: table2_col };
					columns_in_relationships.push(rel);
					relationUniqueId = uid();
				});
				arrowObj = columns_in_relationships.map((el: any) => {
					startTableName = x[0].table;
					endTableName = y[0].table;

					return {
						isSelected: false,

						start: res.data.isFlatFileData
							? x[0].table.concat(el.tab1)
							: x[0].schema.concat(x[0].table).concat(el.tab1),
						table1_uid: res.data.isFlatFileData
							? x[0].flatFileId
							: x[0].schema.concat(x[0].table),
						startTableName: x[0].table,
						startColumnName: el.tab1,
						startSchema: x[0].schema,
						startId: x[0].id,

						end: res.data.isFlatFileData
							? y[0].table.concat(el.tab2)
							: y[0].schema.concat(y[0].table).concat(el.tab2),
						table2_uid: res.data.isFlatFileData
							? y[0].flatFileId
							: y[0].schema.concat(y[0].table),
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

				arrowsArray.push(...arrowObj);

				relObject = {
					startId: x[0].id,
					endId: y[0].id,
					integrity: obj.refIntegrity,
					cardinality: obj.cardinality,
					showHead: valuesForshowHeadAndshowTail.showHead,
					showTail: valuesForshowHeadAndshowTail.showTail,
					relationId: relationUniqueId,
					startTableName: startTableName,
					endTableName: endTableName,
				};
				relationshipsArray.push(relObject);
			});

			// ====================================================================================
			setDatabaseNametoState(dbName);
			setValuesToState(
				res.data.connectionId,
				res.data.datasetName,
				canvasTables,
				uniqueSchema[0],
				relationshipsArray,
				arrowsArray
			);

			setloadPage(true);
		} else {
			Logger("info", res, "********ERROR********");
		}
	};

	const getColumns = async (
		connection: string,
		schema: string,
		tableName: string,
		databaseName: string,
		flatFileId: string
	) => {
		const uid: any = new ShortUniqueId({ length: 8 });
		var url: string = "";
		if (!flatFileId) {
			if (server === "mysql") {
				url = `metadata-columns/${connection}?database=${databaseName}&table=${tableName}`;
			} else {
				url = `metadata-columns/${connection}?database=${databaseName}&schema=${schema}&table=${tableName}`;
			}
		} else {
			url = `file-data-column-details/${flatFileId}`;
		}

		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: url,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			let arrayWithUid: ColumnsWithUid[] = [];
			if (flatFileId) {
				arrayWithUid = result.data.map((data: any) => {
					return {
						uid: uid(),
						columnName: data.fieldName,
						dataType: data.dataType,
					};
				});
			} else {
				arrayWithUid = result.data.map((data: Columns) => {
					return { uid: schema.concat(tableName).concat(data.columnName), ...data };
				});
			}
			return arrayWithUid;
		}
	};

	return (
		<div className="dataHome">
			<MenuBar from="dataSet" />

			<div className="createDatasetPage">
				{loadPage ? (
					<>
						<Sidebar editMode={true} />
						<Canvas editMode={true} />
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
					canvasTables,
					schema,
					relationshipsArray,
					arrowsArray
				)
			),
		setServerName: (name: string) => dispatch(setServerName(name)),
		setDatabaseNametoState: (name: string) => dispatch(setDatabaseNametoState(name)),
		setViews: (views: any[]) => dispatch(setViews(views)),
		setUserTable: (payload: UserTableProps[]) => dispatch(setUserTable(payload)),
		setCreateDsFromFlatFile: (value: boolean) => dispatch(setCreateDsFromFlatFile(value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDataSet);
