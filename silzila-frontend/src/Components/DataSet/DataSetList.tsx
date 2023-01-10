// List of Datasets created by the user is displayed here.
// Users can delete any dataset
// Creating new and editing existing dataset are handled in other child components

import DeleteIcon from "@mui/icons-material/Delete";
import { Button, MenuItem, Popover, TextField, Tooltip } from "@mui/material";
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
import { SaveButtons } from "../DataConnection/ConfirmFlatFileData";
import ShortUniqueId from "short-unique-id";

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
	const [severity, setSeverity] = useState<string>("success");
	const [showOpnMenu, setShowOpnMenu] = useState<boolean>(false);

	const [openPopOver, setOpenPopOver] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<any>();

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
			// //console.log(result.data.detail);
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
			// //console.log(result.data.detail);
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

	const setFlatFilesListAsTables = async () => {
		var res: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "file-data/",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.status) {
			const uid: any = new ShortUniqueId({ length: 8 });

			const userTable: UserTableProps[] = res.data.map((el: any) => {
				var id = "";
				var bool = false;

				var tableAlreadyChecked: any = tempTable.filter(
					(tbl: any) => tbl.table_uid === el.id
				)[0];

				tempTable.forEach((tbl: any) => {
					if (tbl.table_uid === el.id) {
						id = tbl.id;
						bool = tbl.isNewTable;
					}
				});

				if (tableAlreadyChecked) {
					return {
						schema: "",
						database: "",
						tableName: el.name,
						isSelected: true,
						table_uid: el.id,
						id: id,
						isNewTable: bool,
					};
				}

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
			console.log(userTable);
			setUserTable(userTable);
		} else {
		}
	};

	return (
		<div className="dataSetContainer">
			<div
				style={{
					// paddingBottom: "1rem",
					fontWeight: "600",
					display: "flex",
					flexDirection: "column",
					// paddingLeft: "10px",
					// paddingRight: "10px",
					overflow: "hidden",
				}}
			>
				<div className="containersHead" style={{ flex: 1 }}>
					<div className="containerTitle">
						<SchemaOutlinedIcon style={{ marginRight: "10px", color: " #555555" }} />
						Datasets
					</div>
					<div
						title="Click to Add New Dataset"
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
			</div>

			<div className="connectionListContainer">
				{dataSetList &&
					dataSetList.map((dc: DatasetItem) => {
						return (
							<SelectListItem
								key={dc.datasetName}
								// TODO : need to specify type
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
			</Popover>
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
