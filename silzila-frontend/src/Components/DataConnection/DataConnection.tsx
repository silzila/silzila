// List of Data connections created by the user is displayed here.
// Users can delete any connections
// Creating new and editing existing connections are handled in FormDialog child component

import React, { useEffect, useState } from "react";
import { VisibilitySharp, InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import FetchData from "../ServerCall/FetchData";
import { ConnectionItem } from "../../redux/DataSet/DatasetStateInterfaces";
import AddIcon from "@mui/icons-material/Add";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import Logger from "../../Logger";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { DataConnectionProps } from "./DataConnectionInterfaces";
import { setDataConnectionListToState } from "../../redux/DataSet/datasetActions";
import { resetAllStates } from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import "./DataSetup.css";

const DataConnection = (props: DataConnectionProps) => {
	const [dataConnectionList, setDataConnectionList] = useState<ConnectionItem[]>([]);
	const [mode] = useState<string>("New");
	const navigate = useNavigate();
	const [isHovered, setIsHovered] = useState(false);
	// Handle the Information of tooltip
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
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

	return (
		<div className="dataConnectionContainer">
			<div className="containersHead">
				<div className="containerTitle">
					<StorageOutlinedIcon style={{ marginRight: "10px", color: " #2bb9bb" }} />
					DB Connections
					<Tooltip title="Create connection to your database and save it for later." arrow placement="top">
					<InfoOutlined 
								style={{ 
									marginLeft: "5px", 
									cursor: "pointer", 
									marginTop: "4px",
									color: isHovered ? "grey" : "LightGrey", // Change color based on hover state
									fontSize: "1.2em", // Change font size based on hover state
									transition: "color 0.3s, font-size 0.3s" // Transition for smooth hover effect
								}}
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
							/>
					</Tooltip>
				</div>
				<div
					className="containerButton"
					onClick={(e: any) => {
						Logger("info", "add new connection");
						navigate("/newdataconnection", { state: { mode: mode } });
					}}
					title="Create New DB Connection"
				>
					<AddIcon />
				</div>
			</div>
			<div className="listContainer">
				{dataConnectionList.length > 0 ? (
					<>
						{dataConnectionList.map((dc: ConnectionItem) => {
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
														//external css wont work for this
														style={{
															// width: "1rem",
															height: "1rem",
															margin: "auto auto auto auto",
														}}
														onClick={() =>
															navigate("/newdataconnection", {
																state: {
																	id: dc.id,
																	value: dc.vendor,
																},
															})
														}
													/>
												</Tooltip>
											) : null}
										</div>
									)}
								/>
							);
						})}
					</>
				) : (
					<div className="listEmptyNote">
						*No db connections added yet, add db connection to create datasets*
					</div>
				)}
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

export default connect(mapStateToProps, mapDispatchToProps)(DataConnection);
