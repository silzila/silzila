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
	TableContainer,
	Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dispatch } from "redux";
import { FlatFileStateProps } from "../../redux/FlatFile/FlatFileInterfaces";
import {
	resetFlatFileState,
	setEditApiResponseProp,
} from "../../redux/FlatFile/FlatFileStateActions";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import FetchData from "../ServerCall/FetchData";
import { ConfirmFlatFileProps } from "./FlatFileInterfaces";
import { makeStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import "./FlatFile.css";
import { styles, TextFieldBorderStyle } from "./EditFlatFileData";
import MenuBar from "../DataViewer/MenuBar";
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

export const SaveButtons = makeStyles({
	root: {
		width: 200,

		"& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
			borderColor: "#0076f6",
		},

		"&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
			borderColor: "#0076f6",
		},

		"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: "#0076f6",
		},
		// "& .MuiOutlinedInput-input": {
		// 	color: "green",
		// 	marginRigth: "10px",
		// },
		"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select":
			{
				padding: "2px 4px ",
				marginRight: "10px",
			},
		"& .MuiOutlinedInput-root": {
			fontSize: "14px",
			padding: "2px 5px",
			textAlign: "center",
			height: "40px",
			marginRight: "10px",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			color: "#0076f6",
		},
	},
});

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
				textAlign: "left",
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
	editApiResponse,
	editMode,

	resetFlatFileState,
	setEditApiResponse,
}: ConfirmFlatFileProps) => {
	const classes = useStyles();
	const classes2 = styles();
	const classes3 = SaveButtons();
	const navigate = useNavigate();
	const columnHeaders: any[] = Object.keys(modifiedResponse.sampleRecordes[0]);
	const [selectedButton, setselectedButton] = useState<string>("save");

	const handleOnConfirm = async () => {
		var url: string = "";
		if (editMode) {
			url = `file-data-change-schema-save/`;
		} else {
			url = `file-upload-save-data/`;
		}
		var formObj = {
			fileId: modifiedResponse.fileId,
			name: modifiedResponse.name,
			dateFormat: modifiedResponse.dateFormat,
			timestampFormat: modifiedResponse.timestampFormat,
			timestampNTZFormat: modifiedResponse.timestampNTZFormat,
			revisedColumnInfos: modifiedResponse.revisedColumnInfos,
		};

		var formObjForUpdate = {
			fileId: modifiedResponse.fileId,
			name: modifiedResponse.name,
			revisedColumnInfos: modifiedResponse.revisedColumnInfos,
		};
		console.log(formObjForUpdate);

		var result: any = await FetchData({
			requestType: "withData",
			method: "POST",
			url: url,
			data: editMode ? formObjForUpdate : formObj,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (result.status) {
			window.alert("flat file saved successfully");
			console.log("success");
			navigate("/datahome");
			resetFlatFileState();
		} else {
			// console.log(result.data.message);
			if (result.data.message === "Job aborted.") {
				window.alert(
					"Upload failed: Please make sure all the dataTypes(like date,timestamp) are correct"
				);
			}
		}
	};

	return (
		<div style={{ height: "100vh" }}>
			<MenuBar from="saveFlaFile" />
			<div className="editFlatFileContainer">
				<div className="editFlatFileHeader">
					<div
						style={{
							width: "50%",
							textAlign: "left",
						}}
					>
						<Tooltip title="Click to Edit">
							<TextField
								InputProps={TextFieldBorderStyle}
								inputProps={{
									style: {
										height: "40px",
										padding: "0px 10px",
										fontSize: "20px",
										fontWeight: "bold",
										color: "#3B3C36",
									},
								}}
								onChange={e => {
									e.preventDefault();
									setEditApiResponse("name", e.target.value);
								}}
								onBlur={() => {
									if (!modifiedResponse.name) {
										window.alert("file name cant be empty");
									}
								}}
								value={modifiedResponse.name}
							/>
						</Tooltip>
					</div>
				</div>
				<div
					style={{
						flex: 1,
						maxHeight: "480px",
						maxWidth: "90%",
						margin: "1rem 2rem",
					}}
				>
					<TableContainer
						style={{
							// height: "100%",
							// width: "100%",
							// overflow: "auto",
							height: "400px",
							width: "fit-content",
							maxWidth: "100%",
							// maxWidth: "100%",
							// minWidth: "200px",
							overflow: "auto",
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
									{editApiResponse.columnInfos.map((ch: any) => {
										return (
											<TableCell>
												<div
													style={{
														fontSize: "12px",
														textAlign: "left",
														fontWeight: "400",
													}}
												>
													{ch.newDataType}
												</div>

												{ch.newFieldName}
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
					</TableContainer>
				</div>
				<div
					style={{
						padding: "1rem",
					}}
					className="buttonContainer"
				>
					<TextField
						SelectProps={{
							MenuProps: {
								anchorOrigin: {
									vertical: "top",
									horizontal: "left",
								},
							},
						}}
						className={classes3.root}
						value={selectedButton}
						variant="outlined"
						select
					>
						<MenuItem
							value="save"
							onClick={() => {
								setselectedButton("save");
								handleOnConfirm();
							}}
						>
							{editMode ? "Update" : "Save"}
						</MenuItem>
						<MenuItem
							value="resetChanges"
							onClick={() => {
								setselectedButton("resetChanges");
								navigate("/editflatfile");
							}}
						>
							Reset Changes
						</MenuItem>
						{editMode ? null : (
							<MenuItem
								value="reupload"
								onClick={() => {
									setselectedButton("reupload");
									resetFlatFileState();
									navigate("/flatfileupload");
								}}
							>
								Reupload
							</MenuItem>
						)}
					</TextField>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state: isLoggedProps & FlatFileStateProps, ownProps: any) => {
	return {
		token: state.isLogged.accessToken,
		modifiedResponse: state.flatFileState.confirmModifiedResponse,
		editApiResponse: state.flatFileState.editApiResponse,
		editMode: state.flatFileState.editMode,
	};
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		resetFlatFileState: () => dispatch(resetFlatFileState()),
		setEditApiResponse: (key: string, file: any) => dispatch(setEditApiResponseProp(key, file)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmFlatFileData);
