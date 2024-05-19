import {Button, Checkbox, FormControl, Menu, MenuItem, Radio, Select, TextField, Typography} from "@mui/material";
import { useEffect, useState } from "react";
import { ChartPropertiesProps } from "../../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { TabTileStateProps } from "../../../redux/TabTile/TabTilePropsInterfaces";
import { connect } from "react-redux";
import { TabTileStateProps2 } from "../../../redux/TabTile/TabTilePropsInterfaces";
import { ChartPropertiesStateProps } from "../../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { Dispatch } from "redux";
import { editChartPropItem } from "../../../redux/ChartPoperties/ChartPropertiesActions";
import {fieldName} from '../../CommonFunctions/CommonFunctions';

interface WindowFunctionProps {
	anchorElm: any;
	haswindowfn: boolean;
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
		anchorElm,
		haswindowfn,
		setWindowfn,
		propKey,
		bIndex,
		itemIndex,
        
		//state
		chartProp,
		tabTileProps,
		chartControls,

		// dispatch,
	    updateQueryParam,
	}: WindowFunctionProps) => {
		
    var chartType = chartProp.properties[`${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`].chartType;
    var field = chartProp.properties[propKey].chartAxes[bIndex].fields[itemIndex];
	let defaultWFObject = {
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
	};
	
	field.dataType = field.dataType.toLowerCase();

	const [windowFnValues, setWindowFnValues] = useState<any>(
		field.windowfn ? field.windowfn  : JSON.parse(JSON.stringify(defaultWFObject))  
		);

	//Fetch fields from Dimension, Row, Column, Distribution
	var rows: any[] = [];
	var columns: any[] = [];
	
	if(chartProp.properties[propKey].chartAxes[1].fields.length > 0){
		chartProp.properties[propKey].chartAxes[1].fields.forEach((item:any)=>{
			rows.push(fieldName(item));
		})
	} 
	
	if(["heatmap", "crossTab", "boxPlot"].includes(chartType)){
		if(chartProp.properties[propKey].chartAxes[2].fields.length > 0){
			chartProp.properties[propKey].chartAxes[2].fields.forEach((item:any)=>{
				columns.push(fieldName(item));
			})
			
		}
	} 

	const chartAxesTwoDim = chartProp.properties[propKey].chartAxes[2] ? chartProp.properties[propKey].chartAxes[2].fields : null;

	//If below condition get satisfied, then window function get disabled and its state values retain to its default values
	const chartAxesDimEmpty = ["heatmap", "crossTab", "boxPlot"].includes(chartType) && chartProp.properties[propKey].chartAxes[1].fields.length === 0 && 
	chartProp.properties[propKey].chartAxes[2].fields.length === 0 || !["heatmap", "crossTab", "boxPlot", "richText"].includes(chartType) &&
	chartProp.properties[propKey].chartAxes[1].fields.length === 0;
    
	//Below condition get satisfied, then current(windowFnOption) in sliding and standingvssliding get checked and disabled
	const slidingCurrentDisable = windowFnValues.slidingPreInc !== 0 && windowFnValues.slidingNextInc !== 0 || windowFnValues.slidingPreInc === 0 && windowFnValues.slidingNextInc === 0;
	const standingSlidingCurrentDisable = windowFnValues.standingSlidingPreInc !== 0 && windowFnValues.standingSlidingNextInc !== 0 || windowFnValues.standingSlidingPreInc === 0 && windowFnValues.standingSlidingNextInc === 0;


	useEffect(()=>{ 	
		
		if(rows.length !== 0 || columns.length !== 0){
		const rowValues = ["(Entire Table)", ...rows];
		const columnValues = ["(Entire Table)", ...columns];
		const isStandingRowPresent = [windowFnValues.standingRow].some(value => rowValues.includes(value));
		const isSlidingRowPresent = [windowFnValues.slidingRow].some(value => rowValues.includes(value));
		const isStandingSlidingRowPresent = [windowFnValues.standingSlidingRow].some(value => rowValues.includes(value));
		const isStandingColumnPresent = [windowFnValues.standingColumn].some(value => columnValues.includes(value));
		const isSlidingColumnPresent = [windowFnValues.slidingColumn].some(value => columnValues.includes(value));
		const isStandingSlidingColumnPresent = [windowFnValues.standingSlidingColumn].some(value => columnValues.includes(value));
		
		
	   if(isStandingRowPresent === false || isSlidingRowPresent === false || isStandingSlidingRowPresent === false ||
			isStandingColumnPresent === false || isSlidingColumnPresent === false || isStandingSlidingColumnPresent === false 
		 ){
			setWindowFnValues((prevState: any) => ({ 
				...prevState, 
				...defaultWFObject 
			}));

		}
	}

	if(chartAxesDimEmpty){
		setWindowFnValues((prevState: any) => ({ 
			...prevState, 
			...defaultWFObject 
		}));

		//setStandingSlidingPNC(false);
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

				if (isStandingRowPresentInRows === false || isSlidingRowPresentInRows === false || isStandingSlidingRowPresentInRows === false ||
					isStandingColumnsPresentInColumns === false || isSlidingColumnsPresentInColumns === false|| isStandingSlidingColumnsPresentInColumns === false
				)
					{
						const field2 = {...field};
						field2.windowfn = null;
						updateQueryParam(propKey,bIndex,itemIndex,field2);

						setWindowFnValues((prevState: any) => ({ 
							...prevState, 
							...defaultWFObject 
						}));

					}
				
			}
		}

	
			
	},[chartProp.properties[propKey].chartAxes[1].fields, chartAxesTwoDim, chartAxesDimEmpty, slidingCurrentDisable, standingSlidingCurrentDisable]);  
	
		

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

	const buttonStyle1 = {width: "100%", textTransform: "initial", border: "1px solid transparent", borderRadius: "0", backgroundColor: "rgba(224,224,224,1)", fontSize: "12px", fontWeight: "600", boxShadow: "none",
	"&:hover" : {backgroundColor: "rgba(224,224,224,1)", boxShadow: "none", color: "rgb(87, 87, 87)", border: "1px solid transparent"}}
	
	

	const buttonStyle2 ={width: "100%", textTransform: "initial", border: "1px solid rgba(224,224,224,1)", backgroundColor: "transparent", borderRadius: "0", color: "rgb(87, 87, 87)", fontSize: "12px", fontWeight: "600", boxShadow: "none", 
	"&:hover" : {backgroundColor: "#F0F0F0", boxShadow: "none", color: "rgb(87, 87, 87)", border: "1px solid transparent"}}

	const muiOutlinedInputStyle = { 
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

	
//windowFnValues

// Update individual properties within the object
const handleChange = (value: any, subOption?: string) => {
	switch(windowFnValues.windowFnOptions){
		case "standing":
			if(subOption === "row"){
				setWindowFnValues((prevState: any) => ({ ...prevState, standingRowIndex: value === "(Entire Table)" ? -1 : rows.indexOf(value) }));	
				setWindowFnValues((prevState: any) => ({ ...prevState, standingRow: value }));
			} 
			else if(subOption === "column"){
				setWindowFnValues((prevState: any) => ({ ...prevState, standingColumnIndex: value === "(Entire Table)" ? -1 : columns.indexOf(value)}));
				setWindowFnValues((prevState: any) => ({ ...prevState, standingColumn: value }));
			}
		break;
		case "sliding":
			if(subOption === "row"){
				setWindowFnValues((prevState: any) => ({ ...prevState, slidingRowIndex: value === "(Entire Table)" ? -1 : rows.indexOf(value) }));
				setWindowFnValues((prevState: any) => ({ ...prevState, slidingRow: value }));
			} else if(subOption === "column") {
				setWindowFnValues((prevState: any) => ({ ...prevState, slidingColumnIndex: value === "(Entire Table)" ? -1 : columns.indexOf(value) }));
				setWindowFnValues((prevState: any) => ({ ...prevState, slidingColumn: value }));
			}
		break;
		case "standingsvssliding":
			if(subOption === "row"){
				setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingRowIndex: value === "(Entire Table)" ? -1 : rows.indexOf(value) }));
				setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingRow: value }));
			} else if(subOption === "column"){
				setWindowFnValues((prevState: any) => ({ ...prevState,standingSlidingColumnIndex: value ===  "(Entire Table)" ? -1 : columns.indexOf(value) }));
				setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingColumn: value }));
			}
		break;
	}
}

	
	return(
			<div>
				<Menu
				anchorEl={anchorElm}
				open={haswindowfn}
				onClose={() => setWindowfn(false)}
				sx={{marginLeft: "180px"}}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
				>
					<div className="standingBtn">
						<Button variant="contained" color= "inherit" size= "small"
						onClick={() => {
							setWindowFnValues((prevState: any) => ({ ...prevState, windowFnOptions: "standing" }));
						}}
						sx= {windowFnValues.windowFnOptions === "standing" ? buttonStyle1 : buttonStyle2}
					>
					Standing
					</Button>
					</div>

					<div className="standingslidingBtn">
						<Button variant="contained" color= "inherit" size= "small"
						onClick={() => {
							setWindowFnValues((prevState: any) => ({ ...prevState, windowFnOptions: "sliding" }));
						}}
						sx={windowFnValues.windowFnOptions === "sliding" ? buttonStyle1 : buttonStyle2}>
					Sliding
					</Button>
					</div>

					<div className="standingslidingBtn">
						<Button variant="contained" color= "inherit" size= "small"
						onClick={() => {
							setWindowFnValues((prevState: any) => ({ ...prevState, windowFnOptions: "standingsvssliding" }));
						}}
						sx={windowFnValues.windowFnOptions === "standingsvssliding" ? buttonStyle1 : buttonStyle2}>
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
								onChange= {(e) => {
									setWindowFnValues((prevState: any) => ({ ...prevState, rank: e.target.value }));
								}}
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
								onChange={(e) => {setWindowFnValues((prevState: any) => ({ ...prevState, order: e.target.value }))}}
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
										sx={muiOutlinedInputStyle}
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
										sx={muiOutlinedInputStyle}
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
									checked={windowFnValues.slidingCurrent === 1} 
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
								onChange={(e) => setWindowFnValues((prevState: any) => ({ ...prevState, slidingAggregation: e.target.value }))}
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
							            onChange={(e) => {setWindowFnValues((prevState: any) => ({ ...prevState, percentage: e.target.value }))}}
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
										setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingReferenceWn: e.target.value }));
										//setStandingSlidingPNC(false);
									}}
							        value= "First"
							        sx={{ ...radioButton, marginTop: "0", paddingTop: "0",}}/>
									<Typography sx={{display: "flex", alignItems: "center",fontSize: "12px", marginTop: "0", paddingBottom: "7px"}}>First</Typography>
                                </div>
									
								<div className="commonOption2">
									<Radio size="small"
									checked= {windowFnValues.standingSlidingReferenceWn === "Last"}
							        onChange={(e) => { 
										setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingReferenceWn: e.target.value }));
										//setStandingSlidingPNC(false);
									}}
							        value= "Last" 
							        sx={{ ...radioButton, marginTop: "0", paddingTop: "0",}}/> 
									<Typography sx={{display: "flex", alignItems: "center",fontSize: "12px", marginTop: "0", paddingBottom: "7px" }}>Last</Typography>
                                </div>
									
								<div className="commonOption2">
									<Radio size="small"
									checked= {windowFnValues.standingSlidingReferenceWn === "PNC"}
							        onChange={(e) => { 
										setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingReferenceWn: e.target.value }));
										//setStandingSlidingPNC(true)
									}}
							        value= "PNC"
							        sx={{ ...radioButton, marginTop: "0", paddingTop: "0",}}/>
									
									<div className="commonOption3">
										<Typography sx={{fontSize: "12px"}}>Previous</Typography>
											
										<div className="standingSlidingPrevious">
											<TextField
											value= {windowFnValues.standingSlidingPreInc === -1 ? '' : windowFnValues.standingSlidingPreInc}
											disabled= {windowFnValues.standingSlidingReferenceWn !== "PNC"}
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
											sx={muiOutlinedInputStyle}
										    />
							            </div>
					                </div>
										
									<div className="commonOption3">
										<Typography sx={{fontSize: "12px", paddingLeft: "2px"}}>Next</Typography>
											
										<div className="standingSlidingNext">
											<TextField
						                    value= {windowFnValues.standingSlidingNextInc === -1 ? '' : windowFnValues.standingSlidingNextInc}
											disabled= {windowFnValues.standingSlidingReferenceWn !== "PNC"}
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
											sx={muiOutlinedInputStyle}
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
											checked={windowFnValues.standingSlidingCurrent === 1} 
											disabled = {windowFnValues.standingSlidingReferenceWn !== "PNC"}
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
								onChange={(e) => setWindowFnValues((prevState: any) => ({ ...prevState, standingSlidingAggregation: e.target.value }))}
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
						onChange={(e) => handleChange(e.target.value,  "row")  }
				        value={windowFnValues.windowFnOptions === "standing" ?  windowFnValues.standingRow :
						windowFnValues.windowFnOptions === "sliding" ? windowFnValues.slidingRow :
						windowFnValues.windowFnOptions === "standingsvssliding" ? windowFnValues.standingSlidingRow : null}
						
						sx={{...dropDownSelectStyle, margin: "3px 15px 0 15px",}}
						>
							<MenuItem value= "(Entire Table)" sx={{ fontSize: "12px", padding: "2px 1rem" }}>(Entire Table)</MenuItem>
							{rows.length > 0 ?
							rows.map((row, i) => (
								<MenuItem key={i} value={row} sx={{ fontSize: "12px", padding: "2px 1rem" }}
								selected = { i === (windowFnValues.windowFnOptions === "standing" ?  windowFnValues.standingRowIndex :
								windowFnValues.windowFnOptions === "sliding" ? windowFnValues.slidingRowIndex :
								windowFnValues.windowFnOptions === "standingsvssliding" ? windowFnValues.standingSlidingRowIndex : -1) }
								>									
									{row} 
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
								onChange={(e) => handleChange(e.target.value,  "column")}
								value={windowFnValues.windowFnOptions === "standing" ? windowFnValues.standingColumn :
								windowFnValues.windowFnOptions === "sliding" ? windowFnValues.slidingColumn :
								windowFnValues.windowFnOptions === "standingsvssliding" ? windowFnValues.standingSlidingColumn :
									null
								}
								sx={{...dropDownSelectStyle, margin: "3px 15px 0 15px",}}>
									<MenuItem value= "(Entire Table)" sx={{ fontSize: "12px", padding: "2px 1rem" }}>(Entire Table)</MenuItem>
									{columns.length > 0 ?
									columns.map((column, i) => (
										<MenuItem key={i} value={column} sx={{ fontSize: "12px", padding: "2px 1rem" }}
										selected={ i === (windowFnValues.windowFnOptions === "standing" ? windowFnValues.standingColumnIndex :
										windowFnValues.windowFnOptions === "sliding" ? windowFnValues.slidingColumnIndex :
										windowFnValues.windowFnOptions === "standingsvssliding" ? windowFnValues.standingSlidingColumnIndex :
										-1)
									}
										>
											{column}
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
