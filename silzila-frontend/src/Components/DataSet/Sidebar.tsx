// This component is a part of Create / Edit Dataset page
// Functions incluce
// 	- Select DataConnection
// 	- Select Schema
// 	- Select tables in a schema

import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import ShortUniqueId from "short-unique-id";
import {
	setConnectionValue,
	setServerName,
	setDatabaseNametoState,
	setDataSchema,
	setUserTable,
} from "../../redux/DataSet/datasetActions";
import FetchData from "../ServerCall/FetchData";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import TableList from "./TableList";
import "../DataConnection/DataSetup.css";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { ConnectionItem } from "../DataConnection/DataConnectionInterfaces";
import { SidebarProps } from "./SidebarInterfaces";
import {
	DataSetStateProps,
	tableObjProps,
	UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfacse";
import { ChangeConnection } from "../CommonFunctions/DialogComponents";

const Sidebar = ({
	//props
	editMode,

	// state
	token,
	tableList,
	tempTable,
	connectionValue,
	schemaValue,
	databaseName,
	serverName,

	// dispatch
	setConnection,
	setDataSchema,
	setUserTable,
	setServerName,
	setDatabaseNametoState,
}: SidebarProps) => {
	const [selectedConnection, setSelectedConnection] = useState<String>("");
	const [connectionList, setConnectionList] = useState<ConnectionItem[]>([]);
	const [connectionId, setConnectionId] = useState<string>("");
	const [schemaList, setSchemaList] = useState<string[]>([]);
	const [selectedSchema, setSelectedSchema] = useState<string>("");
	const [isSchemaAvailable, setIsSchemaAvailable] = useState<boolean>(true);

	const [openDlg, setOpenDlg] = useState<boolean>(false);
	const [resetDataset, setResetDataset] = useState<boolean>(false);

	const [dcToResetTo, setDcToResetTo] = useState<string>("");

	// Actions performed when dataConnection is changed
	// If user already selected some tables from another dataset
	// 		to display in canvas, provide a warning to reset data

	const onConnectionChange = (e: string) => {
		console.log(e);
		if (tempTable.length > 0) {
			setDcToResetTo(e);
			setOpenDlg(true);
		} else {
			setSelectedConnection(e);
			setDataSchema("");
			getSchemaList(e);
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
		// TODO:need to specify type
		var res: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "database-connection",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status) {
			console.log("database Connection List", res.data);
			setConnectionList(res.data);
		} else {
			console.log("database connection error", res.data.detail);
		}
	};

	// Get all schemas of a particular data connection
	const getSchemaList = async (uid: string) => {
		const dc_uid = uid;
		if (!editMode) {
			setConnectionId(dc_uid);
			setConnection(dc_uid);
			setUserTable([]);
		}
		// TODO: need to specify type
		var res: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `database-connection/${dc_uid}`,
			headers: { Authorization: `Bearer ${token}` },
			token: token,
		});

		console.log(res);
		if (res.status) {
			if (res.data) {
				setServerName(res.data.vendor);
				setDatabaseNametoState(res.data.database);
				if (res.data.vendor === "mysql") {
					setIsSchemaAvailable(false);
					setSchemaList([]);
					setDataSchema("");
					setSelectedSchema("");
					getTables(dc_uid, res.data.vendor, res.data.database);
				} else {
					setIsSchemaAvailable(true);

					// TODO: need to specify type

					var res2: any = await FetchData({
						requestType: "noData",
						method: "GET",
						url: `metadata-schemas/${dc_uid}?database=${res.data.database}`,
						headers: { Authorization: `Bearer ${token}` },
						token: token,
					});

					if (res2.status) {
						setSchemaList(res2.data);
					} else {
						// console.log(res2.data.detail);
					}
				}
			}
		} else {
			// console.log(res.data.detail);
		}
	};

	// Fetch list of tables in a particular schema
	// TODO: need to specify type for e
	const getTables = async (e: any, vendor?: string | null, dbName?: string | null) => {
		//when getTables is called from getschemalist e will be hold the value of connectionId else it will hold the event value
		console.log(e);
		console.log(vendor);
		var url: string = "";
		var schema: string = "";

		if (vendor) {
			schema = "";
			url = `metadata-tables/${e}?database=${dbName}`;
		} else {
			schema = e.target.value;
			url = `metadata-tables/${connectionId}?database=${databaseName}&schema=${schema}`;
		}
		setSelectedSchema(schema);
		setDataSchema(schema);
		// TODO: need to specify type
		var res: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: url,
			headers: { Authorization: `Bearer ${token}` },
			token: token,
		});

		if (res.status) {
			console.log(res.data);
			// TODO:need to specify type for uid
			const uid: any = new ShortUniqueId({ length: 8 });
			const userTable: UserTableProps[] = res.data.tables.map((el: string) => {
				var id = "";
				var bool = false;

				// Checking if the table is already selected to canvas by user
				// TODO: (p-1) check and mention type
				var tableAlreadyChecked: any = tempTable.filter(
					(tbl: tableObjProps) =>
						tbl.dcId === connectionId && tbl.schema === schema && tbl.tableName === el
				)[0];

				console.log(tableAlreadyChecked);

				// Checking if the selected table is new or previously added to this dataset
				// Required as editing a dataset doesn't allow for deleting already added tables
				tempTable.forEach((tbl: tableObjProps) => {
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
			console.log(userTable);
			setUserTable(userTable);
		} else {
			// console.log(res);
		}
	};

	return (
		<div className="sidebar">
			<div>
				<FormControl fullWidth size="small">
					<InputLabel id="dcSelect">Database</InputLabel>
					<Select
						labelId="dcSelect"
						className="selectBar"
						// TODO:need to specify type
						onChange={(e: any) => {
							onConnectionChange(e.target.value);
						}}
						value={selectedConnection}
						label="Connection"
					>
						{connectionList &&
							connectionList.map((connection: ConnectionItem, i: number) => {
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

			{isSchemaAvailable ? (
				<div>
					<FormControl fullWidth size="small">
						<InputLabel id="schemaSelect">Schema</InputLabel>
						<Select
							labelId="schemaSelect"
							className="selectBar"
							label="Schema"
							// TODO: need to specify type
							onChange={(e: any) => getTables(e, null, null)}
							value={selectedSchema}
						>
							{schemaList &&
								schemaList.map((schema: string) => {
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
			) : null}

			<div className="sidebarHeading">Tables</div>
			{tableList ? (
				tableList.map((tab: UserTableProps) => {
					return (
						<SelectListItem
							key={tab.tableName}
							// TODO: need to specify type
							render={(xprops: any) => (
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

const mapStateToProps = (state: isLoggedProps & DataSetStateProps) => {
	return {
		token: state.isLogged.accessToken,
		tableList: state.dataSetState.tables,
		databaseName: state.dataSetState.databaseName,
		serverName: state.dataSetState.serverName,
		tempTable: state.dataSetState.tempTable,
		connectionValue: state.dataSetState.connection,
		schemaValue: state.dataSetState.schema,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setConnection: (connection: string) => dispatch(setConnectionValue(connection)),
		setDataSchema: (schema: string) => dispatch(setDataSchema(schema)),
		setUserTable: (userTable: UserTableProps[]) => dispatch(setUserTable(userTable)),
		setServerName: (name: string) => dispatch(setServerName(name)),
		setDatabaseNametoState: (name: string) => dispatch(setDatabaseNametoState(name)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
