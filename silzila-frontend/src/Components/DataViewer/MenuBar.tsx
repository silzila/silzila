// This component is positioned at the top of every page except Login/SignUp
// Used for
// 	- navigating to home
// 	- logging out from account
// 	- saving playbooks
// Some parts from this component are optionally rendered based on the page it is displayed

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { connect, useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { CloseOutlined, HomeRounded } from "@mui/icons-material";
import {
  AcceptRejectDialog,
  NotificationDialog,
  PopUpSpinner,
} from "../CommonFunctions/DialogComponents";
import { useNavigate } from "react-router-dom";
import { updatePlaybookUid } from "../../redux/PlayBook/PlayBookActions";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { resetUser } from "../../redux/UserInfo/isLoggedActions";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  githubAddress,
  githubIssueAddress,
  localEndPoint,
  websiteAddress,
} from "../ServerCall/EnvironmentVariables";
import AboutPopover from "../CommonFunctions/PopOverComponents/AboutPopover";
import PrivacyPopover from "../CommonFunctions/PopOverComponents/PrivacyPopover";
import { Dispatch } from "redux";
import CSS from "csstype";
import { MenubarProps } from "./MenubarInterfaces";

import FetchData from "../ServerCall/FetchData";
import "./dataViewer.css";
import { toggleDashModeInTab } from "../../redux/TabTile/TabActions";
import {
  resetAllStates,
  toggleDashMode,
} from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { resetFlatFileState } from "../../redux/FlatFile/FlatFileStateActions";
import silzilaNewLogo from "../../assets/new_silzilaLogo.svg";
import { AlertColor } from "@mui/material/Alert";
import DownloadPagePopover from "../CommonFunctions/PopOverComponents/DownloadPagePopover";
import { setPageSettings } from "../../redux/PageSettings/DownloadPageSettingsActions";

