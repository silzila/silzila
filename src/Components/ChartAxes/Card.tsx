// This component represent each individual table field dropped inside dropzone
// Each card has some aggregate values and option to select different aggregate and/or timeGrain values

import React, { useState } from "react";
import "./Card.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { connect } from "react-redux";
import {
	editChartPropItem,
	revertAxes,
	sortAxes,
} from "../../redux/ChartPoperties/ChartPropertiesActions";
import { Divider, Menu, MenuItem } from "@mui/material";
import Aggregators, { AggregatorKeys } from "./Aggregators";
import { useDrag, useDrop } from "react-dnd";
import { Dispatch } from "redux";
import { TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";
import { ChartPropertiesStateProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { CardProps } from "./ChartAxesInterfaces";
import {
	editChartPropItemForDm,
	revertAxesForDm,
	sortAxesForDm,
} from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import Logger from "../../Logger";

const Card = ({
	// props
	field,
	bIndex,
	itemIndex,
	propKey,
	axisTitle,

	// state
	tabTileProps,
	chartProp,
	dynamicMeasureState,

	// dispatch
	// chartPropUpdated,
	deleteDropZoneItems,
	updateQueryParam,
	sortAxes,
	revertAxes,

	//dynamicMeasure dispatch
	deleteDropZoneItemsForDm,
	updateAxesQueryParamForDm,
	sortAxesForDm,
	revertAxesForDm,
}: CardProps) => {
	field.dataType = field.dataType.toLowerCase();

	var chartType =
		chartProp.properties[`${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`]
			.chartType;

	const originalIndex =
		chartType === "richText"
			? dynamicMeasureState.dynamicMeasureProps?.[dynamicMeasureState.selectedTabId]?.[
					dynamicMeasureState.selectedTileId
			  ]?.[
					`${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`
			  ].chartAxes[bIndex].fields.findIndex((item: any) => item.uId === field.uId)
			: chartProp.properties[propKey].chartAxes[bIndex].fields.findIndex(
					(item: any) => item.uId === field.uId
			  );

	const deleteItem = () => {
		if (chartType === "richText") {
			deleteDropZoneItemsForDm(propKey, bIndex, itemIndex);
		} else {
			deleteDropZoneItems(propKey, bIndex, itemIndex);
		}
		// chartPropUpdated(true);
	};

	const [showOptions, setShowOptions] = useState<boolean>(false);

	const [anchorEl, setAnchorEl] = useState<any | null>(null);

	const open: boolean = Boolean(anchorEl);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (closeFrom: any, queryParam?: any) => {
		setAnchorEl(null);
		setShowOptions(false);

		if (closeFrom === "agg" || closeFrom === "timeGrain") {
			var field2 = JSON.parse(JSON.stringify(field));

			if (closeFrom === "agg") {
				Logger("info", "Aggregate Choice selected", queryParam);
				field2.agg = queryParam;
			} else if (closeFrom === "timeGrain") {
				field2.timeGrain = queryParam;
			}
			if (chartType === "richText") {
				Logger("info", "queryparam");
				updateAxesQueryParamForDm(propKey, bIndex, itemIndex, field2);
			} else {
				updateQueryParam(propKey, bIndex, itemIndex, field2);
			}
		}
	};

	var menuStyle = { fontSize: "12px", padding: "2px 1rem" };
	var menuSelectedStyle = {
		fontSize: "12px",
		padding: "2px 1rem",
		backgroundColor: "rgba(25, 118, 210, 0.08)",
	};

	// Properties and behaviour when a card is dragged
	const [, drag] = useDrag({
		item: {
			uId: field.uId,
			fieldname: field.fieldname,
			displayname: field.fieldname,
			dataType: field.dataType,
			prefix: field.prefix,
			tableId: field.tableId,
			// type: "card",
			bIndex,
			originalIndex,
		},
		type: "card",

		end: (dropResult, monitor) => {
			const { uId, bIndex, originalIndex } = monitor.getItem();
			const didDrop = monitor.didDrop();
			if (!didDrop) {
				if (chartType === "richText") {
					revertAxesForDm(propKey, bIndex, uId, originalIndex);
				} else {
					revertAxes(propKey, bIndex, uId, originalIndex);
				}
			}
		},
	});

	// Properties and behaviours when another card is dropped over this card
	const [, drop] = useDrop({
		accept: "card",
		canDrop: () => false,
		collect: monitor => ({
			backgroundColor1: monitor.isOver({ shallow: true }) ? 1 : 0,
		}),
		hover: ({ uId: dragUId, bIndex: fromBIndex }: { uId: string; bIndex: number }) => {
			if (fromBIndex === bIndex && dragUId !== field.uId) {
				if (chartType === "richText") {
					sortAxesForDm(propKey, bIndex, dragUId, field.uId);
				} else {
					sortAxes(propKey, bIndex, dragUId, field.uId);
				}
				Logger("info", "============HOVER BLOCK END ==============");
			}
		},
	});

	// List of options to show at the end of each card
	// (like, year, month, day, or Count, sum, avg etc)

	const RenderMenu = () => {
		var options: any[] = [];
		var options2: any[] = [];

		if (axisTitle === "Measure" || axisTitle === "X" || axisTitle === "Y") {
			if (field.dataType === "date" || field.dataType === "timestamp") {
				options = options.concat(Aggregators[axisTitle][field.dataType].aggr);
				options2 = options2.concat(Aggregators[axisTitle][field.dataType].timeGrain);
			} else {
				options = options.concat(Aggregators[axisTitle][field.dataType]);
			}
		}

		if (
			axisTitle === "Dimension" ||
			axisTitle === "Row" ||
			axisTitle === "Column" ||
			axisTitle === "Distribution"
		) {
			if (field.dataType === "date" || field.dataType === "timestamp") {
				options2 = options2.concat(Aggregators[axisTitle][field.dataType].timeGrain);
			} else {
				options = options.concat(Aggregators[axisTitle][field.dataType]);
			}
		}
		return (
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={() => handleClose("clickOutside")}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				{options.length > 0
					? options.map(opt => {
							return (
								<MenuItem
									onClick={() => handleClose("agg", opt.id)}
									sx={opt.id === field.agg ? menuSelectedStyle : menuStyle}
									key={opt.id}
								>
									{opt.name}
								</MenuItem>
							);
					  })
					: null}

				{options.length > 0 && options2.length > 0 ? <Divider /> : null}

				{options2.length > 0
					? options2.map(opt2 => {
							return (
								<MenuItem
									onClick={() => handleClose("timeGrain", opt2.id)}
									sx={opt2.id === field.timeGrain ? menuSelectedStyle : menuStyle}
									key={opt2.id}
								>
									{opt2.name}
								</MenuItem>
							);
					  })
					: null}

				{options.length === 0 && options2.length === 0 ? (
					<MenuItem onClick={handleClose} sx={menuStyle} key="optNa">
						<i>-- No options --</i>
					</MenuItem>
				) : null}
			</Menu>
		);
	};

	return field ? (
		<div
			ref={(node: any) => drag(drop(node))}
			className="axisField"
			onMouseOver={() => setShowOptions(true)}
			onMouseLeave={() => {
				if (!open) {
					setShowOptions(false);
				}
			}}
		>
			<button
				type="button"
				className="buttonCommon columnClose"
				onClick={deleteItem}
				title="Remove field"
				style={showOptions ? { visibility: "visible" } : { visibility: "hidden" }}
			>
				<CloseRoundedIcon style={{ fontSize: "13px", margin: "auto" }} />
			</button>

			<span className="columnName ">{field.fieldname}</span>
			<span className="columnPrefix">
				{field.agg ? AggregatorKeys[field.agg] : null}

				{field.timeGrain && field.agg ? <React.Fragment>, </React.Fragment> : null}
				{field.timeGrain ? AggregatorKeys[field.timeGrain] : null}
			</span>
			<span className="columnPrefix"> {field.prefix ? `${field.prefix}` : null}</span>
			<button
				type="button"
				className="buttonCommon columnDown"
				title="Remove field"
				style={showOptions ? { visibility: "visible" } : { visibility: "hidden" }}
				onClick={(e: any) => {
					handleClick(e);
				}}
			>
				<KeyboardArrowDownRoundedIcon style={{ fontSize: "14px", margin: "auto" }} />
			</button>
			<RenderMenu />
		</div>
	) : null;
};

const mapStateToProps = (state: TabTileStateProps2 & ChartPropertiesStateProps & any) => {
	return {
		tabTileProps: state.tabTileProps,
		chartProp: state.chartProperties,
		dynamicMeasureState: state.dynamicMeasuresState,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		deleteDropZoneItems: (propKey: string, binIndex: number, itemIndex: number) =>
			dispatch(editChartPropItem("delete", { propKey, binIndex, itemIndex })),
		updateQueryParam: (propKey: string, binIndex: number, itemIndex: number, item: any) =>
			dispatch(editChartPropItem("updateQuery", { propKey, binIndex, itemIndex, item })),
		sortAxes: (propKey: string, bIndex: number, dragUId: string, uId: string) =>
			dispatch(sortAxes(propKey, bIndex, dragUId, uId)),
		revertAxes: (propKey: string, bIndex: number, uId: string, originalIndex: number) =>
			dispatch(revertAxes(propKey, bIndex, uId, originalIndex)),

		//dynamic measure actions
		deleteDropZoneItemsForDm: (propKey: string, binIndex: number, itemIndex: any) =>
			dispatch(editChartPropItemForDm("delete", { propKey, binIndex, itemIndex })),
		sortAxesForDm: (propKey: string, bIndex: number, dragUId: string, uId: string) =>
			dispatch(sortAxesForDm(propKey, bIndex, dragUId, uId)),
		updateAxesQueryParamForDm: (
			propKey: string,
			binIndex: number,
			itemIndex: number,
			item: any
		) =>
			dispatch(editChartPropItemForDm("updateQuery", { propKey, binIndex, itemIndex, item })),
		revertAxesForDm: (propKey: string, bIndex: number, uId: string, originalIndex: number) =>
			dispatch(revertAxesForDm(propKey, bIndex, uId, originalIndex)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
