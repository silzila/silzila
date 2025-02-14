// Function include
// 	- Setting label for Simple Card

import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

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
      <div
        style={{
          width: "100%",
          padding: "10px 0 0 0",
          fontSize: "12px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "ease-in 0.3s linear",
        }}
      >
        <div className="optionDescription" style={{paddingLeft: "0.6rem"}}>LABEL NAME</div>
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
