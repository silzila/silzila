// List of Data connections created by the user is displayed here.
// Users can delete any connections
// Creating new and editing existing connections are handled in FormDialog child component

import React, { useEffect, useState } from "react";
import { VisibilitySharp } from "@mui/icons-material";
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

const DataConnection = (props: DataConnectionProps) => {
	const [dataConnectionList, setDataConnectionList] = useState<ConnectionItem[]>([]);
	const [mode, setMode] = useState<string>("New");
    const navigate = useNavigate();

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
				</div>
				<div
					className="containerButton"
					onClick={(e: any) => {
						Logger("info", "add new connection");
						navigate("/newdataconnection", {state: { mode: mode}});
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
													onClick={() => 
														navigate("/newdataconnection", {state: { id: dc.id, value: dc.vendor}})}
												/>
											</Tooltip>
										) : null}
									</div>
								)}
							/>
						);
					})}
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
