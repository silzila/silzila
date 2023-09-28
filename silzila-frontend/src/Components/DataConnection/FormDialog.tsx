// Creating new connections &  editing existing connections are handled in this component

import React, { useState } from "react";
import {
	Dialog,
	FormControl,
	InputLabel,
	MenuItem,
	Popover,
	Select,
	SelectChangeEvent,
	Typography,
} from "@mui/material";
import "./DataSetup.css";
import { Button } from "@mui/material";
// import FetchData from "../../ServerCall/FetchData";
import TextFieldComponent from "../../Components/CommonFunctions/TextFieldComponent";
import CloseIcon from "@mui/icons-material/Close";
import { FormProps } from "./DataConnectionInterfaces";
import FetchData from "../ServerCall/FetchData";
import redshiftIcon from "../../assets/redshiftIcon.png";
import databricksIcon from "../../assets/databricksIcon.png";
import mssqlIcon from "../../assets/mssqlicon.png";
import mysqlicon from "../../assets/mysqlicon.svg";
import postgresicon from "../../assets/postgresicon.png";
import axios from "axios";
import Logger from "../../Logger";

function FormDialog({
	//props
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

	//state
	token,
}: FormProps) {
	const [dcDel, setDcDel] = useState<boolean>(false);
	const [dcDelMeg, setDcDelMeg] = useState<string>("");
	const [btnEnable, setBtnEnable] = useState<boolean>(false);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

	const btnEnabelDisable = () => {
		if (account.vendor !== "" &&
			account.server !== "" &&
			account.port !== "" &&
			account.database !== "" &&
		    account.connectionName !== "" &&
			account.password !== "") {
			if (account.vendor === 'databricks') {
				if (account.httppath !== "") {
						setBtnEnable(false);	
				} else {
					setBtnEnable(true);
				}
			}
			else {
				if (account.username !== "") {
						setBtnEnable(false);	
				} else {
					setBtnEnable(true);
				}
			}
			
		} else {
		setBtnEnable(true);	
}
	
	};


	// =================================================
	// Test DataConnection
	// =================================================

	const getDatabaseConnectionTest = () => {
		let data:any = {
			connectionName: account.connectionName,
			vendor: account.vendor,
			server: account.server,
			port: account.port,
			database: account.database,
			password: account.password,
			};
			if(account.vendor === "databricks"){
				data.httpPath = account.httppath;
			 }else{
				 data.username = account.username;
			 }
		return FetchData({
			requestType: "withData",
			method: "POST",
			url: "database-connection-test",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			data: data,
		});
	};

	const handleonTest = async () => {
		 if (
			account.vendor !== "" &&
			account.server !== "" &&
			account.port !== "" &&
			account.database !== "" &&
			account.connectionName !== "" &&
			account.password &&
			(account.password !== "" || account.password !== undefined)
		)
			{
				if (account.vendor === 'databricks') {
					if (account.httppath !== "") {
						var response: any = await getDatabaseConnectionTest();

						if (response.status) {
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
							setTestMessage(response.data.message);
							// setTimeout(() => {
							// 	setOpenAlert(false);
							// 	setTestMessage("");
							// }, 4000);
						}
					} else {
						setSeverity("error");
			            setOpenAlert(true);
			            setTestMessage("Please Fillout All the fields");
			            // setTimeout(() => {
			            // 	setOpenAlert(false);
			            // 	setTestMessage("");
			            // }, 4000);
					}
				}
				else {
					if (account.username !== ""){
							var response: any = await getDatabaseConnectionTest();
	
							if (response.status) {
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
								setTestMessage(response.data.message);
								// setTimeout(() => {
								// 	setOpenAlert(false);
								// 	setTestMessage("");
								// }, 4000);
							}
						} else {
							setSeverity("error");
							setOpenAlert(true);
							setTestMessage("Please Fillout All the fields");
							// setTimeout(() => {
							// 	setOpenAlert(false);
							// 	setTestMessage("");
							// }, 4000);
						}
				}
			}
		else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Please Fillout All the fields");
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// 	setTestMessage("");
			// }, 4000);
		} 
	};

	//==============================================================
	//Delete Dc
	//==============================================================
	// const dslistitem = () => {
	// 	if (dsList.length !== 0) {
	// 		return (
	// 			<React.Fragment>
	// 				<div
	// 					style={{
	// 						fontSize: "16px",
	// 						margin: "10px",
	// 					}}
	// 				>
	// 					Following Datasets are using this connection,
	// 					<div style={{ height: "5rem", overflow: "auto", margin: "10px" }}>
	// 						{dsList.map(el => (
	// 							<p style={{ color: "red", margin: "0px" }}>{el}</p>
	// 						))}
	// 					</div>
	// 					Are you sure to delete this Connection?
	// 				</div>
	// 			</React.Fragment>
	// 		);
	// 	} else {
	// 		return <div>Are you sure to delete this Connection?</div>;
	// 	}
	// };

	const deleteDcWarning = () => {
		setOpenConfirmDialog(true);
	};

	const deleteDc = async () => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: "database-connection/" + dataConnId,
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
			Logger("error", result.data.detail);
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(result.data.detail);
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// 	setTestMessage("");
			// }, 3000);
		}
	};
	// =========================================================================
	// On Form Submit (register Or update)
	// =========================================================================

	const onSubmit = async () => {
		if (
			account.vendor !== "" &&
			account.server !== "" &&
			account.port !== "" &&
			account.database !== "" &&
			account.connectionName !== "" &&
			account.password &&
			(account.password !== "" || account.password !== undefined)
		) 
		{
			if (account.vendor === 'databricks') {
				if (account.httppath !== ""){
					var response: any = await getDatabaseConnectionTest();
		
					if (response.status) {
						if (regOrUpdate === "Update") {
							handleonUpdate();
						}
						if (regOrUpdate === "Register") {
							handleRegister();
						}
					} else {
						setSeverity("error");
						setOpenAlert(true);
						setTestMessage(response.data.message);
						// setTimeout(() => {
						// 	setOpenAlert(false);
						// 	setTestMessage("");
						// }, 4000);
					}
				} 
			
				else {
					setSeverity("error");
					setOpenAlert(true);
					setTestMessage("Please Fillout All the fields");
					// setTimeout(() => {
					// 	setOpenAlert(false);
					// 	setTestMessage("");
					// }, 4000);
				}
			}
			else {
				if (account.username !== ""){
					var response: any = await getDatabaseConnectionTest();
		
					if (response.status) {
						if (regOrUpdate === "Update") {
							handleonUpdate();
						}
						if (regOrUpdate === "Register") {
							handleRegister();
						}
					} else {
						setSeverity("error");
						setOpenAlert(true);
						setTestMessage(response.data.message);
						// setTimeout(() => {
						// 	setOpenAlert(false);
						// 	setTestMessage("");
						// }, 4000);
					}
				} 
			
				else {
					setSeverity("error");
					setOpenAlert(true);
					setTestMessage("Please Fillout All the fields");
					// setTimeout(() => {
					// 	setOpenAlert(false);
					// 	setTestMessage("");
					// }, 4000);
				}
			}
			
		}
		
		else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Please Fillout All the fields");
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// 	setTestMessage("");
			// }, 4000);
		}
	};

	const getUrlAndPort = (connection: string) => {
		if (connection === "postgresql") {
			return "5432";
		}
		if (connection === "mysql") {
			return "3306";
		}
		if (connection === "sqlserver") {
			return "1433";
		}
		if (connection === "redshift") {
			return "5439";
		} 
		if (connection === "databricks") {
			return "443";
		}else {
			return "";
		}
	};

	return (
		<>
			<Dialog
				open={showForm}
				onClose={showAndHideForm}
				sx={{
					"& .css-1t1j96h-MuiPaper-root-MuiDialog-paper": {
						overflow: "auto",
					},
				}}
			>
				<div className="dbFormContainer">
					<form
						className="dbForm"
						onSubmit={e => {
							e.preventDefault();
							onSubmit();
						}}
					>
						<div className="dbFormTitle">
							{viewMode ? (
								<h3>DB Connection</h3>
							) : regOrUpdate === "Update" ? (
								<h3>Edit DB Connection</h3>
							) : (
								<h3>Create DB Connection</h3>
							)}

							<CloseIcon onClick={showAndHideForm} />
						</div>
						{/*========================== Reusable Component from ../CommonFunctions/TextFieldComponents========================= */}

						<FormControl style={{ width: "60%" }}>
							<InputLabel id="selectVendor">Vendor</InputLabel>
							<Select
								sx={{
									"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
										{
											display: "flex",
										},
								}}
								required
								fullWidth
								label="vendor"
								labelId="selectVendor"
								disabled={viewMode}
								variant="outlined"
								value={account.vendor}
								onChange={e => {
									setAccount({
										...account,
										vendor: e.target.value,
										server: e.target.value === "databricks" ? "" : "localhost" && e.target.value === "redshift" ? "" : "localhost" ,
										port: getUrlAndPort(e.target.value),
										database: e.target.value === "databricks" ? "default" : "",
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
								
								<MenuItem value="redshift">
									<img src={redshiftIcon} alt="" className="vendorIconStyle" />
									<Typography>Amazon Redshift</Typography>
								</MenuItem>
								<MenuItem value="databricks">
									<img src={databricksIcon} alt="" className="vendorIconStyle" />
									<Typography>Databricks</Typography>
								</MenuItem>
								<MenuItem value="sqlserver">
									<img src={mssqlIcon} alt="" className="vendorIconStyle" />
									<Typography>Ms SQL Server</Typography>
								</MenuItem>
								<MenuItem value="mysql">
									<img src={mysqlicon} alt="" className="vendorIconStyle" />
									<Typography>MySql</Typography>
								</MenuItem>
								<MenuItem value="postgresql">
									<img src={postgresicon} alt="" className="vendorIconStyle" />
									<Typography>PostgreSql</Typography>
								</MenuItem>
							</Select>
						</FormControl>
						<small className="dbConnectionErrorText">{account.vendorError}</small>
                        
						<TextFieldComponent
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setAccount({ ...account, server: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, serverError: "" })}
							onBlur={() => {
								if (account.server.length === 0) {
									setAccount({
										...account,
										serverError: account.vendor === "databricks" ? "Server Hostname should not be empty" : "Server Url should not be empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.server, lable: account.vendor === "databricks" ? "Server Hostname" : "Server Url"}}
						/>
						<small className="dbConnectionErrorText">{account.serverError}</small>
                         
						<TextFieldComponent
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
						<small className="dbConnectionErrorText">{account.portError}</small>
                       
						<TextFieldComponent
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setAccount({ ...account, database: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, databaseError: "" })}
							onBlur={() => {
								if (account.database.length === 0) {
									setAccount({
										...account,
										databaseError: "Database should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.database, lable: "Database"}}
						/>
						<small className="dbConnectionErrorText">{account.databaseError}</small>
					
                         
						{account.vendor === "databricks" ?
						<>
						<TextFieldComponent
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setAccount({ ...account, httppath: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, httppathError: "" })}
							onBlur={() => {
								if (account.httppath.length === 0) {
									setAccount({
										...account,
										httppathError: "HTTP Path should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.httppath, lable: "HTTP Path" }}
						/>
						<small className="dbConnectionErrorText">{account.httppathError}</small>
						</>
                        :
						<>
						<TextFieldComponent
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setAccount({ ...account, username: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, userNameError: "" })}
							onBlur={() => {
								if (account.username.length === 0) {
									setAccount({
										...account,
										userNameError: "Username should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{ viewMode, value: account.username, lable: "Username"}}
						/>
						<small className="dbConnectionErrorText">{account.userNameError}</small>
						</>
						} 
                        
						<TextFieldComponent
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setAccount({ ...account, password: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, passwordError: "" })}
							onBlur={() => {
								if (account.password.length === 0) {
									setAccount({
										...account,
										passwordError: account.vendor === "databricks" ? "Token should not be Empty" : "Password should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{
								viewMode,
								value: account.password,
								lable: account.vendor === "databricks" ? "Token" : "Password",
								type: account.vendor === "databricks" ? "text" : "password",
							}}
						/>
						<small className="dbConnectionErrorText">{account.passwordError}</small>

						<TextFieldComponent
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setAccount({ ...account, connectionName: e.target.value });
								btnEnabelDisable();
							}}
							onFocus={() => setAccount({ ...account, connectionNameError: "" })}
							onBlur={() => {
								if (account.connectionName.length === 0) {
									setAccount({
										...account,
										connectionNameError: "Connection Name should not be Empty",
									});
									btnEnabelDisable();
								}
							}}
							{...{
								viewMode,
								value: account.connectionName,
								lable: "Connection name",
							}}
						/>
						<small className="dbConnectionErrorText">
							{account.connectionNameError}
						</small>
						
						{viewMode ? (
							<div className="dbFormButton">
								<Button
									variant="contained"
									value="Edit"
									onClick={(e: any) => {
										setViewMode(false);
										setBtnEnable(true);
										handleMode("Edit");
									}}
									style={{ backgroundColor: "#af99db" }}
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
							<div className="dbFormButton">
								<Button
									variant="contained"
									onClick={handleonTest}
									disabled={btnEnable}
									style={{
										backgroundColor: btnEnable
											? "rgba(224,224,224,1)"
											: "#af99db",
									}}
								>
									Test
								</Button>
								<Button
									type="submit"
									variant="contained"
									style={{
										backgroundColor: btnEnable
											? "rgba(224,224,224,1)"
											: "#2bb9bb",
									}}
									onClick={e => {
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
			<Dialog open={openConfirmDialog}>
				<div className="dbDeleteDialog">
					<div className="dbDeleteDialogMsg">
						Delete DB Connection?
						<br />
						<br />
					</div>
					<div className="dbDeleteDialogBtnContainer">
						<Button
							className="dbDeleteDialogBtn1"
							onClick={() => setOpenConfirmDialog(false)}
							variant="contained"
						>
							Cancel
						</Button>

						<Button
							className="dbDeleteDialogBtn2"
							variant="contained"
							onClick={() => {
								setOpenConfirmDialog(false);
								showAndHideForm();
								deleteDc();
							}}
						>
							Delete
						</Button>
					</div>
				</div>
			</Dialog>
		</>
	);
}
export default FormDialog;
