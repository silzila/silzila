import React, { useState } from "react";
import { connect } from "react-redux";
import {getGeoJSON} from '../GeoJSON/MapCommonFunctions';
import { Divider, Menu, MenuItem } from "@mui/material";
import './GeoHelp.css';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";

const GoeHelp = ({
    //props
    propKey,
    anchorElement,
    open,
    handleClose,

    //state
    chartControls, 
    chartProperties
}:any)=>{

    let geoLocation = chartProperties.properties[propKey].Geo.geoLocation;
    let type = chartProperties.properties[propKey].Geo.geoMapKey;
    // var chartControl: any = chartControls.properties[propKey];	
	// let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

    
    let mapJSON = getGeoJSON(geoLocation);
    let keys = Object.keys(mapJSON.features[0].properties).filter(item=> ["continent","hc-a2","iso-a2","iso-a3","region-wb", "subregion"].includes(item));
    keys.sort();

    keys = ["name", ...keys];

    return(
        <Menu
            id="basic-menu"
            className="geoHelpTable"
            anchorEl={anchorElement}
            open={open}
            onClose={(handleClose)}
            MenuListProps={{
                "aria-labelledby": "basic-button",
            }}
			>         
            <Table stickyHeader style={{"height":"25rem", "width":"50rem"}}>   
                <TableHead>
                    <TableRow>          
                    {
                        keys.map((hdr:any, idx:number)=>{
                        return(<TableCell
                            style={{
                                fontWeight: "bold",
                                backgroundColor: "#e8eaf6",
                            }} key={idx}>{hdr}
                            </TableCell>)
                        })
                    }   
                    </TableRow>  
                </TableHead> 
                <TableBody style={{ width: "auto" }}>
                    {
                        mapJSON.features.map((item:any, index:number)=>{
                        return(
                            <TableRow key={index} id="TRow">
                                {
                                keys.map((hdr:any, idx:number)=>{
                                    return(<TableCell key={idx} id="TColumn">{item.properties[hdr]}</TableCell>)
                                })
                                }
                            </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        
        </Menu>        
    );
}

const mapStateToProps = (state:  any) => {
	return {	
		chartControls: state.chartControls,
		chartProperties: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(GoeHelp);