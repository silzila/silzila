import { FormControl, MenuItem, Popover, Select, TextField } from "@mui/material";
import { SelectComponentStyle, menuItemStyle } from "./Labels/SnakeyLabelOptions";
import { textFieldStyleProps } from "./GridAndAxes/GridAndAxes";
import { SketchPicker } from "react-color";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";

export const CustomFontAndBgColor = ({
	id,
	backgroundColor,

	fontColor,

	onChangeColorProps,
}: any) => {
	const [selectedId, setSelectedId] = useState<string>("");
	const [isbgColorPopoverOpen, setbgColorPopOverOpen] = useState<boolean>(false);
	const [isFontColorPopoverOpen, setFontColorPopOverOpen] = useState<boolean>(false);

	return (
		<div style={{ display: "flex", gap: "10px", marginLeft: "10px" }}>
			<div
				title="Background Color"
				style={{
					height: "20px",
					width: "20px",
					backgroundColor: backgroundColor,
					color: backgroundColor,
					border: "2px solid darkgray",
					borderRadius: "4px",
				}}
				onClick={() => {
					setSelectedId(id);
					setbgColorPopOverOpen(!isbgColorPopoverOpen);
				}}
			></div>
			<Popover
				open={isbgColorPopoverOpen}
				onClose={() => setbgColorPopOverOpen(false)}
				// onClick={() => setbgColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div id={id}>
					<SketchPicker
						color={backgroundColor}
						className="sketchPicker"
						width="16rem"
						onChangeComplete={color => {
							onChangeColorProps("backgroundColor", color.hex, selectedId);
						}}
					/>
				</div>
			</Popover>

			<div
				title="Font Color"
				style={{
					height: "20px",
					width: "20px",
					backgroundColor: fontColor,
					color: fontColor,
					border: "2px solid darkgray",
					borderRadius: "4px",
				}}
				onClick={() => {
					setFontColorPopOverOpen(!isFontColorPopoverOpen);
					setSelectedId(id);
				}}
			></div>
			<Popover
				open={isFontColorPopoverOpen}
				onClose={() => setFontColorPopOverOpen(false)}
				// onClick={() => setFontColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div id={id}>
					<SketchPicker
						color={fontColor}
						className="sketchPicker"
						width="16rem"
						onChangeComplete={color => {
							onChangeColorProps("fontColor", color.hex, selectedId);
						}}
					/>
				</div>
			</Popover>
		</div>
	);
};

export const StyleButtons = ({ isBold, isItalic, isUnderlined, onChangeStyleProps }: any) => {
	return (
		<div
			style={{
				display: "flex",
				gap: "10px",
			}}
		>
			<FormatBoldIcon
				onClick={() => {
					onChangeStyleProps("isBold", !isBold);
				}}
				sx={{
					height: "20px",
					width: "20px",
					border: "1px solid grey",
					borderRadius: "3px",
					backgroundColor: isBold ? "rgba(224,224,224,1)" : "none",
				}}
			/>
			<FormatItalicIcon
				onClick={() => onChangeStyleProps("isItalic", !isItalic)}
				sx={{
					height: "20px",
					width: "20px",
					border: "1px solid grey",
					borderRadius: "3px",
					backgroundColor: isItalic ? "rgba(224,224,224,1)" : "none",
				}}
			/>
			<FormatUnderlinedIcon
				onClick={() => onChangeStyleProps("isUnderlined", !isUnderlined)}
				sx={{
					height: "20px",
					width: "20px",
					border: "1px solid grey",
					borderRadius: "3px",
					backgroundColor: isUnderlined ? "rgba(224,224,224,1)" : "none",
				}}
			/>
		</div>
	);
};

