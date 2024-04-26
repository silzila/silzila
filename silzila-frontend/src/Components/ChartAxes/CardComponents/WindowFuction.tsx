import {Button, Checkbox, FormControl, Menu, MenuItem, Radio, Select, TextField, Typography} from "@mui/material";
import { useEffect, useState } from "react";
import { ChartPropertiesProps } from "../../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { TabTileStateProps } from "../../../redux/TabTile/TabTilePropsInterfaces";
import { connect } from "react-redux";
import { TabTileStateProps2 } from "../../../redux/TabTile/TabTilePropsInterfaces";
import { ChartPropertiesStateProps } from "../../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { Dispatch } from "redux";
import { editChartPropItem } from "../../../redux/ChartPoperties/ChartPropertiesActions";

interface WindowFunctionProps {
	windowfn: boolean;
	setWindowfn:  React.Dispatch<React.SetStateAction<boolean>>;
	propKey: string;
	bIndex: number;
	itemIndex: number;

	//state
	chartProp: ChartPropertiesProps;
	tabTileProps: TabTileStateProps;
	chartControls: any;

	// dispatch
	updateQueryParam: (propKey: string, binIndex: number, itemIndex: number, item: any) => void;
	}
	
	const WindowFunction = ({
		//props
		windowfn,
		setWindowfn,
		propKey,
		bIndex,
		itemIndex,
        
		//state
		chartProp,
		tabTileProps,
		chartControls,

		// dispatch,
	    // chartPropUpdated,
	    updateQueryParam,
	}: WindowFunctionProps) => {
		
    var chartType = chartProp.properties[`${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`].chartType;
    var field = chartProp.properties[propKey].chartAxes[bIndex].fields[itemIndex];
	
	field.dataType = field.dataType.toLowerCase();

	const [windowFnValues, setWindowFnValues] = useState<any>(
		field.windowfn ? 
		field.windowfn  
		:  
		{
		windowFnOptions: "standing",
		rank: "Default",
		order: "Descending",
		standingRowIndex: -1,
		standingColumnIndex: -1,
		standingRow: "(Entire Table)",
		standingColumn: "(Entire Table)",
		slidingPreInc: -1,
		slidingNextInc: 0,
		slidingCurrent: 1,
		slidingAggregation: "Sum",
		slidingRowIndex: -1,
		slidingColumnIndex: -1,
		slidingRow: "(Entire Table)",
		slidingColumn: "(Entire Table)",
		slidingSlideDirection: "rowwise",
		percentage: "Percentage from",
		standingSlidingReferenceWn: "First",
		standingSlidingPreInc: -1,
		standingSlidingNextInc: 1,
		standingSlidingCurrent: 1,
		standingSlidingAggregation: "Sum",
		standingSlidingRowIndex: -1,
		standingSlidingColumnIndex: -1,
		standingSlidingRow: "(Entire Table)",
		standingSlidingColumn: "(Entire Table)",
		standingSlidingSlideDirection: "rowwise",
	});

	const textFieldStyleProps = {
		style: {
			fontSize: "12px",
			width: "58px",
			backgroundColor: "white",
			height: "26px",
		},
	};

	const dropDownSelectStyle = {
		height: "26px", 
		fontSize: "12px",
		'&.MuiOutlinedInput-root': {
			'& fieldset': {
			  border: '1px solid rgb(211, 211, 211)', // Change the border color here
			},
			'&:hover fieldset': {
			  border: '1px solid #af99db', // Change the hover border color here
			},
			'&.Mui-focused fieldset': {
			  border: '1px solid #af99db', // Change the focused border color here
			},
			'&.Mui-focused svg': {
				color: '#af99db', // Change the arrow color when focused
			},
		  },
	};

	const radioButton = {
		'&.Mui-checked': { color: "#af99db" },
		'& .MuiTouchRipple-root': {
			display: 'none', // Remove ripple effect
		},
		"&:hover": {backgroundColor: "transparent"},
		'& .MuiSvgIcon-root': { fontSize: 16 },
	}

	const [standingSlidingPNC, setStandingSlidingPNC] = useState<boolean>(false);
	const ranks: string[] = ["Default", "Dense", "Unique"];
	const orders: string[] = ["Ascending", "Descending"];
	const percentages: string[] = ["Percentage from", "Difference from", "Percentage difference from"]; 
	const slidingAggregation : any[] = ["Sum", "Avg", "Min", "Max", "Count"];   
	const standingSlidingAggregation : any[] = ["Sum", "Avg", "Min", "Max"];
    
	const chartAxesTwoDim = chartProp.properties[propKey].chartAxes[2] ? chartProp.properties[propKey].chartAxes[2].fields : null;

	//If below condition get satisfied, then window function get disabled and its state values retain to its default values
	const chartAxesDimEmpty = ["heatmap", "crossTab", "boxPlot"].includes(chartType) && chartProp.properties[propKey].chartAxes[1].fields.length === 0 && 
	chartProp.properties[propKey].chartAxes[2].fields.length === 0 || !["heatmap", "crossTab", "boxPlot", "richText"].includes(chartType) &&
	chartProp.properties[propKey].chartAxes[1].fields.length === 0;
    
	//Below condition get satisfied, then current(windowFnOption) in sliding and standingvssliding get checked and disabled
	const slidingCurrentDisable = windowFnValues.slidingPreInc !== 0 && windowFnValues.slidingNextInc !== 0 || windowFnValues.slidingPreInc === 0 && windowFnValues.slidingNextInc === 0;
	const standingSlidingCurrentDisable = windowFnValues.standingSlidingPreInc !== 0 && windowFnValues.standingSlidingNextInc !== 0 || windowFnValues.standingSlidingPreInc === 0 && windowFnValues.standingSlidingNextInc === 0;

	//Fetch fields from Dimension, Row, Column, Distribution
	var row: any[] = [];
	var column: any[] = [];
	
	if(chartProp.properties[propKey].chartAxes[1].fields.length > 0){
		row.push(chartProp.properties[propKey].chartAxes[1].fields.map((rowFieldname) => rowFieldname))
	} 
	
	if(["heatmap", "crossTab", "boxPlot"].includes(chartType)){
		if(chartProp.properties[propKey].chartAxes[2].fields.length > 0){
			column.push(chartProp.properties[propKey].chartAxes[2].fields.map((columnFieldname) => columnFieldname))
		}} 

	var rows: any[] = [];
	var columns: any[] = [];
	if(chartProp.properties[propKey].chartAxes[1].fields.length > 0){
		rows.push(...row[0]);
	} 

	if(["heatmap", "crossTab", "boxPlot"].includes(chartType)){
	if(chartProp.properties[propKey].chartAxes[2].fields.length > 0){
		columns.push(...column[0]);
	}}

	// Update individual properties within the object
	const handleChange = (value: any, option: string, subOption?: string) => {
		if(option === "standing") {
			if(subOption === "rank"){
				setWindowFnValues((prevState: any) => ({ ...prevState, rank: value }));
			} else {
				if(subOption === "order"){
					setWindowFnValues((prevState: any) => ({ ...prevState, order: value }));
				} else {
					if(subOption === "row"){
						setWindowFnValues((prevState: any) => ({ ...prevState, standingRowIndex: value === "(Entire Table)" ? -1 : rows.indexOf(value) }));	
						setWindowFnValues((prevState: any) => ({ ...prevState, standingRow: value }));
					} else {
						if(subOption === "column"){
							setWindowFnValues((prevState: any) => ({ ...prevState, standingColumnIndex: value === "(Entire Table)" ? -1 : columns.indexOf(value)}));
							setWindowFnValues((prevState: any) => ({ ...prevState, standingColumn: value }));
						} else {
							if(value === "standing"){
								setWindowFnValues((prevState: any) => ({ ...prevState, windowFnOptions: value }));
							}}}}}} else {
								if(option === "sliding"){
									if(subOption === "aggregation"){
										setWindowFnValues((prevState: any) => ({ ...prevState, slidingAggregation: value }));
									} else {
										if(subOption === "row"){
											setWindowFnValues((prevState: any) => ({ ...prevState, slidingRowIndex: value === "(Entire Table)" ? -1 : rows.indexOf(value) }));
											setWindowFnValues((prevState: any) => ({ ...prevState, slidingRow: value }));
										} else {
											if(subOption === "column") {
												setWindowFnValues((prevState: any) => ({ ...prevState, slidingColumnIndex: value === "(Entire Table)" ? -1 : columns.indexOf(value) }));
												setWindowFnValues((prevState: any) => ({ ...prevState, slidingColumn: value }));
											} else {
												if(value === "sliding"){
													setWindowFnValues((prevState: any) => ({ ...prevState, windowFnOptions: value }));
												}}}}} else {
													if(option === "standingsvssliding"){
														if(subOption === "percentage") {
															setWindowFnValues((prevState: any) => ({ ...prevState, percentage: value }));
														} else {
															if(subOption === "standingSlidingReferenceWn" ){
																setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingReferenceWn: value }));
															} else {
																if(subOption === "aggregation"){
																	setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingAggregation: value }));
																} else {
																	if(subOption === "row"){
																		setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingRowIndex: value === "(Entire Table)" ? -1 : rows.indexOf(value) }));
																		setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingRow: value }));
																	} else {
																		if(subOption === "column"){
																			setWindowFnValues((prevState: any) => ({ ...prevState,standingSlidingColumnIndex: value ===  "(Entire Table)" ? -1 : columns.indexOf(value) }));
																			setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingColumn: value }));
																		} else {
																			if(value === "standingsvssliding"){
																				setWindowFnValues((prevState: any) => ({ ...prevState, windowFnOptions: value }));
																			}}}}}}} else {
																				if(option === "defaultWindowFnValue"){
																					setWindowFnValues((prevState: any) => ({ 
																						...prevState, 
																						windowFnOptions: "standing",
																						rank: "Default",
																						order: "Descending",
																						standingRowIndex: -1,
																						standingColumnIndex: -1,
																						standingRow: "(Entire Table)",
																						standingColumn: "(Entire Table)",
																						slidingPreInc: -1,
																						slidingNextInc: 0,
																						slidingCurrent: 1,
																						slidingAggregation: "Sum",
																						slidingRowIndex: -1,
																						slidingColumnIndex: -1,
																						slidingRow: "(Entire Table)",
																						slidingColumn: "(Entire Table)",
																						slidingSlideDirection: "rowwise",
																						percentage: "Percentage from",
																						standingSlidingReferenceWn: "First",
																						standingSlidingPreInc: -1,
																						standingSlidingNextInc: 1,
																						standingSlidingCurrent: 1,
																						standingSlidingAggregation: "Sum",
																						standingSlidingRowIndex: -1,
																						standingSlidingColumnIndex: -1,
																						standingSlidingRow: "(Entire Table)",
																						standingSlidingColumn: "(Entire Table)",
																						standingSlidingSlideDirection: "rowwise",
																					}));
																					setStandingSlidingPNC(false);
																				}}}}};
	
	useEffect(()=>{ 
		//If mismatch of values between window function local state and chartAxes dimension, row, column and distribution, then local state value retain to its default value
		if(rows.length !== 0 || column.length !== 0){
			const standingRow = [windowFnValues.standingRow];
			const slidingRow = [windowFnValues.slidingRow];
			const standingSlidingRow = [windowFnValues.standingSlidingRow];
			const standingColumn = [windowFnValues.standingColumn];
			const slidingColumn = [windowFnValues.slidingColumn];
			const standingSlidingColumn = [windowFnValues.standingSlidingColumn];	
			const rowValues = ["(Entire Table)", ...rows];
			const columnValues = ["(Entire Table)", ...columns];
			const isStandingRowPresent = standingRow.some(value => rowValues.includes(value));
			const isSlidingRowPresent = slidingRow.some(value => rowValues.includes(value));
			const isStandingSlidingRowPresent = standingSlidingRow.some(value => rowValues.includes(value));
			const isStandingColumnPresent = standingColumn.some(value => columnValues.includes(value));
			const isSlidingColumnPresent = slidingColumn.some(value => columnValues.includes(value));
			const isStandingSlidingColumnPresent = standingSlidingColumn.some(value => columnValues.includes(value));
			if(isStandingRowPresent === false){
				handleChange("defaultWindowFnValue", "defaultWindowFnValue");
			} else{
				if(isSlidingRowPresent === false){
					handleChange("defaultWindowFnValue", "defaultWindowFnValue");
				} else {
					if(isStandingSlidingRowPresent === false){
						handleChange("defaultWindowFnValue", "defaultWindowFnValue"); 
					} else {
						if(isStandingColumnPresent === false){
							handleChange("defaultWindowFnValue", "defaultWindowFnValue");
						} else{
							if(isSlidingColumnPresent === false){
								handleChange("defaultWindowFnValue", "defaultWindowFnValue");   
							} else {
								if(isStandingSlidingColumnPresent === false){
									handleChange("defaultWindowFnValue", "defaultWindowFnValue");
								} 
							}}}}}
				  
		}
		
		if(chartAxesDimEmpty){
			handleChange("defaultWindowFnValue", "defaultWindowFnValue");
		}

		if(slidingCurrentDisable){
			setWindowFnValues((prevState: any) => ({ ...prevState, slidingCurrent: 1 }));
		} 

		if(standingSlidingCurrentDisable) {
			setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingCurrent: 1 }));
		}

		//If mismatch of values between local and redux state of window function, then window function redux state value will be null and local state values retain to its default values
		if(field.windowfn){
			if(rows.length !== 0 || columns.length !== 0){
				const windowfnvalue = field.windowfn;
				const standingRowValue = [windowfnvalue.standingRow];
				const slidingRowValue = [windowfnvalue.slidingRow];
				const standingSlidingRowValue = [windowfnvalue.standingSlidingRow];
				const standingColumnValue = [windowfnvalue.standingColumn];
				const slidingColumnValue = [windowfnvalue.slidingColumn];
				const standingSlidingColumnValue = [windowfnvalue.standingSlidingColumn];
				const rowValues = ["(Entire Table)", ...rows];
				const columnValues = ["(Entire Table)", ...columns];
				const isStandingRowPresentInRows = standingRowValue.some(value => rowValues.includes(value));
				const isSlidingRowPresentInRows = slidingRowValue.some(value => rowValues.includes(value));
				const isStandingSlidingRowPresentInRows = standingSlidingRowValue.some(value => rowValues.includes(value));
				const isStandingColumnsPresentInColumns = standingColumnValue.some(value => columnValues.includes(value));
				const isSlidingColumnsPresentInColumns = slidingColumnValue.some(value => columnValues.includes(value));
				const isStandingSlidingColumnsPresentInColumns = standingSlidingColumnValue.some(value => columnValues.includes(value));
				if (isStandingRowPresentInRows === false)
					{
						const field2 = {...field};
						field2.windowfn = null;
						updateQueryParam(propKey,bIndex,itemIndex,field2);
						handleChange("defaultWindowFnValue", "defaultWindowFnValue");
					} else {
						if (isSlidingRowPresentInRows === false){
							const field2 = {...field};
							field2.windowfn = null;
							updateQueryParam(propKey,bIndex,itemIndex,field2);
							handleChange("defaultWindowFnValue", "defaultWindowFnValue");
						} else {
							if (isStandingSlidingRowPresentInRows === false){
								const field2 = {...field};
								field2.windowfn = null;
								updateQueryParam(propKey,bIndex,itemIndex,field2);
							    handleChange("defaultWindowFnValue", "defaultWindowFnValue");
							} else {
								if (isStandingColumnsPresentInColumns === false){
									const field2 = {...field};
							        field2.windowfn = null;
							        updateQueryParam(propKey,bIndex,itemIndex,field2);
							        handleChange("defaultWindowFnValue", "defaultWindowFnValue");
								} else {
									if (isSlidingColumnsPresentInColumns === false){
										const field2 = {...field};
										field2.windowfn = null;
							            updateQueryParam(propKey,bIndex,itemIndex,field2);
							            handleChange("defaultWindowFnValue", "defaultWindowFnValue");
									} else {
										if (isStandingSlidingColumnsPresentInColumns === false){
											const field2 = {...field};
											field2.windowfn = null;
											updateQueryParam(propKey,bIndex,itemIndex,field2);
											handleChange("defaultWindowFnValue", "defaultWindowFnValue");
										}}}}}}} 
		}
			
	},[chartProp.properties[propKey].chartAxes[1].fields, chartAxesTwoDim, chartAxesDimEmpty, slidingCurrentDisable, standingSlidingCurrentDisable]);  
	
	return(
			<div>
				<Menu
				open={windowfn}
				onClose={() => setWindowfn(false)}
				sx={{marginLeft: "180px"}}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
				>
					<div className="standingBtn">
						<Button variant="contained" color= "inherit" size= "small"
						onClick={() => {
							handleChange("standing", "standing");
						}}
						sx= {windowFnValues.windowFnOptions === "standing" ?
						{width: "100%", textTransform: "initial", border: "1px solid transparent", borderRadius: "0", backgroundColor: "rgba(224,224,224,1)", fontSize: "12px", fontWeight: "600", boxShadow: "none",
						"&:hover" : {backgroundColor: "rgba(224,224,224,1)", boxShadow: "none", color: "rgb(87, 87, 87)", border: "1px solid transparent"}}
						:
						{width: "100%", textTransform: "initial", border: "1px solid rgba(224,224,224,1)", backgroundColor: "transparent", borderRadius: "0", color: "rgb(87, 87, 87)", fontSize: "12px", fontWeight: "600", boxShadow: "none", 
					    "&:hover" : {backgroundColor: "#F0F0F0", boxShadow: "none", color: "rgb(87, 87, 87)", border: "1px solid transparent"}}}
					>
					Standing
					</Button>
					</div>

					<div className="standingslidingBtn">
						<Button variant="contained" color= "inherit" size= "small"
						onClick={() => {
							handleChange("sliding", "sliding");
						}}
						sx={windowFnValues.windowFnOptions === "sliding" ? 
					    {width: "100%", textTransform: "initial",border: "1px solid transparent", borderRadius: "0", backgroundColor: "rgba(224,224,224,1)", fontSize: "12px", fontWeight: "600", boxShadow: "none", 
					    "&:hover" : {backgroundColor: "rgba(224,224,224,1)", boxShadow: "none", color: "rgb(87, 87, 87)", border: "1px solid transparent"}}
					    :
					    {width: "100%", textTransform: "initial", border: "1px solid rgba(224,224,224,1)", backgroundColor: "transparent", borderRadius: "0", color: "rgb(87, 87, 87)", fontSize: "12px", fontWeight: "600", boxShadow: "none", 
					    "&:hover" : {backgroundColor: "#F0F0F0", boxShadow: "none", color: "rgb(87, 87, 87)", border: "1px solid transparent"}}}>
					Sliding
					</Button>
					</div>

					<div className="standingslidingBtn">
						<Button variant="contained" color= "inherit" size= "small"
						onClick={() => {
							handleChange("standingsvssliding", "standingsvssliding");
						}}
						sx={windowFnValues.windowFnOptions === "standingsvssliding" ? 
					    {width: "100%", textTransform: "initial", border: "1px solid transparent", borderRadius: "0", backgroundColor: "rgba(224,224,224,1)", fontSize: "12px", fontWeight: "600", boxShadow: "none", 
					    "&:hover" : {backgroundColor: "rgba(224,224,224,1)", boxShadow: "none", color: "rgb(87, 87, 87)", border: "1px solid transparent"}}
					    :
						{width: "100%", textTransform: "initial", border: "1px solid rgba(224,224,224,1)", backgroundColor: "transparent", borderRadius: "0", color: "rgb(87, 87, 87)", fontSize: "12px", fontWeight: "600", boxShadow: "none", 
					    "&:hover" : {backgroundColor: "#F0F0F0", boxShadow: "none", color: "rgb(87, 87, 87)", border: "1px solid transparent"}}}>
					Standing vs Sliding
					</Button>
				    </div>

					{windowFnValues.windowFnOptions === "standing" ?
					<div>
					<div className="MenuSize">
					<div className="standingMain">
						<Typography sx={{fontSize: "12px", fontWeight: "600", color: "rgb(87, 87, 87)", paddingLeft: "15px", }}>Rank</Typography>
						{ranks.map((option, index) => (
							<div className="commonOption1" key={index} style={{ marginBottom: "0px" }}>
								<Radio size= "small"
								checked= {windowFnValues.rank === option}
								onChange= {(e) => handleChange(e.target.value, "standing", "rank")}
								value= {option}
								sx={{ ...radioButton, marginTop: "0", paddingTop: "0", paddingLeft: "15px",}}/>
								<Typography sx={{display: "flex", alignItems: "center",fontSize: "12px", marginTop: "0", paddingBottom: "7px"}}>{option}</Typography>
							</div>
							))}
					</div>
					
					<div>
						<Typography sx={{fontSize: "12px", fontWeight: "600", color: "rgb(96, 96, 96)", paddingLeft: "15px", marginTop:"2px"}}>Order</Typography>
						{orders.map((option, index) => (
							<div className="commonOption1" key={index}>
								<Radio size="small"
								checked= {windowFnValues.order === option}
								onChange={(e) => { handleChange(e.target.value, "standing", "order") }}
								value= {option}
								sx={{ ...radioButton, marginTop: "0", paddingTop: "0", paddingLeft: "15px",}}/>
								<Typography sx={{display: "flex", alignItems: "center",fontSize: "12px", marginTop: "0", paddingBottom: "7px" }}>{option}</Typography>
							</div>
							))}
					</div>
				    </div> 
				    </div>
	                :
					null
					}
					
					{windowFnValues.windowFnOptions === "sliding" ?
					<div>
					<div className="MenuSize">
							<Typography sx={{fontSize: "12px", paddingLeft: "15px", fontWeight: "600", color: "rgb(96, 96, 96)"}}>MOVING CALCULATION</Typography>
							<Typography sx={{fontSize: "12px", padding: "5px 0 0 15px", fontWeight: "600", color: "rgb(96, 96, 96)", }}>Reference Window</Typography>
							
							<div className="slidingRefWindow">
								<div className="commonOption3">
									<Typography sx={{fontSize: "12px", padding: "3px 0 0 17px"}}>Previous</Typography>
									
									<div className="slidingPrevious">
										<TextField
										value= {windowFnValues.slidingPreInc === -1 ? '' : windowFnValues.slidingPreInc}
										variant="outlined"
							            placeholder="All"
										type="number"
										onChange={e => {
											e.preventDefault();
							
											if(Number(e.target.value) >= 0){
												setWindowFnValues((prevState: any) => ({ ...prevState, slidingPreInc: parseInt(e.target.value) }));
											} else {
												setWindowFnValues((prevState: any) => ({ ...prevState, slidingPreInc: -1}));
											}
										}}
										InputProps={{ ...textFieldStyleProps }}
										sx={{ 
											'& .MuiOutlinedInput-root': {
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													border: "1px solid rgba(224,224,224,1)", // Change border color when focused
												},
												'&:hover .MuiOutlinedInput-notchedOutline': {
													border: "1px solid rgba(224,224,224,1)", // Change border color on hover
												},
												'.MuiOutlinedInput-notchedOutline': {
													border: "1px solid rgba(224,224,224,1)", // Change default border color
												},
											  },
										}}
										/>
						            </div>
					            </div>
								
								<div className="commonOption3">
									<Typography sx={{fontSize: "12px", padding: "3px 15px 0 12px"}}>Next</Typography>
									
									<div className="slidingNext">
										<TextField
						                value={windowFnValues.slidingNextInc === -1 ? '' : windowFnValues.slidingNextInc}
						                variant="outlined"
							            placeholder="All"
						                type="number"
										onChange={e => {
											e.preventDefault();
							
											if(Number(e.target.value) >= 0){
												setWindowFnValues((prevState: any) => ({ ...prevState, slidingNextInc: parseInt(e.target.value) }));
											}
											else{
												setWindowFnValues((prevState: any) => ({ ...prevState, slidingNextInc: -1 }));
											}
										}}
										InputProps={{ ...textFieldStyleProps  }}
										sx={{ 
											'& .MuiOutlinedInput-root': {
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													border: "1px solid rgba(224,224,224,1)", // Change border color when focused
												},
												'&:hover .MuiOutlinedInput-notchedOutline': {
													border: "1px solid rgba(224,224,224,1)", // Change border color on hover
												},
												'.MuiOutlinedInput-notchedOutline': {
													border: "1px solid rgba(224,224,224,1)", // Change default border color
												},
											  },
										}}
							            />
						            </div>
					            </div>
				            </div>
							
							{
								(windowFnValues.slidingPreInc !==  0 && windowFnValues.slidingNextInc !== 0) ||
								(windowFnValues.slidingPreInc ===  0 && windowFnValues.slidingNextInc === 0) 
								? 
								(   
								<div style={{display: "flex",  marginLeft: "6px"}} >
									<Checkbox size= "small" sx={{'& .MuiSvgIcon-root': { fontSize: 16 }}} 
									defaultChecked 
									disabled
									value = {windowFnValues.slidingCurrent}
									/>
									<Typography sx={{fontSize: "12px", marginTop: "10px"}}>Current</Typography>
								</div> 
								 )
								: 
								null
							} 
								
							{
								(windowFnValues.slidingPreInc !==  0 && windowFnValues.slidingNextInc === 0) ||
								(windowFnValues.slidingPreInc ===  0 && windowFnValues.slidingNextInc !== 0)
								?
								( 
								<div style={{display: "flex",  marginLeft: "6px"}}>
									<Checkbox size= "small"  
									sx={{...radioButton}}
									checked={windowFnValues.slidingCurrent} 
									onChange={(e) =>
										setWindowFnValues((prevState: any) => ({ ...prevState, slidingCurrent: e.target.checked ? 1 : 0}))
									}
									value = {windowFnValues.slidingCurrent}
									/>
									<Typography sx={{fontSize: "12px", marginTop: "10px"}}>Current</Typography>
					            </div> 
								) 
								:
								null
					        }
							
							<Typography sx={{fontSize: "12px", paddingLeft: "15px", fontWeight: "600", color: "rgb(96, 96, 96)", marginTop: "2px"}}>Aggregation</Typography>
							
							<FormControl fullWidth>
								<Select
								onChange={(e) => handleChange(e.target.value, "sliding", "aggregation")}
								value={windowFnValues.slidingAggregation}
						        sx={{...dropDownSelectStyle ,margin: "3px 15px 7px 15px",}}>
									{slidingAggregation.map((data,index) => (
										<MenuItem key={index} value={data} sx={{fontSize: "12px"}}>
											{data}
								        </MenuItem>
							        ))}
						        </Select>
				            </FormControl>
					</div>
					</div>
					:
					null
					}
					
					{windowFnValues.windowFnOptions === "standingsvssliding" ?
					<div>
						<div className="MenuSize">
							<div>
								{percentages.map((option, index) => (
									<div className="commonOption2" key={index}>
										<Radio size= "small"
										checked= {windowFnValues.percentage === option}
							            onChange={(e) => { handleChange(e.target.value, "standingsvssliding", "percentage")}}
							            value= {option}
							            sx={{ ...radioButton, marginTop: "0", paddingTop: "0", paddingLeft: "15px",}}/>
										<Typography sx={{display: "flex", alignItems: "center",fontSize: "12px", marginTop: "0", padding: "0 15px 7px 0"}}>{option}</Typography>
					                </div>
						            ))}
			                </div>
							
							<Typography sx={{fontSize: "12px", fontWeight: "600", color: "rgb(96, 96, 96)", paddingLeft: "15px", marginTop: "2px"}}>
								Reference Window
							</Typography>
							
							<div className="windowFnStandingSlidingRefWindow">
								<div className="commonOption1">
									<Radio size="small"
									checked= {windowFnValues.standingSlidingReferenceWn === "First"}
							        onChange={(e) => { 
										handleChange(e.target.value, "standingsvssliding" , "standingSlidingReferenceWn");
										setStandingSlidingPNC(false);
									}}
							        value= "First"
							        sx={{ ...radioButton, marginTop: "0", paddingTop: "0",}}/>
									<Typography sx={{display: "flex", alignItems: "center",fontSize: "12px", marginTop: "0", paddingBottom: "7px"}}>First</Typography>
                                </div>
									
								<div className="commonOption2">
									<Radio size="small"
									checked= {windowFnValues.standingSlidingReferenceWn === "Last"}
							        onChange={(e) => { 
										handleChange(e.target.value, "standingsvssliding" , "standingSlidingReferenceWn");
										setStandingSlidingPNC(false);
									}}
							        value= "Last" 
							        sx={{ ...radioButton, marginTop: "0", paddingTop: "0",}}/> 
									<Typography sx={{display: "flex", alignItems: "center",fontSize: "12px", marginTop: "0", paddingBottom: "7px" }}>Last</Typography>
                                </div>
									
								<div className="commonOption2">
									<Radio size="small"
									checked= {windowFnValues.standingSlidingReferenceWn === "PNC"}
							        onChange={(e) => { 
										handleChange(e.target.value, "standingsvssliding" , "standingSlidingReferenceWn");
										setStandingSlidingPNC(true)
									}}
							        value= "PNC"
							        sx={{ ...radioButton, marginTop: "0", paddingTop: "0",}}/>
									
									<div className="commonOption3">
										<Typography sx={{fontSize: "12px"}}>Previous</Typography>
											
										<div className="standingSlidingPrevious">
											<TextField
											value= {windowFnValues.standingSlidingPreInc === -1 ? '' : windowFnValues.standingSlidingPreInc}
											disabled= {standingSlidingPNC === false}
											variant="outlined"
						                    type="number"
						                    placeholder= {"All"}
											onChange={e => {
							                e.preventDefault();
							
											if(Number(e.target.value) >= 0){
												setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingPreInc: parseInt(e.target.value) }));
											} else {
												setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingPreInc: -1 }));
											}
										    }}
										    InputProps={{ ...textFieldStyleProps }}
											sx={{ 
												'& .MuiOutlinedInput-root': {
													'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
														border: "1px solid rgba(224,224,224,1)", // Change border color when focused
													},
													'&:hover .MuiOutlinedInput-notchedOutline': {
														border: "1px solid rgba(224,224,224,1)", // Change border color on hover
													},
													'.MuiOutlinedInput-notchedOutline': {
														border: "1px solid rgba(224,224,224,1)", // Change default border color
													},
												  },
											}}
										    />
							            </div>
					                </div>
										
									<div className="commonOption3">
										<Typography sx={{fontSize: "12px", paddingLeft: "2px"}}>Next</Typography>
											
										<div className="standingSlidingNext">
											<TextField
						                    value= {windowFnValues.standingSlidingNextInc === -1 ? '' : windowFnValues.standingSlidingNextInc}
											disabled= {standingSlidingPNC === false}
											variant="outlined"
						                    type="number"
						                    placeholder= {"All"}
						                    onChange={e => {
												e.preventDefault();
							
												if(Number(e.target.value) >= 0){
													setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingNextInc: parseInt(e.target.value) }));
												} else {
													setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingNextInc: -1}));
												}
											}}
											InputProps={{ ...textFieldStyleProps }}
											sx={{ 
												'& .MuiOutlinedInput-root': {
													'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
														border: "1px solid rgba(224,224,224,1)", // Change border color when focused
													},
													'&:hover .MuiOutlinedInput-notchedOutline': {
														border: "1px solid rgba(224,224,224,1)", // Change border color on hover
													},
													'.MuiOutlinedInput-notchedOutline': {
														border: "1px solid rgba(224,224,224,1)", // Change default border color
													},
												  },
											}}
											/>
										</div>
					                </div>
					            </div>
								
								{
									(windowFnValues.standingSlidingPreInc !==  0 && windowFnValues.standingSlidingNextInc !== 0) ||
									(windowFnValues.standingSlidingPreInc ===  0 && windowFnValues.standingSlidingNextInc === 0) 
									? 
									(
										<div style={{display: "flex",  marginLeft: "24px"}} >
											<Checkbox size= "small" sx={{'& .MuiSvgIcon-root': { fontSize: 16}}}
											disabled
											defaultChecked
											value = {windowFnValues.standingSlidingCurrent}
											/>
											<Typography sx={{fontSize: "12px", marginTop: "10px"}}>Current</Typography>
										</div> 
									)
									: 
									null
								}
											
								{
									(windowFnValues.standingSlidingPreInc !==  0 && windowFnValues.standingSlidingNextInc === 0) ||
									(windowFnValues.standingSlidingPreInc ===  0 && windowFnValues.standingSlidingNextInc !== 0) 
									?
									( 
										<div style={{display: "flex",  marginLeft: "24px"}}>
											<Checkbox size= "small"  
											sx={{...radioButton}}
											checked={windowFnValues.standingSlidingCurrent} 
											disabled = {standingSlidingPNC === false}
											onChange={(e) =>
												setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingCurrent: e.target.checked ? 1 : 0}))
											}
											value = {windowFnValues.standingSlidingCurrent}
											/>
											<Typography sx={{fontSize: "12px", marginTop: "10px"}}>Current</Typography>
										</div> 
									) 
									:
									null
							    }
							</div>
							
							<Typography sx={{fontSize: "12px", paddingLeft: "15px", fontWeight: "600", color: "rgb(96, 96, 96)", marginTop: "12px",}}>Aggregation</Typography>
							<FormControl fullWidth>
								<Select
								onChange={(e) => handleChange(e.target.value, "standingsvssliding", "aggregation")}
						        value={windowFnValues.standingSlidingAggregation}
						        sx={{...dropDownSelectStyle, margin: "3px 15px 7px 15px"}}>
									{standingSlidingAggregation.map((data,index) => (
										<MenuItem key={index} value={data} sx={{fontSize: "12px"}}>
											{data}
										</MenuItem>
							        ))}
						        </Select>
				            </FormControl>	
			            </div>
					</div>
					: 
					null
					}
					
					<Typography sx={{fontSize: "12px", paddingLeft: "15px", fontWeight: "600", color: "rgb(96, 96, 96)", marginTop: "5px", }}>
						{chartType === "heatmap" || chartType === "crossTab" || chartType === "table" ? "per Row" : 
						chartType === "calendar" ? "per Date" : "per Dimension"}
					</Typography>
					
					<FormControl fullWidth>	
						<Select
						disabled= {chartProp.properties[propKey].chartAxes[1].fields.length === 0}
						onChange={(e) => windowFnValues.windowFnOptions === "standing" ? handleChange(e.target.value, "standing", "row") :
						windowFnValues.windowFnOptions === "sliding" ? handleChange(e.target.value, "sliding", "row") :  
						windowFnValues.windowFnOptions === "standingsvssliding" ?  handleChange(e.target.value, "standingsvssliding", "row") : null }
				            
						value={windowFnValues.windowFnOptions === "standing" ?  windowFnValues.standingRow :
						windowFnValues.windowFnOptions === "sliding" ? windowFnValues.slidingRow :
						windowFnValues.windowFnOptions === "standingsvssliding" ? windowFnValues.standingSlidingRow : null }
						sx={{...dropDownSelectStyle, margin: "3px 15px 0 15px",}}
						>
							<MenuItem value= "(Entire Table)" sx={{ fontSize: "12px", padding: "2px 1rem" }}>(Entire Table)</MenuItem>
							{rows.length > 0 ?
							rows.map((row, i) => (
								<MenuItem key={i} value={row} sx={{ fontSize: "12px", padding: "2px 1rem" }}>
									{row.timeGrain ? `${row.timeGrain} of ${row.fieldname}` : row.fieldname} 
								</MenuItem>
							))
							: 
							null
							}
				        </Select>
			        </FormControl>
				    
					{
						["heatmap", "crossTab", "boxPlot"].includes(chartType) ?
						<div>
							<Typography sx={{fontSize: "12px", paddingLeft: "15px", fontWeight: "600", color: "rgb(96, 96, 96)", marginTop: "12px", }}>
								{chartType === "boxPlot" ? "per Distribution" : "per Column"} 
							</Typography>
							
							<FormControl fullWidth>
								<Select 
								disabled= {chartProp.properties[propKey].chartAxes[2].fields.length === 0}
								onChange={(e) => windowFnValues.windowFnOptions === "standing" ? handleChange(e.target.value, "standing", "column") : 
								windowFnValues.windowFnOptions === "sliding" ? handleChange(e.target.value, "sliding", "column") :  
				                windowFnValues.windowFnOptions === "standingsvssliding"  ?  handleChange(e.target.value, "standingsvssliding", "column") 
				                    : null
								}
								value={windowFnValues.windowFnOptions === "standing" ? windowFnValues.standingColumn :
									windowFnValues.windowFnOptions === "sliding" ? windowFnValues.slidingColumn :
									windowFnValues.windowFnOptions === "standingsvssliding" ? windowFnValues.standingSlidingColumn :
									null
								}
								sx={{...dropDownSelectStyle, margin: "3px 15px 0 15px",}}>
									<MenuItem value= "(Entire Table)" sx={{ fontSize: "12px", padding: "2px 1rem" }}>(Entire Table)</MenuItem>
									{columns.length > 0 ?
									columns.map((column, i) => (
										<MenuItem key={i} value={column} sx={{ fontSize: "12px", padding: "2px 1rem" }}>
											{column.timeGrain ? `${column.timeGrain} of ${column.fieldname}` : column.fieldname}
										</MenuItem>
						            ))
									: null
									}
				                </Select>
			                </FormControl>
						</div>
						:
						null
			        }
					
					{
					(windowFnValues.windowFnOptions === "standingsvssliding" && ["heatmap", "crossTab", "boxPlot"].includes(chartType)) || 
					(windowFnValues.windowFnOptions === "sliding"  && ["heatmap", "crossTab", "boxPlot"].includes(chartType) ) 
					?
					<div>
						<Typography sx={{fontSize: "12px", paddingLeft: "15px", fontWeight: "600", color: "rgb(96, 96, 96)", marginTop: "12px", }}>Slide Direction</Typography>
						
							{chartProp.properties[propKey].chartAxes[1].fields.length === 0 || chartProp.properties[propKey].chartAxes[2].fields.length === 0 ? 
							<div className="commonOption2">
								<div
								style={{borderRadius: "2px 0 0 2px", margin: "3px 0 0 15px", color: "rgba(0, 0, 0, 0.38)"}}
								className={ windowFnValues.windowFnOptions === "sliding" && windowFnValues.slidingSlideDirection === "rowwise" ? "slideDirectionSelected" :
								windowFnValues.windowFnOptions === "standingsvssliding" && windowFnValues.standingSlidingSlideDirection === "rowwise" ?
								"slideDirectionSelected" : "slideDirection" }>
									Row wise
							    </div>
								
								<div style={{borderRadius: "0 2px 2px 0", margin: "3px 15px 0 0", color: "rgba(0, 0, 0, 0.38)"}} 
								className={ windowFnValues.windowFnOptions === "sliding" && windowFnValues.slidingSlideDirection === "columnwise" ? "slideDirectionSelected" :
								windowFnValues.windowFnOptions === "standingsvssliding" && windowFnValues.standingSlidingSlideDirection === "columnwise" ?
								"slideDirectionSelected" : "slideDirection" }>
									Column wise
			                    </div>
							</div>
							:
							<div className="commonOption2">
								<div onClick={(e) => {
									e.preventDefault();
									if(windowFnValues.windowFnOptions === "sliding"){
										setWindowFnValues((prevState: any) => ({ ...prevState, slidingSlideDirection: "rowwise"}));
									} else{
										if(windowFnValues.windowFnOptions === "standingsvssliding"){
											setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingSlideDirection: "rowwise"}));
										}
									}
							    }}
							    style={{borderRadius: "2px 0 0 2px", margin: "3px 0 0 15px"}}
							    className={ windowFnValues.windowFnOptions === "sliding" && windowFnValues.slidingSlideDirection === "rowwise" ? "slideDirectionSelected" :
								windowFnValues.windowFnOptions === "standingsvssliding" && windowFnValues.standingSlidingSlideDirection === "rowwise" ?
								"slideDirectionSelected" : "slideDirection" }>
									Row wise
							    </div>
								
								<div onClick={(e) => {
									e.preventDefault();
									if(windowFnValues.windowFnOptions === "sliding"){
										setWindowFnValues((prevState: any) => ({ ...prevState, slidingSlideDirection: "columnwise"}));
									} else{
										if(windowFnValues.windowFnOptions === "standingsvssliding"){
											setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingSlideDirection: "columnwise"}));
										}
									}
								}}
								style={{borderRadius: "0 2px 2px 0", margin: "3px 15px 0 0"}} 
								className={ windowFnValues.windowFnOptions === "sliding" && windowFnValues.slidingSlideDirection === "columnwise" ? "slideDirectionSelected" :
								windowFnValues.windowFnOptions === "standingsvssliding" && windowFnValues.standingSlidingSlideDirection === "columnwise" ?
								"slideDirectionSelected" : "slideDirection" }>
									Column wise
			                    </div>
							</div>
					        }
			        </div>
					:
			        null
					}
					
					<div className="canelOkBtn">
						<div className="cancelBtn">
							<Button variant="outlined" color= "inherit" size="small"
							onClick={() => setWindowfn(false)}
					 		sx={{fontSize: "12px", boxShadow: "none", border: "2px solid rgba(224,224,224,1)", borderRadius: "2px", textTransform: "initial",
					        "&:hover" : {backgroundColor: "transparent", boxShadow: "0px 0px 2px 1px rgb(199, 199, 199)"}}}>
								Cancel
			                </Button> 
			            </div>
						
						<div className="okBtn">
							<Button variant="outlined" color= "inherit" size="small"
							onClick={() => {
								setWindowfn(false);
								var field2 = JSON.parse(JSON.stringify(field));
								field2.windowfn = windowFnValues;
								updateQueryParam(propKey, bIndex, itemIndex, field2);
							}}
							sx={{fontSize: "12px", boxShadow: "none", border: "2px solid #af99db", borderRadius: "2px", textTransform: "initial",
							"&:hover" : {backgroundColor: "transparent", boxShadow: "0px 0px 2px 1px #af99db"}}}>
								Ok
							</Button> 
			            </div>
			        </div>
                </Menu>
			</div>
		)
	};
	
	const mapStateToProps = (state: TabTileStateProps2 & ChartPropertiesStateProps & any) => {
		return {
			tabTileProps: state.tabTileProps,
			chartProp: state.chartProperties,
			chartControls: state.chartControls,
		};
	};

	const mapDispatchToProps = (dispatch: Dispatch<any>) => {
		return { 
			updateQueryParam: (propKey: string, binIndex: number, itemIndex: number, item: any) =>
			    dispatch(editChartPropItem("updateQuery", { propKey, binIndex, itemIndex, item })),
			
		};
	}; 

export default connect(mapStateToProps, mapDispatchToProps) (WindowFunction);
