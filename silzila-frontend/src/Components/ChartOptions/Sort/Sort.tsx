import React, {  useState, useEffect, Dispatch } from 'react';
import { connect} from 'react-redux';
import "../ChartOptions.css";
import { SortChartData, SortOrder, SortedValue } from "../../../redux/ChartPoperties/ChartControlsActions";
import { FormControl, MenuItem, Select, Typography } from '@mui/material';

interface Props {
	chartControls: any;
	tabTileProps: any;

	SortChartData: (propKey: string, chartData: string | any) => void;
	SortOrder: (propKey: string, order: string) => void;
	SortedValue: (propKey: string, chartData: string | any) => void;
  }

const Sort = ({
  //state
	chartControls,
    tabTileProps,

  //dispatch
    SortChartData,
	SortOrder,
	SortedValue
}: Props) => { 
	const[ascDescNotify, setAscDescNotify] = useState<string>("");
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`; 
	// Getting chartData 
	const data: string | any = chartControls.properties[propKey].chartData.length > 0 ? chartControls.properties[propKey].chartData : [];
	
    useEffect(()=>{ 
		if(chartControls.properties[propKey].sortOrder !== ""){
			if(chartControls.properties[propKey].sortOrder === "Ascending")
			{
				handleAsc();
			} else {
				handleDesc();
			}}
	},[chartControls.properties[propKey].sortedValue]); 

	// Shallow copy of data
	var chartData: string | any = [...data];
	var descendingChartData: string | any = [...data];
    
	// Getting the keys of first object in chartData array
	const firstObjKey = chartData.length > 0 ? Object.keys(chartData[0]) : [];  
	
	// Update the selected column to the state
	const handleSelectedColumnValue = (event: string | any) => { 
		setAscDescNotify("");
		SortedValue(propKey, event.target.value);
    };
    
	// Creates an ascending order of selected column
	const handleAsc = () => {
		const sortedDataAscending = chartData.sort((a: string | any , b: string | any) => { 
			const sortedValueA = a[chartControls.properties[propKey].sortedValue];
			const sortedValueB = b[chartControls.properties[propKey].sortedValue];
		
			if (typeof sortedValueA === 'number' && typeof sortedValueB === 'number') {
			  return sortedValueA - sortedValueB; // Numeric comparison
			} else if (typeof sortedValueA === 'string' && typeof sortedValueB === 'string') {
			  return sortedValueA.localeCompare(sortedValueB); // String comparison
			} else {
			  // Handle other data types 
			  return sortedValueA - sortedValueB;
			}
		  });
		  chartData = sortedDataAscending;
		  SortChartData(propKey, chartData);
	}
    
	// Creates an descending order of selected column
	const handleDesc = () => {
		const sortedDataDescending = descendingChartData.sort((a: string | any, b: string | any) => { 
			const sortedValueA = a[chartControls.properties[propKey].sortedValue];
			const sortedValueB = b[chartControls.properties[propKey].sortedValue];
		
			if (typeof sortedValueB === 'number' && typeof sortedValueA === 'number') {
			  return sortedValueB - sortedValueA; // Numeric comparison
			} else if (typeof sortedValueB === 'string' && typeof sortedValueA === 'string') {
			  return sortedValueB.localeCompare(sortedValueA); // String comparison
			} else {
			  // Handle other data types 
			  return sortedValueB - sortedValueA;
			}
		});
		descendingChartData = sortedDataDescending; 
		SortChartData(propKey, descendingChartData);
	}  
	
	// Non equal value between local state and redux state get erased
	if(chartControls.properties[propKey].sortedValue !== "") {
		if(firstObjKey.length !== 0){
		const find = firstObjKey.some(value => value === chartControls.properties[propKey].sortedValue);
		if(find === false){
			SortedValue(propKey, "");
			SortOrder(propKey, "");
		}
	}}
	
	return (
		<React.Fragment>
			{data.length > 0 ?
			/* Enable Sort Component */
			(
				<div>
					<div className='sort'>Sortby</div>
					
					{/* itreate and display firstObjKey */}
					<div>
						<FormControl fullWidth  sx={{margin: "0 10px 0 10px"}}>

							{chartControls.properties[propKey].sortedValue ? null :
							<Typography sx={{color: "#ccc", fontSize: "10px", textAlign: "left", padding: "0 0 3px 5px", fontStyle: "italic"}}>
								*Select a Column name*
							</Typography>}

							<Select sx={{width: "95.5%", height: "26px", fontSize: "13px"}}
							onChange={handleSelectedColumnValue}
							value={chartControls.properties[propKey].sortedValue}>

								{firstObjKey.map((data,index) => (
									<MenuItem key={index} value={data} 
									sx={{color: "black", fontSize: "13px", "&:hover" : {backgroundColor: "rgb(238, 238, 238)"}}}>
										{data}
									</MenuItem>
									))}	
                            </Select>
							
                        </FormControl>
					</div>
					
					<div className='sort'>Sort Type</div>
					
					<div style={{display: "flex"}}>
						{chartControls.properties[propKey].sortedValue ?
						/* Column name or value gets selected then ascending, descending enable */
						<>
						<div style={{borderRadius: "5px 0 0 5px", cursor: "pointer", marginLeft: "10px", marginBottom: "10px", transition: "0.2s"}}
						className={ chartControls.properties[propKey].sortOrder === "Ascending" ? "radioButtonSelected" : "radioButton" }
						onClick={() => {
							SortOrder(propKey, "Ascending");
							handleAsc();
						}}>
							Ascending
						</div>

						<div style={{borderRadius: "0 5px 5px 0", cursor: "pointer", marginBottom: "10px", transition: "0.2s"}}
						className={ chartControls.properties[propKey].sortOrder === "Descending" ? "radioButtonSelected" : "radioButton" }
						onClick={() => {  
							SortOrder(propKey, "Descending");
							handleDesc();
						}}>
							Descending
						</div>
						</>
						:
						<>
						{/* Column name or value not selected then ascending, descending disable  */}
						<div style={{ borderRadius: "5px 0 0 5px", cursor: "pointer", marginLeft: "10px", marginTop: "10px", transition: "0.2s"}} className= "radioButton"
						 onClick={() => { 
							setAscDescNotify("Firstly Please select column name");
						}}>
							Ascending
						</div>
						
						<div style={{ borderRadius: "0 5px 5px 0", cursor: "pointer", marginTop: "10px", transition: "0.2s"}} className= "radioButton"
						 onClick={() => { 
							setAscDescNotify("Firstly Please select column name");
						}}>
							Descending
						</div>
						</> 
						}
					</div>
					
					<div>
						{ascDescNotify && 
						<p style={{ color: "#ccc", fontStyle: "italic", fontSize: "10px" }}>
							*{ascDescNotify}*
						</p>
						}
				</div>
				</div>
			)
			:
			/* Disable Sort Component */
			(
				<div>
					<div className='sortDisable'>Sortby</div>

					<div>
						<FormControl fullWidth disabled sx={{margin: "0 10px 0 10px"}}>
							<Select sx={{width: "95.5%", height: "26px"}}></Select>
						</FormControl>
	                </div>
					
					<div className='sortDisable'>Sort Type</div>
					
					<div style={{display: "flex"}}>
						<div style={{color: "#b6b6b6", borderRadius: "5px 0 0 5px", marginLeft: "10px"}} className= "radioButton">
							Ascending 
	                    </div>
						<div style={{color: "#b6b6b6", borderRadius: "0 5px 5px 0"}} className= "radioButton">
							Descending
	                    </div> 
	                </div>
	            </div>
	        )}
		</React.Fragment>
    )
}

const mapStateToProps = (state: any) => {
	return {
		chartControls: state.chartControls,
        tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		SortChartData: (propKey: string, chartData: string | any) =>
			dispatch(SortChartData(propKey, chartData)),
		SortOrder: (propKey: string, order: string) =>
			dispatch(SortOrder(propKey, order)),
		SortedValue: (propKey: string, value: string | any) =>
			dispatch(SortedValue(propKey, value)),		
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(Sort);