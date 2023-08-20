import { Button, Popover } from "@mui/material";
import "./ConditionalFormatting.css";
import React, { Dispatch, useState } from "react";
import { connect } from "react-redux";
import {
	addTableConditionalFormats,
	deleteTablecf,
	updatecfObjectOptions,
} from "../../redux/ChartPoperties/ChartControlsActions";
import ShortUniqueId from "short-unique-id";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LabelComponent from "./TableChartControlComponents/LabelComponent";
import GradientComponent from "./TableChartControlComponents/GradientComponent";
import RuleComponent from "./TableChartControlComponents/RuleComponent";
import { gradientDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const TableConditionalFormatting = ({
	chartControls,
	tabTileProps,
	chartProperties,
	addTableConditionalFormats,
	updatecfObjectOptions,
	deleteTablecf,
}: any) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var uId = new ShortUniqueId({ length: 8 });

	// tableConditionalFormats;

	const [openPopover, setOpenPopover] = useState(false);
	const [anchorEl, setAnchorEl] = useState<any>();
	const [optionAnchorEl, setOptionAnchorEl] = useState<any>();
	const [openOptionPopover, setOpenOptionPopover] = useState<boolean>(false);
	const [openSubOptions, setOpenSubOptions] = useState<boolean>(false);
	const [selectedColumnName, setSelectedColumnName] = useState<string>("");

	const [gradientMinAndMax, setGradientMinAndMax] = useState<any>({
		min: 0,
		max: 0,
	});

	console.log(chartProperties.properties[propKey].chartAxes);

	const getLabelValues = (columnName: string) => {
		const values = chartControls.properties[propKey].chartData.map((item: any) => {
			return {
				colValue: item[columnName],
				backgroundColor: "white",
				isBold: false,
				isItalic: false,
				isUnderlined: false,
				fontColor: "black",
				isUnique: false,
			};
		});

		return values;
	};

	const getMinAndMaxValue = (column: string) => {
		const valuesArray = chartControls.properties[propKey].chartData.map((el: any) => {
			return el[column];
		});
		const minValue = Math.min(...valuesArray);
		const maxValue = Math.max(...valuesArray);
		setGradientMinAndMax({ min: minValue, max: maxValue });
		return { min: minValue, max: maxValue };
	};

	const onSelectOption = (option: string) => {
		if (option === "rule") {
			addTableConditionalFormats(propKey, {
				id: uId(),
				isLabel: false,
				isGradient: false,
				name: selectedColumnName,
				isCollapsed: false,
				value: [],
			});
		}
		if (option === "gradient") {
			console.log(chartControls);
			addTableConditionalFormats(propKey, {
				id: uId(),
				isLabel: false,
				isGradient: true,
				name: selectedColumnName,
				isCollapsed: false,
				value: [
					{
						id: uId(),
						forNull: true,
						name: "Null",
						value: "null",
						isBold: false,
						isItalic: false,
						isUnderlined: false,
						backgroundColor: "white",
						fontColor: "black",
					},
					{
						id: uId(),
						forNull: false,
						name: "Min",
						value: getMinAndMaxValue(selectedColumnName).min,
						isBold: false,
						isItalic: false,
						isUnderlined: false,
						backgroundColor: "white",
						fontColor: "black",
					},

					{
						id: uId(),
						forNull: false,
						name: "Max",
						value: getMinAndMaxValue(selectedColumnName).max,
						isBold: false,
						isItalic: false,
						isUnderlined: false,
						backgroundColor: "white",
						fontColor: "black",
					},
				],
			});
		}
	};

	const onSelectColumn = (columnName: string) => {
		var canAdd = false;
		if (chartControls.properties[propKey].tableConditionalFormats.length === 0) {
			canAdd = true;
		} else {
			var columnAlreadyExist = chartControls.properties[
				propKey
			].tableConditionalFormats.filter((item: any) => item.name === columnName)[0];
			if (!columnAlreadyExist) {
				canAdd = true;
			}
		}
		let isLabel = false;
		if (canAdd) {
			chartProperties.properties[propKey].chartAxes[1].fields.map((column: any) => {
				if (columnName === column.fieldname) {
					setOpenSubOptions(false);
					isLabel = true;

					addTableConditionalFormats(propKey, {
						isLabel: true,
						name: columnName,
						value: getLabelValues(columnName),
						isCollapsed: false,
						applyCommonStyle: true,
						commonBg: "white",
						commonFontColor: "black",
					});

					setOpenPopover(false);
				}
			});
			if (!isLabel) {
				console.log("its a measure");
				setOpenSubOptions(true);
			}
		} else {
			setOpenSubOptions(false);
		}
	};

	const columnsNames =
		chartControls.properties[propKey].chartData.length > 0
			? Object.keys(chartControls.properties[propKey].chartData[0])
			: [];
	return (
		<div className="optionsInfo">
			<div className="optionDescription" style={{ display: "flex", flexDirection: "column" }}>
				{chartControls.properties[propKey].tableConditionalFormats &&
					chartControls.properties[propKey].tableConditionalFormats.map(
						(format: any, i: number) => {
							return (
								<>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											borderBottom: "2px solid rgba(224,224,224,1)",
											paddingBottom: "10px",
										}}
									>
										<div style={{ display: "flex", marginBottom: "10px" }}>
											<span style={{ fontSize: "16px" }}>{format.name}</span>
											{format.isCollapsed ? (
												<ExpandMoreIcon
													sx={{
														margin: "5px 0px 0px auto",
														fontSize: "16px",
													}}
													onClick={() => {
														console.log(format);
														updatecfObjectOptions(propKey, i, {
															...format,
															isCollapsed: false,
														});
													}}
												/>
											) : (
												<ExpandLessIcon
													sx={{
														margin: "5px 0px 0px auto",
														fontSize: "16px",
													}}
													onClick={() => {
														console.log(format, {
															...format,
															isCollapsed: true,
														});

														updatecfObjectOptions(propKey, i, {
															...format,
															isCollapsed: true,
														});
													}}
												/>
											)}
											<DeleteOutlineOutlinedIcon
												sx={{
													margin: "3px 0px 0px 10px",
													fontSize: "18px",
												}}
												onClick={() => deleteTablecf(propKey, i)}
											/>
										</div>
										{format.isCollapsed ? (
											<>
												{format.isLabel ? (
													<LabelComponent format={format} />
												) : (
													<>
														{format.isGradient ? (
															<>
																<GradientComponent
																	gradientMinMax={
																		gradientMinAndMax
																	}
																	format={format}
																/>
															</>
														) : (
															<RuleComponent format={format} i={i} />
														)}
													</>
												)}
											</>
										) : null}
									</div>
								</>
							);
						}
					)}
			</div>
			<div className="optionDescription">
				<Button
					sx={{
						backgroundColor: "rgb(43, 185, 187)",
						height: "25px",
						width: "100%",
						color: "white",
						textTransform: "none",
						"&:hover": {
							backgroundColor: "rgb(43, 185, 187)",
						},
					}}
					disabled={chartControls.properties[propKey].chartData.length > 0 ? false : true}
					onClick={(e: any) => {
						setAnchorEl(e.currentTarget);
						setOpenPopover(true);
					}}
				>
					Add
				</Button>
			</div>
			{chartControls.properties[propKey].chartData.length > 0 ? null : (
				<p>create a chart first and then add conditional formats</p>
			)}
			<Popover
				open={openPopover}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "center",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "center",
					horizontal: "right",
				}}
				onClose={() => setOpenPopover(false)}
			>
				{columnsNames &&
					columnsNames.map((column: string) => {
						return (
							<>
								<Button
									sx={{
										textTransform: "none",
										color: "grey",
										display: "block",
										padding: "0px 8px",
									}}
									value={column}
									onClick={e => {
										setOptionAnchorEl(e.currentTarget);
										onSelectColumn(column);
										setSelectedColumnName(column);
									}}
								>
									{column}
								</Button>
								{openSubOptions && column === selectedColumnName ? (
									<div
										style={{
											marginLeft: "10px",
											display: "flex",
											flexDirection: "column",
										}}
									>
										<Button
											sx={{
												textTransform: "none",
												color: "grey",
												padding: "0px 8px",
												justifyContent: "left",
											}}
											value="gradient"
											onClick={(e: any) => {
												setOpenOptionPopover(false);
												setOpenPopover(false);
												setOpenSubOptions(false);
												onSelectOption(e.target.value);
											}}
										>
											Gradient
										</Button>
										<Button
											sx={{
												textTransform: "none",
												color: "grey",
												justifyContent: "left",
												padding: "0px 8px",
											}}
											value="rule"
											onClick={(e: any) => {
												setOpenOptionPopover(false);
												setOpenPopover(false);
												setOpenSubOptions(false);

												onSelectOption(e.target.value);
											}}
										>
											Rule
										</Button>
									</div>
								) : null}
							</>
						);
					})}
			</Popover>

			<Popover
				open={openOptionPopover}
				anchorEl={optionAnchorEl}
				anchorOrigin={{
					vertical: "center",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "center",
					horizontal: "right",
				}}
				onClose={() => setOpenOptionPopover(false)}
			>
				<Button
					sx={{
						textTransform: "none",
						color: "grey",
						display: "block",
					}}
					value="gradient"
					onClick={(e: any) => {
						setOpenOptionPopover(false);
						setOpenPopover(false);
						onSelectOption(e.target.value);
					}}
				>
					Gradient
				</Button>
				<Button
					sx={{
						textTransform: "none",
						color: "grey",
						display: "block",
					}}
					value="rule"
					onClick={(e: any) => {
						setOpenOptionPopover(false);
						setOpenPopover(false);
						onSelectOption(e.target.value);
					}}
				>
					Rule
				</Button>
			</Popover>
		</div>
	);
};

const mapStateToProps = (state: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		addTableConditionalFormats: (propKey: string, item: any) =>
			dispatch(addTableConditionalFormats(propKey, item)),
		updatecfObjectOptions: (propKey: string, removeIndex: number, item: any) =>
			dispatch(updatecfObjectOptions(propKey, removeIndex, item)),
		deleteTablecf: (propKey: string, index: number) => dispatch(deleteTablecf(propKey, index)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TableConditionalFormatting);
