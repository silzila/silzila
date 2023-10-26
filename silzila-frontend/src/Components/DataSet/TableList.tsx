// This component is part of Sidebar component
// List of tables for a selected schema is returned along with option to check or uncheck

import React, { useState } from "react";
import { Checkbox, Tooltip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FetchData from "../ServerCall/FetchData";
import {
	addTable,
	removeArrows,
	removeRelationshipFromTableList,
	toggleOnChecked,
	toggleOnCheckedOnView,
} from "../../redux/DataSet/datasetActions";
import ShortUniqueId from "short-unique-id";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import {
	DataSetStateProps,
	tableObjProps,
	UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import TableData from "./TableData";
import { TableListProps, tabObj } from "./TableListInterfaces";
import { Columns, ColumnsWithUid } from "./DatasetInterfaces";
import Logger from "../../Logger";

const TableList = (props: TableListProps) => {
	const [selectedTable, setSelectedTable] = useState<string>("");
	const [showTableData, setShowTableData] = useState<boolean>(false);

	// tableData  will be type of any
	const [tableData, setTableData] = useState<any[]>([]);
	const [objKeys, setObjKeys] = useState<string[]>([]);

	// Get all columns for a given table
	const getTableColumns = async (tableName: string, isView: boolean) => {
		Logger("info", "get Columns from tableList");
		const uid: any = new ShortUniqueId({ length: 8 });

		var url: string = "";
		if (props.isFlatFile) {
			url = `file-data-column-details/${props.table.table_uid}`;
		} else {
			if (props.serverName === "mysql") {
				url = `metadata-columns/${props.connectionId}?database=${props.databaseName}&table=${tableName}`;
			} else {
				url = `metadata-columns/${props.connectionId}?database=${props.databaseName}&schema=${props.schema}&table=${tableName}`;
			}
		}

		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: url,
			headers: { Authorization: `Bearer ${props.token}` },
		});
		if (result.status) {
			var obj: tabObj | undefined;
			if (isView) {
				props.viewList.forEach((el: any) => {
					// While in edit mode, we check if this table has already been selected
					// If selected, set its old parameters UID parameters,
					if (el.tableName === tableName && el.isSelected === true && el.isView) {
						const arrayWithUid: ColumnsWithUid[] = result.data.map((data: Columns) => {
							return {
								uid: props.schema.concat(tableName).concat(data.columnName),
								...data,
							};
						});

						obj = {
							isView: true,
							id: el.id,
							table_uid: el.table_uid,
							tableName: tableName,
							isSelected: el.isSelected,
							alias: tableName,
							columns: arrayWithUid,
							dcId: props.connectionId,
							schema: props.schema,
							databaseName: props.databaseName,
							isNewTable: el.isNewTable,
							tablePositionX: 0,
							tablePositionY: 0,
						};
					}
				});
			} else {
				props.tableList.forEach((el: UserTableProps) => {
					// While in edit mode, we check if this table has already been selected
					// If selected, set its old parameters UID parameters,
					if (el.tableName === tableName && el.isSelected === true) {
						let arrayWithUid: any = [];
						if (props.isFlatFile) {
							arrayWithUid = result.data.map((data: any) => {
								return {
									uid: uid(),
									columnName: data.fieldName,
									dataType: data.dataType,
								};
							});
						} else {
							arrayWithUid = result.data.map((data: Columns) => {
								return {
									uid: props.schema.concat(tableName).concat(data.columnName),
									...data,
								};
							});
						}
						obj = {
							id: el.id,
							table_uid: el.table_uid,
							tableName: tableName,
							isSelected: el.isSelected,
							alias: tableName,
							columns: arrayWithUid,
							dcId: props.connectionId,
							schema: props.schema,
							databaseName: props.databaseName,
							isNewTable: el.isNewTable,
							tablePositionX: 0,
							tablePositionY: 0,
						};
					}
				});
			}
			props.addTable(obj);
		}
	};

	// Handles when a table listed in sidebar is checked or unchecked
	// TODO: need to specify type for e
	const checkAndUncheck = (e: any, id: string | number, table: any) => {
		if (table["isView"]) {
			props.toggleOnCheckedOnView(id);
		} else {
			props.onChecked(id);
		}

		if (e.target.checked) {
			getTableColumns(e.target.value, table["isView"]);
		} else {
			if (props.tempTable.length !== 0) {
				props.tempTable.forEach((el: tableObjProps) => {
					if (el.id === id) {
						props.removeArrows(id);
						props.removeRelationship(id);
					}
				});
			}
		}
	};

	// ==============================================================
	//  get Table Data
	// ==============================================================
	const getTableData = async (table: string) => {
		var url: string = "";
		if (props.isFlatFile) {
			url = `file-data-sample-records/${props.table.table_uid}`;
		} else {
			if (props.serverName === "mysql") {
				url = `sample-records/${props.connectionId}/250?database=${props.databaseName}&table=${table}`;
			} else {
				url = `sample-records/${props.connectionId}/250?database=${props.databaseName}&schema=${props.schema}&table=${table}`;
			}
		}
		// TODO:need to specify type
		var res: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: url,
			headers: { Authorization: `Bearer ${props.token}` },
		});

		if (res.status) {
			setTableData(res.data);
			setShowTableData(true);
			var keys: string[] = Object.keys(res.data[0]);
			setObjKeys([...keys]);
		} else {
		}
	};

	// =========================== props to tableData ====================================

	const properties = {
		showTableData,
		setShowTableData,
		selectedTable,
		setSelectedTable,
		tableData,
		setTableData,
		objKeys,
	};

	return (
		<React.Fragment>
			<Checkbox
				sx={{
					"&.Mui-checked": {
						color: "#2bb9bb",
					},
					"&.Mui-disabled": {
						color: "#B1B1B1",
					},
				}}
				style={{ width: "0.5rem", height: "0.5rem", margin: "auto 5px auto 0" }}
				size="small"
				// size="1rem"
				disabled={props.table.isNewTable ? false : true}
				checked={props.table.isSelected ? true : false}
				onClick={e => checkAndUncheck(e, props.table.id, props.table)}
				value={props.table.tableName}
			/>

			<span className="tableName" title={props.table.tableName}>
				{props.table.tableName}
			</span>

			{props.xprops.open ? (
				<Tooltip
					title="View Table"
					arrow
					placement="right-start"
					style={{ float: "right" }}
				>
					<VisibilityOutlinedIcon
						className="tableIcon"
						style={{ width: "1rem", height: "1rem", margin: "auto 5px" }}
						onClick={() => {
							setSelectedTable(props.table.tableName);
							getTableData(props.table.tableName);
						}}
					/>
				</Tooltip>
			) : null}
			<TableData {...properties} />
		</React.Fragment>
	);
};

const mapStateToProps = (state: isLoggedProps & DataSetStateProps) => {
	return {
		tableList: state.dataSetState.tables,
		tempTable: state.dataSetState.tempTable,
		token: state.isLogged.accessToken,
		connectionId: state.dataSetState.connection,
		schema: state.dataSetState.schema,
		databaseName: state.dataSetState.databaseName,
		serverName: state.dataSetState.serverName,
		viewList: state.dataSetState.views,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		onChecked: (tableId: string | number) => dispatch(toggleOnChecked(tableId)),
		toggleOnCheckedOnView: (tableId: string | number) =>
			dispatch(toggleOnCheckedOnView(tableId)),
		addTable: (tableObj: tableObjProps) => dispatch(addTable(tableObj)),
		removeArrows: (arrowId: string | number) => dispatch(removeArrows(arrowId)),
		removeRelationship: (relationId: string | number) =>
			dispatch(removeRelationshipFromTableList(relationId)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TableList);
