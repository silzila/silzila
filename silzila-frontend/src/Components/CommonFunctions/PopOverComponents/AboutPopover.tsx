// Contents for About section under help menu

import { Popover } from "@mui/material";
import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface PopOverProps {
	openAbout: boolean;
	setOpenAbout: (value: boolean) => void;
}

const AboutPopover = ({ openAbout, setOpenAbout }: PopOverProps) => {
	return (
		<Popover
			open={openAbout}
			onClose={setOpenAbout}
			anchorReference="anchorEl"
			anchorOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
			transformOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
		>
			<div
				className="datasetListPopover"
				style={{
					border: "3px solid rgba(0,123,255,0.75)",
					width: "500px",
				}}
			>
				<div className="datasetListPopoverHeading">
					<div style={{ flex: 1, textAlign: "center", fontSize: "20px" }}>
						About Silzila
					</div>

					<CloseRoundedIcon onClick={() => setOpenAbout(false)} />
				</div>
				<div style={{ textAlign: "center" }}>
					<p>
						Silzila is an Open Source Application for Data Exploration and Dashboarding.
					</p>
					<p>
						Version 0.1
						<br />
						Apache License 2.0
					</p>
				</div>
			</div>
		</Popover>
	);
};

export default AboutPopover;
