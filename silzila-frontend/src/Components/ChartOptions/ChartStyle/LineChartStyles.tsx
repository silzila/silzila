// This component is used to enable / disable Smooth Curve option for Line charts

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { enableSmoothCurve } from "../../../redux/ChartPoperties/ChartControlsActions";
import {
  ChartOptionsProps,
  ChartOptionsStateProps,
} from "../CommonInterfaceForChartOptions";
import SwitchWithInput from "../SwitchWithInput";

interface LineChartProps {
  setSmoothCurve: (propKey: string, enable: boolean) => void;
}

const LineChartStyles = ({
  // state
  chartControls,
  tabTileProps,

  // dispatch
  setSmoothCurve,
}: ChartOptionsProps & LineChartProps) => {
  var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

  return (
    <div className="optionsInfo">
      <div className="optionDescription">
        <label
          htmlFor="enableDisable"
          className="enableDisableLabel"
          style={{ marginRight: "10px", paddingLeft: "0" }}
        >
          Smooth Curve
        </label>

        <SwitchWithInput
          isChecked={chartControls.properties[propKey].smoothCurve?.enable}
          onSwitch={() => {
            setSmoothCurve(
              propKey,
              !chartControls.properties[propKey].smoothCurve?.enable
            );
          }}
        />
      </div>
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
    setSmoothCurve: (propKey: string, enable: boolean) =>
      dispatch(enableSmoothCurve(propKey, enable)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LineChartStyles);
