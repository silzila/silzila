import React, {  useState, useEffect, Dispatch } from 'react';
import { connect} from 'react-redux';
import {MdArrowDropDown, MdArrowDropUp} from 'react-icons/md';
import "../ChartOptions.css";
import { SortChartData, updateChartData, SortOrder, SortedValue } from "../../../redux/ChartPoperties/ChartControlsActions";

interface Props {
	chartControls: any;
	tabTileProps: any;

	SortChartData: (propKey: string, chartData: string | any) => void;
	updateChartData: (propKey: string, chartData: string | any) => void;
	SortOrder: (propKey: string, order: string) => void;
	SortedValue: (propKey: string, chartData: string | any) => void;
  }

const Sort = ({
  //state
	chartControls,
    tabTileProps,

  //dispatch
    SortChartData,
	updateChartData,
	SortOrder,
	SortedValue
}: Props) => { 
	const[data, setData] = useState<string | any>([]);
	const[arrowState, setArrowState] = useState<boolean>(false);
	const[ascDescNotify, setAscDescNotify] = useState<string>("");
	const[state, setState] = useState<boolean>(false);
	const[sortValue, setSortValue] = useState<string | any>();
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	useEffect(()=>{
		//Getting chartData 
		const datas = chartControls.properties[propKey].chartData;
		setData(datas);
	  }); 
    
	//shallow copy of an original chart data
	var chartDetails: string | any = [...data];
	var desecingData: string | any = [...data];
    
	//firstObjKey getting the keys values from first object in array
	const firstObjKey = chartDetails.length > 0 ? Object.keys(chartDetails[0]) : [];

	/* if(chartDetails.length > 0 && chartControls.properties[propKey].sortedValue ){
		if(chartControls.properties[propKey].sortedValue !== sortValue){
			SortedValue(propKey, "");
            SortOrder(propKey, "");
		}
    } */  
    
	//Function getting the value from sortby and update that to state
	const handleKeySelect = (event: string | any) => {
		SortedValue(propKey, event.target.textContent); 
	  };  
    
	//Function create a ascending order of chartData and update that to state
	const handleAsc = () => {
		const sortedDataAscending = chartDetails.sort((a: string | any , b: string | any) => { 
			const sortedValueA = a[chartControls.properties[propKey].sortedValue];
			const sortedValueB = b[chartControls.properties[propKey].sortedValue];
		
			if (typeof sortedValueA === 'number' && typeof sortedValueB === 'number') {
			  return sortedValueA - sortedValueB; // Numeric comparison
			} else if (typeof sortedValueA === 'string' && typeof sortedValueB === 'string') {
			  return sortedValueA.localeCompare(sortedValueB); // String comparison
			} else {
			  // Handle other data types or fallback to default sorting
			  return sortedValueA - sortedValueB;
			}
		  });
		chartDetails = sortedDataAscending; 
		SortChartData(propKey, chartDetails);  
	}
    
	//Function create a ascending order of chartData and update that to state
	const handleDesc = () => {
		const sortedDataDescending = desecingData.sort((a: string | any, b: string | any) => { 
			const sortedValueA = a[chartControls.properties[propKey].sortedValue];
			const sortedValueB = b[chartControls.properties[propKey].sortedValue];
		
			if (typeof sortedValueB === 'number' && typeof sortedValueA === 'number') {
			  return sortedValueB - sortedValueA; // Numeric comparison
			} else if (typeof sortedValueB === 'string' && typeof sortedValueA === 'string') {
			  return sortedValueB.localeCompare(sortedValueA); // String comparison
			} else {
			  // Handle other data types or fallback to default sorting
			  return sortedValueB - sortedValueA;
			}
		});
		desecingData = sortedDataDescending; 
		SortChartData(propKey, desecingData); 
	  }  

  return (
	<React.Fragment>
    
	{chartControls.properties[propKey].chartData.length > 0 ?
	/* Enable Sort Component */
	(
	<div style={{minHeight: "100vh"}} >
	<div 
	style={{display: "flex", textAlign: "left", padding: "0 6% 5px 6%", color: "rgb(96, 96, 96)", fontWeight: 600, marginTop: "20px", fontSize: "15px", cursor: "pointer", alignItems: "center"}}
	onClick={() => {
		setArrowState(!arrowState);
		}}>
		Sortby  
		{chartControls.properties[propKey].chartData.length > 0 && arrowState  ? <MdArrowDropUp/> :
		 chartControls.properties[propKey].chartData.length > 0 ? <MdArrowDropDown/> : <MdArrowDropUp/> } 
    </div>

		<div style= {{width: "100%", height: "260px", overflow: "hidden", overflowY: "auto", textOverflow: "ellipsis"}}>
        
		{/* itreating and displaying firstObjKey */}
		{arrowState ? null : data ?
		<div onClick={handleKeySelect}>

           {firstObjKey.map((data, index) => {
			return(
				<div key= {index} className= {chartControls.properties[propKey].sortedValue === data ? "menuStyleActive" : "menuStyle"}
				onClick={() => {
					setState(true); 
					setAscDescNotify("");
					setSortValue(data);
					}}>
					{data}
				</div>	
			)
		   })}
			
		</div>
       :null }
			 
		<div
		style={{display: "flex", textAlign: "left", padding: "0 6% 5px 6%", color: "rgb(96, 96, 96)", fontWeight: 600, marginTop: "20px", fontSize: "15px", cursor: "pointer", alignItems: "center"}}>
		Sort Type 
		</div> 

        <div style={{display: "flex"}} >
			{ chartControls.properties[propKey].sortedValue   ? 
			/* If value get selected under sortby, then above condition gets satisfied, then it show Ascending and Descending button for do ascending and descending */
			<>
			<div style={{borderRadius: "5px 0 0 5px", cursor: "pointer", marginLeft: "10px", marginTop: "10px", transition: "0.2s"}}
			className={ state ? "radioButton" : /* chartControls.properties[propKey].sortedValue === sortValue &&  */ 
			chartControls.properties[propKey].sortOrder === "Ascending" ? "radioButtonSelected" : "radioButton" }
			onClick={() => {{ 
			    setState(false); 	
				SortOrder(propKey, "Ascending");
			    handleAsc();
			}}} >
			Ascending 	
			</div>
			<div style={{borderRadius: "0 5px 5px 0", cursor: "pointer", marginTop: "10px", transition: "0.2s"}}
			className={ state ? "radioButton" : /* chartControls.properties[propKey].sortedValue === sortValue && */
			 chartControls.properties[propKey].sortOrder === "Descending" ? "radioButtonSelected" : "radioButton" }
			onClick={() => {{ 
			    setState(false); 
			    SortOrder(propKey, "Descending");
			    handleDesc();
			}}}
			>
            Descending
			</div>
			</> 
			: 
			/* If value not get selected under sortby, then now also it show Ascending and Descending button but when make click on 
			 it notify us that value not get selected */
			<>
			<div onClick={() => { setAscDescNotify("Please select one value under sortby"); }}
			style={{borderRadius: "5px 0 0 5px", cursor: "pointer", marginLeft: "10px", marginTop: "10px", transition: "0.2s"}}
			className= "radioButton" >
			Ascending 
			</div>
			
			<div onClick={() => { setAscDescNotify("Please select one value under sortby"); }}
			style={{borderRadius: "0 5px 5px 0", cursor: "pointer", marginTop: "10px", transition: "0.2s"}}
			className= "radioButton" >
            Descending
			</div>
			</> }
		</div>
		
		<div>
			{ascDescNotify && 
			    <p style={{ color: "#ccc", fontStyle: "italic", fontSize: "10px" }}>
				*{ascDescNotify}*
			    </p>}
			</div>
	    </div>
		</div>
    )
    :
	/* Disable Sort Component */ 
	(
	<div>
	<div 
	style={{display: "flex", textAlign: "left", padding: "0 6% 5px 6%", color: "#b6b6b6", fontWeight: 600, marginTop: "20px", fontSize: "15px", alignItems: "center"}}>
    	Sortby  <MdArrowDropUp/> 
	</div>	
	
	<div
		style={{display: "flex", textAlign: "left", padding: "0 6% 5px 6%", color: "#b6b6b6", fontWeight: 600, marginTop: "20px", fontSize: "15px", alignItems: "center"}}>
		Sort Type 
    </div>
    
	<div style={{display: "flex"}} >
	<div
		style={{color: "#b6b6b6", borderRadius: "5px 0 0 5px", marginLeft: "10px", marginTop: "10px", transition: "0.2s"}}
		className= "radioButton" >
		    Ascending 
	</div>
	
	<div
	    style={{color: "#b6b6b6", borderRadius: "0 5px 5px 0", marginTop: "10px", transition: "0.2s"}}
		className= "radioButton" >
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
		updateChartData: (propKey: string, chartData: string | any) =>
			dispatch(updateChartData(propKey, chartData)),	
		SortOrder: (propKey: string, order: string) =>
			dispatch(SortOrder(propKey, order)),
		SortedValue: (propKey: string, value: string | any) =>
			dispatch(SortedValue(propKey, value)),		
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(Sort);