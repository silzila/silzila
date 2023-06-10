// This component houses the dropzones for table fields
// Number of dropzones and its name is returned according to the chart type selected.
// Once minimum number of fields are met for the given chart type, server call is made to get chart data and saved in store

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import ChartsInfo from "./ChartsInfo2";
import "./ChartAxes.css";
import DropZone from "./DropZone";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {  ChartAxesProps } from "./ChartAxesInterfaces";
import {
	ChartPropertiesStateProps,
} from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import ChartData from "./ChartData";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { chartFilterGroupEdited } from "../../redux/ChartFilterGroup/ChartFilterGroupStateActions";
import {
	ChartFilterGroupProps,
	ChartFilterGroupStateProps,
} from "../../redux/ChartFilterGroup/ChartFilterGroupInterface";
import { updateChartDataForDm } from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import {AxesValuProps, ChartAxesFormattedAxes } from './ChartAxesInterfaces';
import FetchData from '../ServerCall/FetchData';
import { updateChartData } from "../../redux/ChartPoperties/ChartControlsActions";
import { canReUseData, toggleAxesEdited } from "../../redux/ChartPoperties/ChartPropertiesActions";

const ChartAxes = ({
	// props
	tabId,
	tileId,

	// state
	token,
	chartGroup,
	chartProp,
	changeLocation,
	dynamicMeasureState,

	// dispatch
	updateChartData,
	toggleAxesEdit,
	reUseOldData,
	chartFilterGroupEdited,
	updateChartDataForDm,
}: ChartAxesProps & any) => {
	const [loading, setLoading] = useState<boolean>(false);

	var propKey: string = `${tabId}.${tileId}`;
	var chartType = chartProp.properties[propKey].chartType;
	var dropZones: any = [];
	for (let i = 0; i < ChartsInfo[chartProp.properties[propKey].chartType].dropZones.length; i++) {
		dropZones.push(ChartsInfo[chartProp.properties[propKey].chartType].dropZones[i].name);
	}

	// var chartProp: any =
	// 	chartType === "richText" && chartProperties.properties[propKey].isDynamicMeasureWindowOpened
	// 		? dynamicMeasureState.dynamicMeasureProps?.[dynamicMeasureState.selectedTabId]?.[
	// 				dynamicMeasureState.selectedTileId
	// 		  ]?.[
	// 				`${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`
	// 		  ]
	// 		: chartProperties.properties[propKey];
	// const usePrevious = (value) => {
	// 	const ref = useRef();
	// 	useEffect(() => {
	// 	  ref.current = value;
	// 	});
	// 	return ref.current;
	// }

	//   const {chartFilter} = chartProp.properties[propKey].chartAxes[0];
	//   const prevFilter = usePrevious({chartFilter});

	// every time chartAxes or chartType is changed, check if
	// new data must be obtained from server
	// check for minimum requirements in each dropzone for the given chart type
	// if not reset the data


	var menuItemStyle = {
		fontSize: "12px",
		padding: "2px 1rem",
		// borderBottom: "1px solid lightgray",
	};

	return (
		<div className="charAxesArea">
			{chartProp.properties[propKey].chartType === "geoChart" && (
				<div
					style={{ backgroundColor: "#d3d3d3", display: "flex", flexDirection: "column" }}
				>
					<span className="axisTitle"></span>
					<FormControl size="small" sx={{ margin: "0.5rem" }}>
						<InputLabel sx={{ fontSize: "12px", lineHeight: "1.5rem" }}>
							Select Map
						</InputLabel>
						<Select
							sx={{ fontSize: "14px", height: "1.5rem", backgroundColor: "white" }}
							label="Select Map"
							value={chartProp.properties[propKey].geoLocation}
							onChange={e => {
								console.log(e.target.value);
								changeLocation(propKey, e.target.value);
							}}
						>
							<MenuItem sx={menuItemStyle} value="world">
								World
							</MenuItem>

							<MenuItem sx={menuItemStyle} value="brazil">
								Brazil
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="china">
								China
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="france">
								France
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="germany">
								Germany
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="india">
								India
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="japan">
								Japan
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="nigeria">
								Nigeria
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="southAfrica">
								South Africa
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="uk">
								United Kingdom
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="usa">
								USA
							</MenuItem>
						</Select>
					</FormControl>
				</div>
			)}
			{dropZones.map((zone: any, zoneI: any) => (
				<DropZone bIndex={zoneI} name={zone} propKey={propKey} key={zoneI} />
			))}
			<ChartData tabId={tabId} tileId={tileId} screenFrom="Chartaxes"></ChartData>
		</div>
	);
};

const mapStateToProps = (state: ChartPropertiesStateProps , ownProps: any) => {
	return {
		chartProp: state.chartProperties,
	};
};


export default connect(mapStateToProps, null)(ChartAxes);
