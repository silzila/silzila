import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Menu, Autocomplete,TextField,Button } from "@mui/material";
import {fieldName} from '../../../CommonFunctions/CommonFunctions';
import {getGeoJSON} from '../GeoJSON/MapCommonFunctions';
import { Dispatch } from "redux";
import {changeGeoMapUnMatched} from '../../../../redux/ChartPoperties/ChartPropertiesActions';


const GoeMismatch = ({  
    propKey,
    anchorElement,
    open,
    handleClose,
    misMatchList,
    changeGeoMapUnMatched,

    //state
    chartControls, 
    chartProperties}:any)=>{

        let options:any = [];
        let dimensionName = chartProperties.properties[propKey].chartAxes[1].fields[0];
        dimensionName = fieldName(dimensionName)
        //changeGeoMapUnMatched(propKey, misMatchList);
       // const [unMatchedArray, setUnMatchedArray] = useState([]);

        // useEffect(()=>{
        //     setUnMatchedArray(misMatchList);
        // },[misMatchList])

       
        let mapJSON = getGeoJSON(chartProperties.properties[propKey].Geo.geoLocation);

        options = mapJSON.features.map((item:any)=>{
            if(chartProperties.properties[propKey].Geo.geoMapKey === "name"){
                return  "".concat(item.properties["name"]);
            }
            else{
                return  "".concat(item.properties[chartProperties.properties[propKey].Geo.geoMapKey], "; ", item.properties["name"]);
            }
        })

        options.sort();

        //options.sort((a:any,b:any)=>{ return a.key - b.key;});


        const handleLocationOnChange =(e:any, name:string)=>{
            console.log(e.currentTarget.innerText, name);
            let list  = JSON.parse(JSON.stringify(misMatchList));
           // let list = chartProperties.properties[propKey].Geo.unMatchedChartData?.length > 0 ? chartProperties.properties[propKey].Geo.unMatchedChartData : misMatchList;

            let matchIndex = list.findIndex((item:any)=>{
                    return item[dimensionName] === name;
                })

                list[matchIndex].selectedKey = e.currentTarget.innerText

            changeGeoMapUnMatched(propKey, list[matchIndex], matchIndex);
        }

        const handleOkButtonClick = () =>{
            handleClose();


        }

    return(
        <Menu
        id="basic-menu"
        className="geoHelpTable"
        anchorEl={anchorElement}
        open={open}       
        MenuListProps={{
            "aria-labelledby": "basic-button",
        }}
        >      
        <div>
           <h3  style={{paddingLeft:"1rem"}}>Unmatched Locations</h3>
        </div>
            <div style={{"height":"25rem" ,"width":"40rem", "overflowY":"auto", "marginBottom":"15px"}}>
            {
                misMatchList.map((item:any, index:number)=>{
                    let defaultVal = chartProperties.properties[propKey].Geo.unMatchedChartData.find((selectedItem:any)=>{
                        return selectedItem[dimensionName] === item[dimensionName]
                    })?.selectedKey;

                    return(                   
                    <div key={index} style={{"display":"flex","flexDirection":"row", "columnGap":"5rem", "justifyContent":"space-around", "marginTop": "15px"}}>
                        <span style={{width:"10rem", wordWrap:"normal"}}>{item[dimensionName]}</span>

                        <Autocomplete

                            defaultValue={defaultVal || ""}                           
                            disablePortal
                            id="combo-box-demo"
                            onChange={(e:any)=>handleLocationOnChange(e, item[dimensionName])}
                            options={options}
                            sx={{ width: "20rem" }}
                            renderInput={(params) => <TextField {...params} label="Location" />}
                            />
                    </div>  
                    )
                })
            }

            </div>
            <Button
                value="cancel"
                onClick={handleOkButtonClick}
                sx={{                 
                    border: "2px solid grey",
                    color: "grey",
                    float: "right"
                }}
            >
                Ok
            </Button>
        </Menu>        
    )
}

const mapStateToProps = (state:  any) => {
	return {	
        chartControls: state.chartControls,
		chartProperties: state.chartProperties,
	};
};


const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		changeGeoMapUnMatched: (propKey: string, value: string, index: number) =>
			dispatch(changeGeoMapUnMatched(propKey, value, index)),
        }
    };

export default connect(mapStateToProps, mapDispatchToProps)(GoeMismatch);