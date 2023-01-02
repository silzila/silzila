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
	Typography,
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
			"& .MuiOutlinedInput-root": {
				height: "20px",
				fontSize: "10px",
				padding: "2px 5px",
				textAlign: "left",
			},
			"& .MuiMenuItem-root": {
				padding: "4px",
				display: "flex",
				height: "20px",
				width: "100px",
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

	setEditApiResponse,
	setModifiedApiResponse,
	resetFlatFileState,
}: EditFlatFileProps) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [editColumnName, setEditColumnName] = useState<boolean>(false);
	const [selectedColumnToEdit, setSelectedColumnToEdit] = useState<string>("");
	const [editFileName, setEditFileName] = useState<boolean>(false);

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
			url: "file-upload-change-schema/",
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
		<div className="editFlatFileContainer">
			<div className="editFlatFileHeader">
				<span className="flat-file-name">
					{editFileName ? (
						<TextField
							// style={{ padding: "5px 10px", width: "60%" }}
							inputProps={{
								style: {
									height: "fit-content",
									width: "60%",
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
					) : (
						<p
							className="tableName-style"
							title="Click to Edit"
							onClick={() => setEditFileName(true)}
						>
							{editApiResponse.name}
						</p>
					)}
				</span>
				<div className="format-elm-container">
					<div className="formatElm">
						<FormLabel sx={{ ...FormLabelStyle }}>Date Format:</FormLabel>
						<TextField
							inputProps={TextFieldStyle}
							onChange={e => {
								e.preventDefault();
								setEditApiResponse("dateFormat", e.target.value);
							}}
							value={editApiResponse.dateFormat}
						/>
					</div>
					<div className="formatElm">
						<FormLabel sx={{ ...FormLabelStyle }}>Timestamp Format:</FormLabel>
						<TextField
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
					minHeight: "450px",
					maxHeight: "480px",
					maxWidth: "90%",
					margin: "1rem auto 1rem auto",
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
											sx={{
												backgroundColor: headerElement.columnExcluded
													? "#f1f4f4"
													: "white",
											}}
										>
											<div
												style={{
													display: "flex",
													justifyContent: "space-between",
													padding: "0 1rem",
													marginBottom: "10px",
												}}
											>
												<Select
													disabled={headerElement.columnExcluded}
													value={headerElement.newDataType}
													onChange={e => {
														let temp = editApiResponse.columnInfos.map(
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
														setEditApiResponse("columnInfos", temp);
													}}
												>
													{dataTypes.map((dt: any) => {
														return (
															<MenuItem value={dt.value}>
																<Typography
																	sx={{
																		width: "auto",
																		overflow: "hidden",
																		textOverflow: "ellipsis",
																		fontSize: "12px",
																	}}
																>
																	{dt.value
																		.charAt(0)
																		.toUpperCase() +
																		dt.value.slice(1)}{" "}
																</Typography>
															</MenuItem>
														);
													})}
												</Select>
												{headerElement.columnExcluded ? (
													<VisibilityOffIcon
														className={classes.visiblityIconStyle}
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
															setEditApiResponse("columnInfos", temp);
														}}
													/>
												) : (
													<VisibilityIcon
														className={classes.visiblityIconStyle}
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

															setEditApiResponse("columnInfos", temp);
														}}
													/>
												)}
											</div>

											{editColumnName &&
											selectedColumnToEdit === headerElement.fieldName ? (
												<input
													id="columnName"
													type="text"
													disabled={headerElement.columnExcluded}
													value={headerElement.newFieldName}
													onChange={e => {
														e.preventDefault();
														console.log(e.target.value);
														let temp = editApiResponse.columnInfos.map(
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
														setEditApiResponse("columnInfos", temp);
													}}
													onBlur={() => {
														setEditColumnName(false);
														setSelectedColumnToEdit("");
														console.log(editApiResponse);
													}}
												></input>
											) : (
												<div
													onDoubleClick={() => {
														if (!headerElement.columnExcluded) {
															setSelectedColumnToEdit(
																headerElement.fieldName
															);
															setEditColumnName(true);
														}
													}}
													className="columnNameStyle"
												>
													<span
														style={{
															color: headerElement.columnExcluded
																? "#8f8f8f"
																: "#4a4a4a",
														}}
														title="Double Click to Edit"
													>
														{headerElement.newFieldName}
													</span>
												</div>
											)}
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
															backgroundColor: elm.columnExcluded
																? "#f1f4f4"
																: "transparent",
															color: elm.columnExcluded
																? "#8f8f8f"
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
			</div>
			<div className="buttonContainer">
				<Button
					className={classes.uploadButton}
					onClick={() => {
						resetFlatFileState();
						navigate("/flatfileupload");
					}}
				>
					Cancel
				</Button>
				<Button className={classes.uploadButton} onClick={() => handleSave()}>
					Save
				</Button>
			</div>
		</div>
	);
};
const mapStateToProps = (state: isLoggedProps & FlatFileStateProps, ownProps: any) => {
	return {
		token: state.isLogged.accessToken,
		editApiResponse: state.flatFileState.editApiResponse,
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
