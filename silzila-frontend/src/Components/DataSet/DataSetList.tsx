// List of Datasets created by the user is displayed here.
// Users can delete any dataset
// Creating new and editing existing dataset are handled in other child components

import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Dialog, MenuItem, Popover, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dispatch } from "redux";
import {
	resetState,
	setCreateDsFromFlatFile,
	setDatasetList,
	setDsId,
	setUserTable,
} from "../../redux/DataSet/datasetActions";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { DatasetListProps } from "./DatasetListInterfaces";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import FetchData from "../ServerCall/FetchData";
import { DatasetItem, UserTableProps } from "../../redux/DataSet/DatasetStateInterfaces";
import DataConnectionListPopover from "../CommonFunctions/PopOverComponents/DataConnectionListPopover";
import AddIcon from "@mui/icons-material/Add";
import SchemaOutlinedIcon from "@mui/icons-material/SchemaOutlined";

import ShortUniqueId from "short-unique-id";
import { AlertColor } from "@mui/material/Alert";
import { SaveButtons } from "../DataConnection/muiStyles";
import CloseRounded from "@mui/icons-material/CloseRounded";

const DataSetList = ({
	// state
	accessToken,
	tempTable,

	// dispatch
	setDataSetListToStore,
	resetState,
	setDsId,
	setCreateDsFromFlatFile,
	setUserTable,
}: DatasetListProps) => {
	const classes = SaveButtons();
	var navigate = useNavigate();

	var token: string = accessToken;

	const [dataSetList, setDataSetList] = useState<DatasetItem[]>([]);
	const [selectedButton, setSelectedButton] = useState<string>("flatFile");

	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("");
	const [severity, setSeverity] = useState<AlertColor>("success");
	const [showOpnMenu, setShowOpnMenu] = useState<boolean>(false);

	const [openPopOver, setOpenPopOver] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<any>();
	const uid: any = new ShortUniqueId({ length: 8 });
	const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
	const [deleteItemId, setDeleteItemId] = useState<string>("");

	useEffect(() => {
		resetState();
		getInformation();
	}, []);

	// Get the list of Datasets
	const getInformation = async () => {
		// TODO:need to specify type
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
	const deleteDs = async () => {
		setConfirmDialog(false);
		const dsId: string = deleteItemId;
		// TODO: need to specify type
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
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(result.data.detail);
			getInformation();
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// 	setTestMessage("");
			// }, 3000);
		}
	};

	const setFlatFilesListAsTables = async () => {
		var res: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "file-data/",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status) {
			const userTable: UserTableProps[] = res.data.map((el: any) => {
				return {
					schema: "",
					database: "",
					tableName: el.name,
					isSelected: false,
					table_uid: el.id,
					id: uid(),
					isNewTable: true,
				};
			});
			setUserTable(userTable);
		} else {
		}
	};

	return (
		<div className="dataConnectionContainer">
			<div className="containersHead">
				<div className="containerTitle">
					<SchemaOutlinedIcon style={{ marginRight: "10px", color: " #2bb9bb" }} />
					Datasets
				</div>
				<div
					className="containerButton"
					onClick={() => {
						setShowOpnMenu(true);
					}}
				>
					<AddIcon
						onClick={e => {
							setAnchorEl(e.currentTarget);
							setOpen(true);
						}}
					/>
				</div>
			</div>
			<div className="listContainer">
				{dataSetList &&
					dataSetList.map((dc: DatasetItem) => {
						return (
							<SelectListItem
								key={dc.datasetName}
								//  TODO : need to specify type
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
														setConfirmDialog(true);
														setDeleteItemId(dc.id);
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
			<NotificationDialog
				openAlert={openAlert}
				severity={severity}
				testMessage={testMessage}
			/>
			<DataConnectionListPopover
				showCard={openPopOver}
				setShowCard={setOpenPopOver}
				popOverTitle="Select a DataConnection to use with Dataset"
			/>
			<Popover
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				onClose={() => setOpen(false)}
			>
				<Button
					sx={{
						textTransform: "none",
						color: "grey",
						display: "block",
					}}
					value="dbConnections"
					onClick={() => {
						setOpenPopOver(true);
						setOpen(false);
					}}
				>
					DB Connections
				</Button>
				<Button
					sx={{
						textTransform: "none",
						color: "grey",
						display: "block",
					}}
					value="flatFile"
					onClick={() => {
						setSelectedButton("flatFile");
						setCreateDsFromFlatFile(true);
						setFlatFilesListAsTables();
						navigate("/newdataset");
						setOpen(false);
					}}
				>
					Flat Files
				</Button>
			</Popover>
			<Dialog open={confirmDialog}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						padding: "8px",
						width: "400px",
						height: "auto",
						justifyContent: "center",
					}}
				>
					<div style={{ fontWeight: "bold", textAlign: "center" }}>
						<div style={{ display: "flex" }}>
							<span style={{ flex: 1 }}>
								Are You Sure You Want To Delete This Dataset?
							</span>

							<CloseRounded
								style={{ margin: "0.25rem", fontSize: "16px" }}
								onClick={() => {
									setConfirmDialog(false);
								}}
							/>
						</div>
					</div>
					<div
						style={{ padding: "15px", justifyContent: "space-around", display: "flex" }}
					>
						<Button
							style={{ backgroundColor: "#2bb9bb" }}
							variant="contained"
							onClick={() => {
								setConfirmDialog(false);
							}}
						>
							Cancel
						</Button>
						<Button
							style={{ backgroundColor: "red", float: "right" }}
							variant="contained"
							onClick={() => deleteDs()}
						>
							Delete
						</Button>
					</div>
				</div>
			</Dialog>
		</div>
	);
};

const mapStateToProps = (state: any) => {
	return {
		accessToken: state.isLogged.accessToken,
		tempTable: state.dataSetState.tempTable,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		resetState: () => dispatch(resetState()),
		setDsId: (id: string) => dispatch(setDsId(id)),
		setDataSetListToStore: (dataSetList: DatasetItem[]) =>
			dispatch(setDatasetList(dataSetList)),
		setCreateDsFromFlatFile: (value: boolean) => dispatch(setCreateDsFromFlatFile(value)),
		setUserTable: (userTable: any) => dispatch(setUserTable(userTable)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataSetList);
