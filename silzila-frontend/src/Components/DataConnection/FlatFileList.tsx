import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import FetchData from "../ServerCall/FetchData";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { connect } from "react-redux";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { Button, Dialog, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import {
	setApiResponse,
	setEditApiResponse,
	toggleEditMode,
} from "../../redux/FlatFile/FlatFileStateActions";
import { Dispatch } from "redux";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { AlertColor } from "@mui/material/Alert";
import { CloseRounded } from "@mui/icons-material";

const FlatFileList = (props: any) => {
	const [fileList, setFileList] = useState<any>([]);
	const [severity, setSeverity] = useState<AlertColor>("success");
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("Testing alert");
	const [deleteItemId, setDeleteItemId] = useState<string>("");
	var navigate = useNavigate();
	useEffect(() => {
		getInformation();
		// eslint-disable-next-line
	}, []);

	// Get Info on DataConnection from server
	const getInformation = async () => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "file-data/",
			headers: { Authorization: `Bearer ${props.token}` },
		});

		if (result.status) {
			setFileList(result.data);
		} else {
		}
	};

	const deleteFlatFile = async () => {
		const fileId = deleteItemId;
		var result: any = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: `file-data/${fileId}`,
			headers: { Authorization: `Bearer ${props.token}` },
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
		}
	};

	const onEditFlatFile = async (file: any) => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `file-data-column-details/${file.id}`,
			headers: { Authorization: `Bearer ${props.token}` },
		});
		if (result.status) {
			var result2: any = await FetchData({
				requestType: "noData",
				method: "GET",
				url: `file-data-sample-records/${file.id}`,
				headers: {
					Authorization: `Bearer ${props.token}`,
				},
			});
			if (result2.status) {
				var fileObj = {
					fileId: file.id,
					name: file.name,
					dateFormat: file.dateFormat,
					timestampFormat: file.timestampFormat,
					columnInfos: result.data,
					sampleRecords: result2.data,
				};
				props.setApiResponse(fileObj);
				props.setEditApiResponse(fileObj);
				navigate("/editflatfile");
			} else {
			}
		} else {
		}
		props.setEditMode(true);
	};
	return (
		<div className="dataConnectionContainer">
			<div className="containersHead">
				<div className="containerTitle">
					<DescriptionOutlinedIcon style={{ marginRight: "10px", color: " #2bb9bb" }} />
					Flat Files
				</div>

				<div
					title="Add New Flatfile"
					className="containerButton"
					onClick={() => {
						navigate("/flatfileupload");
					}}
				>
					<AddIcon />
				</div>
			</div>
			<div className="listContainer">
				{fileList &&
					fileList.map((fi: any) => {
						return (
							<SelectListItem
								key={fi.name}
								render={(xprops: any) => (
									<div
										key={fi.name}
										className={
											xprops.open
												? "dataConnectionListSelected"
												: "dataConnectionList"
										}
										onClick={() => onEditFlatFile(fi)}
										onMouseOver={() => xprops.setOpen(true)}
										onMouseLeave={() => xprops.setOpen(false)}
									>
										<div className="dataConnectionName">{fi.name}</div>
										{xprops.open ? (
											<Tooltip
												title="Delete Flatfile"
												arrow
												placement="right-start"
											>
												<div
													className="dataHomeDeleteIcon"
													onClick={e => {
														e.stopPropagation();
														setDeleteItemId(fi.id);
														setConfirmDialog(true);

														// var yes = window.confirm(
														// 	"Are you sure you want to Delete this File?"
														// );
														// if (yes) {
														// 	deleteFlatFile(fi.id);
														// }
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
								Are You Sure You Want To Delete This FlatFile?
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
							onClick={() => deleteFlatFile()}
						>
							Delete
						</Button>
					</div>
				</div>
			</Dialog>
			<NotificationDialog
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
				severity={severity}
				testMessage={testMessage}
				openAlert={openAlert}
			/>
		</div>
	);
};
const mapStateToProps = (state: isLoggedProps, ownProps: any) => {
	return {
		token: state.isLogged.accessToken,
	};
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setEditMode: (mode: boolean) => dispatch(toggleEditMode(mode)),
		setApiResponse: (file: any) => dispatch(setApiResponse(file)),
		setEditApiResponse: (file: any) => dispatch(setEditApiResponse(file)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(FlatFileList);
