// Used for setting color scale in Heatmap

import { FormControlLabel, Radio, RadioGroup, TextField, Typography, Popover } from "@mui/material";
import { AlertColor } from "@mui/material/Alert";
import { useState } from "react";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setColorScaleOption } from "../../../redux/ChartPoperties/ChartControlsActions";
import { NotificationDialog } from "../../CommonFunctions/DialogComponents";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import "./ColorSteps.css";

const textFieldInputProps = {
	style: {
		height: "2rem",
		flex: 1,
		padding: "4px 8px 2px 8px",
		width: "4rem",
		fontSize: "14px",
	},
};

const ColorScale = ({
	// state
	chartControls,
	tabTileProps,

	// dispatch
	setColorScaleOption,
}: ChartOptionsProps & {
	setColorScaleOption: (option: string, value: any, propKey: string) => void;
}) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [severity, setSeverity] = useState<AlertColor>("success");
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("Testing alert");
	const [isColorPopoverOpen, setColorPopOverOpen] = useState<boolean>(false);
	const [minOrMaxColor, setminOrMaxColor] = useState<string>("");
	const [color, setColor] = useState<string>("");

	var max = chartControls.properties[propKey].colorScale.max;
	var min = chartControls.properties[propKey].colorScale.min;

	var selectedOption = chartControls.properties[propKey].colorScale.colorScaleType;

	const typographyComponent = (value: string) => {
		return <Typography style={{ fontSize: "14px" }}>{value}</Typography>;
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

	const checkMinMaxValue = () => {
		if (Number(max) === 0) {
			setOpenAlert(true);
			setSeverity("error");
			setTestMessage("Max value can't be zero");
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// 	setTestMessage("");
			// }, 3000);
		} else {
			if (Number(min) >= Number(max)) {
				setOpenAlert(true);
				setSeverity("error");
				setTestMessage("Max value should be grater than Min");
				// setTimeout(() => {
				// 	setOpenAlert(false);
				// 	setTestMessage("");
				// }, 3000);
			}
		}
	};

	return (
		<div className="optionsInfo">
			<div className="optionDescription">SET COLOR SCALE:</div>

			<div className="optionDescription" style={{ marginTop: "5px", marginBottom: "5px" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "5px" }}
				>
					Min Color
				</label>
				<div
					style={{
						height: "1.25rem",
						width: "20%",
						marginLeft: "20px",
						backgroundColor: chartControls.properties[propKey].colorScale.minColor,
						color: chartControls.properties[propKey].colorScale.minColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={e => {
						setColor(chartControls.properties[propKey].colorScale.minColor);
						setminOrMaxColor("minColor");
						setColorPopOverOpen(!isColorPopoverOpen);
					}}
				>
					{"  "}
				</div>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "5px" }}
				>
					Max Color
				</label>
				<div
					style={{
						height: "1.25rem",
						width: "20%",
						marginLeft: "20px",
						backgroundColor: chartControls.properties[propKey].colorScale.maxColor,
						color: chartControls.properties[propKey].colorScale.maxColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={e => {
						setColor(chartControls.properties[propKey].colorScale.maxColor);

						setminOrMaxColor("maxColor");
						setColorPopOverOpen(!isColorPopoverOpen);
					}}
				>
					{"  "}
				</div>
			</div>
			<div className="optionDescription">SET MIN MAX VALUES</div>

			<div className="colorScaleContainer">
				<RadioGroup
					aria-labelledby="demo-controlled-radio-buttons-group"
					name="controlled-radio-buttons-group"
					onChange={e => {
						setColorScaleOption("colorScaleType", e.target.value, propKey);
					}}
				>
					<FormControlLabel
						value="Automatic"
						checked={selectedOption === "Automatic" ? true : false}
						control={RadioBtn()}
						label={typographyComponent("Automatic")}
					/>
					<FormControlLabel
						value="Manual"
						checked={selectedOption === "Manual" ? true : false}
						control={RadioBtn()}
						label={typographyComponent("Manual")}
					/>
				</RadioGroup>

				{selectedOption === "Manual" ? (
					<div>
						<div className="inputFieldContainer">
							<TextField
								type="number"
								value={min}
								onChange={e => {
									setColorScaleOption("min", e.target.value, propKey);
								}}
								label="Min"
								InputLabelProps={{ shrink: true }}
								inputProps={{ ...textFieldInputProps }}
								onBlur={checkMinMaxValue}
							/>
							<TextField
								type="number"
								value={max}
								onChange={e => {
									setColorScaleOption("max", e.target.value, propKey);
								}}
								label="Max"
								InputLabelProps={{ shrink: true }}
								inputProps={{ ...textFieldInputProps }}
								onBlur={checkMinMaxValue}
							/>
						</div>
					</div>
				) : null}
			</div>

			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				onClick={() => setColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={color}
						className="sketchPicker"
						width="16rem"
						// styles={{ padding: "0" }}
						onChangeComplete={(color: any) => {
							setColorScaleOption(minOrMaxColor, color.hex, propKey);
						}}
						onChange={(color: any) =>
							setColorScaleOption(minOrMaxColor, color.hex, propKey)
						}
						disableAlpha
					/>
				</div>
			</Popover>

			<NotificationDialog
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
				severity={severity}
				testMessage={testMessage}
				openAlert={openAlert}
			/>
		</div>
	);
};

const mapStateToProps = (state: ChartOptionsStateProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setColorScaleOption: (option: string, value: any, propKey: string) =>
			dispatch(setColorScaleOption(option, value, propKey)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorScale);