import RichTreeViewControl from "../Controls/RichTreeViewControl";
import {
  areNestedObjectsEqual,
  ConvertListOfListToRichTreeViewList,
  DeleteAllCookies,
  deletePlaybookDetailsFromSessionStorage,
  GetWorkSpaceDetails,
  isNameAllowed,
} from "../CommonFunctions/CommonFunctions";
import Logger from "../../Logger";
import { ffButtonStyle, ffDialogTitle } from "../Controls/muiStyles";
import Header from "../../Components/Header";
import { fontSize, palette } from "../..";
import HoverButton from "../Buttons/HoverButton";
import { RootState } from "../../redux";
import {
  contentTypes,
  fromRoute,
  messages,
  navigatetTo,
} from "../CommonFunctions/aliases";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const MenuBar = ({
  // props
  from,

  // state
  token,
  tabTileProps,
  tabState,
  tileState,
  playBookState,
  chartProperty,
  chartControl,
  chartGroup,
  dynamicMeasureState,
  calculations,
  sampleRecords,

  //dispatch
  toggleDashMode,
  toggleDashModeInTab,
  updatePlayBookId,
  resetAllStates,
  resetUser,
  resetFlatFileState,
  setPageSettings,
}: MenubarProps) => {
  var showSaveWarning: boolean = false;
  var _ = require("lodash");

  const location = useLocation();
  const state = location.state;

  // Check if the current state of playbook is the same as old state or not
  if (from === fromRoute.dataViewer && playBookState.oldContent) {
    if (
      _.isEqual(tabState, playBookState.oldContent.tabState) &&
      _.isEqual(tileState, playBookState.oldContent.tileState) &&
      _.isEqual(tabTileProps, playBookState.oldContent.tabTileProps) &&
      _.isEqual(chartProperty, playBookState.oldContent.chartProperty) &&
      _.isEqual(chartControl, playBookState.oldContent.chartControl) &&
      _.isEqual(chartGroup, playBookState.oldContent.chartGroup) &&
      _.isEqual(
        dynamicMeasureState,
        playBookState.oldContent.dynamicMeasureState
      )
      // JSON.stringify(tabState) === JSON.stringify(playBookState.oldContent.tabState) &&
      // JSON.stringify(tileState) === JSON.stringify(playBookState.oldContent.tileState) &&
      // JSON.stringify(tabTileProps) ===
      // 	JSON.stringify(playBookState.oldContent.tabTileProps) && //*
      // JSON.stringify(chartProperty) ===
      // 	JSON.stringify(playBookState.oldContent.chartProperty) &&
      // JSON.stringify(chartControl) ===
      // 	JSON.stringify(playBookState.oldContent.chartControl) && //*
      // JSON.stringify(chartGroup) === JSON.stringify(playBookState.oldContent.chartGroup) &&
      // JSON.stringify(dynamicMeasureState) ===
      // JSON.stringify(playBookState.oldContent.dynamicMeasureState)
    ) {
      showSaveWarning = false;
    } else {
      showSaveWarning = true;
    }
  }

  const menuStyle: CSS.Properties = {
    fontSize: "12px",
    padding: "2px 8px",
    margin: 0,
  };

  // values for opening file menu and setting its anchor position
  const [openFileMenu, setOpenFileMenu] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);

  // values for opening help menu and setting its anchor position
  const [openHelpMenu, setOpenHelpMenu] = useState<boolean>(false);
  const [helpAnchorEl, setHelpAnchorEl] = useState<any>(null);

  // values for opening Logout menu and setting its anchor position
  const [logoutModal, setLogoutModal] = useState<boolean>(false);
  const [logoutAnchor, setLogoutAnchor] = useState<any | null>(null);

  // Open / Close about popOver
  const [aboutPopover, setAboutPopover] = useState<boolean>(false);

  // Open / Close privacy popOver
  const [privacyPopover, setPrivacyPopover] = useState<boolean>(false);

  // Save dataset modal Open / Close , playbook name and description
  const [saveModal, setSaveModal] = useState<boolean>(false);
  const [playBookName, setPlayBookName] = useState<string>(
    playBookState?.playBookName
  );
  const [playBookDescription, setPlayBookDescription] = useState<string>(
    playBookState.description
  );

  // Success / Failure alert modal
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [testMessage, setTestMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // value to identify if save action is called because Home icon was clicked
  const [saveFromHomeIcon, setSaveFromHomeIcon] = useState<boolean>(false);
  const [saveFromLogoutIcon, setSaveFromLogoutIcon] = useState<boolean>(false);
  const [
    openSaveCalculationDialogFromHomeIcon,
    setOpenSaveCalculationDialogFromHomeIcon,
  ] = useState(false);

  const [subWorkspaceList, setSubWorkspaceList] = useState<Array<Object>>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [isSubWorkspaceSelected, setIsSubWorkspaceSelected] =
    useState<boolean>(false);
  const [currentClicked, setCurrentClicked] = useState<boolean>(false);
  const [disableEdit, setDisableEdit] = useState<boolean>(false);
  const [currentButtonEvent, setCurrentButtonEvent] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saveFromUpdateProfile, setSaveFromUpdateProfile] =
    useState<boolean>(false);
  useEffect(() => {
    setPlayBookName(playBookState?.playBookName);

    // const getPrivilegeforPlayBook = async () => {
    //   const permissionRes = await FetchData({
    //     requestType: "noData",
    //     method: "GET",
    //     url: `privilege?workspaceId=${state?.parentId}&contentTypeId=${contentTypes.Playbook}&contentId=${playBookState.playBookUid}`,
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   if (permissionRes.status) {
    //     setDisableEdit(
    //       !permissionRes.data.levelId || permissionRes.data.levelId === 3
    //     );
    //   } else return;
    // };

    // if (from === "dataViewer") getPrivilegeforPlayBook();
  }, [playBookState]);

  // useEffect(() => {
  // 	if(selectedWorkspace !== ""){
  // 		setShowWorkSpace(false);
  // 	}
  // },[selectedWorkspace]);

  const cancelAndSaveButtons = () => {
    return (
      <>
        <HoverButton
          sx={{
            ...ffButtonStyle,
            border: `1px solid ${palette.primary.contrastText}`,
            fontSize: fontSize.medium,
            lineHeight: "normal",
          }}
          onClick={() => {
            setSaveModal(false);
          }}
          text="Cancel"
          hoverColor="secondary.contrastText"
          color="primary.contrastText"
          hoverBackgroundColor="primary.contrastText"
          backgroundColor="secondary.contrastText"
          transitionTime="0.2s"
        />
        <HoverButton
          onClick={() => {
            if (saveFromLogoutIcon) setLogoutModal(false);
            // When save button is clicked after a prompt from Home icon or logout action,
            // 	call handleSave function, which uses the old pb_uid to save the state
            // 	Else call savePlaybook function which will create a new playbook

            if (playBookState.playBookUid !== null) {
              handleSave(false);
              // closeDc();
            } else {
              savePlaybook();
              // resetAllStates();
              // close
            }
          }}
          text="Save"
          color="primary.main"
          hoverColor="secondary.contrastText"
          backgroundColor="secondary.contrastText"
          hoverBackgroundColor="primary.main"
          transitionTime="0.2s"
          sx={{
            ...ffButtonStyle,
            border: `1px solid ${palette.primary.main}`,
            fontSize: fontSize.medium,
            lineHeight: "normal",
          }}
        />
        {/* <Button
          sx={{
            ...ffButtonStyle,
            backgroundColor: "#2bb9bb",
            border: "2px solid #2bb9bb",
            fontSize: fontSize.medium,
            color: "white",
            lineHeight: "normal",
            "&:hover": {
              color: palette.primary.contrastText,
            },
          }}
          // variant="contained"
          onClick={() => {
            if (saveFromLogoutIcon) setLogoutModal(false);
            // When save button is clicked after a prompt from Home icon or logout action,
            // 	call handleSave function, which uses the old pb_uid to save the state
            // 	Else call savePlaybook function which will create a new playbook

            if (playBookState.playBookUid !== null) {
              handleSave(false);
              // closeDc();
            } else {
              savePlaybook();
              resetAllStates();
              // close
            }
          }}
        >
          Save
        </Button> */}
      </>
    );
  };
  const handleDirectClick = (selectedWorkspaceID: string, list: any) => {
    // if(!selectedWorkspaceID){
    // 	setSeverity("error");
    // 	setOpenAlert(true);
    // 	setTestMessage("Select a workspace.");
    // 	return;
    // }

    setIsSubWorkspaceSelected(
      !list.find((item: any) => item.id === selectedWorkspaceID)
    );
    setSelectedWorkspace(selectedWorkspaceID);
  };

  const getAllSubworkspace = async () => {
    setLoading(true);
    var result: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `workspaces/tree`,
      headers: { Authorization: `Bearer ${token}` },
    });

    let list = [];

    if (result.status) {
      list = result.data;
      setLoading(false);
    } else {
      Logger("error", result.data.detail);
      setLoading(false);
    }

    setSubWorkspaceList(ConvertListOfListToRichTreeViewList(list));
  };

  useEffect(() => {
    getAllSubworkspace();
  }, []);
  var navigate = useNavigate();
  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  }, [state, navigate]);
  if (!state) {
    return null;
  }

  //The below function can be called from 3 different user actions
  //		1. Save playbook
  //		2. Home button clicked
  //		3. Logout clicked
  function logout() {
    // setTimeout(() => {
    let authToken: any = Cookies.get("authToken");
    if (window.location.protocol === "https:") {
      let decodedToken: any = null;
      if (authToken) {
        decodedToken = jwtDecode(authToken);
      }
      DeleteAllCookies();
      Cookies.remove("authToken");
      Cookies.remove("authToken", {
        path: "/",
        domain: new URL(localEndPoint || "").hostname,
      });
      localStorage.clear();

      if (authToken && decodedToken?.access === "community") {
        localStorage.setItem("isLoggingOut", "true");
        window.history.pushState(null, "", "/");
        window.location.href = `${localEndPoint}auth/community/signin`;
        // window.location.reload();
      } else {
        localStorage.setItem("isLoggingOut", "true");
        window.history.pushState(null, "", "/");
        window.location.href = `${localEndPoint}auth/business/signin`;
        // window.location.reload();
      }
    } else {
      DeleteAllCookies();
      Cookies.remove("authToken");
      Cookies.remove("authToken", {
        path: "/",
        domain: new URL(localEndPoint || "").hostname,
      });
      localStorage.clear();
      localStorage.setItem("isLoggingOut", "true");
      window.history.pushState(null, "", "/");
      resetUser();
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      // window.location.reload();
    }
    // resetUser();
    DeleteAllCookies();
    Cookies.remove("authToken");
    Cookies.remove("authToken", {
      path: "/",
      domain: new URL(localEndPoint || "").hostname,
    });
    localStorage.clear();
    // }, 2000);

    // localStorage.clear();
  }
  const handleSave = async (saveFromHome?: boolean) => {
    setOpenFileMenu(false);

    // check if this playbook already has a name / id
    // 		if Yes, save in the same name
    // 		if No, open modal to save in a new name
    if (playBookState.playBookUid && playBookState.playBookUid !== null) {
      setSaveModal(false);
      var playBookObj = formatPlayBookData();

      /*	PRS	11/JUN/2022	Removed extra '/'	*/
      setLoading(true);
      var result = await FetchData({
        requestType: "withData",
        method: "PUT",
        url: `playbook/${playBookState.playBookUid}?workspaceId=${
          selectedWorkspace || state?.parentId
        }`,
        data: playBookObj,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!result.status) {
        setOpenSaveCalculationDialogFromHomeIcon(false);
        setLoading(false);
        setSeverity("error");
        setOpenAlert(true);
        setTestMessage(result.data.message);
        // setSeverity("error");
        // setOpenAlert(true);
        // setTestMessage(result.data.message);
        // setTimeout(() => {
        // 	setOpenAlert(false);
        // }, 2000);
      } else {
        setOpenSaveCalculationDialogFromHomeIcon(false);
        setLoading(false);
        setSeverity("success");
        setOpenAlert(true);
        setTestMessage("Successfully saved playbook");

        // if (!saveFromHome) {
        //   updatePlayBookId(
        //     result.data.name,
        //     result.data.id,
        //     result.data.description,
        //     result.data.content
        //   );
        // }

        setTimeout(() => {
          setOpenAlert(false);
          if (saveFromHome) {
            deletePlaybookDetailsFromSessionStorage();
            navigate("/");
            resetAllStates();
          } else if (saveFromLogoutIcon) {
            deletePlaybookDetailsFromSessionStorage();
            // resetUser();
            logout();
            // navigate("/login");/
            resetAllStates();
          } else if (saveFromUpdateProfile) {
            deletePlaybookDetailsFromSessionStorage();
            navigate("/update-profile");
            resetAllStates();
          }
        }, 2000);

      }
    } else {
      setSaveModal(true);
    }
  };

  //Format the data to be saved under this playbook
  const formatPlayBookData = () => {
    var playBookObj = {
      name: playBookName.trim(),
      description: "",
      content: {
        tabState,
        tileState,
        tabTileProps,
        chartProperty,
        chartControl,
        chartGroup,
        dynamicMeasureState,
        calculations,
      },
    };

    if (playBookDescription) playBookObj.description = playBookDescription;

    return playBookObj;
  };
  const currPlaybook = () => {
    return {
      tabState,
      tileState,
      tabTileProps,
      chartProperty,
      chartControl,
      chartGroup,
      dynamicMeasureState,
      calculations,
      sampleRecords,
    };
  };
  var fileMenuStyle: CSS.Properties = {
    fontSize: "12px",
    padding: "2px 1rem",
    display: "flex",
  };
  var menuIconStyle: CSS.Properties = { fontSize: "14px" };

  // Save playbook with a new name
  const savePlaybook = async () => {
    let workSpaceId = selectedWorkspace || state?.parentId;

    if (playBookName && selectedWorkspace && state?.parentId) {
      var playBookObj = formatPlayBookData();

      if (!isNameAllowed(playBookObj.name)) {
        setSeverity("warning");
        setOpenAlert(true);
        setTestMessage(messages.playbook.wrongName);
        return;
      }
      setLoading(true);
      var result= await FetchData({
        requestType: "withData",
        method: "POST",
        url: `playbook?workspaceId=${workSpaceId}`,
        data: playBookObj,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (result.status) {
        const data=JSON.parse(result.data);
        updatePlayBookId(
          data.name,
          data.id,
          data.description,
          data.content
        );
        if (
          !saveFromHomeIcon &&
          !saveFromLogoutIcon &&
          !saveFromUpdateProfile
        ) {
          sessionStorage.setItem(
            `pb_id_${data.id}`,
            data.content
          );
        }
        setSaveModal(false);
        setLoading(false);
        setOpenSaveCalculationDialogFromHomeIcon(false);
        setSeverity("success");
        setOpenAlert(true);
        setTestMessage("Successfully saved playbook");
        setTimeout(() => {
          if (saveFromHomeIcon) {
            deletePlaybookDetailsFromSessionStorage();
            if (isSubWorkspaceSelected) {
              let workspaceDetail: any = GetWorkSpaceDetails(
                subWorkspaceList,
                workSpaceId,
                true
              );
              localStorage.setItem("workspaceName", workspaceDetail?.label);
              localStorage.setItem(
                "childWorkspaceName",
                workspaceDetail.subLabel
              );
              localStorage.setItem("parentId", workSpaceId);

              navigate(`/SubWorkspaceDetails/${workSpaceId}`);
              resetAllStates();
            } else {
              let workspaceDetail: any = GetWorkSpaceDetails(
                subWorkspaceList,
                workSpaceId
              );
              localStorage.setItem("workspaceName", workspaceDetail?.label);
              localStorage.setItem("parentId", workSpaceId);
              resetAllStates();
              navigate(`/workspace/${workSpaceId}`);
            }
            //navigate("/");
          } else if (saveFromLogoutIcon) {
            deletePlaybookDetailsFromSessionStorage();
            // resetUser();
            logout();
            // navigate("/login");
            resetAllStates();
          } else if (saveFromUpdateProfile) {
            deletePlaybookDetailsFromSessionStorage();
            navigate("/update-profile");
            resetAllStates();
          } else {
            deletePlaybookDetailsFromSessionStorage();
            navigate(`/dataviewer/${result.data.workspaceId}`, {
              state: {
                mode: "Save",
                parentId: result.data.workspaceId,
                // workspaceName: parentWorkspaceName,
                playbookId: result.data.id,
              },
            });
          }

          /*	PRS	14Nov2024	Fresh save play book*/
          //resetAllStates();
          setOpenAlert(false);
        }, 2000);
      } else {
        setLoading(false);
        setOpenSaveCalculationDialogFromHomeIcon(false);
        setSeverity("error");
        setOpenAlert(true);
        setTestMessage(result.data.message);
        // setTimeout(() => {
        // 	setOpenAlert(false);
        // }, 2000);
      }
    } else {
      setSeverity("error");
      setOpenAlert(true);
      setTestMessage("Provide a Playbook name & select a workspace");

      // setTimeout(() => {
      // 	setOpenAlert(false);
      // }, 2000);
    }
  };
  function saveAndNavigateTo(routeTo: string): void {
    if (disableEdit) {
      if (routeTo === navigatetTo.login) logout();
      else if (routeTo === navigatetTo.updateProfile)
        navigate("/update-profile");
      resetAllStates();
      return;
    }

    if (
      areNestedObjectsEqual(
        sessionStorage.getItem(`pb_id_${playBookState.playBookUid}`) || "",
        JSON.stringify(currPlaybook())
      )
    ) {
      deletePlaybookDetailsFromSessionStorage();
      // sessionStorage.removeItem(`pb_id_${playBookState.playBookUid}`);
      if (routeTo === navigatetTo.login) logout();
      else if (routeTo === navigatetTo.updateProfile)
        navigate("/update-profile");
      resetAllStates();
    } else {
      if (routeTo === navigatetTo.login) setSaveFromLogoutIcon(true);
      else if (routeTo === navigatetTo.updateProfile)
        setSaveFromUpdateProfile(true);
      setOpenSaveCalculationDialogFromHomeIcon(true);
    }
  }
  // const closeDc = async () => {
  // 	var result = await FetchData({
  // 		requestType: "noData",
  // 		method: "POST",
  // 		url: "dc/close-all-dc",
  // 		headers: { Authorization: `Bearer ${token}` },
  // 	});
  // };

  const LogOutMenu = () => {
    return (
      <Menu
        open={logoutModal}
        className="menuPopover"
        anchorEl={logoutAnchor}
        // anchorOrigin={{
        // 	vertical: "bottom",
        // 	horizontal: "left",
        // }}
        // transformOrigin={{
        // 	vertical: "top",
        // 	horizontal: "left",
        // }}
        onClose={() => {
          setLogoutAnchor(null);
          // setAnchorEl(null);
          setLogoutModal(false);
        }}
      >
        <MenuItem
          sx={fileMenuStyle}
          onClick={() => {
            if (from === "dataViewer") {
              if (showSaveWarning || playBookState.playBookUid === null) {
                setSaveFromLogoutIcon(true);
                setSaveModal(true);
                //closeDc();
              } else {
                //closeDc();

                // resetUser();
                logout();
                // navigate("/login");
                resetAllStates();
              }
            }

            if (from === "dataHome" || from === "dataSet") {
              //closeDc();

              // resetUser();
              logout();
              // navigate("/login");
              resetAllStates();
            }
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    );
  };

  // const onDownload = () => {
  // 	if (setCallForDownload) {
  // 		setCallForDownload(true);
  // 	}
  // };

  const FileMenu = () => {
    return (
      <Menu
        open={openFileMenu}
        className="menuPopover"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => {
          setAnchorEl(null);
          setOpenFileMenu(false);
        }}
      >
        <MenuItem
          className={disableEdit ? "disabledOption" : ""}
          sx={fileMenuStyle}
          onClick={() => {
            setSaveFromHomeIcon(false);
            handleSave();
          }}
        >
          Save PlayBook
        </MenuItem>
        <MenuItem
          className={disableEdit ? "disabledOption" : ""}
          sx={fileMenuStyle}
          onClick={() => {
            setOpenFileMenu(false);
            setSaveModal(true);
            playBookState.playBookUid = null; /*	PRS	11/JUN/2022	*/
          }}
        >
          Save Playbook As
        </MenuItem>

        <MenuItem
          sx={fileMenuStyle}
          onClick={() => {
            setOpenFileMenu(false);
            setPageSettings("downloadType", "pdf");
            setPageSettings("openPageSettingPopover", true);
          }}
        >
          Download PDF
        </MenuItem>
        <MenuItem
          sx={fileMenuStyle}
          onClick={() => {
            setOpenFileMenu(false);
            setPageSettings("downloadType", "image");
            setPageSettings("callForDownload", true);
          }}
        >
          Download Image
        </MenuItem>
      </Menu>
    );
  };

  const HelpMenu = () => {
    return (
      <Menu
        open={openHelpMenu}
        className="menuPopover"
        anchorEl={helpAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => {
          setHelpAnchorEl(null);
          setOpenHelpMenu(false);
        }}
      >
        <MenuItem
          sx={fileMenuStyle}
          onClick={() => {
            window.open(websiteAddress, "_blank");
            setOpenHelpMenu(false);
          }}
        >
          <span style={{ flex: 1, marginRight: "1rem" }}>Visit Silzila</span>
          <LaunchRoundedIcon sx={menuIconStyle} />
        </MenuItem>
        <MenuItem
          sx={fileMenuStyle}
          onClick={() => {
            window.open(githubAddress, "_blank");
            setOpenHelpMenu(false);
          }}
        >
          <span style={{ flex: 1, marginRight: "1rem" }}>View Github</span>
          <LaunchRoundedIcon sx={menuIconStyle} />
        </MenuItem>
        <MenuItem
          sx={fileMenuStyle}
          onClick={() => {
            window.open(githubIssueAddress, "_blank");
            setOpenHelpMenu(false);
          }}
        >
          <span style={{ flex: 1, marginRight: "1rem" }}>Report Bug</span>
          <LaunchRoundedIcon sx={menuIconStyle} />
        </MenuItem>
        <MenuItem
          sx={fileMenuStyle}
          onClick={() => {
            window.open(
              "mailto:example@silzila.org?subject=Silzila%20Feedback",
              "_blank"
            );
            setOpenHelpMenu(false);
          }}
        >
          <span style={{ flex: 1, marginRight: "1rem" }}>Provide Feedback</span>
          <EmailOutlinedIcon sx={menuIconStyle} />
        </MenuItem>
        <MenuItem
          sx={fileMenuStyle}
          onClick={() => {
            setAboutPopover(!aboutPopover);
            setOpenHelpMenu(false);
          }}
        >
          <span style={{ flex: 1, marginRight: "1rem" }}>About</span>
          <InfoOutlinedIcon sx={menuIconStyle} />
        </MenuItem>
        <MenuItem
          sx={fileMenuStyle}
          onClick={() => {
            setPrivacyPopover(!privacyPopover);
            setOpenHelpMenu(false);
          }}
        >
          <span style={{ flex: 1, marginRight: "1rem" }}>Privacy</span>
          <PrivacyTipOutlinedIcon sx={menuIconStyle} />
        </MenuItem>
      </Menu>
    );
  };

  const getHomeIcon = () => {
    switch (from) {
      case "dataHome":
        return (
          <div className="menuHomeIcon">
            <HomeRounded fontSize="large" sx={{ color: "#2bb9bb" }} />
          </div>
        );
      case "dataSet":
        return (
          <div
            className="menuHomeIcon"
            onClick={() => {
              navigate("/");
            }}
          >
            <HomeRounded fontSize="large" sx={{ color: "#2bb9bb" }} />
          </div>
        );
      case "fileUpload":
      case "editFlatFile":
      case "saveFlaFile":
        return (
          <div
            className="menuHomeIcon"
            onClick={() => {
              resetFlatFileState();
              navigate("/");
            }}
          >
            <HomeRounded fontSize="large" sx={{ color: "#2bb9bb" }} />
          </div>
        );
      case "dataViewer":
        return (
          <div
            className="menuHomeIcon"
            onClick={() => {
              if (showSaveWarning || playBookState.playBookUid === null) {
                setSaveFromHomeIcon(true);
                setSaveModal(true);
              } else {
                resetAllStates();
                navigate("/");
              }
            }}
          >
            <HomeRounded fontSize="large" sx={{ color: "#2bb9bb" }} />
          </div>
        );
    }
  };

  return (
    <div
      className="dataViewerMenu"
      style={{
        padding: "0.5rem",
        borderBottom:
          from === "fileUpload" ||
          from === "editFlatFile" ||
          from === "saveFlaFile"
            ? "2px solid rgba(224,224,224,1)"
            : "none",
      }}
    >
      <SelectListItem
        render={(xprops: any) => (
          <div
            onMouseOver={() => xprops.setOpen(false)}
            onMouseLeave={() => xprops.setOpen(true)}
          >
            {(xprops.open && from !== "dataHome") ||
            from === "fileUpload" ||
            from === "editFlatFile" ||
            from === "saveFlaFile" ? (
              <>{getHomeIcon()}</>
            ) : (
              <>
                <div
                  onClick={() => {
                    if (from === "dataViewer" && !disableEdit) {
                      // if (showSaveWarning || playBookState.playBookUid === null) {
                      if (
                        !areNestedObjectsEqual(
                          sessionStorage.getItem(
                            `pb_id_${playBookState.playBookUid}`
                          ) || "",
                          JSON.stringify(currPlaybook())
                        )
                      ) {
                        setSaveFromHomeIcon(true);
                        setOpenSaveCalculationDialogFromHomeIcon(true);
                      } else {
                        sessionStorage.removeItem(
                          `pb_id_${playBookState.playBookUid}`
                        );
                        resetAllStates();
                        navigate("/");
                      }
                      // }
                    } else {
                      resetAllStates();
                      navigate("/");
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={silzilaNewLogo}
                    style={{
                      // height: "100%",
                      height: "1.625rem",
                      // width: "3rem",
                      width: "1.625rem",
                      // padding: "4px 4px 4px 6px",
                      // margin: "4px 0px 0px 2px",
                    }}
                    alt="Silzila Home"
                  />
                </div>
              </>
            )}
          </div>
        )}
      />
      {openSaveCalculationDialogFromHomeIcon && from === "dataViewer" ? (
        <AcceptRejectDialog
          open={openSaveCalculationDialogFromHomeIcon}
          closeFunction={() => {
            setOpenSaveCalculationDialogFromHomeIcon(false);
            setSaveFromHomeIcon(false);
            setSaveFromLogoutIcon(false);
            setSaveFromUpdateProfile(false);
          }}
          acceptFunction={() => {
            handleSave(saveFromHomeIcon);
          }}
          rejectFunction={() => {
            deletePlaybookDetailsFromSessionStorage();
            // sessionStorage.removeItem(`pb_id_${playBookState.playBookUid}`);
            setOpenSaveCalculationDialogFromHomeIcon(false);
            saveFromLogoutIcon
              ? logout()
              : navigate(saveFromUpdateProfile ? "/update-profile" : "/");
            // navigate(
            //   saveFromLogoutIcon
            //     ? "/login"
            //     : saveFromUpdateProfile
            //     ? "/update-profile"
            //     : "/"
            // );
            setSaveFromHomeIcon(false);
            setSaveFromLogoutIcon(false);
            setSaveFromUpdateProfile(false);

            resetAllStates();
          }}
          heading="Save playbook"
          messages={[
            {
              text: "Do you want to save the current playbook before closing?",
            },
          ]}
          acceptText="Yes"
          rejectText="No"
          varient="animated"
          rejectButtonStyle={{
            border: "2px solid red",
            color: "red",

            // "&:focus": { backgroundColor: "red", color: "white" },
          }}
          acceptButtonStyle={{
            border: "2px solid #2bb9bb",
            color: "#2bb9bb",
            // "&:focus": {
            //   background: palette.primary.main,
            //   color: palette.secondary.contrastText,
            // },
          }}
          acceptTransition={{
            transitionTime: "0.2s",
            backgroundColor: "secondary.contrastText",
            color: "primary.main",
            hoverBackgroundColor: "primary.main",
            hoverColor: "secondary.contrastText",
          }}
          rejectTransition={{
            transitionTime: "0.2s",
            backgroundColor: "secondary.contrastText",
            color: "red",
            hoverBackgroundColor: "red",
            hoverColor: "secondary.contrastText",
          }}
        />
      ) : (
        <AcceptRejectDialog
          open={openSaveCalculationDialogFromHomeIcon}
          closeFunction={() => {
            setOpenSaveCalculationDialogFromHomeIcon(false);
            setSaveFromHomeIcon(false);
            setSaveFromLogoutIcon(false);
            setSaveFromUpdateProfile(false);
          }}
          rejectFunction={() => {
            setOpenSaveCalculationDialogFromHomeIcon(false);
            setSaveFromHomeIcon(false);
            setSaveFromLogoutIcon(false);
            setSaveFromUpdateProfile(false);
          }}
          acceptFunction={() => {
            deletePlaybookDetailsFromSessionStorage();
            // sessionStorage.removeItem(`pb_id_${playBookState.playBookUid}`);
            setOpenSaveCalculationDialogFromHomeIcon(false);
            saveFromLogoutIcon
              ? logout()
              : navigate(saveFromUpdateProfile ? "/update-profile" : "/");
            // navigate(
            //   saveFromLogoutIcon
            //     ? "/login"
            //     : saveFromUpdateProfile
            //     ? "/update-profile"
            //     : "/"
            // );
            setSaveFromHomeIcon(false);
            setSaveFromLogoutIcon(false);
            setSaveFromUpdateProfile(false);

            resetAllStates();
          }}
          heading={saveFromLogoutIcon ? "Logout" : "Update Profile"}
          messages={[
            {
              text: "Do you want to proceed without saving?",
            },
          ]}
          acceptText="Yes"
          rejectText="No"
          varient="animated"
          rejectButtonStyle={{
            border: "2px solid red",
            color: "red",

            // "&:focus": { backgroundColor: "red", color: "white" },
          }}
          acceptButtonStyle={{
            border: "2px solid #2bb9bb",
            color: "#2bb9bb",
            // "&:focus": {
            //   background: palette.primary.main,
            //   color: palette.secondary.contrastText,
            // },
          }}
          acceptTransition={{
            transitionTime: "0.2s",
            backgroundColor: "secondary.contrastText",
            color: "primary.main",
            hoverBackgroundColor: "primary.main",
            hoverColor: "secondary.contrastText",
          }}
          rejectTransition={{
            transitionTime: "0.2s",
            backgroundColor: "secondary.contrastText",
            color: "red",
            hoverBackgroundColor: "red",
            hoverColor: "secondary.contrastText",
          }}
        />
      )}
      {from === "dataViewer" ? (
        <>
          <div className="menuItemsGroup">
            <div
              className="menuItem"
              onClick={(e) => {
                setOpenFileMenu(!openFileMenu);
                setAnchorEl(e.currentTarget);
              }}
            >
              File
            </div>
            {/* Disabled for now */}
            {/* <div
							className="menuItem"
							onClick={e => {
								setOpenHelpMenu(!openHelpMenu);
								setHelpAnchorEl(e.currentTarget);
							}}
						>
							Help
						</div> */}
          </div>

          {playBookState?.playBookName ? (
            <div
              className="playbookName"
              title={`Playbook Name: ${playBookState?.playBookName}\n${
                playBookState.description !== null
                  ? playBookState.description
                  : ""
              }`}
            >
              {playBookState?.playBookName}
            </div>
          ) : (
            <div className="unsavedPlaybookName" title="Unsaved Playbook">
              Unsaved Playbook
            </div>
          )}

          <div className="userInfo">
            {(tabState.tabs[tabTileProps.selectedTabId].showDash ||
              tabTileProps.showDash) &&
            !disableEdit ? (
              <Select
                size="small"
                sx={{
                  height: "1.5rem",
                  fontSize: "12px",
                  width: "6rem",
                  margin: "auto 0.5rem",
                  boxOutline: "#2bb9bb",
                  paddingTop: "2.8px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2bb9bb", // Sets the outline color when focused
                  },
                }}
                value={tabTileProps.dashMode}
                onChange={(e) => {
                  toggleDashMode(e.target.value);
                  toggleDashModeInTab(
                    tabTileProps.selectedTabId,
                    e.target.value
                  );
                }}
              >
                <MenuItem sx={menuStyle} value="Edit">
                  {/* <AppRegistrationIcon
										sx={{ fontSize: "14px", marginRight: "4px" }}
									/> */}
                  Edit
                </MenuItem>
                <MenuItem sx={menuStyle} value="Present">
                  {/* <SlideshowIcon sx={{ fontSize: "14px", marginRight: "4px" }} /> */}
                  Present
                </MenuItem>
              </Select>
            ) : null}
          </div>
        </>
      ) : null}
      {/* {from === "dataViewer" ? <div style={{ width: "3rem" }}>&nbsp;</div> : null} */}

      {/* {<div
      //  className={
      //     !tabTileProps.showDash && from === "dataViewer"
      //       ? "accountIcon"
      //       : "menuHome"
      //   }
      //   onClick={(e) => {
      //     setLogoutAnchor(e.currentTarget);
      //     setLogoutModal(!logoutModal);
      //   }}
      // >
      //   <AccountCircleIcon sx={{ color: "#666", float: "right" }} />
      </div>} */}
      <div style={{ borderBottom: "none" }}>
        <Header
          from={from}
          saveAndNavigateTo={saveAndNavigateTo}
        />
      </div>
      {/* <!--       <div
      style={{
        paddingLeft: "1rem",
      }}
        className={
          !tabTileProps.showDash && from === "dataViewer"
            ? "accountIcon"
            : "menuHome"
        }
        onClick={(e) => {
          setLogoutAnchor(e.currentTarget);
          setLogoutModal(!logoutModal);
        }}
      >
        <AccountCircleIcon sx={{ color: "#666",  }} />
      </div> --> */}

      <FileMenu />
      <HelpMenu />
      <LogOutMenu />
      <AboutPopover openAbout={aboutPopover} setOpenAbout={setAboutPopover} />
      <PrivacyPopover
        openPrivacy={privacyPopover}
        setOpenPrivacy={setPrivacyPopover}
      />
      {/* A Dialog prompt to save the current playbook. This opens from either of the following actions */}
      {/* 1. When a user clicks save playbook from file menu for the first time */}
      {/* 2. When user clicks Home button and chooses to save changes */}
      {/* 3. When user clicks logout button and chooses to save changes */}
      <Dialog open={saveModal}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // padding: "8px",
            width: "450px",
            height: "auto",
            justifyContent: "center",
          }}
        >
          <div style={{ fontWeight: "bold", textAlign: "center" }}>
            <DialogTitle
              sx={{
                ...ffDialogTitle,
                background: "#424242",
                padding: "16px 20px 16px 24px",
              }}
            >
              <div>
                <b style={{ color: "white" }}>Save Playbook</b>
              </div>

              <CloseOutlined
                onClick={() => {
                  setSaveFromHomeIcon(false);
                  setSaveFromLogoutIcon(false);
                  setSaveModal(false);
                  setOpenSaveCalculationDialogFromHomeIcon(false);
                }}
                style={{ color: "white", paddingLeft: "4px" }}
              />
            </DialogTitle>
            {(saveFromHomeIcon || saveFromLogoutIcon) &&
            playBookState.playBookUid !== null ? null : (
              <div style={{ padding: "0 20px" }}>
                <span style={{ textAlign: "left" }}>Select a workspace</span>
                {
                  <div style={{ maxHeight: "20rem", overflowY: "auto" }}>
                    <RichTreeViewControl
                      currentButtonEvent={currentButtonEvent}
                      directClickedValue={currentClicked}
                      currentWorkspace={state?.parentId}
                      list={subWorkspaceList}
                      title={"Select a Workspace"}
                      // showInPopup={true}
                      handleDirectClick={handleDirectClick}
                    ></RichTreeViewControl>
                  </div>
                }
                <Box
                  sx={{
                    marginTop: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <TextField
                    required
                    size="small"
                    fullWidth
                    label="Playbook Name"
                    sx={{
                      ".MuiOutlinedInput-root": {
                        // height: "2rem",
                      },
                    }}
                    variant="outlined"
                    onChange={(e) => setPlayBookName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        savePlaybook();
                      }
                    }}
                    value={playBookName}
                  />
                  <TextField
                    label="Description"
                    size="small"
                    fullWidth
                    sx={{
                      ".MuiOutlinedInput-root": {
                        // height: "2rem",
                        // fontSize: "12px",
                      },
                    }}
                    onChange={(e) => setPlayBookDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        savePlaybook();
                      }
                    }}
                  />
                  <div
                    style={{
                      paddingBottom: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      columnGap: "1rem",
                    }}
                  >
                    {/* <Button
                      // variant="contained"
                      sx={{
                        ...ffButtonStyle,
                        // backgroundColor: "#af98db",
                        fontSize: fontSize.medium,
                        marginRight: "auto",
                        border: `2px solid ${palette.secondary.light}`,
                        // marginLeft: "1rem",
                        color: palette.secondary.light,
                        lineHeight: "normal",
                        marginLeft: 0,
                        overflow: "hidden",
                        position: "relative",
                        zIndex: 0,
                        transition: "all 0.2s",
                        // "&:hover": {
                        //   color: "white",
                        //   // border: "2px solid #af98db",
                        //   // backgroundColor: palette.secondary.light,
                        // },
                        "&:hover": {
                          color: "white", // Change text color on hover
                        },
                        "&:hover::before": {
                          transform: "translateX(0%)", // Trigger the animation
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background: palette.secondary.light, // The sweeping color
                          zIndex: -1, // Place the background below the text
                          transform: "translateX(-100%)", // Start position
                          transition: "transform 0.2s ease-in-out", // Smooth animation
                        },
                      }}
                      onClick={(e) => {
                        setCurrentClicked(!currentClicked);
                        setCurrentButtonEvent(e);
                      }}
                    >
                      Current Workspace
                    </Button> */}
                    <HoverButton
                      text="Current Workspace"
                      color="secondary.light"
                      hoverColor="secondary.contrastText"
                      backgroundColor="secondary.contastText"
                      hoverBackgroundColor="secondary.light"
                      sx={{
                        ...ffButtonStyle,
                        border: `1px solid ${palette.secondary.light}`,
                        fontSize: fontSize.medium,
                        lineHeight: "normal",
                      }}
                      onClick={(e) => {
                        setCurrentClicked(!currentClicked);
                        setCurrentButtonEvent(e);
                      }}
                      transitionTime="0.2s"
                    />
                    {/* {saveFromHomeIcon || saveFromLogoutIcon ? (
                      <Button
                        // variant="contained"
                        sx={{
                          ...ffButtonStyle,
                          backgroundColor: "red",
                          fontSize: fontSize.medium,
                          color: "white",
                          marginRight: "auto",
                          marginLeft: "2rem",
                          "&:hover": {
                            color: palette.primary.contrastText,
                            border: "2px solid red",
                          },
                        }}
                        onClick={() => {
                          // If discard button is clicked after a logout, reset user info and navigate to login page
                          if (saveFromLogoutIcon) {
                            //closeDc();
                            setSaveFromLogoutIcon(false);
                            resetUser();
                            navigate("/login");
                          }

                          // If discard button is clicked after clicking on Home icon,
                          // go back to dataHome page and reset all states related to playbooks
                          if (saveFromHomeIcon) {
                            // resetAllStates();
                            setSaveFromHomeIcon(false);
                            navigate("/");
                          }
                        }}
                      >
                        Discard
                      </Button>
                    ) : null} */}

                    {/* {saveFromHomeIcon || saveFromLogoutIcon ? (
                      cancelAndSaveButtons()
                    ) : ( */}
                    <Box sx={{ display: "flex", gap: "1rem" }}>
                      {cancelAndSaveButtons()}
                    </Box>
                    {/* )} */}
                  </div>
                </Box>
              </div>
            )}
          </div>
        </div>
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
      {/* render Menu */}
      <DownloadPagePopover />
      <PopUpSpinner show={loading} />
    </div>
  );
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    playBookState: state.playBookState,
    token: state.isLogged.accessToken,
    tabTileProps: state.tabTileProps,
    tabState: state.tabState,
    tileState: state.tileState,
    chartProperty: state.chartProperties,
    chartControl: state.chartControls,
    chartGroup: state.chartFilterGroup,
    dynamicMeasureState: state.dynamicMeasuresState,
    calculations: state.calculations,
    sampleRecords: state.sampleRecords,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    toggleDashMode: (dashMode: string) => dispatch(toggleDashMode(dashMode)),
    toggleDashModeInTab: (tabId: number, dashMode: string) =>
      dispatch(toggleDashModeInTab(tabId, dashMode)),
    updatePlayBookId: (
      playBookName: string,
      playBookUid: string,
      description: string,
      oldContent: string | any
    ) =>
      dispatch(
        updatePlaybookUid(playBookName, playBookUid, description, oldContent)
      ),
    resetAllStates: () => dispatch(resetAllStates()),
    resetUser: () => dispatch(resetUser()),
    resetFlatFileState: () => dispatch(resetFlatFileState()),
    setPageSettings: (option: string, value: any) =>
      dispatch(setPageSettings(option, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
