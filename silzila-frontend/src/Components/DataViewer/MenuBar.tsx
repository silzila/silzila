// This component is positioned at the top of every page except Login/SignUp
// Used for
// 	- navigating to home
// 	- logging out from account
// 	- saving playbooks
// Some parts from this component are optionally rendered based on the page it is displayed

import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Dialog, Menu, MenuItem, Select, TextField } from "@mui/material";
import { HomeRounded } from "@mui/icons-material";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
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
	websiteAddress,
} from "../ServerCall/EnvironmentVariables";
import AboutPopover from "../CommonFunctions/PopOverComponents/AboutPopover";
import PrivacyPopover from "../CommonFunctions/PopOverComponents/PrivacyPopover";
import { Dispatch } from "redux";
import CSS from "csstype";
import { MapStateProps, MenubarProps } from "./MenubarInterfaces";

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

	// Check if the current state of playbook is the same as old state or not
	if (from === "dataViewer" && playBookState.oldContent) {
		if (
			_.isEqual(tabState, playBookState.oldContent.tabState) &&
			_.isEqual(tileState, playBookState.oldContent.tileState) &&
			_.isEqual(tabTileProps, playBookState.oldContent.tabTileProps) &&
			_.isEqual(chartProperty, playBookState.oldContent.chartProperty) &&
			_.isEqual(chartControl, playBookState.oldContent.chartControl) &&
			_.isEqual(chartGroup, playBookState.oldContent.chartGroup) &&
			_.isEqual(dynamicMeasureState, playBookState.oldContent.dynamicMeasureState)
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

	const menuStyle: CSS.Properties = { fontSize: "12px", padding: "2px 8px", margin: 0 };

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
	const [playBookName, setPlayBookName] = useState<string>(playBookState.playBookName);
	const [playBookDescription, setPlayBookDescription] = useState<string>(
		playBookState.description
	);

	// Success / Failure alert modal
	const [severity, setSeverity] = useState<AlertColor>("success");
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("");

	// value to identify if save action is called because Home icon was clicked
	const [saveFromHomeIcon, setSaveFromHomeIcon] = useState<boolean>(false);
	const [saveFromLogoutIcon, setSaveFromLogoutIcon] = useState<boolean>(false);

	var navigate = useNavigate();

	//The below function can be called from 3 different user actions
	//		1. Save playbook
	//		2. Home button clicked
	//		3. Logout clicked
	const handleSave = async () => {
		setOpenFileMenu(false);

		// check if this playbook already has a name / id
		// 		if Yes, save in the same name
		// 		if No, open modal to save in a new name
		if (playBookState.playBookUid !== null) {
			setSaveModal(false);
			var playBookObj = formatPlayBookData();
			/*	PRS	11/JUN/2022	Removed extra '/'	*/
			var result: any = await FetchData({
				requestType: "withData",
				method: "PUT",
				url: `playbook/${playBookState.playBookUid}`,
				data: playBookObj,
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!result.status) {
			} else {
				setSeverity("success");
				setOpenAlert(true);
				setTestMessage("Successfully saved playbook");

				updatePlayBookId(
					result.data.name,
					result.data.id,
					result.data.description,
					result.data.content
				);

				setTimeout(() => {
					setOpenAlert(false);
					if (saveFromHomeIcon) {
						navigate("/datahome");
						resetAllStates();
					}

					if (saveFromLogoutIcon) {
						resetUser();
						navigate("/login");
					}
				}, 2000);

				console.log(JSON.stringify(result.data.content["tabTileProps"], null, "\t"));
				console.log(JSON.stringify(tabTileProps, null, "\t"));
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
			},
		};

		if (playBookDescription) playBookObj.description = playBookDescription;

		return playBookObj;
	};

	var fileMenuStyle: CSS.Properties = { fontSize: "12px", padding: "2px 1rem", display: "flex" };
	var menuIconStyle: CSS.Properties = { fontSize: "14px" };

	// Save playbook with a new name
	const savePlaybook = async () => {
		if (playBookName) {
			var playBookObj = formatPlayBookData();

			var result: any = await FetchData({
				requestType: "withData",
				method: "POST",
				url: "playbook/",
				data: playBookObj,
				headers: { Authorization: `Bearer ${token}` },
			});

			if (result.status) {
				updatePlayBookId(
					result.data.name,
					result.data.pb_uid,
					result.data.description,
					result.data.content
				);

				setSaveModal(false);

				setSeverity("success");
				setOpenAlert(true);
				setTestMessage("Successfully saved playbook");
				setTimeout(() => {
					if (saveFromHomeIcon) {
						navigate("/datahome");
						resetAllStates();
					}
					if (saveFromLogoutIcon) {
						navigate("/login");
						resetUser();
					}
					setOpenAlert(false);
				}, 2000);
			} else {
				setSeverity("error");
				setOpenAlert(true);
				setTestMessage(result.data.detail);
				// setTimeout(() => {
				// 	setOpenAlert(false);
				// }, 2000);
			}
		} else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Provide a Playbook name");

			// setTimeout(() => {
			// 	setOpenAlert(false);
			// }, 2000);
		}
	};

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

								resetUser();
								navigate("/login");
							}
						}

						if (from === "dataHome" || from === "dataSet") {
							//closeDc();

							resetUser();
							navigate("/login");
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
					sx={fileMenuStyle}
					onClick={() => {
						setSaveFromHomeIcon(false);
						handleSave();
					}}
				>
					Save PlayBook
				</MenuItem>
				<MenuItem
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
						<HomeRounded sx={{ color: "grey" }} />
					</div>
				);
			case "dataSet":
				return (
					<div
						className="menuHomeIcon"
						onClick={() => {
							navigate("/dataHome");
						}}
					>
						<HomeRounded sx={{ color: "grey" }} />
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
							navigate("/dataHome");
						}}
					>
						<ArrowBackIcon sx={{ color: "grey" }} />
					</div>
				);
			case "dataViewer":
				return (
					<div
						className="menuHomeIcon"
						onClick={() => {
							console.log(showSaveWarning, playBookState.playBookUid);
							if (showSaveWarning || playBookState.playBookUid === null) {
								setSaveFromHomeIcon(true);
								setSaveModal(true);
							} else {
								resetAllStates();
								navigate("/dataHome");
							}
						}}
					>
						<HomeRounded sx={{ color: "#666" }} />
					</div>
				);
		}
	};

	return (
		<div
			className="dataViewerMenu"
			style={{
				borderBottom:
					from === "fileUpload" || from === "editFlatFile" || from === "saveFlaFile"
						? "2px solid rgba(224,224,224,1)"
						: "none",
			}}
		>
			<SelectListItem
				render={(xprops: any) => (
					<div
						onMouseOver={() => xprops.setOpen(true)}
						onMouseLeave={() => xprops.setOpen(false)}
					>
						{(xprops.open && from !== "dataHome") ||
						from === "fileUpload" ||
						from === "editFlatFile" ||
						from === "saveFlaFile" ? (
							<>{getHomeIcon()}</>
						) : (
							<>
								<img
									src={silzilaNewLogo}
									style={{
										// height: "100%",
										height: "80%",
										// width: "3rem",
										width: "2.5rem",
										padding: "4px 4px 4px 6px",
										margin: "4px 0px 0px 2px",
										backgroundColor: "white",
									}}
									alt="Silzila Home"
								/>
							</>
						)}
					</div>
				)}
			/>

			{from === "dataViewer" ? (
				<>
					<div className="menuItemsGroup">
						<div
							className="menuItem"
							onClick={e => {
								setOpenFileMenu(!openFileMenu);
								setAnchorEl(e.currentTarget);
							}}
						>
							File
						</div>
						<div
							className="menuItem"
							onClick={e => {
								setOpenHelpMenu(!openHelpMenu);
								setHelpAnchorEl(e.currentTarget);
							}}
						>
							Help
						</div>
					</div>

					<div
						className="playbookName"
						title={`Playbook Name: ${playBookState.playBookName}\n${
							playBookState.description !== null ? playBookState.description : ""
						}`}
					>
						{playBookState.playBookName}
					</div>

					<div className="userInfo">
						{tabState.tabs[tabTileProps.selectedTabId].showDash ||
						tabTileProps.showDash ? (
							<Select
								size="small"
								sx={{
									height: "1.5rem",
									fontSize: "12px",
									width: "6rem",
									margin: "auto 0.5rem",
								}}
								value={tabTileProps.dashMode}
								onChange={e => {
									toggleDashMode(e.target.value);
									toggleDashModeInTab(tabTileProps.selectedTabId, e.target.value);
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

			<div
				className={
					!tabTileProps.showDash && from === "dataViewer" ? "accountIcon" : "menuHome"
				}
				onClick={e => {
					setLogoutAnchor(e.currentTarget);
					setLogoutModal(!logoutModal);
				}}
			>
				<AccountCircleIcon sx={{ color: "#666", float: "right" }} />
			</div>
			<FileMenu />
			<HelpMenu />
			<LogOutMenu />
			<AboutPopover openAbout={aboutPopover} setOpenAbout={setAboutPopover} />
			<PrivacyPopover openPrivacy={privacyPopover} setOpenPrivacy={setPrivacyPopover} />
			{/* A Dialog prompt to save the current playbook. This opens from either of the following actions */}
			{/* 1. When a user clicks save playbook from file menu for the first time */}
			{/* 2. When user clicks Home button and chooses to save changes */}
			{/* 3. When user clicks logout button and chooses to save changes */}
			<Dialog open={saveModal}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						padding: "8px",
						width: "400px",
						height: "auto",
						justifyContent: "center",
					}}
				>
					<div style={{ fontWeight: "bold", textAlign: "center" }}>
						<div style={{ display: "flex" }}>
							<span style={{ flex: 1 }}>Save playbook</span>

							<CloseRounded
								style={{ margin: "0.25rem" }}
								onClick={() => {
									setSaveFromHomeIcon(false);
									setSaveFromLogoutIcon(false);
									setSaveModal(false);
								}}
							/>
						</div>
						<p></p>

						{(saveFromHomeIcon || saveFromLogoutIcon) &&
						playBookState.playBookUid !== null ? null : (
							<div style={{ padding: "0 50px" }}>
								<TextField
									required
									size="small"
									fullWidth
									label="Playbook Name"
									variant="outlined"
									onChange={e => setPlayBookName(e.target.value)}
									onKeyDown={e => {
										if (e.key === "Enter") {
											savePlaybook();
										}
									}}
									value={playBookName}
								/>
								<br />
								<br />
								<TextField
									label="Description"
									size="small"
									fullWidth
									onChange={e => setPlayBookDescription(e.target.value)}
									onKeyDown={e => {
										if (e.key === "Enter") {
											savePlaybook();
										}
									}}
								/>
							</div>
						)}
					</div>
					<div
						style={{ padding: "15px", justifyContent: "space-around", display: "flex" }}
					>
						{saveFromHomeIcon || saveFromLogoutIcon ? (
							<Button
								style={{ backgroundColor: "red", float: "right" }}
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
										navigate("/datahome");
									}
								}}
								variant="contained"
							>
								Discard
							</Button>
						) : null}

						<Button
							style={{ backgroundColor: "#2bb9bb" }}
							variant="contained"
							onClick={() => {
								if (saveFromLogoutIcon) setLogoutModal(false);
								// When save button is clicked after a prompt from Home icon or logout action,
								// 	call handleSave function, which uses the old pb_uid to save the state
								// 	Else call savePlaybook function which will create a new playbook

								if (playBookState.playBookUid !== null) {
									handleSave();
									// closeDc();
								} else {
									savePlaybook();
									// close
								}
							}}
						>
							Save
						</Button>
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
		) => dispatch(updatePlaybookUid(playBookName, playBookUid, description, oldContent)),
		resetAllStates: () => dispatch(resetAllStates()),
		resetUser: () => dispatch(resetUser()),
		resetFlatFileState: () => dispatch(resetFlatFileState()),
		setPageSettings: (option: string, value: any) => dispatch(setPageSettings(option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
