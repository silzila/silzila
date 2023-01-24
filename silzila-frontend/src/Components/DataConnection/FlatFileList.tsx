import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import FetchData from "../ServerCall/FetchData";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { connect } from "react-redux";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import {
	setApiResponse,
	setEditApiResponse,
	toggleEditMode,
} from "../../redux/FlatFile/FlatFileStateActions";
import { Dispatch } from "redux";

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
	const getColumnInfos = (data: any) => {
		const mappedColumnInfos = data.map((el: any) => {
			return {
				fieldName: el.fieldName,
				dataType: el.dataType,
				newFieldName: el.fieldName,
				newDataType: el.dataType,
				columnExcluded: false,
			};
		});
		return mappedColumnInfos;
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
					dateFormat: "yyyy-MM-dd",
					timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
					timestampNTZFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS]",
					columnInfos: getColumnInfos(result.data),
					sampleRecords: result2.data,
				};
				console.log(fileObj);
				props.setApiResponse(fileObj);
				props.setEditApiResponse(fileObj);
				navigate("/editflatfile");
			} else {
				console.log(result2);
			}
		} else {
			console.log(result);
		}
		props.setEditMode(true);
	};
	return (
		<div className="dataConnectionContainer">
			<div className="containersHead">
				<div className="containerTitle">
					<DescriptionOutlinedIcon style={{ marginRight: "10px", color: " #0076f6" }} />
					Flat File
				</div>

				<div
					title="Click to Add New Flatfile"
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
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setEditMode: (mode: boolean) => dispatch(toggleEditMode(mode)),
		setApiResponse: (file: any) => dispatch(setApiResponse(file)),
		setEditApiResponse: (file: any) => dispatch(setEditApiResponse(file)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(FlatFileList);
