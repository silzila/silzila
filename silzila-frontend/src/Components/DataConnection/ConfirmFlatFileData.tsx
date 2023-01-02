import {
	Button,
	FormLabel,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
	MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dispatch } from "redux";
import { FlatFileStateProps } from "../../redux/FlatFile/FlatFileInterfaces";
import { resetFlatFileState } from "../../redux/FlatFile/FlatFileStateActions";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import FetchData from "../ServerCall/FetchData";
import { ConfirmFlatFileProps } from "./FlatFileInterfaces";
import { makeStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import "./FlatFile.css";
const FormLabelStyle = {
	fontSize: "14px",
	margin: "5px",
	width: "50%",
	textAlign: "right",
};
const TextFieldStyle = {
	style: {
		height: "25px",
		padding: "0px 10px",
		fontSize: "12px",
	},
};

const useStyles: any = makeStyles(() =>
	createStyles({
		uploadButton: {
			textTransform: "none",
			color: "#303030",
			border: "2px solid rgba(224,224,224,1)",
			padding: "5px 20px",
			borderRadius: "0px",
		},
		tableHeader: {
			"& .MuiTableCell-root": {
				fontWeight: "bold",
				padding: "8px",
				borderRight: "1px solid rgba(224,224,224,1)",
				borderTop: "1px solid rgba(224,224,224,1)",
				textAlign: "center",
				color: "#4a4a4a",
			},
			"& .MuiTableRow-root": {
				borderLeft: "1px solid rgba(224,224,224,1)",
			},
		},
		tableBody: {
			"& .MuiTableCell-root": {
				fontSize: "12px",
				padding: "6px 10px 6px 20px ",
				whiteSpace: "nowrap",
				maxWidth: "250px",
				minWidth: "75px",
				textOverflow: "ellipsis",
				overflow: "hidden",
				backgroundColor: "white",
				borderRight: "1px solid rgba(224,224,224,1)",
			},
		},
	})
);

const ConfirmFlatFileData = ({
	token,
	modifiedResponse,

	resetFlatFileState,
}: ConfirmFlatFileProps) => {
	const classes = useStyles();
	const navigate = useNavigate();
	console.log(modifiedResponse.sampleRecordes[0]);
	const columnHeaders: any[] = Object.keys(modifiedResponse.sampleRecordes[0]);
	const [selectedButton, setselectedButton] = useState<string>("Select Option");

	const handleOnConfirm = async () => {
		var formObj = {
			fileId: modifiedResponse.fileId,
			name: modifiedResponse.name,
			dateFormat: modifiedResponse.dateFormat,
			timestampFormat: modifiedResponse.timestampFormat,
			timestampNTZFormat: modifiedResponse.timestampNTZFormat,
			revisedColumnInfos: modifiedResponse.revisedColumnInfos,
		};

		var result: any = await FetchData({
			requestType: "withData",
			method: "POST",
			url: "file-upload-save-data/",
			data: formObj,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (result.status) {
			window.alert("flat file saved successfully");
			console.log("success");
		} else {
			console.log("error");
		}
	};

	return (
		<React.Fragment>
			<div className="editFlatFileContainer">
				<div className="editFlatFileHeader">
					<span className="flat-file-name">
						{modifiedResponse ? (
							<TextField
								// style={{ padding: "5px 10px", width: "60%" }}
								inputProps={{
									style: {
										height: "fit-content",
										width: "60%",
									},
								}}
								// onChange={e => {
								// 	e.preventDefault();
								// 	setEditApiResponse("name", e.target.value);
								// }}
								// onBlur={() => {
								// 	if (modifiedResponse.name) {
								// 		setEditFileName(false);
								// 	} else {
								// 		window.alert("file name cant be empty");
								// 		setEditFileName(true);
								// 	}
								// }}
								value={modifiedResponse.name}
							/>
						) : (
							<p
								className="tableName-style"
								title="Click to Edit"
								// onClick={() => setEditFileName(true)}
							>
								{modifiedResponse.name}
							</p>
						)}
					</span>
					{/* <div className="format-elm-container">
						<div className="formatElm">
							<FormLabel sx={{ ...FormLabelStyle }}>Date Format:</FormLabel>
							<TextField
								inputProps={TextFieldStyle}
								value={modifiedResponse.dateFormat}
								disabled
							/>
						</div>
						<div className="formatElm">
							<FormLabel sx={{ ...FormLabelStyle }}>Timestamp Format:</FormLabel>
							<TextField
								inputProps={TextFieldStyle}
								disabled
								value={modifiedResponse.timestampFormat}
							/>
						</div>
						<div className="formatElm">
							<FormLabel sx={{ ...FormLabelStyle }}>Timestamp NTZ Format:</FormLabel>
							<TextField
								inputProps={TextFieldStyle}
								disabled
								value={modifiedResponse.timestampNTZFormat}
							/>
						</div>
					</div> */}
				</div>
				<div
					style={{
						flex: 1,
						minHeight: "450px",
						maxHeight: "480px",
						maxWidth: "90%",
						margin: "1rem auto 1rem auto",
					}}
				>
					<Table
						style={{
							width: "auto",
						}}
						sx={{
							borderLeft: "1px solid rgba(224,224,224,1)",
						}}
						stickyHeader={true}
					>
						<TableHead className={classes.tableHeader}>
							<TableRow>
								{columnHeaders.map((ch: string) => {
									return (
										<TableCell>
											<p>dataType</p>

											{ch}
										</TableCell>
									);
								})}
							</TableRow>
						</TableHead>
						<TableBody className={classes.tableBody}>
							{modifiedResponse.sampleRecordes.map((mr: any) => {
								return (
									<TableRow>
										{columnHeaders.map((ch: string) => {
											return <TableCell>{mr[ch]}</TableCell>;
										})}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
				<div
					style={{
						padding: "1rem",
					}}
					className="buttonContainer"
				>
					<Select value={selectedButton}>
						<MenuItem
							value="save"
							onClick={(e: any) => {
								setselectedButton(e.target.value);
								handleOnConfirm();
							}}
						>
							Save
						</MenuItem>
						<MenuItem
							value="resetChanges"
							onClick={(e: any) => {
								setselectedButton(e.target.value);
								navigate("/editflatfile");
							}}
						>
							Reset Changes
						</MenuItem>
						<MenuItem
							value="reupload"
							onClick={(e: any) => {
								setselectedButton(e.target.value);
								resetFlatFileState();
								navigate("/flatfileupload");
							}}
						>
							ReUpload
						</MenuItem>
						<MenuItem
							value="cancel"
							onClick={(e: any) => {
								setselectedButton(e.target.value);
								resetFlatFileState();
								navigate("/datahome");
							}}
						>
							Cancel
						</MenuItem>
					</Select>
					{/* <Button className={classes.uploadButton} onClick={handleOnConfirm}>
						Confirm
					</Button>
					<Button
						className={classes.uploadButton}
						onClick={() => {
							navigate("/editflatfile");
						}}
					>
						Discard
					</Button>
					<Button
						className={classes.uploadButton}
						onClick={() => {
							resetFlatFileState();
							navigate("/flatfileupload");
						}}
					>
						cancel
					</Button> */}
				</div>
			</div>
		</React.Fragment>
	);
};

const mapStateToProps = (state: isLoggedProps & FlatFileStateProps, ownProps: any) => {
	return {
		token: state.isLogged.accessToken,
		modifiedResponse: state.flatFileState.confirmModifiedResponse,
	};
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		resetFlatFileState: () => dispatch(resetFlatFileState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmFlatFileData);
