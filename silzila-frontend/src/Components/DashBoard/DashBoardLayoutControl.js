// This page controls the size / aspect ratio of dashboard
// Save all state related to this component in tabState > dashLayout

import {
	Button,
	FormControlLabel,
	InputLabel,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import {
	setAspectRatioHeight,
	setAspectRatioWidth,
	setCustomHeight,
	setCustomWidth,
	setDashLayout,
	setDashLayoutSelectedOptionForAuto,
	setDashLayoutSelectedOptionForFixed,
	setCustomRMinWidth,
	setCustomRMinHeight,
	setCustomRMaxWidth,
	setCustomRMaxHeight,
} from "../../redux/TabTile/actionsTabTile";

const DashBoardLayoutControl = ({
	//state
	tabTileProps,
	tabState,
	//dispatch
	setDashLayout,
	setDashLayoutSelectedOptionForAuto,
	setDashLayoutSelectedOptionForFixed,
	setAspectRatioHeight,
	setAspectRatioWidth,
	setCustomHeight,
	setCustomWidth,
	setCustomRMinWidth,
	setCustomRMinHeight,
	setCustomRMaxWidth,
	setCustomRMaxHeight,
}) => {
	const [isAutoSelected, setIsAutoSelected] = useState(true);
	const [isFixedSelected, setIsFixedSelected] = useState(false);
	const [isCoustomSelected, setIsCustomSelected] = useState(false);
	const [isCoustomRangeSelected, setIsCustomRangeSelected] = useState(false);

	// console.log(tabTileProps.selectedTabId);
	const tabId = tabTileProps.selectedTabId;
	const fixedOption = tabState.tabs[tabId].dashLayout.selectedOptionForFixed;
	const autoOption = tabState.tabs[tabId].dashLayout.selectedOptionForAuto;
	let customHeight = tabState.tabs[tabId].dashLayout.custom.height;
	let customWidth = tabState.tabs[tabId].dashLayout.custom.width;

	// console.log(tabState.tabs[tabId].dashLayout.dashboardLayout);
	const textFieldInputProps = {
		style: {
			height: "2rem",
			flex: 1,
			padding: "4px 8px 2px 8px",
			width: "4rem",
			fontSize: "14px",
		},
	};

	const RadioBtn = () => {
		return (
			<Radio
				sx={{
					"& .MuiSvgIcon-root": {
						fontSize: 18,
					},
				}}
			/>
		);
	};
	const whenPageSizeisAuto = () => {
		return (
			<div style={{ margin: "10px", padding: "0px 5px 5px 16px" }}>
				<RadioGroup
					aria-labelledby="demo-controlled-radio-buttons-group"
					name="controlled-radio-buttons-group"
					onChange={(e) => {
						setDashLayoutSelectedOptionForAuto(tabId, e.target.value);
					}}
				>
					<FormControlLabel
						value="Full Screen"
						checked={autoOption === "Full Screen" ? true : false}
						control={RadioBtn()}
						label={typographyComponent("Full Screen")}
					/>
					<FormControlLabel
						value="Aspect Ratio"
						checked={autoOption === "Aspect Ratio" ? true : false}
						control={RadioBtn()}
						label={typographyComponent("Aspect Ratio")}
					/>
				</RadioGroup>
				{tabState.tabs[tabTileProps.selectedTabId].dashLayout.selectedOptionForAuto ===
				"Aspect Ratio" ? (
					<div
						style={{
							display: "flex",
							columnGap: "20px",
							padding: "1rem",
						}}
					>
						<TextField
							type="number"
							label="Width"
							value={tabState.tabs[tabId].dashLayout.aspectRatio.width}
							onChange={(e) => setAspectRatioWidth(tabId, e.target.value)}
							InputLabelProps={{ shrink: true }}
							inputProps={{ ...textFieldInputProps, min: 1 }}
						/>
						<TextField
							type="number"
							value={tabState.tabs[tabId].dashLayout.aspectRatio.height}
							onChange={(e) => setAspectRatioHeight(tabId, e.target.value)}
							label="Height"
							InputLabelProps={{ shrink: true }}
							minvalue
							inputProps={{ ...textFieldInputProps, min: 1 }}
						/>
					</div>
				) : null}
			</div>
		);
	};

	const typographyComponent = (value) => {
		return <Typography style={{ fontSize: "14px" }}>{value}</Typography>;
	};

	// When user chooses a custom pixel size for the dashboard area
	// For future versions

	// const dashSizeOptionBtn = () => {
	// 	return (
	// 		<div className="radioButtons" style={{ marginTop: "10px" }}>
	// 			<div
	// 				className={
	// 					tabState.tabs[tabId].dashLayout.dashboardLayout === "Auto"
	// 						? "radioButtonSelected"
	// 						: "radioButton"
	// 				}
	// 				onClick={() => {
	// 					setIsAutoSelected(true);
	// 					setIsFixedSelected(false);
	// 					setDashLayout(tabId, "Auto");
	// 				}}
	// 			>
	// 				Auto
	// 			</div>
	// 			<div
	// 				className={
	// 					tabState.tabs[tabId].dashLayout.dashboardLayout === "Fixed"
	// 						? "radioButtonSelected"
	// 						: "radioButton"
	// 				}
	// 				onClick={() => {
	// 					setIsFixedSelected(true);
	// 					setIsAutoSelected(false);
	// 					setDashLayout(tabId, "Fixed");
	// 				}}
	// 			>
	// 				Fixed
	// 			</div>
	// 		</div>
	// 	);
	// };

	// const whenPagesizeIsFixed = () => {
	// 	return (
	// 		<>
	// 			<FormControlLabel
	// 				key="FHD"
	// 				value="Full HD"
	// 				checked={fixedOption === "Full HD" ? true : false}
	// 				control={RadioBtn()}
	// 				label={typographyComponent("Full HD (0980 x 1080)")}
	// 			/>
	// 			<FormControlLabel
	// 				key="HD"
	// 				value="HD"
	// 				checked={fixedOption === "HD" ? true : false}
	// 				control={RadioBtn()}
	// 				label={typographyComponent("HD (0980 x 1080)")}
	// 			/>
	// 			<FormControlLabel
	// 				key="WS"
	// 				value="Wide Screen"
	// 				checked={fixedOption === "Wide Screen" ? true : false}
	// 				control={RadioBtn()}
	// 				label={typographyComponent("Wide Screen (0980 x 1080)")}
	// 			/>
	// 			<FormControlLabel
	// 				key="C"
	// 				value="Custom"
	// 				checked={fixedOption === "Custom" ? true : false}
	// 				control={RadioBtn()}
	// 				label={typographyComponent("Custom")}
	// 			/>
	// 			{isCoustomSelected ? (
	// 				<div
	// 					style={{ display: "flex", columnGap: "20px", padding: "8px 2px 8px 12px" }}
	// 				>
	// 					<TextField
	// 						type="number"
	// 						value={customHeight}
	// 						onChange={(e) => setCustomHeight(tabId, e.target.value)}
	// 						label="Height"
	// 						InputLabelProps={{ shrink: true }}
	// 						inputProps={{ ...textFieldInputProps, min: 1 }}
	// 					/>
	// 					<TextField
	// 						type="number"
	// 						value={customWidth}
	// 						onChange={(e) => setCustomWidth(tabId, e.target.value)}
	// 						label="Width"
	// 						InputLabelProps={{ shrink: true }}
	// 						inputProps={{ ...textFieldInputProps, min: 1 }}
	// 					/>
	// 				</div>
	// 			) : null}
	// 			<FormControlLabel
	// 				sx={{ fontSize: "10px" }}
	// 				key="CR"
	// 				value="Custom Range"
	// 				checked={fixedOption === "Custom Range" ? true : false}
	// 				control={RadioBtn()}
	// 				label={typographyComponent("Custom Range")}
	// 			/>
	// 			{isCoustomRangeSelected ? (
	// 				<div
	// 					style={{
	// 						display: "flex",
	// 						flexDirection: "column",
	// 						rowGap: "10px",
	// 						padding: "8px 2px 8px 12px",
	// 					}}
	// 				>
	// 					<InputLabel sx={{ float: "left", flex: 1, fontSize: "14px" }}>
	// 						Min
	// 					</InputLabel>
	// 					<div style={{ flex: 1, display: "flex", columnGap: "20px" }}>
	// 						<TextField
	// 							type="number"
	// 							value={tabState.tabs[tabId].dashLayout.customRange.minHeight}
	// 							onChange={(e) => setCustomRMinHeight(tabId, e.target.value)}
	// 							label="Height"
	// 							InputLabelProps={{ shrink: true }}
	// 							inputProps={{ ...textFieldInputProps, min: 1 }}
	// 						/>
	// 						<TextField
	// 							type="number"
	// 							value={tabState.tabs[tabId].dashLayout.customRange.minWidth}
	// 							onChange={(e) => setCustomRMinWidth(tabId, e.target.value)}
	// 							label="Width"
	// 							InputLabelProps={{ shrink: true }}
	// 							inputProps={{ ...textFieldInputProps, min: 1 }}
	// 						/>
	// 					</div>
	// 					<InputLabel sx={{ float: "left", flex: 1, fontSize: "14px" }}>
	// 						Max
	// 					</InputLabel>
	// 					<div style={{ flex: 1, display: "flex", columnGap: "20px" }}>
	// 						<TextField
	// 							type="number"
	// 							value={tabState.tabs[tabId].dashLayout.customRange.maxHeight}
	// 							onChange={(e) => setCustomRMaxHeight(tabId, e.target.value)}
	// 							label="Height"
	// 							InputLabelProps={{ shrink: true }}
	// 							inputProps={{ ...textFieldInputProps, min: 1 }}
	// 						/>
	// 						<TextField
	// 							type="number"
	// 							value={tabState.tabs[tabId].dashLayout.customRange.maxWidth}
	// 							onChange={(e) => setCustomRMaxWidth(tabId, e.target.value)}
	// 							label="Width"
	// 							InputLabelProps={{ shrink: true }}
	// 							inputProps={{ ...textFieldInputProps, min: 1 }}
	// 						/>
	// 					</div>
	// 				</div>
	// 			) : null}
	// 		</>
	// 	);
	// };
	// const onToggle = (value) => {
	// 	setDashLayoutSelectedOptionForFixed(tabId, value);
	// 	if (value === "Custom") {
	// 		setIsCustomSelected(true);
	// 		setIsCustomRangeSelected(false);
	// 	} else if (value === "Custom Range") {
	// 		setIsCustomSelected(false);
	// 		setIsCustomRangeSelected(true);
	// 	} else {
	// 		setIsCustomSelected(false);
	// 		setIsCustomRangeSelected(false);
	// 	}
	// };

	return (
		<div className="dashboardLayoutControl">
			<div className="axisTitle">Dashboard Size</div>
			{/* {dashSizeOptionBtn()} */}
			{whenPageSizeisAuto()}

			{/* {isAutoSelected ? (
				whenPageSizeisAuto()
			) : (
				<div style={{ padding: "0px 5px 5px 16px", textAlign: "left" }}>
					<RadioGroup
						aria-labelledby="demo-controlled-radio-buttons-group"
						name="controlled-radio-buttons-group"
						sx={{ margin: "10px", fontSize: "10px" }}
						onChange={(e) => onToggle(e.target.value)}
					>
						{whenPagesizeIsFixed()}
					</RadioGroup>
				</div>
			)} */}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chartControl: state.chartControls,
		tabTileProps: state.tabTileProps,
		tabState: state.tabState,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setDashLayout: (tabId, value) => dispatch(setDashLayout(tabId, value)),
		setDashLayoutSelectedOptionForAuto: (tabId, value) =>
			dispatch(setDashLayoutSelectedOptionForAuto(tabId, value)),
		setDashLayoutSelectedOptionForFixed: (tabId, value) =>
			dispatch(setDashLayoutSelectedOptionForFixed(tabId, value)),
		setAspectRatioHeight: (tabId, value) => dispatch(setAspectRatioHeight(tabId, value)),
		setAspectRatioWidth: (tabId, value) => dispatch(setAspectRatioWidth(tabId, value)),
		setCustomHeight: (tabId, value) => dispatch(setCustomHeight(tabId, value)),
		setCustomWidth: (tabId, value) => dispatch(setCustomWidth(tabId, value)),
		setCustomRMinWidth: (tabId, value) => dispatch(setCustomRMinWidth(tabId, value)),
		setCustomRMinHeight: (tabId, value) => dispatch(setCustomRMinHeight(tabId, value)),
		setCustomRMaxWidth: (tabId, value) => dispatch(setCustomRMaxWidth(tabId, value)),
		setCustomRMaxHeight: (tabId, value) => dispatch(setCustomRMaxHeight(tabId, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoardLayoutControl);
