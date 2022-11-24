import { FormControlLabel, styled, Switch } from "@mui/material";
import "./SliderWithInput.css";

const SwitchWithInput = ({ isChecked, onSwitch }: { isChecked: boolean; onSwitch: any }) => {
	const SwitchComponent = styled(Switch)(() => ({
		padding: 9,
		height: 35,
		width: 54,
		"& .MuiSwitch-track": {
			borderRadius: 16,
		},
		"& .MuiSwitch-thumb": {
			boxShadow: "none",
			width: 13,
			height: 13,
			margin: "1.8px",
		},
	}));
	return (
		<FormControlLabel control={<SwitchComponent checked={isChecked} onClick={onSwitch} />} />
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
