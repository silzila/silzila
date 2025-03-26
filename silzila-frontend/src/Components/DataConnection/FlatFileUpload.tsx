import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Dispatch } from "redux";
import {
  setApiResponse,
  setEditApiResponse,
} from "../../redux/FlatFile/FlatFileStateActions";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import FetchData from "../ServerCall/FetchData";
import "./FlatFile.css";
import FileDropZone from "./FileDropZone";
import { FlatFileUploadProps } from "./FlatFileInterfaces";
import Logger from "../../Logger";
import MenuBar from "../DataViewer/MenuBar";
import { fontSize, palette } from "../..";
import { jwtDecode } from "jwt-decode";
import jsonFileIcon from "../../assets/jsonFileIcon.png";
import csvFileIcon from "../../assets/csvFileIcon.png";
import xlsxFileIcon from "../../assets/xlsxFileIcon.png";
import HoverButton from "../Buttons/HoverButton";
import { ffButtonStyle } from "./muiStyles";
import { PopUpSpinner } from "../CommonFunctions/DialogComponents";

const FlatFileUpload = ({
  token,
  setApiResponse,
  setEditApiResponse,
}: FlatFileUploadProps) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [selectedFileType, setSelectedFileType] = useState<
    string | undefined
  >(); // Filetype state
  const [selectedSheetName, setSelectedSheetName] = useState<string>(""); // Sheetname state

  const { parentId } = useParams();

  const [fileInfo, setFileInfo] = useState<{
    fileId: string;
    fileName: string;
  }>({
    fileId: "",
    fileName: "",
  });
  const [loading, setLoading] = useState(false);
  const [sheetChooseDialogShow, setSheetChooseDialogShow] = useState(false);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [sheetLoading, setSheetLoading] = useState(false);
  // Error dialog state
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");
  const [sheetError, setSheetError] = useState<{
    isError: boolean;
    message: string;
  }>({ isError: false, message: "" });
  type TExcelDetails = {
    fileId: string;
    fileName: string;
    sheetNames: string[];
  };

  const setDataToEditApiResponse = useCallback(
    (data: any) => {
      const fileObj = {
        fileId: data.fileId,
        name: data.name,
        dateFormat: data.dateFormat,
        timestampFormat: data.timestampFormat,
        columnInfos: data.columnInfos,
        sampleRecords: data.sampleRecords,
        fileType: selectedFileType,
      };
      setEditApiResponse(fileObj);
    },
    [selectedFileType, setEditApiResponse]
  );

  // Function to handle file type selection
  const handleFileType = (fileType: string) => {
    setSelectedFileType(fileType);
    setSelectedFile(undefined); // reset selectedFile when file type change
    // setSelectedSheetName(""); // reset sheet name when file type change
    // setSelectedSheet(""); // reset sheet name when file type change
  };

  const decodedToken: any = jwtDecode(token);
  const access = decodedToken.access;

  const MAX_FILE_SIZE_MB = 1024 // File size limit 1GB

  const SheetDialog = ({
    sheetChooseDialogShow,
    setSheetChooseDialogShow,
  }: {
    sheetChooseDialogShow: boolean;
    setSheetChooseDialogShow: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const [selectedSheet, setSelectedSheet] = useState<string>("");
    const uploadExcelFile = async () => {
      const formData = new FormData();
      formData.append("fileId", fileInfo.fileId);
      formData.append("sheetName", selectedSheet);
      formData.append("fileName", fileInfo.fileName);
      setLoading(true);
      const res = await FetchData({
        requestType: "withData",
        method: "POST",
        url: "file-upload-excel",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      if (res.status) {
        setApiResponse(res.data);
        setDataToEditApiResponse(res.data);
        setLoading(false);
        navigate(`/editflatfile/${parentId}`, {
          state: { mode: "New", parentId: parentId },
        });
      } else {
        setLoading(false);
        Logger("info", "error");
        setErrorDialogMessage("Error uploading the file");
        setErrorDialogOpen(true);
        setSelectedFile(undefined); // reset selectedFile after error
        // setSelectedSheetName("");
        setSelectedSheet("");
      }
    };

    return (
      <Dialog
        open={sheetChooseDialogShow}
        disableEnforceFocus
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          background: "transparent",
        }}
        TransitionProps={{ timeout: 0 }}
        // onClose={() => setSheetChooseDialogShow(false)}
      >
        <Box
          sx={{
            height: "20rem",
            width: "20rem",
            padding: "1rem",
          }}
        >
          {sheetLoading ? (
            <div
              className="loading-container"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBlock: 0,
                height: "100%",
                width: "100%",
              }}
            >
              <div className="user-spinner"></div>
            </div>
          ) : sheetError.isError ? (
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  color: "red",
                }}
              >
                Some Error occored while fetching sheet names
              </Typography>
            </Box>
          ) : (
            <Box>
              <DialogTitle
                id="alert-dialog-title"
                sx={{
                  fontSize: fontSize.large,
                  fontWeight: "bold",
                  paddingInline: 0,
                }}
              >
                Select Sheet
              </DialogTitle>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Sheet name
                  </InputLabel>
                  <Select
                    value={selectedSheet}
                    labelId="demo-simple-select-label"
                    onChange={(e) => setSelectedSheet(e.target.value)}
                    label="Sheet name"
                    sx={{ width: "100%" }}
                  >
                    {sheetNames.map((sheetName) => (
                      <MenuItem key={sheetName} value={sheetName}>
                        {sheetName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
          {!sheetLoading ? (
            <Box
              sx={{
                position: "absolute",
                width: "calc(100% - 2rem);",
                bottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <HoverButton
                text="Cancel"
                color="red"
                transitionTime="0.2s"
                backgroundColor="secondary.contrastText"
                hoverColor="secondary.contrastText"
                hoverBackgroundColor="red"
                sx={{
                  border: "1px solid red",
                }}
                onClick={() => {
                  setSheetChooseDialogShow(false);
                  setSelectedFile(undefined);
                  setSheetError({ isError: false, message: "" });
                  setSelectedSheet("");
                }}
              />
              <HoverButton
                disabled={sheetError.isError}
                text="Proceed"
                color="primary.main"
                transitionTime="0.2s"
                backgroundColor="secondary.contrastText"
                hoverColor="secondary.contrastText"
                hoverBackgroundColor="primary.main"
                sx={{
                  border: "1px solid " + palette.primary.main,
                  cursor: sheetError.isError ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  setSheetChooseDialogShow(false);
                  uploadExcelFile();
                }}
              />
            </Box>
          ) : null}
        </Box>
      </Dialog>
    );
  };

  // function to handle file select
  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (
        (selectedFileType === "csv" && fileExtension !== "csv") ||
        (selectedFileType === "json" && fileExtension !== "json")
      ) {
        setErrorDialogMessage(
          `Invalid file type. Expected a ${selectedFileType.toUpperCase()} file.`
        );
        setErrorDialogOpen(true);
        setSelectedFile(undefined);
        return;
      }
      if (selectedFileType === "excel" && fileExtension !== "xlsx") {
        setErrorDialogMessage(
          "Please upload Excel file (.xlsx format) only. Other file types are not supported."
        );
        setErrorDialogOpen(true);
        setSelectedFile(undefined); // Reset selected file
        setSelectedSheetName(""); // Reset sheet name
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setErrorDialogMessage(`File size exceeds the maximum limit.`);
        setErrorDialogOpen(true);
        setSelectedFile(undefined);
        setSelectedSheetName("");
        return;
      }
    }
    setSelectedFile(file);
  };

  // Function to handle form submission
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!selectedFile) {
      setErrorDialogMessage("Please select a file to upload");
      setErrorDialogOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (selectedFileType === "excel") {
      setSheetLoading(true);
      setSheetChooseDialogShow(true);
      const res = await FetchData({
        requestType: "withData",
        method: "POST",
        url: "file-upload-excel-sheetname",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSheetLoading(false);
      console.log(res);
      if (res.status) {
        const _res: TExcelDetails = res.data;
        setSheetNames(_res.sheetNames);
        setFileInfo({ fileId: _res.fileId, fileName: _res.fileName });
      } else {
        setSheetError({
          isError: true,
          message: res.data ?? "An error Occured",
        });
      }

      return;
    }
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const fileContent = e.target.result;
      if (selectedFileType === "excel") return;
      else {
        if (selectedFileType === "json") {
          try {
            JSON.parse(fileContent);
          } catch {
            setErrorDialogMessage("JSON Object is not in the expected Format");
            setErrorDialogOpen(true);
            setSelectedFile(undefined); // reset selectedFile when error occurs
            return;
          }
        }

        setLoading(true);
        var result: any = await FetchData({
          requestType: "withData",
          method: "POST",
          url: "file-upload",
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (result.status) {
          setApiResponse(result.data);
          setDataToEditApiResponse(result.data);
          setLoading(false);
          navigate(`/editflatfile/${parentId}`, {
            state: { mode: "New", parentId: parentId },
          });
        } else {
          setLoading(false);
          Logger("info", "error");
          const errorMessage = result.data?.message ?? "Error uploading the file";
          setErrorDialogMessage(errorMessage);
          setErrorDialogOpen(true);
          setSelectedFile(undefined); // reset selectedFile after error
          // setSelectedSheetName("");
        }
      }
    };

    // if (selectedFileType === "excel") {
    //   reader.readAsArrayBuffer(selectedFile);
    // } else {
    // }
    reader.readAsText(selectedFile);
  };

  return (
    <div>
      <MenuBar from="fileUpload" />
      <SheetDialog
        setSheetChooseDialogShow={setSheetChooseDialogShow}
        sheetChooseDialogShow={sheetChooseDialogShow}
        // selectedSheetName={selectedSheetName}
        // setSelectedSheetName={setSelectedSheetName}
      />
      <div style={{ display: "flex" }}>
        <div
          className="rightsidebar-container"
          style={{
            borderRight: "2px solid rgb(224, 224, 224)",
            height: "100vh",
          }}
        >
          <div>
            <div>
              <h2
                className="header"
                style={{
                  fontSize: fontSize.large,
                  color: palette.primary.contrastText,
                  fontWeight: "bold",
                }}
              >
                Select a File Type
              </h2>
            </div>
            <div className="icon-container">
              <div
                className={`csv-container ${
                  selectedFileType === "csv" ? "selected-container" : ""
                }`}
                style={{ display: "flex" }}
                onClick={() => handleFileType("csv")}
              >
                <div className="csv-icon">
                  <img src={csvFileIcon} className="csv-img" alt="CSV" />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: fontSize.medium,
                      color: palette.primary.contrastText,
                    }}
                  >
                    CSV
                  </p>
                </div>
              </div>

              <div
                className={`json-container ${
                  selectedFileType === "json" ? "selected-container" : ""
                }`}
                style={{ display: "flex" }}
                onClick={() => handleFileType("json")}
              >
                <div className="json-icon">
                  <img src={jsonFileIcon} className="json-img" alt="JSON" />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: fontSize.medium,
                      color: palette.primary.contrastText,
                    }}
                  >
                    JSON
                  </p>
                </div>
              </div>

              <div
                className={`excel-container ${
                  selectedFileType === "excel" ? "selected-container" : ""
                }`}
                style={{ display: "flex" }}
                onClick={() => handleFileType("excel")}
              >
                <div className="excel-icon">
                  <img src={xlsxFileIcon} className="excel-img" alt="Excel" />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: fontSize.medium,
                      color: palette.primary.contrastText,
                    }}
                  >
                    EXCEL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedFileType ? (
          <div className="FileUploadContainer">
            <div
              className="uploadFileTitle"
              style={{
                fontSize: fontSize.large,
                color: palette.primary.contrastText,
                fontWeight: "bold",
              }}
            >
              Upload {selectedFileType.toUpperCase()} File
            </div>
            <FileDropZone
              setSelectedFile={handleFileSelect}
              selectedFile={selectedFile}
              fileType={selectedFileType}
            />

            <div className="file-upload-button-container">
              {/* <Button
                style={{
                  textTransform: "none",
                  color: "#2bb9bb",
                  border: "2px solid  #2bb9bb",
                  padding: "5px 20px",
                  borderRadius: "5px",
                  height: "40px",
                }}
                onClick={handleSubmit}
              >
                Upload
              </Button> */}
              <HoverButton
                onClick={handleSubmit}
                text="Upload"
                color="primary.main"
                hoverColor="secondary.contrastText"
                backgroundColor="secondary.contrastText"
                hoverBackgroundColor="primary.main"
                transitionTime="0.2s"
                sx={{
                  ...ffButtonStyle,
                  height: "2.5rem",
                  border: `1px solid ${palette.primary.main}`,
                  fontSize: fontSize.medium,
                  lineHeight: "normal",
                }}
              />
            </div>
          </div>
        ) : (
          <div className="select-container">
            <p
              style={{
                fontSize: fontSize.medium,
                color: palette.primary.contrastText,
                fontWeight: "bold",
                alignSelf: "center"
              }}
            >
              Select a File Type
            </p>
          </div>
        )}
      </div>

      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <div className="dialog-container">
          <DialogTitle className="dialog-title">ERROR!</DialogTitle>
          <DialogContentText
            className="dialog-content-text"
            sx={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              alignContent: "center",
              paddingLeft: " 20px",
              paddingRight: "20px",
              paddingBottom: "5px",
            }}
          >
            {errorDialogMessage}
          </DialogContentText>
          <DialogActions className="dialog-actions">
            <Button
              onClick={() => {
                setErrorDialogOpen(false);
                //  setSelectedFile(undefined);
              }}
              className="dialog-button"
              sx={{
                color: "gray",
                border: "1px solid gray",
                marginBottom: "10px",
                marginRight: "15px",
                "&:hover": {
                  backgroundColor: " #8c6bb1",
                  color: "white",
                },
              }}
            >
              OK
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      <PopUpSpinner
        show={loading}
        // paperProps={{ style: { backgroundColor: "red", boxShadow: "none" } }}
        // sx={{ marginLeft: "16.7rem" }}
      />
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