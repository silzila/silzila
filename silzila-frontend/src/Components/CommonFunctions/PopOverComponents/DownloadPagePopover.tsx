// This component renders a popover with a list of datasets
// Used in following places
// 	- when a new Playbook button is clicked, this popup will allow to select a dataset to work with in that playbook
// 	- when changing a dataset from within dataviewerbottom component, this list is presented to 'Add Dataset'

import { MenuItem, Popover, TextField, Button, Paper } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { connect } from "react-redux";
import "./Popover.css";
import {
	resetPageSettings,
	setPageSettings,
} from "../../../redux/PageSettings/DownloadPageSettingsActions";
import { Dispatch } from "redux";
import { orientations, paperSize } from "./pageSettingsData";
import { useEffect, useState } from "react";
import { setCustomHeight } from "../../../redux/TabTile/TabActions";

const DownloadPagePopover = ({
	pageSettings,
	tabTileProps,
	//

	setPageSettings,
	resetPageSettings,
}: any) => {
	const textFieldStyleProps = {
		style: {
			fontSize: "12px",
			width: pageSettings.downloadType === "pdf" ? "150px" : "70%",
			margin: "6px auto 0.5rem 0",
			backgroundColor: "white",
			height: "1.5rem",
			color: "#404040",
		},
	};

	return (
		<Popover
			open={pageSettings.openPageSettingPopover}
			onClose={() => {
				setPageSettings("openPageSettingPopover", false);
				setTimeout(() => {
					resetPageSettings();
				}, 300);
			}}
			anchorOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
			transformOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
		>
			<Paper
				sx={{
					width: pageSettings.downloadType === "pdf" ? "450px" : "auto",
					height: pageSettings.downloadType === "pdf" ? "300px" : "auto",
					border: "none",
					boxShadow: "none",
				}}
			>
				<div className="datasetListPopover">
					<div className="datasetListPopoverHeading">
						<div style={{ flex: 1, color: "grey" }}>Page settings</div>

						<CloseRoundedIcon
							style={{ marginLeft: "1rem", color: "grey" }}
							onClick={() => {
								setPageSettings("openPageSettingPopover", false);
								setTimeout(() => {
									resetPageSettings();
								}, 300);
							}}
						/>
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "50% 50%",
							columnGap: "10px",
							rowGap: "10px",
						}}
					>
						{pageSettings.downloadType === "pdf" ? (
							<>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
									}}
								>
									<span style={{ fontSize: "14px" }}>Orientation</span>
									<TextField
										value={pageSettings.SelectedOrientation}
										variant="outlined"
										onChange={e => {
											setPageSettings("SelectedOrientation", e.target.value);
										}}
										InputProps={{
											...textFieldStyleProps,
										}}
										select
									>
										{orientations.map((ori: string) => {
											return (
												<MenuItem
													key={ori}
													value={ori}
													style={{ textTransform: "capitalize" }}
												>
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
									<span style={{ fontSize: "14px" }}>Format</span>
									<TextField
										value={pageSettings.selectedFormat}
										variant="outlined"
										onChange={e => {
											setPageSettings("selectedFormat", e.target.value);
										}}
										InputProps={{ ...textFieldStyleProps }}
										select
									>
										{paperSize.map((size: string) => {
											return (
												<MenuItem key={size} value={size}>
													{size}
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
									<span style={{ fontSize: "14px" }}>Top margin</span>
									<TextField
										type="number"
										value={pageSettings.top_margin}
										variant="outlined"
										onChange={e => {
											setPageSettings("top_margin", Number(e.target.value));
										}}
										InputProps={{
											...textFieldStyleProps,
										}}
									></TextField>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
									}}
								>
									<span style={{ fontSize: "14px" }}>Bottom margin</span>
									<TextField
										type="number"
										value={pageSettings.bottom_margin}
										variant="outlined"
										onChange={e => {
											setPageSettings(
												"bottom_margin",
												Number(e.target.value)
											);
										}}
										InputProps={{
											...textFieldStyleProps,
										}}
									></TextField>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
									}}
								>
									<span style={{ fontSize: "14px" }}>Left margin</span>
									<TextField
										type="number"
										value={pageSettings.left_margin}
										variant="outlined"
										onChange={e => {
											setPageSettings("left_margin", Number(e.target.value));
										}}
										InputProps={{
											...textFieldStyleProps,
										}}
									></TextField>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
									}}
								>
									<span style={{ fontSize: "14px" }}>Right margin</span>
									<TextField
										type="number"
										value={pageSettings.right_margin}
										variant="outlined"
										onChange={e => {
											setPageSettings("right_margin", Number(e.target.value));
										}}
										InputProps={{
											...textFieldStyleProps,
										}}
									></TextField>
								</div>
							</>
						) : (
							<>
								{/* <div
								style={{
									display: "flex",
									flexDirection: "column",
								}}
							>
								<span style={{ fontSize: "14px" }}>Height</span>
								<TextField
									value={pageSettings.customHeight}
									variant="outlined"
									type="number"
									onChange={e => {
										setPageSettings("customHeight", Number(e.target.value));
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
									value={pageSettings.customWidth}
									variant="outlined"
									type="number"
									onChange={e => {
										setPageSettings("customWidth", Number(e.target.value));
									}}
									InputProps={{ ...textFieldStyleProps }}
								/>
							</div> */}
							</>
						)}
					</div>
					{/* <div> */}
					{/* <Button
							style={{
								textTransform: "none",
								backgroundColor: "rgba(224,224,224,1)",
								color: "black",
								marginTop: "10px",
							}}
							onClick={() => {
								resetPageSettings();
							}}
						>
							Cancel
						</Button> */}
					{/* </div> */}
					<div>
						<Button
							style={{
								float: "right",
								textTransform: "none",
								backgroundColor: "#2bb9bb",
								color: "white",
								margin: "10px -3px 10px 10px",
							}}
							onClick={() => {
								setPageSettings("callForDownload", true);
							}}
						>
							Set & Download
						</Button>
					</div>
				</div>
			</Paper>
		</Popover>
	);
};
const mapStateToProps = (state: any, ownProps: any) => {
	return {
		pageSettings: state.pageSettings,
		tabTileProps: state.tabTileProps,
	};
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setPageSettings: (option: string, value: any) => dispatch(setPageSettings(option, value)),
		resetPageSettings: () => dispatch(resetPageSettings()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPagePopover);
