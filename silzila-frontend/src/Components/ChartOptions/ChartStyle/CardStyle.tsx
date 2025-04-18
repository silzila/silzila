import { connect } from "react-redux";
import "./chartStyle.css";
import SliderWithInput from "../SliderWithInput";
import { FormControl, MenuItem, Popover, Select } from "@mui/material";
import { Dispatch } from "redux";
import { updateCardControls } from "../../../redux/ChartPoperties/ChartControlsActions";
import {
  ChartOptionsProps,
  ChartOptionsStateProps,
} from "../CommonInterfaceForChartOptions";
import { useState } from "react";
import { ColorResult, SketchPicker } from "react-color";
import {
  SelectComponentStyle,
  menuItemStyle,
} from "../Labels/SnakeyLabelOptions";
import SwitchWithInput from "../SwitchWithInput";

interface CardStyleProps {
  updateCardControls: (propKey: string, option: string, value: any) => void;
}

const CardStyle = ({
  // state
  chartControls,
  tabTileProps,

  // dispatch
  updateCardControls,
}: ChartOptionsProps & CardStyleProps) => {
  var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
  var cardStyleOptions: any = chartControls.properties[propKey].cardControls;
  const [colorPopoveropen, setColorPopOverOpen] = useState<boolean>(false);

  const borderStyle: string[] = [
    "dashed",
    "solid",
    "dotted",
    "double",
    "groove",
    "ridge",
  ];
  const fontStyle: string[] = ["italic", "oblique", "normal"];

  return (
    <div className="optionsInfo">
      <div className="optionDescription">
        <label
          htmlFor="enableDisable"
          className="enableDisableLabel"
          style={{ marginRight: "10px", paddingLeft: "0.5rem" }}
        >
          Custom Font Style
        </label>

        <SwitchWithInput
          isChecked={cardStyleOptions.customStyle}
          onSwitch={() => {
            updateCardControls(
              propKey,
              "customStyle",
              !cardStyleOptions.customStyle
            );
          }}
        />
      </div>

      {cardStyleOptions.customStyle ? (
        <>
          <div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Font Size</div>
          <SliderWithInput
            percent={false}
            sliderValue={cardStyleOptions.fontSize}
            sliderMinMax={{ min: 20, max: 100, step: 1 }}
            changeValue={(value) => {
              updateCardControls(propKey, "fontSize", value);
            }}
          />
          <div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Label Font Size</div>
          <SliderWithInput
            percent={false}
            sliderValue={cardStyleOptions.subtextFontSize}
            sliderMinMax={{ min: 10, max: 70, step: 1 }}
            changeValue={(value) =>
              updateCardControls(propKey, "subtextFontSize", value)
            }
          />
        </>
      ) : null}
      <div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Border Tickness</div>
      <SliderWithInput
        percent={true}
        sliderValue={cardStyleOptions.borderTickness}
        sliderMinMax={{ min: 1, max: 50, step: 1 }}
        changeValue={(value) => {
          updateCardControls(propKey, "borderTickness", value);
        }}
      />
      <div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Border Radius</div>
      <SliderWithInput
        percent={true}
        sliderValue={cardStyleOptions.borderRadius}
        sliderMinMax={{ min: 0, max: 100, step: 1 }}
        changeValue={(value) => {
          updateCardControls(propKey, "borderRadius", value);
        }}
      />
      <div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Border Style</div>

      <FormControl
        fullWidth
        size="small"
        style={{ fontSize: "12px", borderRadius: "4px" }}
      >
        <Select
          value={cardStyleOptions.dashStyle}
          variant="outlined"
          onChange={(e) => {
            updateCardControls(propKey, "dashStyle", e.target.value);
          }}
          sx={SelectComponentStyle}
          MenuProps={{
            PaperProps: {
              sx: {
                "& .MuiMenuItem-root.Mui-selected": {
                  backgroundColor: "rgba(43, 185, 187, 0.1) !important", // Force background color
                },
                "& .MuiMenuItem-root.Mui-selected:hover": {
                  backgroundColor: "rgba(43, 185, 187, 0.2) !important", // Change hover state for selected item
                },
              },
            },
          }}
        >
          {borderStyle.map((item: string) => {
            return (
              <MenuItem value={item} key={item} sx={menuItemStyle}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Font Style</div>

      <FormControl
        fullWidth
        size="small"
        style={{ fontSize: "12px", borderRadius: "4px" }}
      >
        <Select
          value={cardStyleOptions.fontStyle}
          variant="outlined"
          onChange={(e) => {
            updateCardControls(propKey, "fontStyle", e.target.value);
          }}
          sx={SelectComponentStyle}
          MenuProps={{
            PaperProps: {
              sx: {
                "& .MuiMenuItem-root.Mui-selected": {
                  backgroundColor: "rgba(43, 185, 187, 0.1) !important", // Force background color
                },
                "& .MuiMenuItem-root.Mui-selected:hover": {
                  backgroundColor: "rgba(43, 185, 187, 0.2) !important", // Change hover state for selected item
                },
              },
            },
          }}
        >
          {fontStyle.map((item: string) => {
            return (
              <MenuItem value={item} key={item} sx={menuItemStyle}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>
        Border Color
        <div
          style={{
            height: "1.25rem",
            width: "60%",
            backgroundColor: cardStyleOptions.borderColor,
            color: cardStyleOptions.borderColor,
            border: "2px solid darkgray",
            margin: "auto",
            marginLeft: "0.5rem",
          }}
          onClick={() => {
            setColorPopOverOpen(!colorPopoveropen);
          }}
        >
          {"  "}
        </div>
      </div>
      <Popover
        open={colorPopoveropen}
        onClose={() => setColorPopOverOpen(false)}
        onClick={() => setColorPopOverOpen(false)}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 350, left: 1300 }}
      >
        <div>
          <SketchPicker
            className="sketchPicker"
            width="16rem"
            onChangeComplete={(color: ColorResult) => {
              updateCardControls(propKey, "borderColor", color.hex);
            }}
            onChange={(color: ColorResult) =>
              updateCardControls(propKey, "borderColor", color.hex)
            }
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
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateCardControls: (
      propKey: string,
      option: string,
      value: string | number
    ) => dispatch(updateCardControls(propKey, option, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardStyle);
