// This component is a part of Create / Edit Dataset page
// Functions incluce
// 	- Select DataConnection
// 	- Select Schema
// 	- Select tables in a schema

import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ShortUniqueId from "short-unique-id";
import {
	setConnectionValue,
	setDataSchema,
	setUserTable,
} from "../../redux/Dataset/datasetActions";
import FetchData from "../../ServerCall/FetchData";
import { ChangeConnection } from "../CommonFunctions/DialogComponents";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import TableList from "./TableList";
import "../DataConnection/DataSetup.css";

const Sidebar = ({
	//props
	editMode,

	// state
	token,
	tableList,
	tempTable,
	connectionValue,
	schemaValue,

	// dispatch
	setConnection,
	setDataSchema,
	setUserTable,
}) => {
	const [selectedConnection, setSelectedConnection] = useState("");
	const [connectionList, setConnectionList] = useState([]);
	const [connectionId, setConnectionId] = useState();
	const [schemaList, setSchemaList] = useState([]);
	const [selectedSchema, setSelectedSchema] = useState("");

	const [openDlg, setOpenDlg] = useState(false);
	const [resetDataset, setResetDataset] = useState(false);

	const [dcToResetTo, setDcToResetTo] = useState("");

	// Actions performed when dataConnection is changed
	// If user already selected some tables from another dataset
	// 		to display in canvas, provide a warning to reset data
	const onConnectionChange = (e) => {
		if (tempTable.length > 0) {
			setDcToResetTo(e.target.value);
			setOpenDlg(true);
		} else {
			setSelectedConnection(e.target.value);
			setDataSchema("");
			getSchemaList(e.target.value);
			setSelectedSchema("");
		}
	};

	useEffect(() => {
		// If Dataset is opened in edit mode, set all required values to state
		if (editMode) {
			getAllDc();
			setSelectedConnection(connectionValue);
			setConnectionId(connectionValue);
			getSchemaList(connectionValue);
			setSelectedSchema(schemaValue);
		} else {
			getAllDc();
		}
	}, []);

	// Reset all the values in store
	useEffect(() => {
		if (resetDataset) {
			setSelectedConnection(dcToResetTo);
			getSchemaList(dcToResetTo);
			setSelectedSchema("");
			setDataSchema("");
			setResetDataset(false);
		}
	}, [resetDataset]);

	// Get all data connection available
	const getAllDc = async () => {
		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "database-connection",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status) {
			setConnectionList(res.data);
		} else {
			// console.log(res.data.detail);
		}
	};

	// Get all schemas of a particular data connection
	const getSchemaList = async (uid) => {
		const dc_uid = uid;
		if (!editMode) {
			setConnectionId(dc_uid);
			setConnection(dc_uid);
			setUserTable([]);
		}

		var res = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `database-connection/${dc_uid}`,
			headers: { Authorization: `Bearer ${token}` },
			token: token,
		});

		if (res.status) {
			if (res.data) {
				var res2 = await FetchData({
					requestType: "noData",
					method: "POST",
					url: `metadata-schemas/${dc_uid}`,
					headers: { Authorization: `Bearer ${token}` },
					token: token,
				});

				if (res2.status) {
					setSchemaList(res2.data);
				} else {
					// console.log(res2.data.detail);
				}
			}
		} else {
			// console.log(res.data.detail);
		}
	};

	// Fetch list of tables in a particular schema
	const getTables = async (e) => {
		const schema = e.target.value;
		setSelectedSchema(schema);
		setDataSchema(schema);

		var res = await FetchData({
			requestType: "noData",
			method: "POST",
			url: `metadata-tables/${connectionId}?schema=${schema}`,
			headers: { Authorization: `Bearer ${token}` },
			token: token,
		});

		if (res.status) {
			const uid = new ShortUniqueId({ length: 8 });
			const userTable = res.data.tables.map((el) => {
				var id = "";
				var bool = false;

				// Checking if the table is already selected to canvas by user
				var tableAlreadyChecked = tempTable.filter(
					(tbl) =>
						tbl.dcId === connectionId && tbl.schema === schema && tbl.tableName === el
				)[0];

				// Checking if the selected table is new or previously added to this dataset
				// Required as editing a dataset doesn't allow for deleting already added tables
				tempTable.forEach((tbl) => {
					if (
						tbl.dcId === connectionId &&
						tbl.schema === schema &&
						tbl.tableName === el
					) {
						id = tbl.id;
						bool = tbl.isNewTable;
					}
				});

				// Already selected table in canvas has an ID.
				if (tableAlreadyChecked) {
					return {
						tableName: el,
						isSelected: true,
						table_uid: schema.concat(el),
						id: id,
						isNewTable: bool,
					};
				}

				// New tables need to be assigned a uid
				return {
					tableName: el,
					isSelected: false,
					table_uid: schema.concat(el),
					id: uid(),
					isNewTable: true,
				};
			});

			setUserTable(userTable);
		} else {
			// console.log(res);
		}
	};

	return (
		<div className="sidebar">
			{/* <div className="sidebarHeading">Connection</div> */}
			<div>
				<FormControl fullWidth size="small">
					<InputLabel id="dcSelect">Connection</InputLabel>
					<Select
						labelId="dcSelect"
						className="selectBar"
						onChange={(e) => {
							onConnectionChange(e);
						}}
						value={selectedConnection}
						label="Connection"
					>
						{connectionList &&
							connectionList.map((connection, i) => {
								return (
									<MenuItem
										title={
											connection.database +
											" ".concat("(" + connection.connectionName + ")")
										}
										value={connection.id}
										key={connection.id}
									>
										<Typography
											sx={{
												width: "auto",
												overflow: "hidden",
												textOverflow: "ellipsis",
												fontSize: "14px",
											}}
										>
											{connection.database} ({connection.connectionName})
										</Typography>
									</MenuItem>
								);
							})}
					</Select>
				</FormControl>
			</div>

			{/* <div className="sidebarHeading">Schema</div> */}
			<div>
				<FormControl fullWidth size="small">
					<InputLabel id="schemaSelect">Schema</InputLabel>
					<Select
						labelId="schemaSelect"
						className="selectBar"
						label="Schema"
						onChange={(e) => getTables(e)}
						value={selectedSchema}
					>
						{schemaList &&
							schemaList.map(({schema}) => {
								return (
									<MenuItem value={schema} key={schema}>
										<Typography
											sx={{
												width: "auto",
												overflow: "hidden",
												textOverflow: "ellipsis",
												fontSize: "14px",
											}}
										>
											{schema}
										</Typography>
									</MenuItem>
								);
							})}
					</Select>
				</FormControl>
			</div>

			<div className="sidebarHeading">Tables</div>
			{tableList.length !== 0 ? (
				tableList &&
				tableList.map((tab) => {
					return (
						<SelectListItem
							key={tab.tableName}
							render={(xprops) => (
								<div
									className="tableListStyle"
									onMouseOver={() => xprops.setOpen(true)}
									onMouseLeave={() => xprops.setOpen(false)}
								>
									<TableList
										key={tab.tableName}
										className="tableListElement"
										table={tab}
										tableId={tab.tableName}
										xprops={xprops}
										connectionId={connectionId}
									/>
								</div>
							)}
						/>
					);
				})
			) : (
				<div style={{ marginTop: "10px", fontStyle: "italic" }}>No Tables</div>
			)}

			<ChangeConnection
				open={openDlg}
				setOpen={setOpenDlg}
				setReset={setResetDataset}
				heading="RESET DATASET"
				message="Changing connection will reset this dataset creation. Do you want to discard
						the progress?"
			/>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
		tableList: state.dataSetState.tables,
		tempTable: state.dataSetState.tempTable,
		connectionValue: state.dataSetState.connection,
		schemaValue: state.dataSetState.schema,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setConnection: (pl) => dispatch(setConnectionValue(pl)),
		setDataSchema: (pl) => dispatch(setDataSchema(pl)),
		setUserTable: (userTable) => dispatch(setUserTable(userTable)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
