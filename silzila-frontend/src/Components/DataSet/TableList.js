// This component is part of Sidebar component
// List of tables for a selected schema is returned along with option to check or uncheck

import React, { useState } from "react";
import { Checkbox, Tooltip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FetchData from "../../ServerCall/FetchData";
import { connect } from "react-redux";
import {
	addTable,
	removeArrows,
	removeRelationshipFromTableList,
	toggleOnChecked,
} from "../../redux/Dataset/datasetActions";
import TableData from "./TableData";
import ShortUniqueId from "short-unique-id";

const TableList = (props) => {
	const [selectedTable, setSelectedTable] = useState("");
	const [showTableData, setShowTableData] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [objKeys, setObjKeys] = useState([]);

	// Get all columns for a given table
	const getTableColumns = async (tableName) => {
		const uid = new ShortUniqueId({ length: 8 });

		var result = await FetchData({
			requestType: "noData",
			method: "POST",
			url: "metadata-columns/" + props.connectionId + "?schema=" + props.schema + "&table=" + tableName,

			headers: { Authorization: `Bearer ${props.token}` },
		});
		if (result.status) {
			let obj;
			props.tableList.map((el) => {
				// While in edit mode, we check if this table has already been selected
				// If selected, set its old parameters UID parameters,
				if (el.tableName === tableName && el.isSelected === true) {
					const arrayWithUid = result.data.map((data) => {
						return {
							uid: props.schema.concat(tableName).concat(data.columnName),
							...data,
						};
					});

					obj = {
						id: el.id,
						table_uid: el.table_uid,
						tableName: tableName,
						isSelected: el.isSelected,
						alias: tableName,
						columns: arrayWithUid,
						dcId: props.connectionId,
						schema: props.schema,
						isNewTable: el.isNewTable,
						tablePositionX : 0,
						tablePositionY : 0
					};
				}
			});

			props.addTable(obj);
		}
	};

	// Handles when a table listed in sidebar is checked or unchecked
	const checkAndUncheck = (e, id) => {
		props.onChecked(id);

		if (e.target.checked) {
			getTableColumns(e.target.value);
		} else {
			if (props.tempTable.length !== 0) {
				props.tempTable.map((el) => {
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
	const getTableData = async (table) => {
		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "dc/sample-records/" + props.connectionId + "/" + props.schema + "/" + table,
			headers: { Authorization: `Bearer ${props.token}` },
		});

		if (res.status) {
			setTableData(res.data);
			setShowTableData(true);
			var keys = Object.keys(res.data[0]);
			setObjKeys([...keys]);
		} else {
			// console.log("Get Table Data Error".res.data.detail);
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
				style={{ width: "1rem", height: "1rem", margin: "auto 5px auto 0" }}
				size="1rem"
				disabled={props.table.isNewTable ? false : true}
				checked={props.table.isSelected ? true : false}
				onClick={(e) => checkAndUncheck(e, props.table.id)}
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

const mapStateToProps = (state) => {
	return {
		tableList: state.dataSetState.tables,
		tempTable: state.dataSetState.tempTable,
		token: state.isLogged.accessToken,
		connectionId: state.dataSetState.connection,
		schema: state.dataSetState.schema,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onChecked: (data) => dispatch(toggleOnChecked(data)),
		addTable: (payload) => dispatch(addTable(payload)),
		removeArrows: (pl) => dispatch(removeArrows(pl)),
		removeRelationship: (pl) => dispatch(removeRelationshipFromTableList(pl)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TableList);
