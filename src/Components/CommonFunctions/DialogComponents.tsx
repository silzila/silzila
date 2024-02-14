// Commonly used notifications / alerts in many components for
// 	- alerting actions of User interactions
// 	- Server success / failure message display

import { Alert, AlertColor, Button, Dialog } from "@mui/material";
import { resetState } from "../../redux/DataSet/datasetActions";
import { useDispatch } from "react-redux";

// Simple alert to display for 2-3 seconds after a user action like deleting, adding items, server CallSharp, etc

interface NotificationProps {
	openAlert: boolean;
	severity: AlertColor;
	testMessage: string;
	onCloseAlert?: () => void;
}

interface ChangeConnectionProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	setReset?: any;
	heading: string;
	message: string;
	onChangeOrAddDataset?: any;
}

export const NotificationDialog = ({
	openAlert,
	severity,
	testMessage,
	onCloseAlert,
}: NotificationProps) => {
	return (
		<>
			<Dialog
				open={openAlert}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				onClose={onCloseAlert}
			>
				<Alert style={{ padding: "30px" }} severity={severity}>
					{testMessage}
				</Alert>
			</Dialog>
		</>
	);
};

// Alert do display specifically in dataset create / edit page when a new dataConnection is selected
export const ChangeConnection = ({
	open,
	setOpen,
	setReset,
	heading,
	message,
	onChangeOrAddDataset,
}: ChangeConnectionProps) => {
	const dispatch = useDispatch();

	return (
		<Dialog open={open}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					padding: "5px",
					width: "350px",
					height: "auto",
					justifyContent: "center",
				}}
			>
				<div style={{ fontWeight: "bold", textAlign: "center" }}>
					{heading}
					<br />
					<br />
					<p style={{ fontWeight: "normal" }}>{message}</p>
				</div>
				<div style={{ padding: "15px", justifyContent: "space-around", display: "flex" }}>
					<Button
						style={{ backgroundColor: "grey", float: "right" }}
						onClick={() => setOpen(false)}
						variant="contained"
					>
						Cancel
					</Button>
					{heading === "RESET DATASET" ? (
						<Button
							style={{ backgroundColor: "red" }}
							variant="contained"
							onClick={() => {
								dispatch(resetState());
								setOpen(false);
								setReset(true);
							}}
						>
							Discard
						</Button>
					) : (
						<Button
							style={{ backgroundColor: "red" }}
							variant="contained"
							onClick={onChangeOrAddDataset}
						>
							Ok
						</Button>
					)}
				</div>
			</div>
		</Dialog>
	);
};