export const CondtionComponent = ({
	conditionSArray,
	onDeleteCondition,
	onChangeProps,
	chartType,
}: any) => {
	return (
		<>
			<div style={{ display: "flex", flexDirection: "column" }}>
				{conditionSArray.map((condition: any, i: number) => {
					return (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								borderBottom: "2px solid rgba(224,224,224,1)",
								paddingBottom: "10px",
							}}
						>
							<div style={{ display: "flex" }}>
								<span>
									{chartType === "richText"
										? `conditional Format ${i + 1}`
										: `Rule ${i + 1}`}
								</span>
								{condition.isCollapsed ? (
									<ExpandMoreIcon
										sx={{
											margin: "5px 0px 0px auto",
											fontSize: "16px",
										}}
										onClick={() => {
											onChangeProps(
												condition.id,
												"isCollapsed",
												!condition.isCollapsed
											);
										}}
									/>
								) : (
									<ChevronRightIcon
										sx={{
											margin: "5px 0px 0px auto",
											fontSize: "16px",
										}}
										onClick={() =>
											onChangeProps(
												condition.id,
												"isCollapsed",
												!condition.isCollapsed
											)
										}
									/>
								)}
								<DeleteOutlineOutlinedIcon
									sx={{
										margin: "3px 0px 0px 10px",
										fontSize: "18px",
									}}
									onClick={() => onDeleteCondition(condition.id)}
								/>
							</div>

							{condition.isCollapsed ? (
								<>
									<div style={{ flexDirection: "column" }}>
										<div>Condition</div>
										<FormControl
											fullWidth
											size="small"
											style={{
												fontSize: "12px",
												borderRadius: "4px",
												marginTop: "5px",
											}}
										>
											<Select
												value={condition.conditionType}
												variant="outlined"
												onChange={e => {
													onChangeProps(
														condition.id,
														"conditionType",
														e.target.value
													);
												}}
												sx={SelectComponentStyle}
											>
												{conditionTypes.map((item: any) => {
													return (
														<MenuItem
															value={item.id}
															key={item.id}
															sx={{
																textTransform: "capitalize",
																...menuItemStyle,
															}}
														>
															{item.value}
														</MenuItem>
													);
												})}
											</Select>
										</FormControl>
										<GetInputField
											condition={condition}
											// onChangeValueProps={(option: string, value: any) =>
											// 	console.log(value)
											// }
											onChangeValueProps={(option: string, value: any) => {
												onChangeProps(condition.id, option, value);
											}}
										/>
										<div
											style={{
												display: "flex",
												marginTop: "5px",
												marginLeft:
													chartType === "richText" ? "30px" : "0px",
											}}
										>
											<StyleButtons
												isBold={condition.isBold}
												isItalic={condition.isItalic}
												isUnderlined={condition.isUnderlined}
												onChangeStyleProps={(
													option: string,
													value: any
												) => {
													onChangeProps(condition.id, option, value);
												}}
											/>
											<CustomFontAndBgColor
												backgroundColor={condition.backgroundColor}
												fontColor={condition.fontColor}
												onChangeColorProps={(
													option: string,
													color: any,
													id: any
												) => {
													onChangeProps(id, option, color);
												}}
												id={condition.id}
											/>
										</div>
									</div>
								</>
							) : null}
						</div>
					);
				})}
			</div>
		</>
	);
};

export const checkIsConditionSatisfied = (formatsArray: any, dmValue: number) => {
	const updatedArray = formatsArray.map((item: any) => {
		let  el = JSON.parse(JSON.stringify(item));
		if (el.conditionType === 1) {
			if (dmValue > el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 2) {
			if (dmValue < el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 3) {
			if (dmValue >= el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 4) {
			if (dmValue <= el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 5) {
			if (dmValue === el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 6) {
			if (dmValue != el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 7) {
			if (el.minValue < dmValue < el.maxValue) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		return el;
	});

	return updatedArray;
};

export const conditionTypes = [
	{ id: 1, value: "> Greater than" },
	{ id: 2, value: "< Less than" },
	{ id: 3, value: ">= Greater than or Equal to" },
	{ id: 4, value: "<= Less than or Equal to" },
	{ id: 5, value: "= Equal to" },
	{ id: 6, value: "<> Not Equal to" },
	{ id: 7, value: ">= Between <=" },
];

export const GetInputField = ({ condition, onChangeValueProps }: any) => {
	return (
		<>
			{condition.conditionType === 7 ? (
				<>
					<div>Min Value</div>

					<TextField
						value={condition.minValue}
						variant="outlined"
						type="number"
						onChange={e => {
							e.preventDefault();
							onChangeValueProps("minValue", e.target.value);
						}}
						sx={{ marginTop: "5px" }}
						InputProps={{ ...textFieldStyleProps }}
						fullWidth
					/>
					<div>Max Value</div>

					<TextField
						value={condition.maxValue}
						variant="outlined"
						type="number"
						onChange={e => {
							e.preventDefault();
							onChangeValueProps("maxValue", e.target.value);
						}}
						sx={{ marginTop: "5px" }}
						InputProps={{ ...textFieldStyleProps }}
						fullWidth
					/>
				</>
			) : (
				<>
					<div>Target Value</div>

					<TextField
						value={condition.target}
						variant="outlined"
						type="number"
						onChange={e => {
							e.preventDefault();
							onChangeValueProps("target", e.target.value);
						}}
						onBlur={(e: any) => {
							onChangeValueProps("target", e.target.value);
						}}
						sx={{ marginTop: "5px" }}
						InputProps={{ ...textFieldStyleProps }}
						fullWidth
					/>
				</>
			)}
		</>
	);
};
