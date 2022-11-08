// This component is a part of Create / Edit Dataset page
// Functions incluce
// 	- Select DataConnection
// 	- Select Schema
// 	- Select tables in a schema

import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
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
	setViews,
} from "../../redux/DataSet/datasetActions";
import FetchData from "../ServerCall/FetchData";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import TableList from "./TableList";
import "../DataConnection/DataSetup.css";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { SidebarProps } from "./SidebarInterfaces";
import {
	ConnectionItem,
	DataSetStateProps,
	tableObjProps,
	UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import { ChangeConnection } from "../CommonFunctions/DialogComponents";
import { idText } from "typescript";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

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
	views,
	dataConnectionList,

	// dispatch
	setConnection,
	setDataSchema,
	setUserTable,
	setServerName,
	setDatabaseNametoState,
	setViews,
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

	const [databaseList, setDatabaseList] = useState<string[]>([]);
	const [selectedDb, setSelectedDb] = useState<string>("");
	const [tableExpand, setTableExpand] = useState<boolean>(true);
	const [viewExpand, setViewExpand] = useState<boolean>(true);

	const [disableDb, setDisableDb] = useState<boolean>(false);

	// Actions performed when dataConnection is changed
	// If user already selected some tables from another dataset
	// 		to display in canvas, provide a warning to reset data

	const onConnectionChange = (e: string) => {
		//console.log(e);
		setSelectedDb(e);
		setDatabaseNametoState(e);

		setDataSchema("");
		setSchemaList([]);
		setSelectedSchema("");

		setUserTable([]);
		setViews([]);

		if (serverName === "mysql") {
			// getTables()
		} else {
			//console.log(e);
			getSchemaList(e);
		}
	};

	useEffect(() => {
		if (serverName === "postgresql" && tempTable.length > 0) {
			setDisableDb(true);
		}
		// If Dataset is opened in edit mode, set all required values to state
		if (editMode) {
			//console.log(schemaValue);
			getAllMetaDb();
			setSelectedDb(databaseName);
			setSelectedSchema(schemaValue);
			setSelectedConnection(connectionValue);
			setConnectionId(connectionValue);
			// getSchemaList(connectionValue);
			getSchemaList(databaseName);
		} else {
			getAllMetaDb();
		}
	}, []);

	useEffect(() => {
		if (serverName === "postgresql" && tempTable.length > 0) {
			setDisableDb(true);
		}
		if (serverName === "postgresql" && tempTable.length === 0) {
			setDisableDb(false);
		}
	}, [tempTable]);

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

	const getAllMetaDb = async () => {
		if (serverName === "mysql") {
			setIsSchemaAvailable(false);
		} else {
			setIsSchemaAvailable(true);
		}
		var res: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `metadata-databases/${connectionValue}`,
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status) {
			// //console.log("database List", res.data);
			setDatabaseList(res.data);
		} else {
			// //console.log("database List error", res.data.detail);
		}
	};

	// Get all schemas of a particular data connection
	const getSchemaList = async (db: string) => {
		if (!editMode) {
			setUserTable([]);
			setViews([]);
		}
		//console.log(`metadata-schemas/${connectionValue}?database=${db}`);

		var res: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `metadata-schemas/${connectionValue}?database=${db}`,
			headers: { Authorization: `Bearer ${token}` },
			token: token,
		});
		if (res.status) {
			// //console.log(res.data);
			setSchemaList(res.data);
		} else {
			// //console.log(res.data.detail);
		}
	};

	// Fetch list of tables in a particular schema

	const getTables = async (e: any, vendor?: string | null, dbName?: string | null) => {
		var url: string = "";
		var schema: string = "";

		if (serverName === "mysql") {
			url = `metadata-tables/${e}?database=${selectedDb}`;
		} else {
			schema = e.target.value;
			url = `metadata-tables/${connectionValue}?database=${selectedDb}&schema=${schema}`;
		}

		setSelectedSchema(schema);
		setDataSchema(schema);

		var res: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: url,
			headers: { Authorization: `Bearer ${token}` },
			token: token,
		});

		if (res.status) {
			const uid: any = new ShortUniqueId({ length: 8 });
			// const viewArray = res.data.views.map((el: string) => {
			// 	return {
			// 		schema: schema,
			// 		database:selectedDb,
			// 		isView: true,
			// 		tableName: el,
			// 		isSelected: false,
			// 		table_uid: schema.concat(el),
			// 		id: uid(),
			// 		isNewTable: true,
			// 	};
			// });
			// setViews(viewArray);
			// //console.log(res.data);
			const views = res.data.views.map((el: any) => {
				var id = "";
				var bool = false;

				var tableAlreadyChecked = tempTable.filter(
					tbl =>
						tbl.dcId === connectionValue &&
						tbl.schema === schema &&
						tbl.tableName === el
				)[0];
				console.log(tableAlreadyChecked);
				tempTable.forEach((tbl: any) => {
					if (
						tbl.dcId === connectionValue &&
						tbl.schema === schema &&
						tbl.tableName === el
					) {
						id = tbl.id;
						bool = tbl.isNewTable;
					}
				});
				if (tableAlreadyChecked) {
					return {
						schema: schema,
						database: databaseName,
						isView: true,
						tableName: el,
						isSelected: true,
						table_uid: schema.concat(el),
						id: id,
						isNewTable: bool,
					};
				}
				return {
					schema: schema,
					database: databaseName,
					isView: true,
					tableName: el,
					isSelected: false,
					table_uid: schema[0].concat(el),
					id: uid(),
					isNewTable: true,
				};
			});

			const userTable: UserTableProps[] = res.data.tables.map((el: string) => {
				var id = "";
				var bool = false;

				// Checking if the table is already selected to canvas by user
				// TODO: (p-1) check and mention type
				var tableAlreadyChecked: any = tempTable.filter(
					(tbl: tableObjProps) =>
						// tbl.dcId === connectionId && tbl.schema === schema && tbl.tableName === el
						tbl.dcId === connectionValue &&
						tbl.schema === schema &&
						tbl.tableName === el
				)[0];

				// //console.log(tableAlreadyChecked);

				// Checking if the selected table is new or previously added to this dataset
				// Required as editing a dataset doesn't allow for deleting already added tables
				tempTable.forEach((tbl: tableObjProps) => {
					if (
						// tbl.dcId === connectionId &&
						tbl.dcId === connectionValue &&
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
						schema: schema,
						database: databaseName,
						tableName: el,
						isSelected: true,
						table_uid: schema.concat(el),
						id: id,
						isNewTable: bool,
					};
				}

				// New tables need to be assigned a uid
				return {
					schema: schema,
					database: databaseName,
					tableName: el,
					isSelected: false,
					table_uid: schema.concat(el),
					id: uid(),
					isNewTable: true,
				};
			});
			//console.log(userTable);
			setUserTable(userTable);
			setViews(views);
		} else {
			// //console.log(res);
		}
	};

	const getConnectionName = (id: string) => {
		var name: string = "";
		dataConnectionList.map((el: ConnectionItem) => {
			if (el.id === id) {
				name = el.connectionName;
			}
		});
		return name;
	};

	return (
		<div style={{ display: "flex", flexDirection: "column" }} className="sidebar">
			<div style={{ padding: "0 1rem 0 1rem", margin: "15px 0px 15px 0px" }}>
				<FormControl fullWidth size="small">
					<TextField
						label="DataConnection"
						className="selectBar"
						// InputLabelProps={{
						// 	sx: {
						// 		fontSize: "30px",
						// 	},
						// }}
						InputProps={{
							sx: {
								height: "2.5rem",
								fontSize: "13.5px",
							},
						}}
						disabled={true}
						value={getConnectionName(connectionValue)}
					/>
				</FormControl>
			</div>

			<div style={{ padding: "0 1rem 0 1rem" }}>
				<FormControl fullWidth size="small">
					<InputLabel id="dcSelect">Database</InputLabel>
					<Select
						labelId="dcSelect"
						className="selectBar"
						// TODO:need to specify type
						onChange={(e: any) => {
							onConnectionChange(e.target.value);
						}}
						disabled={disableDb}
						value={selectedDb}
						label="Connection"
					>
						{databaseList &&
							databaseList.map((db: string) => {
								return (
									<MenuItem value={db} key={db} title={db}>
										<Typography
											sx={{
												width: "auto",
												overflow: "hidden",
												textOverflow: "ellipsis",
												fontSize: "14px",
											}}
										>
											{db}
										</Typography>
									</MenuItem>
								);
							})}
					</Select>
				</FormControl>
			</div>

			{isSchemaAvailable ? (
				<div style={{ padding: "0 1rem 0 1rem" }}>
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

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "70%",
					// padding: 0,
					margin: 0,
				}}
			>
				<div
					style={{
						fontSize: "16px",
						color: "#666",
						margin: "5px 0 10px 0",
						textAlign: "left",
						padding: "0 1rem 0 1rem",
						display: "flex",
					}}
				>
					<Typography>Tables</Typography>
					<div>
						{tableExpand ? (
							<Tooltip title="Collapse">
								<ArrowRightIcon onClick={() => setTableExpand(!tableExpand)} />
							</Tooltip>
						) : (
							<Tooltip title="Expand">
								<ArrowDropDownIcon onClick={() => setTableExpand(!tableExpand)} />
							</Tooltip>
						)}
					</div>
				</div>
				{tableExpand ? (
					<div
						style={{
							flex: 1,
							height: "70%",
							overflowY: "auto",
							overflowX: "hidden",
							paddingLeft: "1rem",
						}}
					>
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
							<div
								style={{
									marginTop: "10px",
									fontStyle: "italic",
									padding: "0 1rem 0 1rem",
								}}
							>
								No Tables
							</div>
						)}
					</div>
				) : null}

				<div
					style={{
						fontSize: "16px",
						color: "#666",
						margin: "5px 0 10px 0",
						textAlign: "left",
						padding: "0 1rem 0 1rem",
						display: "flex",
					}}
				>
					<Typography>Views</Typography>
					<div>
						{viewExpand ? (
							<Tooltip title="Collapse">
								<ArrowRightIcon onClick={() => setViewExpand(!viewExpand)} />
							</Tooltip>
						) : (
							<Tooltip title="Expand">
								<ArrowDropDownIcon onClick={() => setViewExpand(!viewExpand)} />
							</Tooltip>
						)}
					</div>
				</div>

				{viewExpand ? (
					<div
						style={{
							flex: 1,
							height: "10%",
							overflowY: "auto",
							overflowX: "hidden",
							paddingLeft: "1rem",
						}}
					>
						{views ? (
							views.map((tab: any) => {
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
												{/* {view} */}
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
							<div
								style={{
									marginTop: "10px",
									fontStyle: "italic",
									padding: "0 1rem 0 1rem",
								}}
							>
								No Views
							</div>
						)}
					</div>
				) : null}
			</div>

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
		views: state.dataSetState.views,
		databaseName: state.dataSetState.databaseName,
		serverName: state.dataSetState.serverName,
		tempTable: state.dataSetState.tempTable,
		connectionValue: state.dataSetState.connection,
		schemaValue: state.dataSetState.schema,
		dataConnectionList: state.dataSetState.dataConnectionList,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setConnection: (connection: string) => dispatch(setConnectionValue(connection)),
		setDataSchema: (schema: string) => dispatch(setDataSchema(schema)),
		setUserTable: (userTable: UserTableProps[]) => dispatch(setUserTable(userTable)),
		setServerName: (name: string) => dispatch(setServerName(name)),
		setDatabaseNametoState: (name: string) => dispatch(setDatabaseNametoState(name)),
		setViews: (views: any[]) => dispatch(setViews(views)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
