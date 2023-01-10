import {
	Button,
	FormLabel,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Tooltip,
	Typography,
	TableContainer,
} from "@mui/material";
import { useState } from "react";
import AbcIcon from "@mui/icons-material/Abc";
import NumbersIcon from "@mui/icons-material/Numbers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { connect } from "react-redux";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import {
	setEditApiResponseProp,
	setModifiedApiResponse,
} from "../../redux/FlatFile/FlatFileStateActions";
import { Dispatch } from "redux";
import FetchData from "../ServerCall/FetchData";
import { useNavigate } from "react-router-dom";
import { resetFlatFileState } from "../../redux/FlatFile/FlatFileStateActions";
import { FlatFileStateProps } from "../../redux/FlatFile/FlatFileInterfaces";
import { EditFlatFileProps } from "./FlatFileInterfaces";
import { makeStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import { SaveButtons } from "./ConfirmFlatFileData";
import MenuBar from "../DataViewer/MenuBar";

const FormLabelStyle = {
	fontSize: "14px",
	margin: "5px",
	width: "50%",
	textAlign: "right",
};
const TextFieldStyle = {
	style: {
		width: "300px",
		height: "25px",
		padding: "0px 10px",
		fontSize: "12px",
	},
};
export const TextFieldBorderStyle = {
	sx: {
		".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
			border: "2px solid transparent",
		},
		"&:hover": {
			".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
				border: "2px solid rgba(224,224,224,1)",
			},
		},
		"&:not(:hover)": {
			".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
				border: "2px solid transparent",
			},
		},
	},
};

export const styles = makeStyles({
	root: {
		width: 120,

		"& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
			borderColor: "transparent",
		},

		"&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
			borderColor: "rgba(224,224,224,1)",
		},

		"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: "rgba(224,224,224,1)",
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
			height: "20px",
			fontSize: "12px",
			padding: "2px 5px",
			textAlign: "left",
			marginRight: "10px",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
		"& .MuiMenuItem-root": {
			padding: "4px",
			display: "flex",
			height: "20px",
			width: "100px",
		},
	},
});
const useStyles: any = makeStyles((theme: any) =>
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
			},
			"& .MuiTableRow-root": {
				borderLeft: "1px solid rgba(224,224,224,1)",
			},
		},
		tableBody: {
			"& .MuiTableCell-root": {
				fontSize: "12px",
				padding: "6px 10px 6px 20px ",
				maxWidth: "250px",
				minWidth: "75px",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
				overflow: "hidden",
				backgroundColor: "white",
				borderRight: "1px solid rgba(224,224,224,1)",
			},
		},
		visiblityIconStyle: {
			color: "grey",
			fontSize: "18px",
			marginLeft: "20px",
		},
	})
);

