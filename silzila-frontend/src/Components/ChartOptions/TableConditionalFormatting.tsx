import { Button, Popover } from "@mui/material";
import "./ConditionalFormatting.css";
import React, { Dispatch, useEffect, useState } from "react";
import { connect } from "react-redux";
import {
	addTableConditionalFormats,
	deleteTablecf,
	updatecfObjectOptions,
} from "../../redux/ChartPoperties/ChartControlsActions";
import ShortUniqueId from "short-unique-id";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LabelComponent from "./TableChartControlComponents/LabelComponent";
import GradientComponent from "./TableChartControlComponents/GradientComponent";
import RuleComponent, {
	addConditionButtonStyle,
} from "./TableChartControlComponents/RuleComponent";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const subMenuItemStyle = {
	textTransform: "none",
	color: "grey",
	display: "block",
};

const arrowIconStyle = {
	margin: "5px 0px 0px auto",
	fontSize: "16px",
};

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

	const [anchorEl, setAnchorEl] = useState<any>();
	const [optionAnchorEl, setOptionAnchorEl] = useState<any>();
	const [selectedColumnName, setSelectedColumnName] = useState<string>("");
	const [menu, setMenu] = useState<any>([]);
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [openSubMenu, setOpenSubMenu] = useState<boolean>(false);

	const [gradientMinAndMax, setGradientMinAndMax] = useState<any>({
		min: 0,
		max: 0,
	});

	const getLabelValues = (columnName: string) => {
		const values = chartControls.properties[propKey].chartData.map((item: any) => {
			return {
				colValue: item[columnName],
				backgroundColor: "white",
				isBold: false,
				isItalic: false,
				isUnderlined: false,
				fontColor: "black",
				// isUnique: false,
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

	const onSelectColumn = (column: any) => {
		var canAdd = false;
		if (chartControls.properties[propKey].tableConditionalFormats.length === 0) {
			canAdd = true;
		} else {
			var columnAlreadyExist = chartControls.properties[
				propKey
			].tableConditionalFormats.filter((item: any) => item.name === column.columnName)[0];
			if (!columnAlreadyExist) {
				canAdd = true;
			}
		}

		if (canAdd) {
			if (column.isLabel) {
				addTableConditionalFormats(propKey, {
					isLabel: column.isLabel,
					name: column.columnName,
					value: column.isLabel ? getLabelValues(column.columnName) : "",
					isCollapsed: false,
					backgroundColor: "white",
					fontColor: "black",
					isItalic: false,
					isUnderlined: false,
					isBold: false,
				});
				setOpenMenu(false);
			} else {
				setOpenSubMenu(true);
			}
		}
	};

	useEffect(() => {
		if (chartControls.properties[propKey].chartData.length > 0) {
			const zones = chartProperties.properties[propKey].chartAxes;

			const output = zones.reduce((accumulator: any, zone: any) => {
				accumulator = accumulator.concat(
					zone.fields.map((value: any) => ({
						isLabel: zone.name === "Row",
						columnName:
							zone.name === "Row"
								? value.fieldname
								: `${value.agg} of ${value.fieldname}`,
					}))
				);

				return accumulator;
			}, []);

			setMenu(output);
		}
	}, [chartControls.properties[propKey].chartData]);

	return (
		<div className="optionsInfo">
			<div className="optionDescription" style={{ display: "flex", flexDirection: "column" }}>
				{chartControls.properties[propKey].tableConditionalFormats &&
					chartControls.properties[propKey].tableConditionalFormats.map(
						(format: any, i: number) => {
							return (
								<>
									<div className="tableConditionalFormatContainer">
										<div className="labelPropsContailer">
											<span style={{ fontSize: "16px", color: "#5d5c5c" }}>
												{format.name}{" "}
											</span>
											{format.isCollapsed ? (
												<ChevronRightIcon
													sx={arrowIconStyle}
													onClick={() => {
														updatecfObjectOptions(propKey, i, {
															...format,
															isCollapsed: false,
														});
													}}
												/>
											) : (
												<ExpandMoreIcon
													sx={arrowIconStyle}
													onClick={() => {
														updatecfObjectOptions(propKey, i, {
															...format,
															isCollapsed: true,
														});
													}}
												/>
											)}
											<DeleteOutlineOutlinedIcon
												sx={{ ...arrowIconStyle, fontSize: "18px" }}
												onClick={() => deleteTablecf(propKey, i)}
											/>
										</div>
										{!format.isCollapsed ? (
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
					sx={addConditionButtonStyle}
					disabled={chartControls.properties[propKey].chartData.length > 0 ? false : true}
					onClick={(e: any) => {
						setAnchorEl(e.currentTarget);
						setOpenMenu(true);
					}}
				>
					Add
				</Button>
			</div>
			{chartControls.properties[propKey].chartData.length > 0 ? null : (
				<p>create a chart first and then add conditional formats</p>
			)}
			<Popover
				open={openMenu}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "center",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "center",
					horizontal: "right",
				}}
				onClose={() => setOpenMenu(false)}
			>
				{menu &&
					menu.map((column: any, index: number) => {
						return (
							<div
								className="menuItemStyle"
								style={{
									borderBottom:
										index === menu.length - 1
											? "none"
											: "1px solid rgba(224,224,224,1)",
								}}
								onClick={e => {
									// if (column.isLabel) {
									onSelectColumn(column);
									setOptionAnchorEl(e.currentTarget);
									// }
									setSelectedColumnName(column.columnName);
								}}
							>
								{column.columnName}
								{column.isLabel ? null : (
									<span style={{ float: "right", marginLeft: "5px" }}>{">"}</span>
								)}
							</div>
						);
					})}
			</Popover>

			<Popover
				open={openSubMenu}
				anchorEl={optionAnchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "center",
					horizontal: "left",
				}}
				onClose={() => setOpenSubMenu(false)}
			>
				<Button
					sx={subMenuItemStyle}
					value="gradient"
					onClick={(e: any) => {
						setOpenSubMenu(false);
						setOpenMenu(false);
						onSelectOption(e.target.value);
					}}
				>
					Gradient
				</Button>
				<Button
					sx={subMenuItemStyle}
					value="rule"
					onClick={(e: any) => {
						setOpenSubMenu(false);
						setOpenMenu(false);
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
