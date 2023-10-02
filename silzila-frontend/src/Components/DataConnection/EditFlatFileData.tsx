import {
	Button,
	FormLabel,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Tooltip,
	Typography,
	TableContainer,
	Dialog,
	DialogTitle,
	DialogContent,
	AlertColor,
} from "@mui/material";
import { useState } from "react";
import AbcIcon from "@mui/icons-material/Abc";
import NumbersIcon from "@mui/icons-material/Numbers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { connect } from "react-redux";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { setEditApiResponseProp } from "../../redux/FlatFile/FlatFileStateActions";
import { Dispatch } from "redux";
import FetchData from "../ServerCall/FetchData";
import { useNavigate } from "react-router-dom";
import { resetFlatFileState } from "../../redux/FlatFile/FlatFileStateActions";
import { FlatFileStateProps } from "../../redux/FlatFile/FlatFileInterfaces";
import { EditFlatFileProps } from "./FlatFileInterfaces";
import MenuBar from "../DataViewer/MenuBar";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { CloseOutlined } from "@mui/icons-material";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import {
	FormLabelStyle,
	TextFieldBorderStyle,
	TextFieldStyle,
	datatypeMenuItem,
	ffButtonStyle,
	ffDialogTc,
	ffDialogTitle,
	flatfilenamefield,
	infoIconStyle,
	rowspancell,
	styles,
	useStyles,
} from "./muiStyles";

