// Control functions related to chart title are handled here
// Function include
// 	- Setting title for graph automatically / manually
// 	- Alignment of graph title

import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
// import {
//   setGenerateTitle,
//   setTitleAlignment,
//   setTitleSize,
// } from "../../../redux/ChartPoperties/ChartPropertiesActions";
// import InputPositiveNumber from "../CommonFunctions/InputPositiveNumber";
import {
  ChartOptionsProps,
  ChartOptionsStateProps,
} from "../CommonInterfaceForChartOptions";
import { TextField } from "@mui/material";
import { textFieldStyleProps } from "../GridAndAxes/GridAndAxes";
import { updateCardControls } from "../../../redux/ChartPoperties/ChartControlsActions";

interface ChartTitleProps {
  updateCardControls: (propKey: string, option: string, value: number) => void;
}
const ChartLabel = ({
  // state
  tabTileProps,
  chartControls,

  // dispatch
  updateCardControls,
}: ChartOptionsProps & ChartTitleProps) => {
  var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
  return (
    <React.Fragment>
      <div className="optionsInfo">
        <div className="optionDescription">LABEL NAME</div>
        <TextField
          value={chartControls.properties[propKey].cardControls.subText}
          variant="outlined"
          onChange={(e: any) => {
            updateCardControls(propKey, "subText", e.target.value);
          }}
          InputProps={{ ...textFieldStyleProps }}
        />
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state: ChartOptionsStateProps, ownProps: any) => {
  return {
    chartProperties: state.chartProperties,
    tabTileProps: state.tabTileProps,
    chartControls: state.chartControls,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateCardControls: (propKey: string, option: string, value: any) =>
      dispatch(updateCardControls(propKey, option, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartLabel);
