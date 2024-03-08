// This component houses the dropzones for table fields
// Number of dropzones and its name is returned according to the chart type selected.
// Once minimum number of fields are met for the given chart type, server call is made to get chart data and saved in store

import { connect } from "react-redux";
import ChartsInfo from "./ChartsInfo2";
import "./ChartAxes.css";
import DropZone from "./DropZone";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ChartAxesProps } from "./ChartAxesInterfaces";
import { ChartPropertiesStateProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import ChartData from "./ChartData";
import { Dispatch } from "redux";
import {changeLocation} from "../../redux/ChartPoperties/ChartPropertiesActions";

const ChartAxes = ({
	// props
	tabId,
	tileId,

	// state

	chartProp,
	changeLocation,
}: ChartAxesProps) => {
	var propKey: string = `${tabId}.${tileId}`;
	var dropZones: any = [];
	for (let i = 0; i < ChartsInfo[chartProp.properties[propKey].chartType].dropZones.length; i++) {
		dropZones.push(ChartsInfo[chartProp.properties[propKey].chartType].dropZones[i].name);
	}

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
					style={{display: "flex", flexDirection: "column" }}
				>
					<span className="axisTitle"></span>
					<FormControl size="small" sx={{ margin: "0.5rem", "& .MuiInputBase-root": {
										borderRadius: "0px",
									} }}
									style={{
										background: "white",
										fontSize: "12px",
										borderRadius: "4px",
									}}>
						<InputLabel sx={{ fontSize: "12px", lineHeight: "1.5rem","&.Mui-focused": {
											color: "#2bb9bb",
										} }}>
							Select Map
						</InputLabel>
						<Select
							sx={{ fontSize: "13px", height: "1.5rem", backgroundColor: "white",color: "grey",

							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: "#2bb9bb",
								color: "#2bb9bb",
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "#2bb9bb",
								color: "#2bb9bb",
							},
							"&.Mui-focused .MuiSvgIcon-root ": {
								fill: "#2bb9bb !important",
							}, }}
							label="Select Map"
							value={chartProp.properties[propKey].geoLocation || "world"}
							onChange={e => {
								changeLocation(propKey, e.target.value);
							}}
						>
							<MenuItem sx={menuItemStyle} value="world">
								World
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="australia">
								Australia
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

const mapStateToProps = (state: ChartPropertiesStateProps, ownProps: any) => {
	return {
		chartProp: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		changeLocation: (propKey: string, geoLocation: any) =>
			dispatch(changeLocation(propKey, geoLocation)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartAxes);
