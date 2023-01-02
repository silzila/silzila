import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import FetchData from "../ServerCall/FetchData";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { connect } from "react-redux";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const FlatFileList = (props: any) => {
	const [fileList, setFileList] = useState<any>([]);
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
			console.log(result.data);
			setFileList(result.data);
		} else {
		}
	};

	const deleteFlatFile = async (fileId: string) => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: `file-data/${fileId}`,
			headers: { Authorization: `Bearer ${props.token}` },
		});
		if (result.status) {
			console.log(result);
			// setSeverity("success");
			// setOpenAlert(true);
			// setTestMessage("Deleted Successfully!");
			// getInformation();
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// 	setTestMessage("");
			// }, 2000);
		} else {
			//console.log(result.detail);
		}
	};
	return (
		<div className="dataConnectionContainer">
			<div className="containersHead">
				<div className="containerTitle">Flat File</div>

				<div
					className="containerButton"
					onClick={() => {
						navigate("/flatfileupload");
					}}
				>
					<AddIcon />
				</div>
			</div>
			<div className="connectionListContainer">
				{fileList &&
					fileList.map((fi: any) => {
						return (
							<SelectListItem
								render={(xprops: any) => (
									<div
										className={
											xprops.open
												? "dataConnectionListSelected"
												: "dataConnectionList"
										}
										onMouseOver={() => xprops.setOpen(true)}
										onMouseLeave={() => xprops.setOpen(false)}
									>
										<div className="dataConnectionName">{fi.name}</div>
										{xprops.open ? (
											<Tooltip
												title="Delete playbook"
												arrow
												placement="right-start"
											>
												<div
													className="dataHomeDeleteIcon"
													onClick={e => {
														e.stopPropagation();

														var yes = window.confirm(
															"Are you sure you want to Delete this File?"
														);
														if (yes) {
															deleteFlatFile(fi.id);
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
		</div>
	);
};
const mapStateToProps = (state: isLoggedProps, ownProps: any) => {
	return {
		token: state.isLogged.accessToken,
	};
};
export default connect(mapStateToProps, null)(FlatFileList);
