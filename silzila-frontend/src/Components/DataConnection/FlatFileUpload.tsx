import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from "@mui/material";
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
import * as XLSX from 'xlsx';
import jsonFileIcon from "../../assets/jsonFileIcon.png";
import csvFileIcon from "../../assets/csvFileIcon.png";
import xlsxFileIcon from "../../assets/xlsxFileIcon.png";

const FlatFileUpload = ({ token, setApiResponse, setEditApiResponse }: FlatFileUploadProps) => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | undefined>();
    const [selectedFileType, setSelectedFileType] = useState<string | undefined>(); // Filetype state
    const [selectedSheetName, setSelectedSheetName] = useState<string>(""); // Sheetname state

    // Error dialog state
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = useState("");

    const setDataToEditApiResponse = (data: any) => {
        var fileObj = {
            fileId: data.fileId,
            name: data.name,
            dateFormat: data.dateFormat,
            timestampFormat: data.timestampFormat,
            columnInfos: data.columnInfos,
            sampleRecords: data.sampleRecords,
            fileType: selectedFileType
        };
        setEditApiResponse(fileObj);
    };

  // Function to handle file type selection
  const handleFileType = (fileType: string) => {
    setSelectedFileType(fileType);
    setSelectedFile(undefined); // reset selectedFile when file type change
    setSelectedSheetName(""); // reset sheet name when file type change
  }

const MAX_FILE_SIZE_MB = 500;  // File size limit

// function to handle file select
const handleFileSelect = (file: File | undefined) => {
  if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (
          (selectedFileType === 'csv' && fileExtension !== 'csv') ||
          (selectedFileType === 'json' && fileExtension !== 'json') 
          
      ) {
          setErrorDialogMessage(`Invalid file type. Expected a ${selectedFileType.toUpperCase()} file.`);
          setErrorDialogOpen(true);
          return;
      } 
      if (selectedFileType === 'excel' && fileExtension !== 'xlsx') {
        setErrorDialogMessage('Please upload Excel file (.xlsx format) only. Other file types are not supported.');
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
          setErrorDialogMessage('Please select a file to upload');
          setErrorDialogOpen(true);
          return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

          const reader = new FileReader();

          reader.onload = async (e: any) => {
              const fileContent = e.target.result;

              if (selectedFileType === 'json') {
                  try {
                      JSON.parse(fileContent);
                  } catch {
                      setErrorDialogMessage('JSON Object is not in the expected Format');
                      setErrorDialogOpen(true);
                      setSelectedFile(undefined); // reset selectedFile when error occurs
                      return;
                  }
                } else if (selectedFileType === 'excel') {
                      const worksheet = XLSX.read(fileContent, { type: 'array' });
                      const sheetNames = worksheet.SheetNames;

                      if (!selectedSheetName) {
                          setErrorDialogMessage('Could not upload. SHEETNAME is NULL');
                          setErrorDialogOpen(true);
                          setSelectedSheetName(""); // Reset sheetname
                          return;
                      }

                      if (!sheetNames.includes(selectedSheetName)) {
                          setErrorDialogMessage(`'${selectedSheetName}' not found in the Excel file`);
                          setErrorDialogOpen(true);
                          setSelectedSheetName("");
                          return;
                      }
                      formData.append('sheetName', selectedSheetName);
                  } 
              
                  var result: any = await FetchData({
                      requestType: 'withData',
                      method: 'POST',
                      url: 'file-upload',
                      data: formData,
                      headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'multipart/form-data',
                      },
                  });

                  if (result.status) {
                      setApiResponse(result.data);
                      setDataToEditApiResponse(result.data);
                      navigate('/editflatfile');
                  } else {
                      Logger('info', 'error');
                      setErrorDialogMessage('Error uploading the file');
                      setErrorDialogOpen(true);
                      setSelectedFile(undefined); // reset selectedFile after error
                      setSelectedSheetName("");
                  }
              } 

        if (selectedFileType === 'excel') {
              reader.readAsArrayBuffer(selectedFile);
          } else {
              reader.readAsText(selectedFile);
          }
      };        

  return (
      <div>
          <MenuBar from="fileUpload" />
          <div style={{ display: "flex" }}>
              <div className="rightsidebar-container" style={{ borderRight: "2px solid rgb(224, 224, 224)", height: "100vh" }}>
                  <div>
                      <div><h2 className="header">Select a File Type</h2></div>
                      <div className="icon-container">
                          <div className={`csv-container ${selectedFileType === 'csv' ? 'selected-container' : ''}`} 
                                style={{ display: "flex" }}
                                onClick={() => handleFileType("csv")}>
                              <div className="csv-icon">
                                  <img src={csvFileIcon} className="csv-img" alt="CSV" />
                              </div>
                              <div>
                                  <p>CSV</p>
                              </div>
                          </div>

                          <div className={`json-container ${selectedFileType === 'json' ? 'selected-container' : ''}`} 
                                style={{ display: "flex" }} 
                                onClick={() => handleFileType("json")}>
                              <div className="json-icon">
                                  <img src={jsonFileIcon} className="json-img" alt="JSON" />
                              </div>
                              <div>
                                  <p>JSON</p>
                              </div>
                          </div>

                          <div className={`excel-container ${selectedFileType === 'excel' ? 'selected-container' : ''}`}
                                style={{ display: "flex" }}
                                onClick={() => handleFileType("excel")}>
                              <div className="excel-icon">
                                  <img src={xlsxFileIcon} className="excel-img" alt="Excel" />
                              </div>
                              <div>
                                  <p>EXCEL</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {selectedFileType ? (
                  <div className="FileUploadContainer">
                      <div className="uploadFileTitle">Upload {selectedFileType.toUpperCase()} File</div>
                      <FileDropZone setSelectedFile={handleFileSelect} selectedFile={selectedFile} fileType={selectedFileType} />
                      <div style={{height: "60px"}}>
                          {selectedFileType === "excel" && (
                              <div className="excelContainer">
                                  <label className="sheetNameLabel">ENTER SHEET NAME:</label>
                                  <input
                                      className="sheetNameInput"
                                      placeholder="Sheet Name"
                                      type="text"
                                      value={selectedSheetName}
                                      onChange={(e) => setSelectedSheetName(e.target.value)}
                                  />
                              </div>
                          )}
                      </div>
                      <div className="file-upload-button-container">
                          <Button
                              style={{
                                  textTransform: "none",
                                  color: "#2bb9bb",
                                  border: "2px solid  #2bb9bb",
                                  padding: "5px 20px",
                                  borderRadius: "5px",
                                  height: "40px"
                              }}
                              onClick={handleSubmit}
                          >
                              Upload
                          </Button>
                      </div>
                  </div>
              ) : (
                  <div className="select-container">
                      <p>Select a FileType</p>
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
                          paddingLeft : " 20px",
                          paddingRight: "20px",
                          paddingBottom: "5px"
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
                              '&:hover': {
                                  backgroundColor: " #8c6bb1",
                                  color: "white"
                              }
                          }}
                      >
                          OK
                      </Button>
                  </DialogActions>
              </div>
          </Dialog>
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
