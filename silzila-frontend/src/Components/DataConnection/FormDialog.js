// Creating new connections &  editing existing connections are handled in this component

import React, { useState } from "react";
import { Dialog, FormControl, InputLabel, MenuItem, Popover, Select } from "@mui/material";
import "./DataSetup.css";
import { Button } from "@mui/material";
import FetchData from "../../ServerCall/FetchData";
import TextFieldComponent from "../../Components/CommonFunctions/TextFieldComponent";
import CloseIcon from "@mui/icons-material/Close";

function FormDialog({
	//state
	account,
	setAccount,
	viewMode,
	setViewMode,
	showForm,
	regOrUpdate,
	setSeverity,
	setOpenAlert,
	setTestMessage,
	dataConnId,

	//function
	showAndHideForm,
	handleMode,
	handleRegister,
	getInformation,
	handleonUpdate,

	//value
	token,
}) {
	const [dcDel, setDcDel] = useState(false);
	const [dcDelMeg, setDcDelMeg] = useState("");
	let dsList = ["abcd", "efgh", "ijkl"];
	const [btnEnable, setBtnEnable] = useState(false);

	const btnEnabelDisable = () => {
		if (
			account.vendor !== "" &&
			account.url !== "" &&
			account.port !== "" &&
			account.db_name !== "" &&
			account.username !== "" &&
			account.friendly_name !== "" &&
			account.password !== ""
		) {
			setBtnEnable(false);
		} else {
			setBtnEnable(true);
		}
	};

	// =================================================
	// Test DataConnection
	// =================================================
	const handleonTest = async () => {
		if (
			account.vendor !== "" &&
			account.url !== "" &&
			account.port !== "" &&
			account.db_name !== "" &&
			account.username !== "" &&
			account.friendly_name !== "" &&
			account.password &&
			(account.password !== "" || account.password !== undefined)
		) {
			let data = {
				friendly_name: account.friendly_name,
				vendor: account.vendor,
				url: account.url,
				port: account.port,
				db_name: account.db_name,
				username: account.username,
				password: account.password,
			};

			var response = await FetchData({
				requestType: "withData",
				method: "POST",
				url: "dc/test-dc",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				data: data,
			});

			if (response.status && response.data.message === "Test Seems OK") {
				setSeverity("success");
				setOpenAlert(true);
				setTestMessage("Test Connection successfull");
				setTimeout(() => {
					setOpenAlert(false);
					setTestMessage("");
				}, 3000);
			} else {
				setSeverity("error");
				setOpenAlert(true);
				setTestMessage(response.data.detail);
				setTimeout(() => {
					setOpenAlert(false);
					setTestMessage("");
				}, 4000);
			}
		} else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Please Fillout All the fields");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 4000);
		}
	};

	// ==============================================================
	// Delete Dc
	// ==============================================================
	const dslistitem = () => {
		if (dsList.length !== 0) {
			return (
				<React.Fragment>
					<div
						style={{
							fontSize: "16px",
							margin: "10px",
						}}
					>
						Following Datasets are using this connection,
						<div style={{ height: "5rem", overflow: "auto", margin: "10px" }}>
							{dsList.map((el) => (
								<p style={{ color: "red", margin: "0px" }}>{el}</p>
							))}
						</div>
						Are you sure to delete this Connection?
					</div>
				</React.Fragment>
			);
		} else {
			return <div>Are you sure to delete this Connection?</div>;
		}
	};

	const deleteDcWarning = async () => {
		var delDataSet = window.confirm("Delete Data Connection?");
		if (delDataSet) {
			showAndHideForm();
			deleteDc();
		}
	};

	const deleteDc = async () => {
		var result = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: "dc/delete-dc/" + dataConnId,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			setDcDel(false);
			setSeverity("success");
			setOpenAlert(true);
			setTestMessage("Deleted Successfully!");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
				showAndHideForm();
				setDcDelMeg("");
				getInformation();
			}, 3000);
		} else {
			// console.log("Delete Dc", result.data.detail);
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(result.data.detail);
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 3000);
		}
	};
	// =========================================================================
	// On Form Submit (register Or update)
	// =========================================================================

	const onSubmit = () => {
		if (
			account.vendor !== "" &&
			account.url !== "" &&
			account.port !== "" &&
			account.db_name !== "" &&
			account.username !== "" &&
			account.friendly_name !== "" &&
			account.password !== ""
		) {
			if (regOrUpdate === "Update") {
				handleonUpdate();
			}
			if (regOrUpdate === "Register") {
				handleRegister();
			}
		}
	};

	const setUrlAndPort = (connection) => {
		if (connection === "postgresql") {
			return 5432;
		}
		if (connection === "mysql") {
			return 3306;
		}
		if (connection === "mssql") {
			return 1433;
		}
	};

	return (
		<>
			<Dialog
				open={showForm}
				// onClose={showAndHideForm}
			>
				<div style={{ padding: "10px", width: "400px" }}>
					<form
						style={{
							// textAlign: "center",
							alignItems: "center",
							display: "flex",
							flexDirection: "column",
							rowGap: "10px",
						}}
						onSubmit={(e) => {
							e.preventDefault();
							onSubmit();
						}}
					>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "95% 5%",
								textAlign: "center",
								width: "100%",
							}}
						>
							{viewMode ? (
								<h3>Data Connection</h3>
							) : regOrUpdate === "Update" ? (
								<h3>Edit Data Connection</h3>
							) : (
								<h3>Create Data Connection</h3>
							)}

							<CloseIcon onClick={showAndHideForm} />
						</div>
						{/*========================== Reusable Component from ../CommonFunctions/TextFieldComponents========================= */}

						<FormControl style={{ width: "60%" }}>
							<InputLabel id="selectVendor">Vendor</InputLabel>
							<Select
								required
								fullWidth
								label="vendor"
								labelId="selectVendor"
								disabled={viewMode}
								variant="outlined"
								value={account.vendor}
								onChange={(e) => {
									setAccount({
										...account,
										vendor: e.target.value,
										url: "localhost",
										port: setUrlAndPort(e.target.value),
									});
									btnEnabelDisable();
								}}
								onFocus={() => setAccount({ ...account, vendorError: "" })}
								onBlur={() => {
									if (account.vendor.length === 0) {
										setAccount({
											...account,
											vendorError: "vendor should not be Empty",
										});
										btnEnabelDisable();
									}
								}}
							>
								<MenuItem value="postgresql">Postgresql</MenuItem>
								<MenuItem value="mysql">Mysql</MenuItem>
								<MenuItem value="mssql">Mssql</MenuItem>
							</Select>
						</FormControl>
						<small style={{ color: "red" }}>{account.vendorError}</small>
						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, url: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, urlError: "" })}
							onBlur={() => {
								if (account.url.length === 0) {
									setAccount({
										...account,
										urlError: "url should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.url, lable: "Url" }}
						/>
						<small style={{ color: "red" }}>{account.urlError}</small>
						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, port: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, portError: "" })}
							onBlur={() => {
								if (account.port.length === 0) {
									setAccount({
										...account,
										portError: "port should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.port, lable: "Port", type: "number" }}
						/>
						<small style={{ color: "red" }}>{account.portError}</small>
						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, db_name: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, db_nameError: "" })}
							onBlur={() => {
								if (account.db_name.length === 0) {
									setAccount({
										...account,
										db_nameError: "Database should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.db_name, lable: "Database" }}
						/>
						<small style={{ color: "red" }}>{account.db_nameError}</small>

						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, friendly_name: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, friendly_nameError: "" })}
							onBlur={() => {
								if (account.friendly_name.length === 0) {
									setAccount({
										...account,
										friendly_nameError: "Connection Name should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{
								viewMode,
								value: account.friendly_name,
								lable: "Connection name",
							}}
						/>
						<small style={{ color: "red" }}>{account.friendly_nameError}</small>
						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, username: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, usernameError: "" })}
							onBlur={() => {
								if (account.username.length === 0) {
									setAccount({
										...account,
										usernameError: "Username should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.username, lable: "Username" }}
						/>
						<small style={{ color: "red" }}>{account.usernameError}</small>

						<TextFieldComponent
							onChange={(e) => {
								setAccount({ ...account, password: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, passwordError: "" })}
							onBlur={() => {
								if (account.password.length === 0) {
									setAccount({
										...account,
										passwordError: "Password should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{
								viewMode,
								value: account.password,
								lable: "Password",
								type: "password",
							}}
						/>
						<small style={{ color: "red" }}>{account.passwordError}</small>
						{viewMode ? (
							<div
								style={{
									margin: "10px auto",
									display: "flex",
									columnGap: "40px",
								}}
							>
								<Button
									variant="contained"
									value="Edit"
									onClick={(e) => {
										setViewMode(false);
										setBtnEnable(true);
										handleMode(e);
									}}
								>
									Edit
								</Button>
								<Button
									variant="contained"
									style={{ backgroundColor: "red" }}
									onClick={deleteDcWarning}
								>
									Delete
								</Button>
							</div>
						) : (
							<div
								style={{
									margin: "10px auto",
									display: "flex",
									columnGap: "40px",
								}}
							>
								<Button
									variant="contained"
									onClick={handleonTest}
									disabled={btnEnable}
								>
									Test
								</Button>
								<Button
									type="submit"
									variant="contained"
									style={{ backgroundColor: "green" }}
									onClick={(e) => {
										e.preventDefault();
										onSubmit();
									}}
									disabled={btnEnable}
								>
									{regOrUpdate}
								</Button>
							</div>
						)}
					</form>
				</div>
			</Dialog>
		</>
	);
}
export default FormDialog;
