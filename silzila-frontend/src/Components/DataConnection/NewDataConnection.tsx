import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, Typography } from "@mui/material";
import MenuBar from "../DataViewer/MenuBar";
import { useLocation } from "react-router-dom";
import redshiftIcon from "../../assets/redshiftIcon.png";
import databricksIcon from "../../assets/databricksIcon.png";
import mssqlicon from "../../assets/mssqlicon.png";
import mysqlicon from "../../assets/mysqlicon.svg";
import postgresicon from "../../assets/postgresicon.png";
import bigqueryicon from "../../assets/bigqueryicon.svg";
import oracleicon from "../../assets/oracleicon.svg";
import snowflakeicon from "../../assets/snowflakeicon.svg";
import motherduckicon from "../../assets/motherduckicon.png";
import ibmdb2icon from "../../assets/ibmdb2icon.png";
import teradataicon from "../../assets/teradataicon.png";
import TextFieldComponent from "../../Components/CommonFunctions/TextFieldComponent";
import FetchData from "../ServerCall/FetchData";
import "./DataSetup.css";
import Logger from "../../Logger";
import DatabaseConnectionDialogComponents from "./DatabaseConnectionDialogComponents";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { DataConnectionDetails, DataConnectionProps } from "./DataConnectionInterfaces";
import { ConnectionItem } from "../../redux/DataSet/DatasetStateInterfaces";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AlertColor } from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { resetAllStates } from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import { setDataConnectionListToState } from "../../redux/DataSet/datasetActions";

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
	httpPath: "",
	httpPathError: "",
	keystore:null,
	keystoreError:"",
	keystorePassword:"",
	keystorePasswordError:"",
	truststore:null,
	truststoreError:"",
	truststorePassword:"",
	truststorePasswordError:"",
};

