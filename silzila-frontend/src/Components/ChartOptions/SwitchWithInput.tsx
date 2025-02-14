import { FormControlLabel, styled, Switch } from "@mui/material";
import "./SliderWithInput.css";

const SwitchWithInput = ({
  isChecked,
  onSwitch,
}: {
  isChecked: boolean;
  onSwitch: any;
}) => {
  const SwitchComponent = styled(Switch)(() => ({
    padding: 9,
    height: 30,
    width: 54,
    "& .MuiSwitch-track": {
      borderRadius: 16,
      backgroundColor: "#c9c9cb",
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 20, 
      height: 20,
      margin: "-4px",
    },
    "& .Mui-checked .MuiSwitch-thumb": {
      backgroundColor: "#2bb9bb !important",
    },
    "& .Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#2bb9bb !important",
    },
  }));
  return (
    <FormControlLabel
      label=""
      control={<SwitchComponent checked={isChecked} onClick={onSwitch} />}
    />
  );
};

export default SwitchWithInput;

//previous Switch Component

/* <Switch
					size="small"
					id="enableDisable"
					checked={calStyle.showYearLabel}
					onClick={() => {
						updateCalendarStyleOptions(
							propKey,
							"showYearLabel",
							!calStyle.showYearLabel
						);
					}}
				/> */
