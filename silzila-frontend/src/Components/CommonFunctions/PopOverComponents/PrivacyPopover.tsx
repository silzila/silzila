// Contents for Privacy section under help menu

import { Popover } from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { githubAddress } from "../../ServerCall/EnvironmentVariables";

interface PrivacyPopoverProps {
	openPrivacy: boolean;
	setOpenPrivacy: (value: boolean) => void;
}

const PrivacyPopover = ({ openPrivacy, setOpenPrivacy }: PrivacyPopoverProps) => {
	return (
		<Popover
			open={openPrivacy}
			onClose={setOpenPrivacy}
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
					maxWidth: "500px",
				}}
			>
				<div className="datasetListPopoverHeading">
					<div style={{ flex: 1, textAlign: "center", fontSize: "20px" }}>Privacy</div>

					<CloseRoundedIcon onClick={() => setOpenPrivacy(false)} />
				</div>
				<div>
					<p>
						Any data handled by Silzila App resides in user's machine only and is not
						shared outside. User login and database credentials are encrypted and saved
						in the user's machine locally. All computations happen locally.
					</p>
					<p>
						If you want to provide feedback,{" "}
						<a
							href="mailto:example@silzila.org?subject=Silzila%20Feedback"
							target="_blank"
						>
							email us
						</a>
						.{" "}
					</p>
					<p>
						To report a bug, visit our{" "}
						<a href={githubAddress} target="_blank">
							git hub issues
						</a>{" "}
						page.
					</p>
				</div>
			</div>
		</Popover>
	);
};

export default PrivacyPopover;
