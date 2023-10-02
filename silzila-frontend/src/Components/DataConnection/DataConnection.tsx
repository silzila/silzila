// List of Data connections created by the user is displayed here.
// Users can delete any connections
// Creating new and editing existing connections are handled in FormDialog child component

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { VisibilitySharp } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { Dispatch } from "redux";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import FormDialog from "./FormDialog";
import { DataConnectionDetails, DataConnectionProps } from "./DataConnectionInterfaces";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import FetchData from "../ServerCall/FetchData";
import { setDataConnectionListToState } from "../../redux/DataSet/datasetActions";
import { ConnectionItem } from "../../redux/DataSet/DatasetStateInterfaces";
import { resetAllStates } from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import AddIcon from "@mui/icons-material/Add";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import { AlertColor } from "@mui/material/Alert";
import Logger from "../../Logger";

const initialState = {
	vendor: "",
	vendorError: "",
	server: "",
	serverError: "",
	port: "",
	portError: "",
	database: "",
	databaseError: "",
	username: "",
	userNameError: "",
	connectionName: "",
	connectionNameError: "",
	password: "",
	passwordError: "",
	httppath: "",
	httppathError:"",
};

const DataConnection = (props: DataConnectionProps) => {
	const [dataConnectionList, setDataConnectionList] = useState<ConnectionItem[]>([]);
	const [showForm, setShowForm] = useState<boolean>(false);
	const [regOrUpdate, setRegOrUpdate] = useState<string>("Register");
	const [account, setAccount] = useState<DataConnectionDetails>(initialState);
	const [dataConnId, setDataConnId] = useState<string>("");
	const [viewMode, setViewMode] = useState<boolean>(false);
	const [severity, setSeverity] = useState<AlertColor>("success");
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("Testing alert");

	useEffect(() => {
		props.resetAllStates();
		getInformation();
		// eslint-disable-next-line
	}, []);

	// Get Info on DataConnection from server
	const getInformation = async () => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "database-connection",
			headers: { Authorization: `Bearer ${props.token}` },
		});

		if (result.status) {
			
			setDataConnectionList(result.data);
			props.setDataConnectionListToState(result.data);
		} else {
			Logger("error", result.data.detail);
		}
	};

	// ================================= when newButton clicked ====================

	//=============== set Mode ===============================
	// TODO:need to specify types
	const handleMode = (mode: string) => {
		if (mode === "New") {
			setRegOrUpdate("Register");
		} else if (mode === "Edit") {
			setAccount({ ...account, password: "" });
			setRegOrUpdate("Update");
		}
	};

	// =======================================
	// open Form
	//  ======================================

	const showAndHideForm = () => {
		if (showForm === true) {
			setShowForm(false);
			setAccount(initialState);
			setDataConnId("");
			setViewMode(false);
		} else {
			setShowForm(true);
		}
	};

	// ========================================================================

	// ==================================================
	// when Visibility icon Clicked
	// ==================================================
	const ViewOrEditDc = async (dcuid: string) => {
		setDataConnId(dcuid);
		// TODO need to specify type
		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "database-connection/" + dcuid,
			headers: { Authorization: `Bearer ${props.token}` },
		});

		if (result.status) {
			setAccount({ ...result.data, password: "*******" });
			setShowForm(true);
			setViewMode(true);
		} else {
			Logger("error", result.data.detail);
		}
	};

	// ==============================================================
	//  Register dc
	//  ==============================================================

	const handleRegister = async () => {
		var data:any = {
			vendor: account.vendor,
			server: account.server,
			port: account.port,
			database: account.database,
			password: account.password,
			connectionName: account.connectionName,
		};
		if(account.vendor === "databricks"){
           data.httppath = account.httppath;
		}else{
			data.username = account.username;
		}
		// TODO need to specify type
		var response: any = await FetchData({
			requestType: "withData",
			method: "POST",
			url: "database-connection",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${props.token}` },
			data: data,
		});

		if (response.status) {
			if (response.data.message === "Friendlly Name is already used") {
				setAccount({
					...account,
					connectionNameError: "Friendlly Name is already used try any other Name",
				});
			} else {
				setOpenAlert(true);
				setSeverity("success");
				setTestMessage("Data Connection successful");
				getInformation();
				setTimeout(() => {
					setOpenAlert(false);
					setTestMessage("");
					setShowForm(false);
					setAccount(initialState);
				}, 3000);
			}
		} else {
			Logger("error", response);
		}
	};

	// ==============================================================
	// Update Dc
	// ==============================================================
	const handleonUpdate = async () => {
		var data:any = {
			vendor: account.vendor,
			server: account.server,
			port: account.port,
			database: account.database,
			password: account.password,
			connectionName: account.connectionName,
		};
		if(account.vendor === "databricks"){
			data.httppath = account.httppath;
		 }else{
			 data.username = account.username;
		 }
		// TODO need to specify type
		var response: any = await FetchData({
			requestType: "withData",
			method: "PUT",
			url: "database-connection/" + dataConnId,
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${props.token}` },
			data: data,
		});

		if (response.status) {
			setSeverity("success");
			setOpenAlert(true);
			setTestMessage("Updated Successfully!");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
				showAndHideForm();
				getInformation();
			}, 3000);
		} else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(response.data.detail);
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// 	setTestMessage("");
			// }, 3000);
		}
	};

	// ===========================================================
	// props to form Component
	// ===========================================================

	const properties = {
		account,
		setAccount,
		viewMode,
		setViewMode,
		showForm,
		showAndHideForm,
		regOrUpdate,
		handleMode,
		token: props.token,
		setSeverity,
		setOpenAlert,
		setTestMessage,
		dataConnId,
		handleRegister,
		getInformation,
		handleonUpdate,
	};

	return (
		<div className="dataConnectionContainer">
			<div className="containersHead">
				<div className="containerTitle">
					<StorageOutlinedIcon style={{ marginRight: "10px", color: " #2bb9bb" }} />
					DB Connections
				</div>
				<div
					className="containerButton"
					onClick={(e: any) => {
						Logger("info", "add new connection");
						handleMode("New");
						showAndHideForm();
					}}
					title="Create New DB Connection"
				>
					<AddIcon />
				</div>
			</div>
			<div className="listContainer">
				{dataConnectionList &&
					dataConnectionList.map((dc: ConnectionItem) => {
						return (
							<SelectListItem
								key={dc.connectionName}
								render={(xprops: any) => (
									<div
										className={
											xprops.open
												? "dataConnectionListSelected"
												: "dataConnectionList"
										}
										onMouseOver={() => xprops.setOpen(true)}
										onMouseLeave={() => xprops.setOpen(false)}
										// onClick={() => ViewOrEditDc(dc.id)}
									>
										<div className="dataConnectionName">
											{dc.connectionName}
										</div>
										{xprops.open ? (
											<Tooltip
												title="View / Edit Data Connection"
												arrow
												placement="right-start"
											>
												<VisibilitySharp
													style={{
														width: "1rem",
														height: "1rem",
														margin: "auto 7px auto auto",
													}}
													onClick={() => ViewOrEditDc(dc.id)}
												/>
											</Tooltip>
										) : null}
									</div>
								)}
							/>
						);
					})}
			</div>
			<FormDialog {...properties} />

			{/* Alert to display success / failure info */}
			<NotificationDialog
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
				severity={severity}
				testMessage={testMessage}
				openAlert={openAlert}
			/>
		</div>
	);
};

const mapStateToProps = (state: isLoggedProps) => {
	return {
		token: state.isLogged.accessToken,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		resetAllStates: () => dispatch(resetAllStates()),
		setDataConnectionListToState: (list: ConnectionItem[]) =>
			dispatch(setDataConnectionListToState(list)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(DataConnection);