const EditFlatFileData = ({
	token,
	editApiResponse,
	editMode,

	setEditApiResponse,
	setModifiedApiResponse,
	resetFlatFileState,
}: EditFlatFileProps) => {
	const classes = useStyles();
	const classes2 = styles();
	const classes3 = SaveButtons();

	const navigate = useNavigate();
	const [editColumnName, setEditColumnName] = useState<boolean>(false);
	const [selectedColumnToEdit, setSelectedColumnToEdit] = useState<string>("");
	const [editFileName, setEditFileName] = useState<boolean>(false);
	const [selectedButton, setselectedButton] = useState<string>("preview");

	let temp: any[] = [];
	const getRevisedColumnInfos = (data: any) => {
		console.log(data);
		const temp1 = data.filter((el: any) => el.columnExcluded === false);
		temp = temp1.map((col: any) => {
			if (col.fieldName === col.newFieldName) {
				if (col.dataType === col.newDataType) {
					col = {
						fieldName: col.fieldName,
						dataType: col.dataType,
					};
				} else {
					col = {
						fieldName: col.fieldName,
						dataType: col.dataType,
						newDataType: col.newDataType,
					};
				}
			} else {
				if (col.dataType === col.newDataType) {
					col = {
						fieldName: col.fieldName,
						newFieldName: col.newFieldName,
						dataType: col.dataType,
					};
				} else {
					col = {
						fieldName: col.fieldName,
						newFieldName: col.newFieldName,
						dataType: col.dataType,
						newDataType: col.newDataType,
					};
				}
			}
			return col;
		});
		return temp;
	};

	const handleSave = async () => {
		var url: string = "";
		if (editMode) {
			url = `file-data-change-schema/`;
		} else {
			url = `file-upload-change-schema/`;
		}
		const finalForm = {
			fileId: editApiResponse.fileId,
			name: editApiResponse.name,
			dateFormat: editApiResponse.dateFormat,
			timestampFormat: editApiResponse.timestampFormat,
			timestampNTZFormat: editApiResponse.timestampNTZFormat,
			revisedColumnInfos: getRevisedColumnInfos(editApiResponse.columnInfos),
		};
		// console.log(finalForm);
		var result: any = await FetchData({
			requestType: "withData",
			method: "POST",
			url: url,
			data: finalForm,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (result.status) {
			setModifiedApiResponse({ ...finalForm, sampleRecordes: result.data });
			navigate("/confirmflatfile");
		} else {
			console.log("error");
		}
	};

	const dataTypes = [
		{ id: 1, value: "text", icon: <AbcIcon /> },
		{ id: 1, value: "integer", icon: <NumbersIcon /> },
		{ id: 1, value: "decimal", icon: "icon" },
		{ id: 1, value: "boolean", icon: "icon" },
		{ id: 1, value: "date", icon: <CalendarMonthIcon /> },
		{ id: 1, value: "timestamp", icon: "icon" },
	];

	return (
		<div style={{ height: "100vh" }}>
			<MenuBar from="editFlatFile" />
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
									if (editApiResponse.name) {
										setEditFileName(false);
									} else {
										window.alert("file name cant be empty");
										setEditFileName(true);
									}
								}}
								value={editApiResponse.name}
							/>
						</Tooltip>
					</div>

					<div className="format-elm-container">
						<div className="formatElm">
							<FormLabel sx={{ ...FormLabelStyle }}>Date Format:</FormLabel>
							<Tooltip title="Click to Edit">
								<TextField
									InputProps={TextFieldBorderStyle}
									inputProps={TextFieldStyle}
									onChange={e => {
										e.preventDefault();
										setEditApiResponse("dateFormat", e.target.value);
									}}
									value={editApiResponse.dateFormat}
								/>
							</Tooltip>
						</div>
						<div className="formatElm">
							<FormLabel sx={{ ...FormLabelStyle }}>Timestamp Format:</FormLabel>
							<TextField
								InputProps={TextFieldBorderStyle}
								inputProps={TextFieldStyle}
								onChange={e => {
									e.preventDefault();
									setEditApiResponse("timestampFormat", e.target.value);
								}}
								value={editApiResponse.timestampFormat}
							/>
						</div>
						<div className="formatElm">
							<FormLabel sx={{ ...FormLabelStyle }}>Timestamp NTZ Format:</FormLabel>
							<TextField
								InputProps={TextFieldBorderStyle}
								inputProps={TextFieldStyle}
								onChange={e => {
									e.preventDefault();
									setEditApiResponse("timestampNTZFormat", e.target.value);
								}}
								value={editApiResponse.timestampNTZFormat}
							/>
						</div>
					</div>
				</div>

				<div
					style={{
						flex: 1,
						height: "500px",
						width: "90%",
						margin: "1rem auto",
					}}
				>
					<TableContainer
						style={{
							height: "400px",
							width: "fit-content",
							maxWidth: "100%",
							// maxWidth: "100%",
							// minWidth: "200px",
							overflow: "auto",
						}}
					>
						<Table
							sx={{
								borderLeft: "1px solid rgba(224,224,224,1)",
							}}
							stickyHeader={true}
						>
							<TableHead className={classes.tableHeader}>
								<TableRow>
									{editApiResponse.columnInfos &&
										editApiResponse.columnInfos.map((headerElement: any) => {
											return (
												<TableCell
													key={headerElement.fieldName}
													style={{
														color: headerElement.columnExcluded
															? "#b5b5b5"
															: "#4a4a4a",
													}}
												>
													<div
														style={{
															display: "flex",
															justifyContent: "space-between",
															// padding: "0 1rem",
															marginBottom: "10px",
														}}
													>
														<TextField
															className={classes2.root}
															value={headerElement.newDataType}
															disabled={headerElement.columnExcluded}
															onChange={e => {
																let temp =
																	editApiResponse.columnInfos.map(
																		(obj: any) => {
																			if (
																				obj.fieldName ===
																				headerElement.fieldName
																			) {
																				obj.newDataType =
																					e.target.value;
																			}
																			return obj;
																		}
																	);
																setEditApiResponse(
																	"columnInfos",
																	temp
																);
															}}
															variant="outlined"
															select
														>
															{dataTypes.map((dt: any) => {
																return (
																	<MenuItem value={dt.value}>
																		<Typography
																			sx={{
																				width: "auto",
																				overflow: "hidden",
																				textOverflow:
																					"ellipsis",
																				fontSize: "12px",
																			}}
																		>
																			{dt.value
																				.charAt(0)
																				.toUpperCase() +
																				dt.value.slice(
																					1
																				)}{" "}
																		</Typography>
																	</MenuItem>
																);
															})}
														</TextField>

														{headerElement.columnExcluded ? (
															<Tooltip title="click to Show">
																<VisibilityOffIcon
																	className={
																		classes.visiblityIconStyle
																	}
																	style={{
																		color: "#b5b5b5",
																	}}
																	onClick={() => {
																		console.log("click");
																		let temp =
																			editApiResponse.columnInfos.map(
																				(obj: any) => {
																					if (
																						obj.fieldName ===
																						headerElement.fieldName
																					) {
																						obj.columnExcluded =
																							false;
																					}
																					return obj;
																				}
																			);
																		setEditApiResponse(
																			"columnInfos",
																			temp
																		);
																	}}
																/>
															</Tooltip>
														) : (
															<Tooltip title="click to Hide">
																<VisibilityIcon
																	className={
																		classes.visiblityIconStyle
																	}
																	onClick={() => {
																		let temp =
																			editApiResponse.columnInfos.map(
																				(obj: any) => {
																					if (
																						obj.fieldName ===
																						headerElement.fieldName
																					) {
																						obj.columnExcluded =
																							true;
																					}
																					return obj;
																				}
																			);

																		setEditApiResponse(
																			"columnInfos",
																			temp
																		);
																	}}
																/>
															</Tooltip>
														)}
													</div>

													<Tooltip
														title={
															headerElement.columnExcluded
																? null
																: "click to Edit"
														}
													>
														<TextField
															style={{ fontSize: "20px" }}
															InputProps={TextFieldBorderStyle}
															inputProps={{
																style: {
																	height: "25px",
																	padding: "0px 10px",
																	fontSize: "14px",
																	fontWeight: "bold",
																	color: "#3B3C36",
																},
															}}
															disabled={headerElement.columnExcluded}
															onChange={e => {
																e.preventDefault();
																console.log(e.target.value);
																let temp =
																	editApiResponse.columnInfos.map(
																		(obj: any) => {
																			if (
																				obj.fieldName ===
																				headerElement.fieldName
																			) {
																				obj.newFieldName =
																					e.target.value;
																			}
																			return obj;
																		}
																	);
																setEditApiResponse(
																	"columnInfos",
																	temp
																);
															}}
															onBlur={() => {
																setEditColumnName(false);
																setSelectedColumnToEdit("");
																console.log(editApiResponse);
															}}
															value={headerElement.newFieldName}
														/>
													</Tooltip>
												</TableCell>
											);
										})}
								</TableRow>
							</TableHead>
							<TableBody className={classes.tableBody}>
								{editApiResponse.sampleRecords &&
									editApiResponse.sampleRecords.map((el: any) => {
										return (
											<TableRow>
												{editApiResponse.columnInfos &&
													editApiResponse.columnInfos.map((elm: any) => {
														return (
															<TableCell
																style={{
																	color: elm.columnExcluded
																		? "#b5b5b5"
																		: "#4a4a4a",
																}}
															>
																{el[elm.fieldName]}
															</TableCell>
														);
													})}
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
				<div className="buttonContainer">
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
							value="preview"
							onClick={() => {
								setselectedButton("preview");
								handleSave();
							}}
						>
							Preview Changes
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
		editApiResponse: state.flatFileState.editApiResponse,
		editMode: state.flatFileState.editMode,
	};
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setEditApiResponse: (key: string, file: any) => dispatch(setEditApiResponseProp(key, file)),
		setModifiedApiResponse: (file: any) => dispatch(setModifiedApiResponse(file)),
		resetFlatFileState: () => dispatch(resetFlatFileState()),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(EditFlatFileData);
