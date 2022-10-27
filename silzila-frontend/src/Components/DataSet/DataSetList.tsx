// List of Datasets created by the user is displayed here.
// Users can delete any dataset
// Creating new and editing existing dataset are handled in other child components

import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dispatch } from "redux";
import { resetState, setDatasetList, setDsId } from "../../redux/DataSet/datasetActions";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { DatasetItem, DatasetProps } from "./DatasetListInterfaces";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import FetchData from "../ServerCall/FetchData";

const DataSetList = ({
	// state
	accessToken,

	// dispatch
	setDataSetListToStore,
	resetState,
	setDsId,
}: DatasetProps) => {
	var navigate = useNavigate();

	var token: string = accessToken;

	const [dataSetList, setDataSetList] = useState<DatasetItem[]>([]);

	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("");
	const [severity, setSeverity] = useState<string>("success");

	useEffect(() => {
		resetState();
		getInformation();
	}, []);

	// Get the list of Datasets
	const getInformation = async () => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "dataset",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (result.status) {
			setDataSetList(result.data);
			setDataSetListToStore(result.data);
		} else {
			// console.log(result.data.detail);
		}
	};

	// Selected dataset for editing
	const editDs = async (dsId: string) => {
		setDsId(dsId);
		setTimeout(() => {
			navigate("/editdataset");
		}, 1000);
	};

	// Deleting a dataset
	const deleteDs = async (dsId: string) => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: "dataset/" + dsId,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			setSeverity("success");
			setOpenAlert(true);
			setTestMessage("Deleted Successfully!");
			getInformation();
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 2000);
		} else {
			// console.log(result.data.detail);
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(result.data.detail);
			getInformation();
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 3000);
		}
	};

	return (
		<div className="dataSetContainer">
			<div className="containersHead">
				<div className="containerTitle">Datasets</div>

				<input
					className="containerButton"
					type="button"
					value="New"
					onClick={() => {
						navigate("/newdataset");
					}}
				/>
			</div>

			<div className="connectionListContainer">
				{dataSetList &&
					dataSetList.map((dc: DatasetItem) => {
						return (
							<SelectListItem
								key={dc.datasetName}
								render={(xprops: any) => (
									<div
										className={
											xprops.open
												? "dataConnectionListSelected"
												: "dataConnectionList"
										}
										onClick={() => editDs(dc.id)}
										onMouseOver={() => xprops.setOpen(true)}
										onMouseLeave={() => xprops.setOpen(false)}
									>
										<div className="dataConnectionName">{dc.datasetName}</div>

										{xprops.open ? (
											<Tooltip
												title="Delete Dataset"
												arrow
												placement="right-start"
											>
												<div
													className="dataHomeDeleteIcon"
													onClick={e => {
														e.stopPropagation();

														var yes = window.confirm(
															"Are you sure you want to Delete this Dataset?"
														);
														if (yes) {
															deleteDs(dc.id);
														}
													}}
												>
													<DeleteIcon
														style={{
															width: "1rem",
															height: "1rem",
															margin: "auto",
														}}
													/>
												</div>
											</Tooltip>
										) : null}
									</div>
								)}
							/>
						);
					})}
			</div>
			{/* Alert to display success / failure info */}
			<NotificationDialog
				openAlert={openAlert}
				severity={severity}
				testMessage={testMessage}
			/>
		</div>
	);
};

const mapStateToProps = (state: isLoggedProps) => {
	return {
		accessToken: state.isLogged.accessToken,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		resetState: () => dispatch(resetState()),
		setDsId: (id: string) => dispatch(setDsId(id)),
		setDataSetListToStore: (dataSetList: DatasetItem[]) =>
			dispatch(setDatasetList(dataSetList)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataSetList);
