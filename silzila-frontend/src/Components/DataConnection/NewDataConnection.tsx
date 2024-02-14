import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, Typography } from "@mui/material";
import MenuBar from "../DataViewer/MenuBar";
import { useLocation } from "react-router-dom";
import redshiftIcon from "../../assets/redshiftIcon.png";
import databricksIcon from "../../assets/databricksIcon.png";
import mssqlIcon from "../../assets/mssqlicon.png";
import mysqlicon from "../../assets/mysqlicon.svg";
import postgresicon from "../../assets/postgresicon.png";
import bigqueryicon from "../../assets/bigqueryicon.svg";
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
			value: "sqlserver",
			name: "Ms SQL Server",
			img: mssqlIcon,
		},
		{
			id: 4,
			value: "mysql",
			name: "MySql",
			img: mysqlicon,
		},
		{
			id: 5,
			value: "postgresql",
			name: "PostgreSql",
			img: postgresicon,
		},
		{
			id: 6,
			value: "bigquery",
			name: "Google BigQuery",
			img: bigqueryicon,
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
		}else {
		if (
			account.vendor !== "" &&
			account.server !== "" &&
			account.port !== "" &&
			account.database !== "" &&
			account.connectionName !== "" &&
			account.password !== ""
		) {
			if (account.vendor === "databricks") {
				if (account.httpPath !== "") {
					setBtnEnable(false);
				} else {
					setBtnEnable(true);
				}
			} else {
				if (account.username !== "") {
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
		if (account.vendor === "databricks") {
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
        } else {
		if (
			account.vendor !== "" &&
			account.server !== "" &&
			account.port !== "" &&
			account.database !== "" &&
			account.connectionName !== "" &&
			account.password &&
			(account.password !== "" || account.password !== undefined)
		) {
			if (account.vendor === "databricks") {
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
				if (account.username !== "") {
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
		if (account.vendor === "databricks") {
			data.httpPath = account.httpPath;
		} else {
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
		if (account.vendor === "databricks") {
			data.httpPath = account.httpPath;
		} else {
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
		} else {
		if (
			account.vendor !== "" &&
			account.server !== "" &&
			account.port !== "" &&
			account.database !== "" &&
			account.connectionName !== "" &&
			account.password &&
			(account.password !== "" || account.password !== undefined)
		) {
			if (account.vendor === "databricks") {
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
		} else {
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
			serverError: "",
			portError: "", 
			databaseError: "", 
			httpPathError: "", 
			userNameError: "", 
			passwordError: "", 
			connectionNameError: "",
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
							}else{
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
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    flex: 0.15, 
    borderRight: '2px solid rgba(224, 224, 224, 1)', 
    padding: '1rem 2rem',
    alignItems: 'flex-start'
    }}
    >    
           <div>
		   {viewMode ? (
                <Typography variant='h6' sx={{color:'#B4B4B3', paddingBottom:'10px'}}>Database</Typography>
							) : !viewMode && enable ? (
				<Typography variant='h6' sx={{color:'#B4B4B3', paddingBottom:'10px'}}>Database</Typography>				
							) : (
                <Typography variant='h6' sx={{color:'#B4B4B3', paddingBottom:'10px'}}>Select a Database</Typography>
							)
			}
			<div> 
				{
				dataconnection.map((data)=>{
					const {id, value, name, img} = data;
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
										<img src={img} alt="Icon" className="vendorIconStyle" />
						               <Typography sx={{color:'#9e9e9e'}}>{name}</Typography>
									</div>
								): !viewMode && enable ? (
									<div className={selected === value ? 'active': 'listItems'}>
										<img src={img} alt="Icon" className="vendorIconStyle" />
						               <Typography sx={{color:'#9e9e9e'}}>{name}</Typography>
									</div>
								 ): 
								 !viewMode && !enable ? (
									<div className={selected === value ? 'active': 'listItem'}>
										<img src={img} alt="Icon" className="vendorIconStyle" />
						               <Typography sx={{color:'#9e9e9e'}}>{name}</Typography>
									</div>
								 ):
								 <div className={selected === value ? 'active': 'listItem'}>
										<img src={img} alt="Icon" className="vendorIconStyle" />
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
	sx={{ display:'flex', flexDirection:'column', flex:1,  marginTop:'1.5rem', overflowY: "auto"}}>

		{ showform || viewMode ?
		<>
            <div 
		    style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>

			    <div>
				   {viewMode ? (
					   <Typography variant='h6' sx={{color:'#B4B4B3', paddingBottom:'10px'}}>DB Connection</Typography>
								   ) : regOrUpdate === "Update" ? (
					   <Typography variant='h6' sx={{color:'#B4B4B3', paddingBottom:'10px'}}>Edit DB Connection</Typography>
								   ) : (
					   <Typography variant='h6' sx={{color:'#B4B4B3', paddingBottom:'10px'}}>Create DB Connection</Typography>
								   )
				   }
			    </div>
			   
				{/*========================== Reusable Component from ../CommonFunctions/TextFieldComponents========================= */}
			    <div
				style={{ display:'flex', flexDirection:'column', gap:'15px', alignItems:'center', width: '100%', marginTop: '20px', padding: '5px',
				height:540, overflow: "hidden", overflowY: "auto"}}>
					           
							   {account.vendor === "bigquery" ? 
							   null
							   :
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
											   serverError: account.vendor === "databricks" ? "Server Hostname should not be empty" : "Server Url should not be empty",
										   });
										   btnEnabelDisable();
									   }
								   }}
								   {...{ viewMode, value: account.server, lable: account.vendor === "databricks" ? "Server Hostname" : "Server Url"}}
							   />
							   <small className="dbConnectionErrorText">{account.serverError}</small>
							   </>
							   }
							   
							   {account.vendor === "bigquery" ?
							   null 
							   :
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
											   portError: "port should not be Empty",
										   });
										   btnEnabelDisable();
									   }
								   }}
								   {...{ viewMode, value: account.port, lable: "Port", type: "number" }}
							   />
							   <small className="dbConnectionErrorText">{account.portError}</small>
							   </>
							   }
							   
							   {account.vendor === "bigquery" ?
							   null 
							   :
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
											   databaseError: "Database should not be Empty",
										   });
										   btnEnabelDisable();
									   }
								   }}
								   {...{ viewMode, value: account.database, lable: "Database"}}
							   />
							   <small className="dbConnectionErrorText">{account.databaseError}</small>
						       </>
							   }
								
								{account.vendor === "bigquery" ?
							   null 
							   :
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
								   {...{ viewMode, value: account.username, lable: "Username"}}
							   />
							   <small className="dbConnectionErrorText">{account.userNameError}</small>
							   </>
							   } 
							   </>
							   }

							  {
								account.vendor === 'databricks' ?
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
								   {...{ viewMode, value: account.password, lable: "Token", type: "text", multiline: true,}}
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
								  {...{ viewMode, value: account.password, lable: "Token", type: "text", multiline: true, rows: 12,
								  placeholder : "Copy, Paste the entire contents from the token json file including { }"}}
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
								   {...{viewMode, value: account.password, lable: "Password", type: "password", }}
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
							   {viewMode ? (
								   <div className="dbFormButton">
									   <Button
										   variant="contained"
										   value="Edit"
										   onClick={(e: any) => {
											   setViewMode(false);
											   setBtnEnable(true);
											   handleMode("Edit");
											   setEnable(true)
										   }}
										   style={{ backgroundColor: "#af99db", marginRight: '18px' }}
									   >
										   Edit
									   </Button>
									   <Button
										   variant="contained"
										   style={{ backgroundColor: "red", marginRight: '7px'}}
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
							   </>
							   :
		                       <div>
		                       <Typography variant= 'h6' sx={{color: '#B4B4B3', paddingTop:'20rem'}}>
								Please select a database
							   </Typography>
						</div>
					}
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
							onClick={() => {
										setChangeDB(false);
										handleListItem(values);
										setDataConnection(values);
								}}
						>
							Continue
						</Button>

						<Button
							className="dbDeleteDialogBtn2"
							variant="contained"
							onClick={() => {
								setChangeDB(false);
								handleListItem(account.vendor);
							}}
						>
							Cancle
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
								deleteDc();
							}}
						>
							Delete
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
