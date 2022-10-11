// List of Datasets created by the user is displayed here.
// Users can delete any dataset
// Creating new and editing existing dataset are handled in other child components

import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetState, setDatasetList, setDsId } from "../../redux/Dataset/datasetActions";
import FetchData from "../../ServerCall/FetchData";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";

const DataSetList = ({
	// state
	token,

	// dispatch
	setDataSetListToStore,
	resetState,
	setDsId,
}) => {
	var navigate = useNavigate();

	const [dataSetList, setDataSetList] = useState([]);

	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("");
	const [severity, setSeverity] = useState("success");

	useEffect(() => {
		resetState();
		getInformation();
	}, []);

	// Get the list of Datasets
	const getInformation = async () => {
		var result = await FetchData({
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
	const editDs = async (dsuid) => {
		setDsId(dsuid);
		setTimeout(() => {
			navigate("/editdataset");
		}, 1000);
	};

	// Deleting a dataset
	const deleteDs = async (dsUid) => {
		var result = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: "dataset/" + dsUid,
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
					onClick={(e) => {
						navigate("/newdataset");
					}}
				/>
			</div>

			<div className="connectionListContainer">
				{dataSetList &&
					dataSetList.map((dc) => {
						return (
							<SelectListItem
								key={dc.datasetName}
								render={(xprops) => (
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
													onClick={(e) => {
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

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		resetState: () => dispatch(resetState()),
		setDsId: (pl) => dispatch(setDsId(pl)),
		setDataSetListToStore: (dataSetList) => dispatch(setDatasetList(dataSetList)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataSetList);
