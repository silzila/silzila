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
import { useState, useEffect } from "react";
import AbcIcon from "@mui/icons-material/Abc";
import NumbersIcon from "@mui/icons-material/Numbers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { connect } from "react-redux";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { setEditApiResponseProp } from "../../redux/FlatFile/FlatFileStateActions";
import { Dispatch } from "redux";
import FetchData from "../ServerCall/FetchData";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { resetFlatFileState, setEditApiResponse } from "../../redux/FlatFile/FlatFileStateActions";
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
	rowspancell,
	styles,
	useStyles,
} from "./muiStyles";
import { fontSize, palette } from "../..";
import { PopUpSpinner } from "../CommonFunctions/DialogComponents";
import RichTreeViewControl from "../Controls/RichTreeViewControl";
import { GetWorkSpaceDetails, ConvertListOfListToRichTreeViewList,  isNameAllowed } from "../CommonFunctions/CommonFunctions";
import Logger from "../../Logger";

const EditFlatFileData = ({
	token,
	editApiResponse,

  setEditApiResponseWorksapce,
	setEditApiResponse,
	resetFlatFileState,
}: EditFlatFileProps) => {
	const classes = useStyles();
	const classes2 = styles();

	const navigate = useNavigate();
  const { parentId } = useParams();
  const location = useLocation();
  const state = location.state;

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
	const [selectedFileType, setSelectedFileType] = useState<string | undefined>(
  editApiResponse.fileType);
  const [showWorkSpace, setShowWorkSpace] = useState<boolean>(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isSubWorkspaceSelected, setIsSubWorkspaceSelected] =
    useState<boolean>(false);
  const [subWorkspaceList, setSubWorkspaceList] = useState<Array<Object>>([]);

   useEffect(() => {
    if (state?.mode === "New") {
      getAllSubworkspace();
    } else if (state?.mode === "Edit") {
      onEditFlatFile(state?.file);
    }
    //eslint-disable-next-line
  }, [state]);

  useEffect(() => {
    if(!state){
      navigate("/")
    }
  }, [state, navigate]) 

  useEffect(() => {
    if (selectedWorkspace !== "") {
      handleSave();
      setShowWorkSpace(false);
    }
    //eslint-disable-next-line
  }, [selectedWorkspace]);
  
  if (!state) {
    return null;
  }
   const getAllSubworkspace = async () => {
    var result: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `workspaces/tree`,
      headers: { Authorization: `Bearer ${token}` },
    });

    let list = [];

    if (result.status) {
      list = result.data;
    } else {
      Logger("error", result.data.detail);
    }

    setSubWorkspaceList(ConvertListOfListToRichTreeViewList(list));
  };

  const onEditFlatFile = async (file: any) => {
    var result: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `file-data-column-details/${file.id}?workspaceId=${parentId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result.status) {
      var result2: any = await FetchData({
        requestType: "noData",
        method: "GET",
        url: `file-data-sample-records?flatfileId=${file.id}&workspaceId=${parentId}`,
        headers: {
          Authorization: `Bearer ${token}`,
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
        setEditApiResponseWorksapce(fileObj);
        setEditApiResponse("fileObj", fileObj);
      } else {
      }
    } else {
    }
    //props.setEditMode(true);
  };
	
	const setDataToEditApiResponse = async () => {

		var fileObj = {
			fileId: editApiResponse.fileId,
			name: editApiResponse.name,
			dateFormat: dateFormat,
			timestampFormat: timestampFormat,
			revisedColumnInfos: editApiResponse.columnInfos,
			fileType: selectedFileType,
		};
		var result: any = await FetchData({
			requestType: "withData",
			method: "POST",
			url: `file-upload-change-schema?workspaceId=${parentId}`,
			data: fileObj,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (result.status) {
			setEditApiResponse("sampleRecordes", result.data);
			setOpenAlert(true);
			setSeverity("success");
			setTestMessage("Preview Successful!");
      setTimeout(() => {
        setOpenAlert(false);
      }, 3000);
		} else {
			let errorMessage = result.data.message;
        
			// Check for specific data type change error
			if (errorMessage.includes('Conversion Error') && errorMessage.includes('Could not convert string')) {
					errorMessage = "You are trying for unmatched datatype";
			}

			setOpenAlert(true);
			setSeverity("error");
			setTestMessage(errorMessage);
		}
	};

  const handleProceedButtonClick = (selectedWorkspaceID: string, list: any) => {
    if (!selectedWorkspaceID) {
      setSeverity("error");
      setOpenAlert(true);
      setTestMessage("Select a workspace.");
      return;
    }

    setIsSubWorkspaceSelected(
      !list.find((item: any) => item.id === selectedWorkspaceID)
    );

    setSelectedWorkspace(selectedWorkspaceID);
  };

	const handleSave = async () => {
    let workspaceID: any = selectedWorkspace || parentId;
    setSelectedWorkspace("");
		var formObj = {
			fileId: editApiResponse.fileId,
			name: editApiResponse.name,
			dateFormat: editApiResponse.dateFormat,
			timestampFormat: editApiResponse.timestampFormat,
			revisedColumnInfos: editApiResponse.columnInfos,
			fileType: selectedFileType,
		};
    setLoading(true);
		var result: any = await FetchData({
			requestType: "withData",
			method: "POST",
			url: `file-upload-save-data?workspaceId=${workspaceID}`,
			data: formObj,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (result.status) {
      setLoading(false);
			setOpenAlert(true);
			setSeverity("success");
			setTestMessage("Flatfile Successfully Saved!");
			setTimeout(() => {
				setOpenAlert(false);
				// navigate("/datahome");
				resetFlatFileState();
			}, 3000);

       if (state?.mode !== "New") {
          navigate(-1);
        } else {
          if (isSubWorkspaceSelected) {
            let workspaceDetail: any = GetWorkSpaceDetails(
              subWorkspaceList,
              workspaceID,
              true
            );
            localStorage.setItem("workspaceName", workspaceDetail?.label);
            localStorage.setItem(
              "childWorkspaceName",
              workspaceDetail.subLabel
            );
            // localStorage.setItem("parentId", workspaceID);
            navigate(`/SubWorkspaceDetails/${workspaceID}`);
          } else {
            let workspaceDetail: any = GetWorkSpaceDetails(
              subWorkspaceList,
              workspaceID
            );
            localStorage.setItem("workspaceName", workspaceDetail?.label);
            localStorage.setItem("parentId", workspaceID);
            navigate(`/workspace/${workspaceID}`);
          }
        }
		} else {
      setLoading(false);
			let errorMessage = result.data.message; 
			// Check for specific data type change error
			if (errorMessage.includes('Conversion Error')) {
					errorMessage = "You are trying for unmatched datatype!";
			}

			setOpenAlert(true);
			setSeverity("error");
			setTestMessage(errorMessage);
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
      {showWorkSpace ? (
        <RichTreeViewControl
          currentWorkspace={state?.parentId}
          proceedButtonName={"Save"}
          list={subWorkspaceList}
          title={"Select a Workspace"}
          showInPopup={showWorkSpace}
          handleCloseButtonClick={(e: any) => {
            setShowWorkSpace(false);
          }}
          handleProceedButtonClick={handleProceedButtonClick}
        ></RichTreeViewControl>
      ) : null}
      <MenuBar from="editFlatFile" />
      <div
        className="editFlatFileContainer"
        style={{ height: "calc(100% - 3rem)" }}
      >
        <div
          className="editFlatFileHeader"
          style={{ width: "100%", margin: 0 }}
        >
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
                onChange={(e) => {
                  e.preventDefault();
                  setEditApiResponse("name", e.target.value);
                }}
                value={editApiResponse.name}
              />
            </Tooltip>
          </div>

          <div
            className="format-elm-container"
            style={{
              justifyContent: "flex-end",
              paddingBlock: "0.5rem",
              gap: "0.5rem",
            }}
          >
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
            <div
              className="formatElm"
              style={{ justifyContent: "flex-end", alignItems: "center" }}
            >
              <div style={{ justifyContent: "flex-end", alignItems: "center" }}>
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
                <FormLabel sx={{ fontSize: fontSize.medium }}>
                  Date Format:
                </FormLabel>
              </div>
              <TextField
                InputProps={TextFieldBorderStyle}
                inputProps={TextFieldStyle}
                onChange={(e) => {
                  e.preventDefault();
                  setDateFormat(e.target.value);
                  setEditApiResponse("dateFormat", e.target.value);
                }}
                value={dateFormat}
              />
            </div>
            <div
              className="formatElm"
              style={{ justifyContent: "flex-end", alignItems: "center" }}
            >
              <FormLabel sx={{ ...FormLabelStyle, fontSize: fontSize.medium }}>
                Timestamp Format:
              </FormLabel>
              <TextField
                InputProps={TextFieldBorderStyle}
                inputProps={TextFieldStyle}
                onChange={(e) => {
                  e.preventDefault();
                  setTimestampFormat(e.target.value);
                  setEditApiResponse("timestampFormat", e.target.value);
                }}
                value={timestampFormat}
              />
            </div>
          </div>
        </div>

        <div className="ffTableDiv" style={{ width: "100%" }}>
          <TableContainer
            sx={{
              height: "100%",
              width: "fit-content",
              maxWidth: "100%",
              overflow: "auto",
              "&::-webkit-scrollbar": {
                height: "5px",
              },
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
                              onChange={(e) => {
                                let temp = editApiResponse.columnInfos.map(
                                  (obj: any) => {
                                    if (
                                      obj.fieldName === headerElement.fieldName
                                    ) {
                                      obj.dataType = e.target.value;
                                    }
                                    return obj;
                                  }
                                );
                                setEditApiResponse("columnInfos", temp);
                              }}
                              variant="outlined"
                              select
                              InputProps={{
                                style: {
                                  fontSize: fontSize.small,
                                  margin: 0,
                                },
                              }}
                              fullWidth
                            >
                              {dataTypes.map((dt: any) => {
                                return (
                                  <MenuItem value={dt.value}>
                                    <Typography sx={datatypeMenuItem}>
                                      {dt.value.charAt(0).toUpperCase() +
                                        dt.value.slice(1)}{" "}
                                    </Typography>
                                  </MenuItem>
                                );
                              })}
                            </TextField>
                          </div>
                          <div
                            style={{
                              color: palette.primary.contrastText,
                              textAlign: "left",
                              fontSize: fontSize.medium,
                              fontWeight: "bold",
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
                            return <TableCell>{el[elm.fieldName]}</TableCell>;
                          })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div
          className="buttonContainer"
          style={{ width: "100%", paddingBlock: "0.5rem" }}
        >
          <Button
            value="cancel"
            onClick={() => {
              navigate("/datahome");
              resetFlatFileState();
            }}
            sx={{
              ...ffButtonStyle,
              border: `2px solid ${palette.primary.contrastText}`,
              color: palette.primary.contrastText,
              "&:hover": {
                color: palette.secondary.contrastText,
                background: palette.primary.contrastText,
              },
            }}
          >
            Cancel
          </Button>
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
            sx={{
              ...ffButtonStyle,
              border: "2px solid #af99db",
              color: "#af99db",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: palette.secondary.light,
                color: palette.secondary.contrastText,
              },
            }}
          >
            Preview Change
          </Button>
          <Button
            value="save"
            onClick={() => {
              if (state?.mode === "New") {
                if (isNameAllowed(editApiResponse.name)) {
                  //handleSave();
                  setShowWorkSpace(true);
                } else {
                  setOpenAlert(true);
                  setSeverity("warning");
                  setTestMessage("File Name can not be empty");
                  setTimeout(() => {
                  setOpenAlert(false);
                  }, 3000);
                  }
              } else {
                handleSave();
              }
            }}
            sx={{
              ...ffButtonStyle,
              border: `2px solid ${palette.primary.main}`,
              color: palette.primary.main,
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: palette.primary.main,
                color: palette.secondary.contrastText,
              },
            }}
          >
            Save
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
                <TableCell>
                  Day of the month as a zero-padded decimal.
                </TableCell>
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
                <TableCell sx={rowspancell}>Hour</TableCell>
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
                  Others
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
      <PopUpSpinner show={loading} />
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
    setEditApiResponseWorksapce: (file: any) =>
      dispatch(setEditApiResponse(file)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(EditFlatFileData);