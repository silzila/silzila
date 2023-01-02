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
import { FlatFileProp } from "../../redux/FlatFile/FlatFileInterfaces";
import { makeStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";

const useStyles: any = makeStyles(() =>
	createStyles({
		uploadButton: {
			textTransform: "none",
			color: "#303030",
			border: "2px solid rgba(224,224,224,1)",
			padding: "5px 20px",
			borderRadius: "0px",
		},
	})
);

const FlatFileUpload = ({ token, setApiResponse, setEditApiResponse }: FlatFileUploadProps) => {
	const navigate = useNavigate();
	const classes = useStyles();
	const [selectedFile, setSelectedFile] = useState<File>();

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

	const setDataToEditApiResponse = (data: any) => {
		var fileObj = {
			fileId: data.fileId,
			name: data.name,
			dateFormat: "yyyy/MM/dd",
			timestampFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
			timestampNTZFormat: "yyyy-MM-dd'T'HH:mm:ss[.SSS]",
			columnInfos: getColumnInfos(data.columnInfos),
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
			console.log("error");
		}
	};

	return (
		<div className="FileUploadContainer">
			<div className="uploadFileTitle">Upload File</div>
			<FileDropZone setSelectedFile={setSelectedFile} selectedFile={selectedFile} />
			<div className="file-upload-button-container">
				<Button className={classes.uploadButton} onClick={handleSubmit}>
					Upload
				</Button>
				<Button className={classes.uploadButton} onClick={() => navigate("/datahome")}>
					Cancel
				</Button>
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
