// This component is used to retrive a specific dataset to be edited
// The information about this dataset is loaded to store
// users can update existing dataset / re-define relationships in dataset

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ShortUniqueId from "short-unique-id";
import { setUserTable, setValuesToState } from "../../redux/Dataset/datasetActions";
import FetchData from "../../ServerCall/FetchData";
import { FindShowHeadAndShowTail } from "../CommonFunctions/FindIntegrityAndCordinality";
import MenuBar from "../DataViewer/MenuBar";
import Canvas from "./Canvas";
import Sidebar from "./Sidebar";

const EditDataSet = ({
	//state
	token,
	dsId,

	//dispatch
	setValuesToState,
	setUserTable,
}) => {
	const [loadPage, setloadPage] = useState(false);
	const [editMode, seteditMode] = useState(true);
	useEffect(() => {
		setAllInfo();
	}, []);

	const setAllInfo = async () => {
		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "ds/get-ds/" + dsId,
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status) {
			// console.log(res.data);
			// const uid = new ShortUniqueId({ length: 8 });

			const canvasTables = await Promise.all(
				res.data.data_schema.tables.map(async (tbl) => {
					return {
						table_uid: tbl.schema_name.concat(tbl.table_name),
						tableName: tbl.table_name,
						alias: tbl.alias,
						dcId: res.data.dc_uid,
						schema: tbl.schema_name,
						columns: await getColumns(res.data.dc_uid, tbl.schema_name, tbl.table_name),
						isSelected: true,
						id: tbl.id,

						isNewTable: false,

						table_position: {
							x: tbl.table_position ? tbl.table_position.x : "",
							y: tbl.table_position ? tbl.table_position.y : "",
						},
					};
				})
			);

			// console.log(canvasTables);

			// ======================== set tables & schema ====================================================

			var schema_list = res.data.data_schema.tables.map((el) => {
				return el.schema_name;
			});

			var uniqueSchema = Array.from(new Set(schema_list));
			// console.log(uniqueSchema);

			let userTable = [];

			const getTables = async () => {
				var res1 = await FetchData({
					requestType: "noData",
					method: "GET",
					url: `dc/tables/${res.data.dc_uid}/${uniqueSchema[0]}`,
					headers: { Authorization: `Bearer ${token}` },
					token: token,
				});

				if (res1.status) {
					const uid = new ShortUniqueId({ length: 8 });

					userTable = res1.data.map((el) => {
						var id = "";
						var tableAlreadyChecked = canvasTables.filter(
							(tbl) =>
								tbl.dcId === res.data.dc_uid &&
								tbl.schema === uniqueSchema[0] &&
								tbl.tableName === el
						)[0];
						canvasTables.forEach((tbl) => {
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
			let arrowsArray = [];
			let relationshipsArray = [];
			let arrowObj = [];
			let relObject = [];

			res.data.data_schema.relationships.map((obj) => {
				const uid = new ShortUniqueId({ length: 8 });

				const valuesForshowHeadAndshowTail = FindShowHeadAndShowTail(obj.cardinality);

				// x  - array of start tables
				const x = res.data.data_schema.tables.filter((el) => {
					return el.id === obj.table1;
				});

				// y - array of endTables
				const y = res.data.data_schema.tables.filter((el) => {
					return el.id === obj.table2;
				});

				let columns_in_relationships = [];
				let relationUniqueId = "";

				obj.table1_columns.map((el, index) => {
					var table2_col = obj.table2_columns[index];
					let rel = { tab1: el, tab2: table2_col };
					columns_in_relationships.push(rel);
					relationUniqueId = uid();
				});

				// console.log(columns_in_relationships);

				arrowObj = columns_in_relationships.map((el) => {
					return {
						isSelected: false,

						start: x[0].schema_name.concat(x[0].table_name).concat(el.tab1),
						table1_uid: x[0].schema_name.concat(x[0].table_name),
						startTableName: x[0].table_name,
						startColumnName: el.tab1,
						startSchema: x[0].schema_name,
						startId: x[0].id,

						end: y[0].schema_name.concat(y[0].table_name).concat(el.tab2),
						table2_uid: y[0].schema_name.concat(y[0].table_name),
						endTableName: y[0].table_name,
						endColumnName: el.tab2,
						endSchema: y[0].schema_name,
						endId: y[0].id,

						integrity: obj.ref_integrity,
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
					integrity: obj.ref_integrity,
					cardinality: obj.cardinality,
					showHead: valuesForshowHeadAndshowTail.showHead,
					showTail: valuesForshowHeadAndshowTail.showTail,
					relationId: relationUniqueId,
				};
				relationshipsArray.push(relObject);
			});

			// ====================================================================================

			setValuesToState(
				res.data.dc_uid,
				res.data.friendly_name,
				canvasTables,
				uniqueSchema[0],
				relationshipsArray,
				arrowsArray
			);
			setloadPage(true);
		} else {
			// console.log(res.data.detail);
		}
	};

	const getColumns = async (connection, schema, tableName) => {
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "dc/columns/" + connection + "/" + schema + "/" + tableName,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			const arrayWithUid = result.data.map((data) => {
				return { uid: schema.concat(tableName).concat(data.column_name), ...data };
			});
			return arrayWithUid;
		}
	};

	return (
		<div className="dataHome">
			<MenuBar from="dataSet" />

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
const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
		dsId: state.dataSetState.dsId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setValuesToState: (conId, fname, canvasTables, schema, relationshipsArray, arrowsArray) =>
			dispatch(
				setValuesToState({
					conId,
					fname,
					canvasTables,
					schema,
					relationshipsArray,
					arrowsArray,
				})
			),
		setUserTable: (pl) => dispatch(setUserTable(pl)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDataSet);