const EditFlatFileData = ({
	token,
	editApiResponse,

	setEditApiResponse,
	resetFlatFileState,
}: EditFlatFileProps) => {
	const classes = useStyles();
	const classes2 = styles();

	const navigate = useNavigate();

	const [dateFormat, setDateFormat] = useState<string>(
		editApiResponse.dateFormat ? editApiResponse.dateFormat : ""
	);
	const [timestampFormat, setTimestampFormat] = useState<string>(
		editApiResponse.timestampFormat ? editApiResponse.timestampFormat : ""
	);
	const [openModalForFormatSpecifier, setOpenModalForFormatSpecifier] = useState<boolean>(false);

	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("");
	const [severity, setSeverity] = useState<AlertColor>("success");

	const setDataToEditApiResponse = async () => {
		var fileObj = {
			fileId: editApiResponse.fileId,
			name: editApiResponse.name,
			dateFormat: dateFormat,
			timestampFormat: timestampFormat,
			revisedColumnInfos: editApiResponse.columnInfos,
		};
		var result: any = await FetchData({
			requestType: "withData",
			method: "POST",
			url: "file-upload-change-schema/",
			data: fileObj,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (result.status) {
			setEditApiResponse("sampleRecordes", result.data);
		} else {
			setOpenAlert(true);
			setSeverity("error");
			setTestMessage(result.data.message);
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// }, 3000);
		}
	};

	const handleSave = async () => {
		var formObj = {
			fileId: editApiResponse.fileId,
			name: editApiResponse.name,
			dateFormat: editApiResponse.dateFormat,
			timestampFormat: editApiResponse.timestampFormat,
			revisedColumnInfos: editApiResponse.columnInfos,
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
			setOpenAlert(true);
			setSeverity("success");
			setTestMessage("Flatfile Successfully Saved!");
			setTimeout(() => {
				setOpenAlert(false);
				navigate("/datahome");
				resetFlatFileState();
			}, 3000);
		} else {
			setOpenAlert(true);
			setSeverity("error");
			setTestMessage(result.data.message);
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// }, 3000);
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
									style: flatfilenamefield,
								}}
								onChange={e => {
									e.preventDefault();
									setEditApiResponse("name", e.target.value);
								}}
								value={editApiResponse.name}
							/>
						</Tooltip>
					</div>

					<div className="format-elm-container">
						{/* <div
							style={{
								flex: 1,
								display: "flex",
								maxHeight: "28px",
								justifyContent: "flex-end",
							}}
						>
							<div
								style={{
									display: "flex",
									flex: 1,
									gap: "5px",
								}}
							>
								<InfoOutlinedIcon
									onClick={() => setOpenModalForFormatSpecifier(true)}
									sx={{ ...infoIconStyle }}
								/>
								<FormLabel sx={{ ...FormLabelStyle }}>Date Format:</FormLabel>
							</div>

							<Tooltip title="Click to Edit">
								<TextField
									InputProps={TextFieldBorderStyle}
									inputProps={TextFieldStyle}
									onChange={e => {
										e.preventDefault();
										setDateFormat(e.target.value);
										setEditApiResponse("dateFormat", e.target.value);
									}}
									value={dateFormat}
								/>
							</Tooltip>
						</div> */}
						<div className="formatElm">
							<div
								style={{
									fontSize: "14px",
									margin: "5px",
									width: "50%",
									textAlign: "right",
									alignItems: "center",
								}}
							>
								<InfoOutlinedIcon
									onClick={() => setOpenModalForFormatSpecifier(true)}
									sx={{
										fontSize: "13px",
										marginRight: "5px",
										verticalAlign: "middle",
										marginBottom: "4px",
										color: "#af99db",
									}}
								/>
								<FormLabel sx={{ fontSize: "14px", marginTop: "10px" }}>
									Date Format:
								</FormLabel>
							</div>
							<TextField
								InputProps={TextFieldBorderStyle}
								inputProps={TextFieldStyle}
								onChange={e => {
									e.preventDefault();
									setDateFormat(e.target.value);
									setEditApiResponse("dateFormat", e.target.value);
								}}
								value={dateFormat}
							/>
						</div>
						<div className="formatElm">
							<FormLabel sx={{ ...FormLabelStyle }}>Timestamp Format:</FormLabel>
							<TextField
								InputProps={TextFieldBorderStyle}
								inputProps={TextFieldStyle}
								onChange={e => {
									e.preventDefault();
									setTimestampFormat(e.target.value);
									setEditApiResponse("timestampFormat", e.target.value);
								}}
								value={timestampFormat}
							/>
						</div>
					</div>
				</div>

				<div className="ffTableDiv">
					<TableContainer
						style={{
							height: "450px",
							width: "fit-content",
							maxWidth: "100%",
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
												<TableCell key={headerElement.fieldName}>
													<div className="ffTablecellDiv">
														<TextField
															className={classes2.root}
															value={headerElement.dataType}
															onChange={e => {
																let temp =
																	editApiResponse.columnInfos.map(
																		(obj: any) => {
																			if (
																				obj.fieldName ===
																				headerElement.fieldName
																			) {
																				obj.dataType =
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
																			sx={datatypeMenuItem}
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
													</div>
													<div
														style={{
															color: "rgba(0, 0, 0, 0.6)",
															textAlign: "left",
														}}
													>
														{headerElement.fieldName}
													</div>
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
															<TableCell>
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
					<Button
						value="preview"
						onClick={() => {
							if (editApiResponse.name) {
								setDataToEditApiResponse();
							} else {
								setOpenAlert(true);
								setSeverity("warning");
								setTestMessage("File Name can not be empty");
								setTimeout(() => {
									setOpenAlert(false);
								}, 3000);
							}
						}}
						sx={{ ...ffButtonStyle, border: "2px solid #af99db", color: "#af99db" }}
					>
						Preview Changes
					</Button>
					<Button
						onClick={() => {
							if (editApiResponse.name) {
								handleSave();
							} else {
								setOpenAlert(true);
								setSeverity("warning");
								setTestMessage("File Name can not be empty");
								setTimeout(() => {
									setOpenAlert(false);
								}, 3000);
							}
						}}
						sx={{ ...ffButtonStyle, border: "2px solid #2bb9bb", color: "#2bb9bb" }}
					>
						Save
					</Button>
					<Button
						value="cancel"
						onClick={() => {
							navigate("/datahome");
							resetFlatFileState();
						}}
						sx={{
							...ffButtonStyle,
							border: "2px solid grey",
							color: "grey",
						}}
					>
						Cancel
					</Button>
				</div>
			</div>

			<Dialog
				open={openModalForFormatSpecifier}
				maxWidth="md"
				fullWidth={true}
				PaperProps={{
					sx: {
						minHeight: "90%",
						maxWidth: "fit-content",
					},
				}}
				className={classes2.dialogTitle}
			>
				<DialogTitle sx={ffDialogTitle}>
					<div>
						<b>Format Specifiers</b>
					</div>
					<CloseOutlined
						onClick={() => setOpenModalForFormatSpecifier(false)}
						style={{ marginRight: "0px", marginLeft: "auto" }}
					/>
				</DialogTitle>
				<DialogContent
					sx={{
						maxWidth: "fit-content",
						padding: "10px",
					}}
				>
					<Table stickyHeader className={classes2.dialogTable}>
						<TableHead>
							<TableRow>
								<TableCell style={ffDialogTc}>Date Part</TableCell>
								<TableCell style={ffDialogTc}>Specifier</TableCell>
								<TableCell style={ffDialogTc}>Description</TableCell>
								<TableCell style={ffDialogTc}>Example</TableCell>
							</TableRow>
						</TableHead>
						<TableBody style={{ width: "auto" }}>
							<TableRow>
								<TableCell rowSpan={5} sx={rowspancell}>
									Day
								</TableCell>
								<TableCell>%a</TableCell>

								<TableCell>Abbreviated weekday name.</TableCell>
								<TableCell>Sun, Mon, …</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%A</TableCell>
								<TableCell>Full weekday name.</TableCell>
								<TableCell>Sunday, Monday, …</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%w</TableCell>
								<TableCell>Weekday as a decimal number.</TableCell>
								<TableCell>0, 1, …, 6</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%d</TableCell>
								<TableCell>Day of the month as a zero-padded decimal.</TableCell>
								<TableCell>01, 02, …, 31</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%-d</TableCell>
								<TableCell>Day of the month as a decimal number.</TableCell>
								<TableCell>1, 2, …, 30</TableCell>
							</TableRow>
							<TableRow>
								<TableCell rowSpan={4} sx={rowspancell}>
									Month
								</TableCell>
								<TableCell>%b</TableCell>
								<TableCell>Abbreviated month name.</TableCell>
								<TableCell>Jan, Feb, …, Dec</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%B</TableCell>
								<TableCell>Full month name.</TableCell>
								<TableCell>January, February, …</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%m</TableCell>
								<TableCell>Month as a zero-padded decimal number.</TableCell>
								<TableCell>01, 02, …, 12</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%-m</TableCell>
								<TableCell>Month as a decimal number.</TableCell>
								<TableCell>1, 2, …, 12</TableCell>
							</TableRow>
							<TableRow>
								<TableCell rowSpan={3} sx={rowspancell}>
									Year
								</TableCell>
								<TableCell>%y</TableCell>
								<TableCell>
									Year without century as a zero-padded decimal number.
								</TableCell>
								<TableCell>00, 01, …, 99</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%-y</TableCell>
								<TableCell>Year without century as a decimal number.</TableCell>
								<TableCell>0, 1, …, 99</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%Y</TableCell>
								<TableCell>Year with century as a decimal number.</TableCell>
								<TableCell>2013, 2019 etc.</TableCell>
							</TableRow>
							<TableRow>
								<TableCell rowSpan={4} sx={rowspancell}>
									Hour
								</TableCell>
								<TableCell>%H</TableCell>
								<TableCell>
									Hour (24-hour clock) as a zero-padded decimal number.
								</TableCell>
								<TableCell>00, 01, …, 23</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%-H</TableCell>
								<TableCell>Hour (24-hour clock) as a decimal number.</TableCell>
								<TableCell>0, 1, …, 23</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%I</TableCell>
								<TableCell>
									Hour (12-hour clock) as a zero-padded decimal number.
								</TableCell>
								<TableCell>01, 02, …, 12</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%-I</TableCell>
								<TableCell>Hour (12-hour clock) as a decimal number.</TableCell>
								<TableCell>1, 2, … 12</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={rowspancell}>Local</TableCell>
								<TableCell>%p</TableCell>
								<TableCell>Locale’s AM or PM.</TableCell>
								<TableCell>AM, PM</TableCell>
							</TableRow>
							<TableRow>
								<TableCell rowSpan={2} sx={rowspancell}>
									Minute
								</TableCell>
								<TableCell>%M</TableCell>
								<TableCell>Minute as a zero-padded decimal number.</TableCell>
								<TableCell>00, 01, …, 59</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%-M</TableCell>
								<TableCell>Minute as a decimal number.</TableCell>
								<TableCell>0, 1, …, 59</TableCell>
							</TableRow>
							<TableRow>
								<TableCell rowSpan={4} sx={rowspancell}>
									Seconds
								</TableCell>
								<TableCell>%S</TableCell>
								<TableCell>Second as a zero-padded decimal number.</TableCell>
								<TableCell>00, 01, …, 59</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%-S</TableCell>
								<TableCell>Second as a decimal number.</TableCell>
								<TableCell>0, 1, …, 59</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%g</TableCell>
								<TableCell>
									Millisecond as a decimal number, zero-padded on the left.
								</TableCell>
								<TableCell>000 - 999</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%f</TableCell>
								<TableCell>
									Microsecond as a decimal number, zero-padded on the left.
								</TableCell>
								<TableCell>000000 - 999999</TableCell>
							</TableRow>
							<TableRow>
								<TableCell rowSpan={10} sx={rowspancell}>
									Anonymous
								</TableCell>
								<TableCell>%z</TableCell>
								<TableCell>
									Time offset from UTC in the form ±HH:MM, ±HHMM, or ±HH.
								</TableCell>
								<TableCell>-0700</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%Z</TableCell>
								<TableCell>Time zone name.</TableCell>
								<TableCell>Europe/Amsterdam</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%j</TableCell>
								<TableCell>
									Day of the year as a zero-padded decimal number.
								</TableCell>
								<TableCell>001, 002, …, 366</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%-j</TableCell>
								<TableCell>Day of the year as a decimal number.</TableCell>
								<TableCell>1, 2, …, 366</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%U</TableCell>
								<TableCell>
									Week number of the year (Sunday as the first day of the week).
								</TableCell>
								<TableCell>00, 01, …, 53</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%W</TableCell>
								<TableCell>
									Week number of the year (Monday as the first day of the week).
								</TableCell>
								<TableCell>00, 01, …, 53</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%c</TableCell>
								<TableCell>ISO date and time representation</TableCell>
								<TableCell>1992-03-02 10:30:20</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%x</TableCell>
								<TableCell>ISO date representation.</TableCell>
								<TableCell>1992-03-02</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%X</TableCell>
								<TableCell>ISO time representation</TableCell>
								<TableCell>10:30:20</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>%%</TableCell>
								<TableCell>A literal ‘%’ character.</TableCell>
								<TableCell>%</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</DialogContent>
			</Dialog>
			<NotificationDialog
				openAlert={openAlert}
				severity={severity}
				testMessage={testMessage}
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
			/>
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
		resetFlatFileState: () => dispatch(resetFlatFileState()),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(EditFlatFileData);
