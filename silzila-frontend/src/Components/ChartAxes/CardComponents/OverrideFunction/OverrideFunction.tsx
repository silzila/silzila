import {Button, Checkbox, FormControl, Menu, MenuItem, Radio, Select, TextField, Typography} from "@mui/material";
import { useEffect, useState } from "react";
import { ChartPropertiesProps } from "../../../../redux/ChartPoperties/ChartPropertiesInterfaces"
import { TabTileStateProps } from "../../../../redux/TabTile/TabTilePropsInterfaces";
import { connect } from "react-redux";
import { TabTileStateProps2 } from "../../../../redux/TabTile/TabTilePropsInterfaces";
import { ChartPropertiesStateProps } from "../../../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { Dispatch } from "redux";
import { editChartPropItem } from "../../../../redux/ChartPoperties/ChartPropertiesActions";
import {fieldName} from '../../../CommonFunctions/CommonFunctions';

const OverrideFunction = ({
         //props
		anchorElm,	
		propKey,
		bIndex,
		itemIndex,
        
		//state
		chartProp,
		tabTileProps,
		chartControls
		// dispatch,
}:any)=>{

    return(
        <div>
            
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
        
    };
}; 

export default connect(mapStateToProps, mapDispatchToProps) (OverrideFunction);