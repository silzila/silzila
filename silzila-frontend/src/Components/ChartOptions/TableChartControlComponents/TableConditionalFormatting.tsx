import { Button, Popover } from "@mui/material";
import "../ConditionalFormatting.css";
import React, { Dispatch, useEffect, useState } from "react";
import { connect } from "react-redux";
import {
	addTableConditionalFormats,
	deleteTablecf,
	updatecfObjectOptions,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import ShortUniqueId from "short-unique-id";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LabelComponent from "./LabelComponent";
import GradientComponent from "./GradientComponent";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RuleComponent from "./RuleComponent";

export const addConditionButtonStyle = {
	backgroundColor: "rgb(43, 185, 187)",
	height: "25px",
	width: "100%",
	color: "white",
	textTransform: "none",
	"&:hover": {
		backgroundColor: "rgb(43, 185, 187)",
	},
};

const subMenuItemStyle = {
	textTransform: "none",
	color: "grey",
	display: "block",
};

// TODO (kasthuri)
interface Props {
	chartControls: any;
	tabTileProps: any;
	chartProperties: any;

	addTableConditionalFormats: (propKey: string, item: any) => void;
	updatecfObjectOptions: (propKey: string, removeIndex: number, item: any) => void;
	deleteTablecf: (propKey: string, index: number) => void;
}

const TableConditionalFormatting = ({
	//state
	chartControls,
	tabTileProps,
	chartProperties,

	//dispatch
	addTableConditionalFormats,
	updatecfObjectOptions,
	deleteTablecf,
}: Props) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var uId = new ShortUniqueId({ length: 8 });
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
		let formattedColumnName = columnName;
		// checking the column type To generate the name as it is in the chartData
		chartProperties.properties[propKey].chartAxes[1].fields.forEach((el: any) => {
			if (el.dataType === "date") {
				console.log();
				if (el.fieldname === columnName) {
					formattedColumnName = `${el.timeGrain} of ${el.fieldname}`;
				}
			}
		});

		const values = chartControls.properties[propKey].chartData.map((item: any) => {
			console.log(item, columnName);
			return {
				colValue: item[formattedColumnName],
				backgroundColor: "white",
				isBold: false,
				isItalic: false,
				isUnderlined: false,
				fontColor: "black",
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
		// if the selected format type for the selected column is rule
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
		// if the selected format type for the selected column is Gradient
		if (option === "gradient") {
			// here we adding 3 values as default , for min,max and NULL values
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
						// getting minimum and maximum values of the selected column
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
						// getting minimum and maximum values of the selected column
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

	// when select any column from dimension
	const onSelectColumn = (column: any) => {
		var canAdd = false;
		/* checking length of array to check whether this item is already exist or not, if the lenth 
		is zero then this is the first item else check the array with columnname */
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

		/* if the is is not already exist or this is the first item */
		if (canAdd) {
			if (column.isLabel) {
				addTableConditionalFormats(propKey, {
					isLabel: column.isLabel,
					name: column.columnName,
					// getLabelValues - function to get all values of selected column
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
				// if the column is not from dimension (means it is from measure zone) , open the popover with two options gradient , rule
				setOpenSubMenu(true);
			}
		}
	};

	// getting the list of columns with isLabel key (it is true if it is a dimension column else it will be false) whenever the chartData changes
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
			<div
				className="optionDescription"
				style={{ display: "flex", flexDirection: "column", marginTop: "0px" }}
			>
				{chartControls.properties[propKey].tableConditionalFormats &&
					chartControls.properties[propKey].tableConditionalFormats.map(
						(format: any, i: number) => {
							return (
								<>
									<div>
										<div className="ColumnTitle">
											<span style={{ fontSize: "16px", color: "#5d5c5c" }}>
												{format.name}{" "}
											</span>
											<span className="expandLessMoreContainer">
												{format.isCollapsed ? (
													<ChevronRightIcon
														sx={{
															fontSize: "16px",
														}}
														onClick={() => {
															updatecfObjectOptions(propKey, i, {
																...format,
																isCollapsed: false,
															});
														}}
													/>
												) : (
													<ExpandMoreIcon
														sx={{
															fontSize: "16px",
														}}
														onClick={() => {
															updatecfObjectOptions(propKey, i, {
																...format,
																isCollapsed: true,
															});
														}}
													/>
												)}
											</span>
											<span className="deleteIconContainer">
												<DeleteOutlineOutlinedIcon
													sx={{ fontSize: "16px" }}
													onClick={() => deleteTablecf(propKey, i)}
												/>
											</span>
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
			<div>
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
				<p style={{ color: "#ccc", fontStyle: "italic", fontSize: "10px" }}>
					*Create a chart first and then add conditions*
				</p>
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
									onSelectColumn(column);
									setOptionAnchorEl(e.currentTarget);
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
