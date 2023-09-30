import { Button } from "@mui/material";
import { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dispatch } from "redux";
import { setApiResponse, setEditApiResponse } from "../../redux/FlatFile/FlatFileStateActions";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import FetchData from "../ServerCall/FetchData";
import "./FlatFile.css";
import FileDropZone from "./FileDropZone";
import { FlatFileUploadProps } from "./FlatFileInterfaces";
import Logger from "../../Logger";
import MenuBar from "../DataViewer/MenuBar";

const FlatFileUpload = ({ token, setApiResponse, setEditApiResponse }: FlatFileUploadProps) => {
	const navigate = useNavigate();

	const [selectedFile, setSelectedFile] = useState<File>();

	const setDataToEditApiResponse = (data: any) => {
		var fileObj = {
			fileId: data.fileId,
			name: data.name,
			dateFormat: data.dateFormat,
			timestampFormat: data.timestampFormat,
			columnInfos: data.columnInfos,
			sampleRecords: data.sampleRecords,
		};
		setEditApiResponse(fileObj);
	};

	const handleSubmit = async (event: any) => {
		if (!selectedFile) {
			window.alert("please select a file to upload");
			return;
		}

		event.preventDefault();
		const formData = new FormData();
		formData.append("file", selectedFile);

		var result: any = await FetchData({
			requestType: "withData",
			method: "POST",
			url: "file-upload/",
			data: formData,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data",
			},
		});

		if (result.status) {
			setApiResponse(result.data);
			setDataToEditApiResponse(result.data);
			navigate("/editflatfile");
		} else {
			Logger("info", "error");
		}
	};

	return (
		<div>
			<MenuBar from="fileUpload" />
			<div className="FileUploadContainer">
				<div className="uploadFileTitle">Upload .csv File</div>
				<FileDropZone setSelectedFile={setSelectedFile} selectedFile={selectedFile} />
				<div className="file-upload-button-container">
					<div></div>
					<Button
						style={{
							textTransform: "none",
							color: "#2bb9bb",
							border: "2px solid 	#2bb9bb",
							padding: "5px 20px",
							borderRadius: "5px",
						}}
						onClick={handleSubmit}
					>
						Upload
					</Button>
				</div>
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
		setApiResponse: (file: any) => dispatch(setApiResponse(file)),
		setEditApiResponse: (file: any) => dispatch(setEditApiResponse(file)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(FlatFileUpload);
