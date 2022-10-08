// List of Data connections created by the user is displayed here.
// Users can delete any connections
// Creating new and editing existing connections are handled in FormDialog child component

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import FetchData from "../../ServerCall/FetchData";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { VisibilitySharp } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import FormDialog from "./FormDialog";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { resetAllStates } from "../../redux/TabTile/actionsTabTile";

const initialState = {
	vendor: "",
	vendorError: "",
	url: "",
	urlError: "",
	port: "",
	portError: "",
	db_name: "",
	db_nameError: "",
	username: "",
	userNameError: "",
	friendly_name: "",
	friendly_nameError: "",
	password: "",
	passwordError: "",
};

const DataConnection = (props) => {
	const [dataConnectionList, setDataConnectionList] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [regOrUpdate, setRegOrUpdate] = useState("Register");
	const [account, setAccount] = useState(initialState);
	const [dataConnId, setDataConnId] = useState("");
	const [viewMode, setViewMode] = useState(false);
	const [severity, setSeverity] = useState("success");
	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("Testing alert");

	useEffect(() => {
		props.resetAllStates();
		getInformation();
		// eslint-disable-next-line
	}, []);

	// Get Info on DataConnection from server
	const getInformation = async () => {
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "database-connection",
			headers: { Authorization: `Bearer ${props.token}` },
		});

		if (result.status) {
			setDataConnectionList(result.data);
		} else {
			// console.log(result.data.detail);
		}
	};

	// ================================= when newButton clicked ====================

	//=============== set Mode ===============================

	const handleMode = (e) => {
		if (e.target.value === "New") {
			setRegOrUpdate("Register");
		} else if (e.target.value === "Edit") {
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

	const ViewOrEditDc = async (dcuid) => {
		setDataConnId(dcuid);
		var result = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "database-connection/" + dcuid,
			headers: { Authorization: `Bearer ${props.token}` },
		});

		if (result.status) {
			setAccount({ ...result.data, password: "" });
			setShowForm(true);
			setViewMode(true);
		} else {
			// console.log(result.data.detail);
		}
	};

	// ==============================================================
	//  Register dc
	//  ==============================================================

	const handleRegister = async () => {
		var data = {
			vendor: account.vendor,
			server: account.url,
			port: account.port,
			database: account.db_name,
			username: account.username,
			password: account.password,
			connectionName: account.friendly_name,
		};

		var response = await FetchData({
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
					friendly_nameError: "Friendlly Name is already used try any other Name",
				});
			} else {
				setOpenAlert(true);
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
			// console.log(response);
		}
	};

	// ==============================================================
	// Update Dc
	// ==============================================================
	const handleonUpdate = async () => {
		var data = {
			vendor: account.vendor,
			server: account.url,
			port: account.port,
			database: account.db_name,
			username: account.username,
			password: account.password,
			connectionName: account.friendly_name,
		};

		var response = await FetchData({
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
			// console.log("Update Dc error", response);
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(response.data.detail);
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 3000);
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
				<div className="containerTitle">Data Connections</div>

				<input
					className="containerButton"
					type="button"
					value="New"
					onClick={(e) => {
						handleMode(e);
						showAndHideForm();
					}}
				/>
			</div>
			<div className="connectionListContainer">
				{dataConnectionList &&
					dataConnectionList.map((dc) => {
						return (
							<SelectListItem
								key={dc.friendly_name}
								render={(xprops) => (
									<div
										className={
											xprops.open
												? "dataConnectionListSelected"
												: "dataConnectionList"
										}
										onMouseOver={() => xprops.setOpen(true)}
										onMouseLeave={() => xprops.setOpen(false)}
										onClick={() => ViewOrEditDc(dc.dc_uid)}
									>
										<div className="dataConnectionName">
											{dc.friendly_name} (<i className="">{dc.db_name}</i>){" "}
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
														margin: "auto",
													}}
													onClick={() => ViewOrEditDc(dc.dc_uid)}
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

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		resetAllStates: () => dispatch(resetAllStates()),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(DataConnection);
