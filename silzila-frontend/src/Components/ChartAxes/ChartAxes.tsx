// This component houses the dropzones for table fields
// Number of dropzones and its name is returned according to the chart type selected.
// Once minimum number of fields are met for the given chart type, server call is made to get chart data and saved in store
// This is another comment

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import ChartsInfo from "./ChartsInfo2";
import "./ChartAxes.css";
import DropZone from "./DropZone";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ChartAxesProps } from "./ChartAxesInterfaces";
import { ChartPropertiesStateProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import ChartData from "./ChartData";
import { Dispatch } from "redux";
import {changeLocation, changeGeoKey} from "../../redux/ChartPoperties/ChartPropertiesActions";
import {getGeoJSON, getMismachedLocationArray} from '../Charts/GeoChart/GeoJSON/MapCommonFunctions';
import WarningIcon from "@mui/icons-material/WarningAmber";
import GoeMismatch from '../Charts/GeoChart/Components/GeoMismatch';
import GoeHelp from '../Charts/GeoChart/Components/GeoHelp';
import {fieldName} from '../CommonFunctions/CommonFunctions';
import { VisibilitySharp, InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import {  Autocomplete,TextField, } from "@mui/material";


const ChartAxes = ({
	// props
	tabId,
	tileId,

	// state

	chartProp,
	chartControls,
	changeLocation,
	changeGeoKey,
}: ChartAxesProps & any) => {
	var propKey: string = `${tabId}.${tileId}`;
	var dropZones: any = [];

	const [mapKeys, setMapKeys] = useState<any>([]);
	const [anchorHelpElm, setAnchorHelpElm] = useState<any | null>(null);
	const [anchorMismatchElm, setAnchorMismatchElm] = useState<any | null>(null);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [showOptionsMismatch, setShowOptionsMismatch] = useState<boolean>(false);
	const [showMismatchIcon, setShowMismatchIcon] = useState<boolean>(false);
	const [misMatchList, setMismatchList] = useState<any>([]);
	const [isHelpHovered, setIsHelpHovered] = useState(false);
	const [isUnMatchedFixed, setIsUnMatchedFixed] = useState(false);
	
	var chartControl: any = chartControls.properties[propKey];
	let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

	//const isOpenHelp: boolean = Boolean(anchorHelpElm);

	for (let i = 0; i < ChartsInfo[chartProp.properties[propKey].chartType].dropZones.length; i++) {
		dropZones.push(ChartsInfo[chartProp.properties[propKey].chartType].dropZones[i].name);
	}
	
	const handleClose = () => {
		setAnchorHelpElm(null);
		setShowOptions(false);
	}

	const handleCloseWarningMismatch = () => {
		setAnchorMismatchElm(null);
		setShowOptionsMismatch(false);
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

	useEffect(() => {
		let mapJSON = getGeoJSON(chartProp.properties[propKey].Geo.geoLocation);
		let keys = Object.keys(mapJSON.features[0].properties).filter(item=> ["continent","hc-a2","iso-a2","iso-a3","region-wb", "subregion"].includes(item));
		keys.sort();

		setMapKeys(["name", ...keys]);
	}, [chartProp.properties[propKey].Geo.geoLocation]);

	useEffect(()=>{
		let misMatchArray = [];

		if(chartProp.properties[propKey].chartType === "geoChart" && chartData.length >0){
			let dimensionName = chartProp.properties[propKey].chartAxes[1].fields[0];
			misMatchArray = getMismachedLocationArray(chartData, fieldName(dimensionName),chartProp.properties[propKey].Geo.geoLocation,chartProp.properties[propKey].Geo.geoMapKey);
			
			////TODO save to redux			
			setShowMismatchIcon(misMatchArray.length > 0);			
			setMismatchList(misMatchArray);			


			if(chartProp.properties[propKey].Geo.unMatchedChartData?.length >0){
				let emptySelectedKey = chartProp.properties[propKey].Geo.unMatchedChartData.find((item:any)=>item.selectedKey == "");	
				setIsUnMatchedFixed(!emptySelectedKey);		
			}
			
		}
		else{
			setShowMismatchIcon(false);
		}
		
	},[chartData, chartProp.properties[propKey].Geo])

	const handleLocationOnChange =(e:any)=>{
		changeLocation(propKey, e.currentTarget.innerText);
	}

	const [options, setOptions] = useState(["World", "Australia", "Brazil", "China"
	,"France", "Germany", "India", "Japan", "Nigeria", "South Africa", "United Kingdom",
	"USA"])

	return (
		<div className="charAxesArea">
			{chartProp.properties[propKey].chartType === "geoChart" && (
				<div
					style={{display: "flex", flexDirection: "column" }}
				>
					<span className="axisTitle"></span>
					<div>
						<Autocomplete
							defaultValue={"World"}         
							value={chartProp.properties[propKey].Geo.geoLocation}                  
							disablePortal
							id="combo-box-demo"
							onChange={(e:any)=>{handleLocationOnChange(e)}}
							options={options}
							sx={{ width: "12rem" }}
							renderInput={(params) => <TextField {...params} label="Select Map" />}
							/>
					</div>
					{/*<FormControl size="small" sx={{ margin: "0.5rem", "& .MuiInputBase-root": {
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
							value={chartProp.properties[propKey].Geo.geoLocation || "world"}
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
						</FormControl>*/}
				</div>
			)}
			{chartProp.properties[propKey].chartType === "geoChart" && (
				<div
					style={{display: "flex", flexDirection: "row" }}
				>
					
					<FormControl size="small" sx={{ width:"9rem", margin: "0.5rem", "& .MuiInputBase-root": {
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
							Select Key
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
							value={chartProp.properties[propKey].Geo.geoMapKey || "name"}
							onChange={e => {
								changeGeoKey(propKey, e.target.value);
							}}
						>
						{
							mapKeys.map((key: any, index:number) => (
								<MenuItem sx={menuItemStyle} value={key} key={index}>
									{key}
								</MenuItem>
							))
						}	
						</Select>
					</FormControl>
					{
						showMismatchIcon ?	<Tooltip title="UnMatched Locations." arrow placement="top"><WarningIcon 
						style={{ 
							marginLeft: "5px", 
							cursor: "pointer", 
							marginTop: "4px",
							color: isUnMatchedFixed ? "green" : "orange", // Change color based on hover state
							fontSize: "1.2em", // Change font size based on hover state
							transition: "color 0.3s, font-size 0.3s" // Transition for smooth hover effect
						}}					
						onClick={(event)=>{
							setAnchorMismatchElm(event.currentTarget);
							setShowOptionsMismatch(!showOptions);
							}}>

						</WarningIcon></Tooltip> : null
					}
					
					<Tooltip title="Help." arrow placement="top">
					<InfoOutlined 
								style={{ 
									marginLeft: "5px", 
									cursor: "pointer", 
									marginTop: "4px",
									color: isHelpHovered ? "grey" : "LightGrey", // Change color based on hover state
									fontSize: "1.2em", // Change font size based on hover state
									transition: "color 0.3s, font-size 0.3s" // Transition for smooth hover effect
								}}
								onMouseEnter={()=>{ setIsHelpHovered(true)}}
								onMouseLeave={()=>{setIsHelpHovered(false)}}
								onClick={(event)=>{
									setAnchorHelpElm(event.currentTarget);
									setShowOptions(!showOptions);
									}}
							/>
					</Tooltip>
					
					<GoeHelp propKey={propKey} open={showOptions} anchorElement={anchorHelpElm} handleClose={handleClose}></GoeHelp>
					<GoeMismatch propKey={propKey} misMatchList={misMatchList} open={showOptionsMismatch} anchorElement={anchorMismatchElm} handleClose={handleCloseWarningMismatch}></GoeMismatch>
				</div>
			)}
			{dropZones.map((zone: any, zoneI: any) => (
				<DropZone bIndex={zoneI} name={zone} propKey={propKey} key={zoneI} />
			))}
			<ChartData tabId={tabId} tileId={tileId} screenFrom="Chartaxes"></ChartData>
		</div>
	);
};


const mapStateToProps = (state: ChartPropertiesStateProps & any, ownProps: any) => {
	return {
		chartProp: state.chartProperties,
		chartControls: state.chartControls,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		changeLocation: (propKey: string, geoLocation: any) =>
			dispatch(changeLocation(propKey, geoLocation)),
		changeGeoKey: (propKey: string, key: any) =>
			dispatch(changeGeoKey(propKey, key)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartAxes);
