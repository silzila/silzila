// This component renders a popover with a list of datasets
// Used in following places
// 	- when a new Playbook button is clicked, this popup will allow to select a dataset to work with in that playbook
// 	- when changing a dataset from within dataviewerbottom component, this list is presented to 'Add Dataset'

import { MenuItem, Popover, TextField, Button } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import "./Popover.css";

const textFieldStyleProps = {
	style: {
		fontSize: "12px",
		width: "70%",
		margin: "6px auto 0.5rem 0",
		backgroundColor: "white",
		height: "1.5rem",
		color: "#404040",
	},
};

interface Props {
	showCard: boolean;
	orientation: any;
	unit: any;
	pageSize: any;
	height: any;
	width: any;
	setShowCard: (value: boolean) => void;
	setOrientation: (value: any) => void;
	setUnit: (value: any) => void;
	setPageSize: (value: any) => void;
	setHeight: (value: any) => void;
	setWidth: (value: any) => void;
	onDownload: () => void;
}

const DownloadPagePopover = ({
	showCard,
	orientation,
	unit,
	pageSize,
	height,
	width,
	setShowCard,
	setOrientation,
	setUnit,
	setPageSize,
	setHeight,
	setWidth,
	onDownload,
}: Props) => {
	const unitsArray: string[] = ["cm", "mm", "in", "pt", "m", "px"];
	const paperSize: string[] = ["a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "a10"];
	const orientations: string[] = ["landscape", "portrait"];

	return (
		<Popover
			open={showCard}
			onClose={setShowCard}
			anchorOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
			transformOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
		>
			<div className="datasetListPopover">
				<div className="datasetListPopoverHeading">
					<div style={{ flex: 1, color: "grey" }}>Page settings</div>

					<CloseRoundedIcon
						style={{ marginLeft: "1rem", color: "grey" }}
						onClick={() => setShowCard(false)}
					/>
				</div>
				<div style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<span style={{ fontSize: "14px" }}>Orientation</span>
						<TextField
							value={orientation}
							variant="outlined"
							onChange={e => {
								setOrientation(e.target.value);
							}}
							InputProps={{ ...textFieldStyleProps }}
							select
						>
							{orientations.map((ori: string) => {
								return (
									<MenuItem value={ori} style={{ textTransform: "capitalize" }}>
										{ori}
									</MenuItem>
								);
							})}
						</TextField>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<span style={{ fontSize: "14px" }}>Unit</span>
						<TextField
							value={unit}
							variant="outlined"
							onChange={e => {
								setUnit(e.target.value);
							}}
							InputProps={{ ...textFieldStyleProps }}
							select
						>
							{unitsArray.map((unit: string) => {
								return <MenuItem value={unit}>{unit}</MenuItem>;
							})}
						</TextField>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<span style={{ fontSize: "14px" }}>Format</span>
						<TextField
							value={pageSize}
							variant="outlined"
							onChange={e => {
								setPageSize(e.target.value);
							}}
							InputProps={{ ...textFieldStyleProps }}
							select
						>
							{paperSize.map((size: string) => {
								return <MenuItem value={size}>{size}</MenuItem>;
							})}
						</TextField>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<span style={{ fontSize: "14px" }}>Height</span>
						<TextField
							value={height}
							variant="outlined"
							type="number"
							onChange={e => {
								setHeight(e.target.value);
							}}
							InputProps={{ ...textFieldStyleProps }}
						/>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<span style={{ fontSize: "14px" }}>Width</span>
						<TextField
							value={width}
							variant="outlined"
							type="number"
							onChange={e => {
								setWidth(e.target.value);
							}}
							InputProps={{ ...textFieldStyleProps }}
						/>
					</div>
					<div></div>
					<div>
						<Button
							style={{
								textTransform: "none",
								backgroundColor: "rgba(224,224,224,1)",
								color: "black",
								marginTop: "10px",
							}}
							onClick={() => setShowCard(false)}
						>
							Cancel
						</Button>
					</div>
					<div>
						<Button
							style={{
								float: "right",
								textTransform: "none",
								backgroundColor: "#2bb9bb",
								color: "white",
								marginTop: "10px",
							}}
							onClick={() => {
								setShowCard(false);
								onDownload();
							}}
						>
							Set & Download
						</Button>
					</div>
				</div>
			</div>
		</Popover>
	);
};

export default DownloadPagePopover;