const NewDataConnection = (props: DataConnectionProps) => {
	const [regOrUpdate, setRegOrUpdate] = useState<string>("Register");
	const [account, setAccount] = useState<DataConnectionDetails>(initialState);
	const [dataConnId, setDataConnId] = useState<string>("");
	const [viewMode, setViewMode] = useState<boolean>(false);
	const [severity, setSeverity] = useState<AlertColor>("success");
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("Testing alert");
	const [btnEnable, setBtnEnable] = useState<boolean>(false);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [selected, setSelected] = useState<string>("");
	const [showform, setShowform] = useState<boolean>(false);
	const [enable, setEnable] = useState<boolean>(false);
	const [changedb, setChangeDB] = useState<boolean>(false);
	const [values, setValues] = useState<string>('');
    const navigate =  useNavigate();
    const location = useLocation();
    const state	= location.state;

    //This dataconnection array is used to list all the data connections in UI
	const dataconnection = [
		{
			id: 1,
			value: "redshift",
			name: "Amazon Redshift",
			img: redshiftIcon,
		},
		{
			id: 2,
			value: "databricks",
			name: "Databricks",
			img: databricksIcon,
		},
		{
			id: 3,
			value: "bigquery",
			name: "Google BigQuery",
			img: bigqueryicon,
		},
		{
			id: 4,
			value: "db2",
			name: "IBM DB2",
			img: ibmdb2icon,
		},
		{
			id: 5,
			value: "motherduck",
			name: "Motherduck",
			img: motherduckicon,
		},
		{
			id: 6,
			value: "sqlserver",
			name: "Ms SQL Server",
			img: mssqlicon,
		},
		{
			id: 7,
			value: "mysql",
			name: "MySQL",
			img: mysqlicon,
		},
		{
			id: 8,
			value: "oracle",
			name: "Oracle",
			img: oracleicon,
		},
		{
			id: 9,
			value: "postgresql",
			name: "PostgreSQL",
			img: postgresicon,
		},
		
		{
			id: 10,
			value: "snowflake",
			name: "Snowflake",
			img: snowflakeicon,
		},
		{
			id: 11,
			value: "teradata",
			name: "Teradata",
			img: teradataicon,
		},
	];

	useEffect(() => {
		handleMode(state.mode);
		ViewOrEditDc(state?.id);
		handleListItem(state?.value);
		props.resetAllStates();
		getInformation();
		// eslint-disable-next-line
	}, []);

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

	// Get Info on DataConnection from server
	const getInformation = async () => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "database-connection",
			headers: { Authorization: `Bearer ${props.token}` },
		});

		if (result.status) {
			props.setDataConnectionListToState(result.data);
		} else {
			Logger("error", result.data.detail);
		}
	};

	//ButtonEnabelDisable
	const btnEnabelDisable = () => {
		if(account.vendor !== "" && account.vendor === "bigquery"){
			if(
				account.connectionName !== "" &&
				account.password !== ""){
					setBtnEnable(false);
				}else{
					setBtnEnable(true);
				}
		}
		else if( account.vendor==="snowflake"){
			if(
				account.server !== "" &&
				account.username !== ""&&
				account.password!==""&&
				account.connectionName!==""
			) {
				setBtnEnable(false);
			  } else {
				setBtnEnable(true);
			  }

		}else if( account.vendor==="motherduck"){
			if(
				account.database !== "" &&
				account.username !== ""&&
				account.password!==""&&
				account.connectionName!==""
			) {
				setBtnEnable(false);
			  } else {
				setBtnEnable(true);
			  }

		}else {
		if (
			account.vendor !== "" &&
			account.server !== "" &&
			account.port !== "" &&
			account.database!==""&&
			account.connectionName !== "" &&
			account.password !== ""

		) {
			if (account.vendor === "oracle") {
				if (
				  account.server !== ""&&
				  account.port !== "" &&
				  account.database!==""&&
				  account.connectionName !== "" &&
				  account.username !== "" &&
				  account.password !== "" &&
				  account.keystore !== null &&
				  account.truststore !== null &&
				  account.keystorePassword !== "" &&
				  account.truststorePassword !== ""
				) {
				  setBtnEnable(false);
				} else {
				  setBtnEnable(true);
				}
			  }
			else if (account.vendor === "databricks") {
				if (account.httpPath !== "") {
					setBtnEnable(false);
				} else {
					setBtnEnable(true);
				}
			} else {
				if (account.username !== "" && account.vendor!=="snowflake") {
					setBtnEnable(false);
				} else {
					setBtnEnable(true);
				}
			}
		   
		} else {
			setBtnEnable(true);
		}
	}};

	

	// =================================================
	// Test DataConnection
	// =================================================

	const getDatabaseConnectionTest = () =>  {
		let data: any = {
			connectionName: account.connectionName,
			vendor: account.vendor,
			server: account.server,
			port: account.port,
			database: account.database,
			password: account.password,
		};

		if(account.vendor==="oracle"){
			const form :any = new FormData();

			form.append("connectionName", account.connectionName);
			form.append("vendor", account.vendor);
			form.append("host",account.server)
			form.append("port", account.port.toString());
			form.append("serviceName", account.database);
			form.append("keystorePassword", account.keystorePassword);
			form.append("truststorePassword", account.truststorePassword);
			form.append("username", account.username);
			form.append("password", account.password);
			
			if (account.keystore) { // Check if a file is selected
				form.append("keystore",  account.keystore);
			  }
			
			  if (account.truststore) { // Check if a truststore is selected (assuming similar logic)
				form.append("truststore",account.truststore );
			  }
			
			return FetchData({
				requestType: "withData",
				method: "POST",
				url: "testOracleConnection",
				headers: {
				  "Content-Type": "multipart/form-data",
				  Authorization: `Bearer ${props.token}`,
				},
				data: form,
			  });

		}
		else if(account.vendor==="snowflake"){
			data.server=account.server;
			data.username=account.username;
			data.password=account.password;
			data.connectionName=account.connectionName;
		}
		else if(account.vendor==="motherduck"){
			    data.database=account.database;
				data.username=account.username;
				data.password=account.password;
				data.connectionName=account.connectionName;
		}
		else if (account.vendor === "databricks") {
			data.httpPath = account.httpPath;
		} else {
			data.username = account.username;
			
		}
		return FetchData({
			requestType: "withData",
			method: "POST",
			url: "database-connection-test",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${props.token}` },
			data: data,
		});
	};

	const handleonTest = async () => {
		if(account.vendor !== "" && account.vendor === "bigquery"){
			if (
				account.server === "",
				account.port === "" ,
				account.database === "",
				account.username === "",
				account.connectionName !== "" &&
				JSON.stringify(account.password) &&
				(account.password !== "" || account.password !== undefined)
			) {
				var response: any = await getDatabaseConnectionTest();

				if (response.status) {
					setSeverity("success");
					setOpenAlert(true);
					setTestMessage("Test Connection successful");
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
		
		else if(account.vendor==="snowflake"){
			if(
				account.server !== "" &&
				account.username !== ""&&
				account.password!==""&&
				account.connectionName!==""
			){
				var response: any = await getDatabaseConnectionTest();

				if (response.status) {
					setSeverity("success");
					setOpenAlert(true);
					setTestMessage("Test Connection successful");
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
	else if(account.vendor==="motherduck"){
		if(
			account.database !== ""&&
			account.username !== ""&&
			account.password!==""&&
			account.connectionName!==""
		){
			var response: any = await getDatabaseConnectionTest();

			if (response.status) {
				setSeverity("success");
				setOpenAlert(true);
				setTestMessage("Test Connection successful");
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
		if (
			account.vendor !== "" &&
			account.server !== "" &&
			account.port !== "" &&
			account.database !== "" &&
			account.connectionName !== "" &&
			account.password &&
			(account.password !== "" || account.password !== undefined)
		) {
			if(account.vendor==="oracle"){
				if(
					
					account.username !== "" &&
					account.keystore !== null &&
					account.keystorePassword !== "" &&
					account.truststore !== null &&
					account.truststorePassword !== "" 
				)
				{
					var response: any = await getDatabaseConnectionTest();

					if (response.status) {
						setSeverity("success");
						setOpenAlert(true);
						setTestMessage("Test Connection successful");
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
			
			else if (account.vendor === "databricks") {
				if (account.httpPath !== "") {
					var response: any = await getDatabaseConnectionTest();

					if (response.status) {
						setSeverity("success");
						setOpenAlert(true);
						setTestMessage("Test Connection successful");
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
			} else {

				if (account.username !== "" && account.vendor!=="snowflake") {
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
		} else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Please Fillout All the fields");
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// 	setTestMessage("");
			// }, 4000);
		}}
	};

	// ==============================================================
	//  Register dc
	//  ==============================================================

	const handleRegister = async () => {
		var data: any = {
			vendor: account.vendor,
			server: account.server,
			port: account.port,
			database: account.database,
			password: account.password,
			connectionName: account.connectionName,
		};

		if(account.vendor==="oracle"){
			const form :any = new FormData();
            
			form.append("connectionName", account.connectionName);
			form.append("vendor", account.vendor);
			form.append("host", account.server);
			form.append("port", account.port.toString());
			form.append("serviceName", account.database);
			form.append("keystorePassword", account.keystorePassword);
			form.append("truststorePassword", account.truststorePassword);
			form.append("username", account.username);
			form.append("password", account.password);

			if (account.keystore) { // Check if a file is selected
				form.append("keystore",  account.keystore);
			  }
			
			  if (account.truststore) { // Check if a truststore is selected (assuming similar logic)
				form.append("truststore",account.truststore );
			  }

			var response: any = await FetchData({
				requestType: "withData",
				method: "POST",
				url: "createOracleConnection",
				headers: {
				  "Content-Type": "multipart/form-data",
				  Authorization: `Bearer ${props.token}`,
				},
				data: form,
			  });

		}
		else if(account.vendor==="snowflake"){
			data.server=account.server;
			data.username=account.username;
			data.password=account.password;
			data.connectionName=account.connectionName;
		}
		else if(account.vendor==="motherduck"){
			data.database=account.database;
			data.username=account.username;
			data.password=account.password;
			data.connectionName=account.connectionName;
		}
		else if (account.vendor === "databricks") {
			data.httpPath = account.httpPath;
		} else {
			data.username = account.username;
		}
		
		// TODO need to specify type
		if(account.vendor!=="oracle"){
			var response: any = await FetchData({
				requestType: "withData",
				method: "POST",
				url: "database-connection",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${props.token}` },
				data: data,
			});
		}
		
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
					setAccount(initialState);
					navigate("/datahome");
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
		var data: any = {
			vendor: account.vendor,
			server: account.server,
			port: account.port,
			database: account.database,
			password: account.password,
			connectionName: account.connectionName,
		};
		
        if(account.vendor==="oracle"){
			const form : any = new FormData();
    
			form.append("connectionName", account.connectionName);
			form.append("vendor", account.vendor);
			form.append("host", account.server);
			form.append("port", account.port.toString());
			form.append("serviceName", account.database);
			form.append("keystorePassword", account.keystorePassword);
			form.append("truststorePassword", account.truststorePassword);
			form.append("username", account.username);
			form.append("password", account.password);

			if (account.keystore) { // Check if a file is selected
				form.append("keystore",  account.keystore);
			  }
			
			  if (account.truststore) { // Check if a truststore is selected (assuming similar logic)
				form.append("truststore",account.truststore );
			  }

			  var response: any = await FetchData({
				requestType: "withData",
				method: "POST",
				url: "updateOracleConnection/" + dataConnId,
				headers: { "Content-Type": "multipart/form-data",
					        Authorization: `Bearer ${props.token}`
						 },
				data: form,
			});

		}

		else if (account.vendor === "databricks") {
			data.httpPath = account.httpPath;
		} else {
			data.username = account.username;
		}

		// TODO need to specify type
		if(account.vendor!=="oracle"){
              var response: any = await FetchData({
				requestType: "withData",
				method: "PUT",
				url: "database-connection/" + dataConnId,
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${props.token}` },
				data: data,
			});
		}
		
		if (response.status) {
			setSeverity("success");
			setOpenAlert(true);
			setTestMessage("Updated Successfully!");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
				getInformation();
				navigate("/datahome");
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
			setViewMode(true);
		} else {
			Logger("error", result.data.detail);
		}
	};

	// ==================================================
	// when Delete icon Clicked
	// ==================================================
	const deleteDcWarning = () => {
		setOpenConfirmDialog(true);
	};

	const deleteDc = async () => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: "database-connection/" + dataConnId,
			headers: { Authorization: `Bearer ${props.token}` },
		});

		  
		if (result.status) {
			setSeverity("success");
			setOpenAlert(true);
			setTestMessage("Deleted Successfully!");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
				getInformation();
				navigate("/datahome");
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
		if(account.vendor !== "" && account.vendor === "bigquery"){
			if(
				account.server === "",
				account.port === "" ,
				account.database === "",
				account.username === "",
				account.connectionName !== "" &&
				JSON.stringify(account.password) &&
				(account.password !== "" || account.password !== undefined)
				){
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
			}else{
				setSeverity("error");
				setOpenAlert(true);
				setTestMessage("Please Fillout All the fields");
				// setTimeout(() => {
				// 	setOpenAlert(false);
				// 	setTestMessage("");
				// }, 4000);
			}
		}else if(account.vendor==="snowflake"){
			if(
			    account.server !== "" &&
				account.username !== "" &&
				account.password &&
				(account.password !== "" || account.password !== undefined)&&
				account.connectionName !== ""
			){
				
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
		else if(account.vendor==="motherduck"){
			if(
			    account.database!== "" &&
				account.username !== "" &&
				account.password &&
				(account.password !== "" || account.password !== undefined)&&
				account.connectionName !== ""
			){
				
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
		if (
			account.vendor !== "" &&
			account.server !== "" &&
			account.port !== "" &&
			account.database !== "" &&
			account.connectionName !== "" &&
			account.password &&
			(account.password !== "" || account.password !== undefined)
		) {
			if(account.vendor==="oracle"){
				if(
					account.username !== "" &&
					account.keystore !== null &&
					account.keystorePassword !== "" &&
					account.truststore !== null &&
					account.truststorePassword !== "" 
				)
				{
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

			else if (account.vendor === "databricks") {
				if (account.httpPath !== "") {
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
				} else {
					setSeverity("error");
					setOpenAlert(true);
					setTestMessage("Please Fillout All the fields");
					// setTimeout(() => {
					// 	setOpenAlert(false);
					// 	setTestMessage("");
					// }, 4000);
				}
			} else {
				if (account.username !== "") {
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
		} else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Please Fillout All the fields");
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// 	setTestMessage("");
			// }, 4000);
		}}
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
		} 
		if (connection === "oracle") {
			return "1522";
		}if (connection === "db2") {
			return "32459";
		}if (connection === "teradata") {
			return "1025";
		}else {
			return "";
		}
	};

	//handleListItem function is used for highlighting the selected DataConnection
	const handleListItem = ( value: string) => {
			setSelected(value);
			if(value){
				setShowform(true);
				}		
		}

     const setDataConnection = (value: string) => {
        setAccount({
			...account,
			vendor: value,
			server: value === "databricks" ? "" : "localhost" && value === "redshift" ? "" : "localhost" ,
			port: getUrlAndPort(value),
			database: value === "databricks" ? "default" : "",
			httpPath: "",
			username: "",
			password: "",
			connectionName: "",
			keystore:null,
			keystorePassword:"",
			truststore:null,
			truststorePassword:"",
			serverError: "",
			portError: "", 
			databaseError: "", 
			httpPathError: "", 
			userNameError: "", 
			passwordError: "", 
			connectionNameError: "",
			keystoreError:"",
			keystorePasswordError:"",
			truststoreError:"",
			truststorePasswordError:"",
		});
	 }

	 const dataConnectionOnclick=(value:any)=>{
		if(!viewMode && !enable){
			if(value !== ''){
				if(account.vendor !== ''){
					if(account.vendor !== value){
						if(value === 'redshift'){
						    if(account.vendor === 'databricks'){
								if(account.server !== '' || account.httpPath !== ''  || account.password !== '' || account.connectionName !== ''){
									setChangeDB(true);
									setValues(value);
								}else{
									setDataConnection(value);
								}	
							}else {
								if(account.vendor === 'sqlserver' || 'mysql' || 'postgresql' || 'bigquery'){
									if(account.password !== '' || account.connectionName !== '' || account.database !== '' || account.username !== '' ){
										setChangeDB(true);
										setValues(value);
									}else{
										setDataConnection(value);	
									}
								}
							}
						}else{
							if(value === 'databricks'){
								if(account.vendor === 'redshift'){
									if(account.server !== '' || account.database !== '' || account.username !== '' || account.password !== '' || account.connectionName !== ''){
										setChangeDB(true);
										setValues(value);
									}else{
										setDataConnection(value);
									}
								}else{
									if(account.vendor === 'sqlserver' || 'mysql' || 'postgresql' || 'bigquery'){
										if(account.password !== '' || account.connectionName !== '' || account.database !== '' || account.username !== ''){
											setChangeDB(true);
											setValues(value);
										}else{
											setDataConnection(value);	
										}
									}
								}
							}else{
								if(value === 'bigquery'){
									if(account.vendor === 'redshift'){
										if(account.server !== '' || account.database !== '' || account.username !== '' || account.password !== '' || account.connectionName !== ''){
											setChangeDB(true);
											setValues(value);
										}else{
											setDataConnection(value);
										}
									}else{
										if(account.vendor === 'databricks'){
											if(account.server !== '' || account.httpPath !== ''  || account.password !== '' || account.connectionName !== ''){
												setChangeDB(true);
												setValues(value);
											}else{
												setDataConnection(value);
											}	
										}else{
												if(account.password !== '' || account.connectionName !== '' || account.database !== '' || account.username !== ''){
													setChangeDB(true);
													setValues(value);
												}else{
													setDataConnection(value);	
												}}}}
												else{
													if(value === 'sqlserver' || 'mysql' || 'postgresql'){
														if(account.vendor === 'redshift'){
															if(account.server !== '' || account.database !== '' || account.username !== '' || account.password !== '' || account.connectionName !== ''){
																setChangeDB(true);
																setValues(value);
															} else {
																setDataConnection(value);
															}
														} else {
															if(account.vendor === 'databricks'){
																if(account.server !== '' || account.httpPath !== ''  || account.password !== '' || account.connectionName !== ''){
																	setChangeDB(true);
																	setValues(value);
																} else {
																	setDataConnection(value);
																}
															} else {
																if(account.password !== '' || account.connectionName !== '' || account.database !== '' || account.username !== ''){
																	setChangeDB(true);
														            setValues(value);
																} else {
																	setDataConnection(value);
																}}}}}
															}
														}
													} else {
														if(account.vendor === value){}
													}
												} else {
													setDataConnection(value);
												}
											}
											btnEnabelDisable();
										}
										else{
											if(!viewMode && enable){}
										}
									}

	 const handleListItemBasedOnVendor = (value:any)=>{
		if(enable){
			return setEnable(true);
		} 
		
		if(!viewMode && !enable){
			handleListItem(value);
		}
	 }

  return (
    <div style={{height: '100vh'}}>
      
    <div style={{borderBottom: '2px solid rgba(224, 224, 224, 1)'}}>
        <MenuBar from="dataSet" />
    </div>
   
    <div style={{display:'flex'}}>
		
    <Box 
    sx={{ 
    // minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    flex: 0.15, 
    borderRight: '2px solid rgba(224, 224, 224, 1)', 
    padding: '1rem 2rem',
    alignItems: 'flex-start',
		height: '100vh'
	// overflow:'auto'
    }}
	className="addScrollBar"
    >    
           <div >

		   {viewMode ? (
                <Typography variant='h6' sx={{color:'#B4B4B3', paddingBottom:'10px'}}>Database</Typography>
							) : !viewMode && enable ? (
				<Typography variant='h6' sx={{color:'#B4B4B3', paddingBottom:'10px'}}>Database</Typography>				
							) : (
                <Typography variant='h6' sx={{color:'#B4B4B3', paddingBottom:'10px'}}>Select a Database</Typography>
							)
			}
			<div > 
				{
				dataconnection.map((data)=>{
					const {id, value, name, img} = data;
					const vendorIconClass = (data.value === 'databricks'||  data.value === 'redshift' || data.value === 'teradata') ? 'separateVendorIcon' : 'vendorIconStyle';
					return(
						
						<div 
						onClick={() =>dataConnectionOnclick(value)}
						onFocus={() => setAccount({ ...account, vendorError: "" })}
						onBlur={() => {
							if (account.vendor.length === 0) {
								setAccount({
									...account,
									vendorError: "vendor should not be Empty",
								});
								btnEnabelDisable();
							}
						}} >
							
							<div key={id} onClick={() =>{ handleListItemBasedOnVendor(value)}} >
					        
								{ viewMode ? (
									<div className={selected === value ? 'active': 'listItems'}>
										<img src={img} alt="Icon" className={vendorIconClass} />
						               <Typography sx={{color:'#9e9e9e'}}>{name}</Typography>
									</div>
								): !viewMode && enable ? (
									<div className={selected === value ? 'active': 'listItems'}>
										<img src={img} alt="Icon" className={vendorIconClass} />
						               <Typography sx={{color:'#9e9e9e'}}>{name}</Typography>
									</div>
								 ): 
								 !viewMode && !enable ? (
									<div className={selected === value ? 'active': 'listItem'}>
										<img src={img} alt="Icon" className= {vendorIconClass} />
						               <Typography sx={{color:'#9e9e9e'}}>{name}</Typography>
									</div>
								 ):
								 <div className={selected === value ? 'active': 'listItem'}>
										<img src={img} alt="Icon" className={vendorIconClass} />
						               <Typography sx={{color:'#9e9e9e'}}>{name}</Typography>
								 </div>
								 }
							
							</div>
						</div>	
					)
				})
			    }
			</div>
		</div> 
    </Box>
     
    <Box
    sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        marginTop: '1.5rem',
        overflowY: "auto"
    }}
>
    {showform || viewMode ? (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <div>
                    {viewMode ? (
                        <Typography variant='h6' sx={{ color: '#B4B4B3', paddingBottom: '10px' }}>DB Connection</Typography>
                    ) : regOrUpdate === "Update" ? (
                        <Typography variant='h6' sx={{ color: '#B4B4B3', paddingBottom: '10px' }}>Edit DB Connection</Typography>
                    ) : (
                        <Typography variant='h6' sx={{ color: '#B4B4B3', paddingBottom: '10px' }}>Create DB Connection</Typography>
                    )}
                </div>

                <div className="dbForm">

					{account.vendor !== "bigquery" && account.vendor!=="motherduck" &&(
                        <>
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
                                            serverError: account.vendor === "databricks" ? "Server Hostname should not be empty" 
											: account.vendor==="snowflake" || account.vendor==="db2"||account.vendor==="teradata" ? "Server should not be empty"
											: account.vendor==="oracle" ? "Host should not be Empty"
											: "Server Url should not be empty"
											,
                                        });
                                        btnEnabelDisable();
                                    }
                                }}
                                {...{ viewMode, value: account.server, lable: account.vendor === "databricks" ? "Server Hostname" 
									 : account.vendor==="snowflake" || account.vendor==="db2"||account.vendor==="teradata" ? "Server": account.vendor==="oracle" ?"Host" 
									 : "Server Url" }}
                            />
                            <small className="dbConnectionErrorText">{account.serverError}</small>
                        </>
                    )}

                    {account.vendor !== "bigquery" && account.vendor !== "snowflake" && account.vendor!=="motherduck" &&(
                        <>
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
                                            portError: "Port should not be Empty",
                                        });
                                        btnEnabelDisable();
                                    }
                                }}
                                {...{ viewMode, value: account.port, lable: "Port", type: "number" }}
                            />
                            <small className="dbConnectionErrorText">{account.portError}</small>
                        </>
                    )}

					

                    {account.vendor !== "bigquery"  && account.vendor !== "snowflake" && (
                        <>
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
                                            databaseError: account.vendor === "oracle" ?"Service Name should not be Empty": "Database should not be Empty",
                                        });
                                        btnEnabelDisable();
                                    }
                                }}
                                {...{ viewMode, value: account.database, lable: account.vendor === "oracle" ?"Service Name" : "Database" }}
                            />
                            <small className="dbConnectionErrorText">{account.databaseError}</small>
                        </>
                    )}

                    {account.vendor==="oracle"&& (
						<>
						 <TextFieldComponent
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								if (e.target.files && e.target.files.length > 0) {
									const file = e.target.files[0];
									// console.log(e.target.files);
									setAccount({
									  ...account,
									  keystore: file,
									  keystoreError: "",
									});
									btnEnabelDisable();
								  }
							}}
							onFocus={() => setAccount({ ...account, keystoreError: "" })}
							onBlur={(e:React.ChangeEvent<HTMLInputElement>) => {	
							if (!account.keystore ) {
								setAccount({
								...account,
								keystoreError: "Key Store should not be empty",
								});
								btnEnabelDisable();
							}
							}}
							{...{
							viewMode,
							value: account.keystore ? account.keystore.name : "",
							lable: "Key Store",
							type: "file",
							}}
						/>
						<small className="dbConnectionErrorText">{account.keystoreError}</small>



						<TextFieldComponent
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setAccount({ ...account, keystorePassword: e.target.value });
                                        btnEnabelDisable();
                                    }}
                                    onFocus={() => setAccount({ ...account, keystorePasswordError: "" })}
                                    onBlur={() => {
                                        if (account.keystorePassword.length === 0) {
                                            setAccount({
                                                ...account,
                                                keystorePasswordError: "keystore Password should not be Empty",
                                            });
                                            btnEnabelDisable();
                                        }
                                    }}
                                    {...{ viewMode, value: account.keystorePassword, lable: "keystore Password", type: "password", }}
                                />
                                <small className="dbConnectionErrorText">{account.keystorePasswordError}</small>

							<TextFieldComponent
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setAccount({ ...account, truststore: e.target.files ? e.target.files[0] : null,
										        truststoreError: e.target.files ? "" : account.truststoreError,
									});
									btnEnabelDisable();
									}}
									onFocus={() => setAccount({ ...account, truststoreError: "" })}
									onBlur={(e:React.ChangeEvent<HTMLInputElement>) => {
									if (!account.truststore && !e.target.files ) {
										setAccount({
										...account,
										truststoreError: "Trust Store should not be empty",
										});
										btnEnabelDisable();
									}
									}}
									{...{
									viewMode,
									value: account.truststore ? account.truststore.name : "",
									lable: "Trust Store",
									type: "file",
									}}
								/>
								<small className="dbConnectionErrorText">{account.truststoreError}</small>

						<TextFieldComponent
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setAccount({ ...account, truststorePassword: e.target.value });
                                        btnEnabelDisable();
                                    }}
                                    onFocus={() => setAccount({ ...account, truststorePasswordError: "" })}
                                    onBlur={() => {
                                        if (account.truststorePassword.length === 0) {
                                            setAccount({
                                                ...account,
                                                truststorePasswordError: "truststore Password should not be Empty",
                                            });
                                            btnEnabelDisable();
                                        }
                                    }}
                                    {...{ viewMode, value: account.truststorePassword, lable: "truststore Password", type: "password", }}
                                />
                                <small className="dbConnectionErrorText">{account.truststorePasswordError}</small>		
						</>
					)}

                    {account.vendor !== "bigquery" &&(
                        <>
                            {account.vendor === "databricks" ?
                                <>
                                    <TextFieldComponent
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setAccount({ ...account, httpPath: e.target.value });
                                            btnEnabelDisable();
                                        }}
                                        onFocus={() => setAccount({ ...account, httpPathError: "" })}
                                        onBlur={() => {
                                            if (account.httpPath.length === 0) {
                                                setAccount({
                                                    ...account,
                                                    httpPathError: "HTTP Path should not be Empty",
                                                });
                                                btnEnabelDisable();
                                            }
                                        }}
                                        {...{ viewMode, value: account.httpPath, lable: "HTTP Path" }}
                                    />
                                    <small className="dbConnectionErrorText">{account.httpPathError}</small>
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
                                        {...{ viewMode, value: account.username, lable: "Username" }}
                                    />
                                    <small className="dbConnectionErrorText">{account.userNameError}</small>
                                </>
                            }
                        </>
                    )}

                    {account.vendor === 'databricks' ?
                        <>
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
                                            passwordError: "Token should not be Empty",
                                        });
                                        btnEnabelDisable();
                                    }
                                }}
                                {...{ viewMode, value: account.password, lable: "Token", type: "text", multiline: true, }}
                            />
                            <small className="dbConnectionErrorText">{account.passwordError}</small>
                        </>
                        :
                        account.vendor === "bigquery" ?
                            <>
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
                                                passwordError: "Token should not be Empty",
                                            });
                                            btnEnabelDisable();
                                        }
                                    }}
                                    {...{
                                        viewMode, value: account.password, lable: "Token", type: "text", multiline: true, rows: 12,
                                        placeholder: "Copy, Paste the entire contents from the token json file including { }"
                                    }}
                                />
                                <small className="dbConnectionErrorText">{account.passwordError}</small>
                            </>
                            :
                            <>
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
                                                passwordError: "Password should not be Empty",
                                            });
                                            btnEnabelDisable();
                                        }
                                    }}
                                    {...{ viewMode, value: account.password, lable: "Password", type: "password", }}
                                />
                                <small className="dbConnectionErrorText">{account.passwordError}</small>
                            </>
                    }

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
					
                </div>
				
            </div>

         <div className="dbButton">
			<div className="dbButtonContainer">
                <div className="dbButtonBox">
                    {viewMode ? (
                        <div className="dbFormButton">
							<Button 
                                variant="contained"
                                style={{ backgroundColor: "red", marginRight: '-108px' }}
                                onClick={deleteDcWarning}
                            >
                                Delete
                            </Button>

                            <Button
                                variant="contained"
                                value="Edit"
                                onClick={(e: any) => {
                                    setViewMode(false);
                                    setBtnEnable(true);
                                    handleMode("Edit");
                                    setEnable(true)
                                }}
								style={{ backgroundColor: "rgb(175, 153, 219)", 
										 marginRight: '5px'
									  
									}}
                            >
                                Edit
                            </Button>
                        
                        </div>
                    ) : (
                        <div className="dbFormButton">
                            <Button className="testButton"
                                variant="contained"
                                onClick={handleonTest}
                                disabled={btnEnable}
                                style={{
                                    backgroundColor: btnEnable ? "rgba(224,224,224,1)" : "#af99db",
									marginRight: '-108px'
                                }}
                            >
                                Test
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                style={{
                                    backgroundColor: btnEnable ? "rgba(224,224,224,1)" : "#2bb9bb",
                                    marginRight: '5px'
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
                </div>
            </div>
		</div>
        </>
    ) : (
        <div>
            <Typography variant='h6' sx={{ color: '#B4B4B3', paddingTop: '20rem' }}>
                Please select a database
            </Typography>
        </div>
    )}
</Box>

				{/* Alert to display success / failure info */}
			    <DatabaseConnectionDialogComponents
                onCloseAlert={() => {
                setOpenAlert(false);
                setTestMessage("");
                }}
                severity={severity}
                testMessage={testMessage}
                openAlert={openAlert}

                />


           <Dialog open={changedb} sx={{marginLeft:'16rem'}}>
				<div className="dbDeleteDialog">
					<div className="dbDeleteDialogMsg">
					You are selecting a different database vendor. Are you sure to reset connection details?
						<br />
						<br />
					</div>
					<div className="dbDeleteDialogBtnContainer">
						<Button
							className="dbDeleteDialogBtn1"
							variant="contained"
							sx={{backgroundColor: "white",
								color: "#5d5c5c",
								border: "1px solid gray",
								marginLeft: "8px",
								width: "105px",
								boxShadow: 'none',
								'&:hover': {
								backgroundColor: "gray",
								color: "white"
							}
							}}
							onClick={() => {
										setChangeDB(false);
										handleListItem(account.vendor);
								}}
						>
							Cancel
						</Button>

						<Button
							className="dbDeleteDialogBtn2"
							sx={{backgroundColor: "white",
								color: "#5d5c5c",
								border: "1px solid gray",
								marginRight: "6px",
								boxShadow: 'none',
								'&:hover': {
								backgroundColor: " #8c6bb1",
								color: "white"
							}
							}}
							variant="contained"
							onClick={() => {
								setChangeDB(false);
								handleListItem(values);
								setDataConnection(values);
							}}
						>
							Continue
						</Button>
					 </div>
				</div>
			</Dialog>		
            
            <Dialog open={openConfirmDialog} sx={{marginLeft:'16.7rem'}}>
				<div className="dbDeleteDialog">
					<div className="dbDeleteDialogMsg">
						Delete DB Connection?
						<br />
						<br />
					</div>
					<div className="dbDeleteDialogBtnContainer">
					<Button
							className="dbDeleteDialogBtn2"
							variant="contained"
							onClick={() => {
								setOpenConfirmDialog(false);
								deleteDc();
							}}
						>
							Delete
						</Button>

						<Button
							className="dbDeleteDialogBtn1"
							onClick={() => setOpenConfirmDialog(false)}
							variant="contained"
						>
							Cancel
						</Button>

						
					 </div>
				</div>
				</Dialog>
			</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewDataConnection);