import { Popover } from "@mui/material";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateCardControls } from "../../../redux/ChartPoperties/ChartControlsActions";
import {
  ChartOptionsProps,
  ChartOptionsStateProps,
} from "../CommonInterfaceForChartOptions";
import { ColorSchemes } from "./ColorScheme";
import Logger from "../../../Logger";

const SankeyColorControls = ({
  // state
  chartControls,
  tabTileProps,
  chartProperties,

  // dispatch
  updateCardControls,
}: ChartOptionsProps & {
  updateCardControls: (propKey: string, option: string, value: any) => void;
}) => {
  var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
  let chartData = chartControls.properties[propKey].chartData
    ? chartControls.properties[propKey].chartData
    : "";

  var colorSchemes = ColorSchemes[6].colors;

  const [isColorPopoverOpen, setColorPopOverOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  return (
    <div className="optionsInfo">
      <div className="optionDescription">
        <label style={{ width: "40%" }}>Value Color</label>
        <div
          style={{
            height: "1.25rem",
            width: "50%",
            marginLeft: "20px",
            backgroundColor:
              chartControls.properties[propKey].cardControls.valueColor,
            color: chartControls.properties[propKey].cardControls.valueColor,
            border: "2px solid darkgray",
            margin: "auto",
          }}
          onClick={() => {
            setSelectedItem("valueColor");
            setColorPopOverOpen(!isColorPopoverOpen);
            setSelectedColor(
              chartControls.properties[propKey].cardControls.valueColor
            );
          }}
        ></div>
      </div>
      <div className="optionDescription">
        <label style={{ width: "40%" }}>Label Color</label>
        <div
          style={{
            height: "1.25rem",
            width: "50%",
            marginLeft: "20px",
            backgroundColor:
              chartControls.properties[propKey].cardControls.labelColor,
            color: chartControls.properties[propKey].cardControls.labelColor,
            border: "2px solid darkgray",
            margin: "auto",
          }}
          onClick={() => {
            setSelectedItem("labelColor");
            setColorPopOverOpen(!isColorPopoverOpen);
            setSelectedColor(
              chartControls.properties[propKey].cardControls.labelColor
            );
          }}
        ></div>
      </div>
      <div className="optionDescription">
        <label style={{ width: "40%" }}>Background Color</label>
        <div
          style={{
            height: "1.25rem",
            width: "50%",
            marginLeft: "20px",
            backgroundColor:
              chartControls.properties[propKey].cardControls.bgColor,
            color: chartControls.properties[propKey].cardControls.bgColor,
            border: "2px solid darkgray",
            margin: "auto",
          }}
          onClick={() => {
            setSelectedItem("bgColor");
            setColorPopOverOpen(!isColorPopoverOpen);
            setSelectedColor(
              chartControls.properties[propKey].cardControls.bgColor
            );
          }}
        ></div>
      </div>

      <Popover
        open={isColorPopoverOpen}
        onClose={() => setColorPopOverOpen(false)}
        onClick={() => setColorPopOverOpen(false)}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 350, left: 1300 }}
      >
        <div>
          <SketchPicker
            color={selectedColor}
            className="sketchPicker"
            width="16rem"
            // styles={{ padding: "0" }}
            onChangeComplete={(color) => {
              updateCardControls(propKey, selectedItem, color.hex);
            }}
            onChange={(color) => {
              updateCardControls(propKey, selectedItem, color.hex);
            }}
            disableAlpha
          />
        </div>
      </Popover>
    </div>
  );
};

const mapStateToProps = (state: ChartOptionsStateProps, ownProps: any) => {
  return {
    chartControls: state.chartControls,
    tabTileProps: state.tabTileProps,
    chartProperties: state.chartProperties,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateCardControls: (propKey: string, option: string, value: any) =>
      dispatch(updateCardControls(propKey, option, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SankeyColorControls);
