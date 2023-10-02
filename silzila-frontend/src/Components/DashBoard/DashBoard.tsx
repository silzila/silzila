// Dashboard Component is the place to position all graphs from within a tab
// graph from each tile can be selected to render here
// The dimensions of Graph area can be set to Full width or any other custom aspect ratio

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
	resetGraphHighlight,
	updateGraphHighlight,
	updateTabDashDetails,
} from "../../redux/TabTile/TabActions";
import { setDashGridSize } from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import { toggleGraphSize } from "../../redux/TabTile/TileActions";
import "./DashBoard.css";
import { DashBoardProps, DashBoardStateProps } from "./DashBoardInterfaces";
import DashBoardLayoutControl from "./DashBoardLayoutControl";
import GraphRNDDash from "./GraphRNDDash";
import CloseIcon from "@mui/icons-material/Close";
import { Checkbox, Tooltip } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { resetPageSettings } from "../../redux/PageSettings/DownloadPageSettingsActions";
import ChartFilterGroupsContainer from "../ChartFilterGroup/ChartFilterGroupsContainer";
import ChartData from "../ChartAxes/ChartData";

import {
	updateDashBoardGroups,
	deleteDashBoardSelectedGroup,
	addDashBoardFilterGroupTabTiles,
	setDashBoardFilterGroupsTabTiles,
	deleteDashBoardSelectedGroupAllTabTiles,
	deleteDashBoardSelectedTabTiles,
} from "../../redux/DashBoardFilterGroup/DashBoardFilterGroupAction";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Logger from "../../Logger";

const DashBoard = ({
	// props
	showListofTileMenu,
	dashboardResizeColumn,
	showDashBoardFilterMenu,
	setShowListofTileMenu,
	setDashboardResizeColumn,
	setShowDashBoardFilter,

	// state
	chartGroup,
	dashBoardGroup,
	tabState,
	tabTileProps,
	tileState,
	pageSettings,

	// dispatch
	updateDashDetails,
	toggleGraphSize,
	setGridSize,
	graphHighlight,
	resetHighlight,
	resetPageSettings,
	updateDashBoardGroups,
	deleteDashBoardSelectedGroup,
	addDashBoardFilterGroupTabTiles,
	setDashBoardFilterGroupsTabTiles,
	deleteDashBoardSelectedGroupAllTabTiles,
	deleteDashBoardSelectedTabTiles,
}: DashBoardProps) => {
	var targetRef = useRef<any>();
	const [mouseDownOutsideGraphs, setmouseDownOutsideGraphs] = useState<boolean>(false);
	const [dimensions, setDimensions] = useState<any>({});
	const [innerDimensions, setinnerDimensions] = useState<any>({});

	var dashbackground: string = `linear-gradient(-90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
	linear-gradient( rgba(0, 0, 0, 0.05) 1px, transparent 1px),
	linear-gradient(-90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
	linear-gradient( rgba(0, 0, 0, 0.05) 1px, transparent 1px)`;

	const [dashStyle, setdashStyle] = useState<any>({
		width: innerDimensions.width,
		height: innerDimensions.height,
		background: dashbackground,
	});

	const [style, setStyle] = useState<any>({
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "solid 1px transparent",
		backgroundColor: "white",
		boxSizing: "border-box",
		zIndex: 10,
	});

	const [style2, setStyle2] = useState<any>({
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "solid 1px darkGray",
		backgroundColor: "white",
		boxSizing: "border-box",
		zIndex: 20,
	});
	const getHeightAndWidth = (paperHeight: number, paperWidth: number) => {
		var graphHeight = dashStyle.height;
		var graphWidth = dashStyle.width;
		const pageHeight = paperHeight - (pageSettings.top_margin + pageSettings.bottom_margin);
		const pageWidth = paperWidth - (pageSettings.right_margin + pageSettings.left_margin);
		var heightRatio = pageHeight / graphHeight;
		var widthRatio = pageWidth / graphWidth;
		// getting least value
		var ratio = Math.min(heightRatio, widthRatio);
		var finalHeight = graphHeight * ratio;
		var finalWidth = graphWidth * ratio;
		return { height: finalHeight, width: finalWidth };
	};

	useEffect(() => {
		if (pageSettings.callForDownload) {
			const input = document.getElementById("GraphAreaToDownload") as HTMLElement;

			const d = new Date();
			const id = `${tabTileProps.selectedTabName}_${d.getDate()}${
				d.getMonth() + 1
			}${d.getFullYear()}:${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;

			if (pageSettings.downloadType === "pdf") {
				html2canvas(input).then(canvas => {
					const imageData = canvas.toDataURL("image/png");

					const pdf = new jsPDF(
						pageSettings.SelectedOrientation,
						"px",
						pageSettings.selectedFormat
					);
					var width = pdf.internal.pageSize.getWidth();
					var height = pdf.internal.pageSize.getHeight();
					const heightAndWidth = getHeightAndWidth(height, width);
					pdf.addImage(
						imageData,
						"JPEG",
						pageSettings.left_margin,
						pageSettings.top_margin,
						heightAndWidth.width,
						heightAndWidth.height
					);
					pdf.save(`${id}`);
					resetPageSettings();
				});
			} else {
				toPng(input, { cacheBust: true })
					.then((dataUrl: any) => {
						const link = document.createElement("a");
						link.download = `${id}`;
						link.href = dataUrl;
						link.click();
						resetPageSettings();
					})
					.catch((err: any) => {
						Logger("error", "", err);
					});
			}
		}
	}, [pageSettings.callForDownload]);

	// Every time the dimensions or dashboard layout changes,
	// recompute the space available for graph
	useEffect(() => {
		graphArea();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [dimensions, tabState.tabs[tabTileProps.selectedTabId].dashLayout]);

	// When dashboard is changed from edit to present mode, enable or disable
	// the grid like background in dashboard area
	useEffect(() => {
		if (tabTileProps.dashMode === "Present") {
			setdashStyle({ ...dashStyle, background: null });
		} else {
			setdashStyle({ ...dashStyle, background: dashbackground });
		}
	}, [tabTileProps.dashMode]);

	let movement_timer: null | any = null;
	const RESET_TIMEOUT: number = 300;
	const handleResize = () => {
		clearInterval(movement_timer);
		movement_timer = setTimeout(test_dimensions, RESET_TIMEOUT);
	};

	const test_dimensions = () => {
		if (targetRef.current) {
			setDimensions({
				width: targetRef.current.offsetWidth,
				height: targetRef.current.offsetHeight,
			});
		}
	};

	useLayoutEffect(() => {
		test_dimensions();
	}, [
		tabTileProps.showDash,
		tabTileProps.dashMode,
		showListofTileMenu,
		dashboardResizeColumn,
		showDashBoardFilterMenu,
	]);

	// Given the dimension of dashboard area available,
	// if Fullscreen option or Aspect ratio option selected,
	// compute the width and height of available area for graphs
	const graphArea = () => {
		var dashLayoutProperty = tabState.tabs[tabTileProps.selectedTabId].dashLayout;

		if (
			dashLayoutProperty.dashboardLayout === "Auto" &&
			dashLayoutProperty.selectedOptionForAuto === "Full Screen"
		) {
			// Approximately divided the area into 32 sections wide & 18 sections height
			// var fullWidth = Math.trunc(dimensions.width / 32, 0) * 32;
			var fullWidth = Math.trunc(dimensions.width / 32) * 32;

			// var fullHeight = Math.trunc(dimensions.height / 18, 0) * 18;
			var fullHeight = Math.trunc(dimensions.height / 18) * 18;

			// setting dashboard graph area according to above size
			setinnerDimensions({ width: fullWidth, height: fullHeight });

			// set grid like background of dashboard accordingly
			setdashStyle({
				...dashStyle,
				width: fullWidth,
				height: fullHeight,
				backgroundSize: `${fullWidth / 32}px ${fullHeight / 18}px, 
				${fullWidth / 32}px ${fullHeight / 18}px, 
				${fullWidth / 2}px ${fullWidth / 2}px,
				${fullHeight / 2}px ${fullHeight / 2}px`,
			});

			// compute size of each of the grid and save it in store
			// used by graph area in tile for displaying graph in dashboard size
			setGridSize({ x: fullWidth / 32, y: fullHeight / 18 });
		}

		if (
			dashLayoutProperty.dashboardLayout === "Auto" &&
			dashLayoutProperty.selectedOptionForAuto === "Aspect Ratio"
		) {
			// ======================================================
			// For aspect ratio

			// Get user defined aspect ratio and set number of grids (twice that of width & height)
			var xUnit = dimensions.width / (dashLayoutProperty.aspectRatio.width * 2);
			var yUnit = dimensions.height / (dashLayoutProperty.aspectRatio.height * 2);

			// checking if the x unit or the y unit can be used as a base unit
			// for computing total size of dashboard graph area

			// Using xUnit as a base
			if (xUnit * (dashLayoutProperty.aspectRatio.height * 2) > dimensions.height) {
			} else {
				// var truncatedX = Math.trunc(xUnit, 0);
				var truncatedX = Math.trunc(xUnit);
				setinnerDimensions({
					width: truncatedX * (dashLayoutProperty.aspectRatio.width * 2),
					height: truncatedX * (dashLayoutProperty.aspectRatio.height * 2),
				});
				setdashStyle({
					...dashStyle,
					width: truncatedX * (dashLayoutProperty.aspectRatio.width * 2),
					height: truncatedX * (dashLayoutProperty.aspectRatio.height * 2),
					backgroundSize: `${truncatedX}px ${truncatedX}px, 
					${truncatedX}px ${truncatedX}px, 
					${truncatedX * dashLayoutProperty.aspectRatio.width}px 
					${truncatedX * dashLayoutProperty.aspectRatio.width}px, 
					${truncatedX * dashLayoutProperty.aspectRatio.height}px 
					${truncatedX * dashLayoutProperty.aspectRatio.height}px`,
				});
				setGridSize({ x: truncatedX, y: truncatedX });
			}

			// Using yUnit as a base
			if (yUnit * (dashLayoutProperty.aspectRatio.width * 2) > dimensions.width) {
			} else {
				// var truncatedY = Math.trunc(yUnit, 0);
				var truncatedY = Math.trunc(yUnit);
				setinnerDimensions({
					width: truncatedY * (dashLayoutProperty.aspectRatio.width * 2),
					height: truncatedY * (dashLayoutProperty.aspectRatio.height * 2),
				});
				setdashStyle({
					...dashStyle,
					width: truncatedY * (dashLayoutProperty.aspectRatio.width * 2),
					height: truncatedY * (dashLayoutProperty.aspectRatio.height * 2),
					backgroundSize: `${truncatedY}px ${truncatedY}px , 
					${truncatedY}px ${truncatedY}px, 
					${truncatedY * dashLayoutProperty.aspectRatio.width}px 
					${truncatedY * dashLayoutProperty.aspectRatio.width}px, 
					${truncatedY * dashLayoutProperty.aspectRatio.height}px 
					${truncatedY * dashLayoutProperty.aspectRatio.height}px`,
				});
				setGridSize({ x: truncatedY, y: truncatedY });
			}
		}
	};

	// List of tiles to be mapped on the side of dashboard,
	// allowing users to choose graphs from these tiles
	let tilesForSelectedTab = tileState.tileList[tabTileProps.selectedTabId];

	let tileList = tilesForSelectedTab.map((tile: any, index: number) => {
		let currentObj = tileState.tiles[tile];
		var propKey: string = `${currentObj.tabId}.${currentObj.tileId}`;

		const dashSpecs = {
			name: currentObj.tileName,
			highlight: false,
			propKey,
			tileId: currentObj.tileId,
			width: 10,
			height: 6,
			x: 11,
			y: 6,
		};

		var propIndex: number = tabState.tabs[currentObj.tabId].tilesInDashboard.indexOf(propKey);
		var indexOfProps = tabState.tabs[currentObj.tabId].tilesInDashboard.includes(propKey);
		var checked: boolean = indexOfProps ? true : false;

		return (
			<div key={index}
				className={
					tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails[propKey]?.highlight
						? "listOfGraphsHighlighted"
						: "listOfGraphs"
				}
			>
				<Checkbox
					size="small"
					key={index}
					checked={checked}
					onChange={event => {
						updateDashBoardFilters(event, propKey);
						updateDashDetails(
							checked,
							propKey,
							dashSpecs,
							tabTileProps.selectedTabId,
							propIndex
						);
						 toggleGraphSize(propKey, checked ? true : false);
						//toggleGraphSize(propIndex, checked ? true : false);
					}}
					style={{
						transform: "scale(0.8)",
						margin: "0px 4px",
					}}
					sx={{
						"&.MuiCheckbox-root": {
							padding: "0px",
							margin: "0px",
						},
						"&.Mui-checked": {
							color: "#2bb9bb",
						},
					}}
				/>

				<span className="graphName">{currentObj.tileName}</span>
			</div>
		);
	});

	const updateDashBoardFilters = (event: any, tileSelected: string) => {
		if (event.target.checked) {
			chartGroup?.tabTile[tileSelected]?.forEach((groupID: string) => {
				if (!dashBoardGroup?.filterGroupTabTiles[groupID]) {
					addDashBoardFilterGroupTabTiles(groupID);
				}

				if (!dashBoardGroup.groups.includes(groupID)) {
					updateDashBoardGroups(groupID);
				}

				let tabTilesList: any = [];
				tabTilesList.push(tileSelected);

				setDashBoardFilterGroupsTabTiles(groupID, tabTilesList);
			});
		} else {
			dashBoardGroup.groups?.forEach((groupID: string) => {
				if (dashBoardGroup.filterGroupTabTiles[groupID].includes(tileSelected)) {
					if (dashBoardGroup.filterGroupTabTiles[groupID].length == 1) {
						deleteDashBoardSelectedGroup(groupID);
						deleteDashBoardSelectedGroupAllTabTiles(groupID);
					} else {
						deleteDashBoardSelectedTabTiles(
							groupID,
							dashBoardGroup.filterGroupTabTiles[groupID].findIndex(
								(id: string) => id == tileSelected
							)
						);
					}
				}
			});
		}
	};

	useEffect(() => {
		renderGraphs();
	}, [tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails, dashStyle]);

	const renderGraphs = () => {
		return tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.map((box, index) => {
			var boxDetails = tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails[box];

			return (
				<GraphRNDDash
					key={index}
					mouseDownOutsideGraphs={mouseDownOutsideGraphs}
					tabId={tabTileProps.selectedTabId}
					boxDetails={boxDetails}
					style={style}
					setStyle={setStyle}
					style2={style2}
					setStyle2={setStyle2}
					gridSize={{ x: dashStyle.width, y: dashStyle.height }}
				/>
			);
		});
	};

	return (
		<div
			className="dashboardWrapper"
			onMouseDown={(e: any) => {
				var container = "dragHeader";
				var container2 = "dashChart";
				var container3 = "rndObject";

				if (e.target.attributes.class) {
					if (
						e.target.attributes.class.value === container ||
						e.target.attributes.class.value === container2 ||
						e.target.attributes.class.value === container3
					) {
						setmouseDownOutsideGraphs(false);
						// graphHighlight(
						// 	tabTileProps.selectedTabId,
						// 	e.target.attributes.propkey.value,
						// 	true
						// );
					} else {
						setmouseDownOutsideGraphs(true);
						// resetHighlight(tabTileProps.selectedTabId);
					}
				}
			}}
		>
			<div className="dashboardOuter" ref={targetRef}>
				<div
					className="dashboardArea"
					id="GraphAreaToDownload"
					style={
						pageSettings.callForDownload
							? {
									...dashStyle,
									background: "none",
									backgroundColor: "white",
									borderTop: "2px solid rgba(224,224,224,1)",
							  }
							: dashStyle
					}
				>
					{tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.length > 0 ? (
						renderGraphs()
					) : (
						<div
							id="GraphAreaToDownload"
							style={{
								height: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "#999999",
								borderTop: pageSettings.callForDownload
									? "2px solid rgba(224,224,224,1)"
									: "0px",
							}}
						>
							<pre style={{ fontFamily: "Monaco", fontSize: "16px" }}>
								No graphs selected{"\n\n"} Select tiles from right panel to place
								graph here
							</pre>
						</div>
					)}
				</div>
			</div>
			{tabTileProps.dashMode === "Edit" ? (
				<div>
					{showListofTileMenu ? (
						<div className="dashBoardSideBar">
							<div className="tileListContainer">
								<div className="axisTitle">
									List of Tiles
									<Tooltip title="Hide">
										<KeyboardArrowUpIcon
											sx={{
												fontSize: "16px",
												float: "right",
												marginRight: "-4px",
											}}
											onClick={() => setShowListofTileMenu(false)}
										/>
									</Tooltip>
								</div>
								{tileList}
							</div>
						</div>
					) : dashboardResizeColumn ? (
						<>
							{dashboardResizeColumn ? (
								<div className="dashBoardSideBar">
									<DashBoardLayoutControl
										setDashboardResizeColumn={setDashboardResizeColumn}
									/>
								</div>
							) : null}
						</>
					) : null}
				</div>
			) : null}
			{showDashBoardFilterMenu ? (
				<>
					<div className="dashBoardSideBar">
						<ChartData
							tabId={tabTileProps.selectedTabId}
							tileId={tabTileProps.selectedTileId}
							screenFrom="Dashboard"
						></ChartData>
						<ChartFilterGroupsContainer
							propKey={"0.0"}
							fromDashboard={true}
						></ChartFilterGroupsContainer>
						{/* <Tooltip title="Hide">
								<KeyboardArrowUpIcon
									sx={{
										fontSize: "16px",
										float: "right",
										margin: "16px 0px 5px 8px",
										color: "grey",
									}}
									onClick={() => setShowDashBoardFilter(false)}
								/>
							</Tooltip> */}
					</div>
				</>
			) : null}
		</div>
	);
};

const mapStateToProps = (state: DashBoardStateProps & any, ownProps: any) => {
	return {
		chartGroup: state.chartFilterGroup,
		dashBoardGroup: state.dashBoardFilterGroup,
		tabState: state.tabState,
		tabTileProps: state.tabTileProps,
		tileState: state.tileState,
		pageSettings: state.pageSettings,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateDashDetails: (
			checked: boolean,
			propKey: string,
			dashSpecs: any,
			tabId: number,
			propIndex: number
		) => dispatch(updateTabDashDetails(checked, propKey, dashSpecs, tabId, propIndex)),

		toggleGraphSize: (tileKey: string, graphSize: boolean) =>
			dispatch(toggleGraphSize(tileKey, graphSize)),

		graphHighlight: (tabId: number, propKey: string, highlight: boolean | any) =>
			dispatch(updateGraphHighlight(tabId, propKey, highlight)),
		resetHighlight: (tabId: number) => dispatch(resetGraphHighlight(tabId)),
		setGridSize: (gridSize: any) => dispatch(setDashGridSize(gridSize)), //gridSize{ x: null | number | string; y: null | number | string }
		resetPageSettings: () => dispatch(resetPageSettings()), //gridSize{ x: null | number | string; y: null | number | string }

		updateDashBoardGroups: (groupId: string) => dispatch(updateDashBoardGroups(groupId)),
		deleteDashBoardSelectedGroup: (groupId: string) =>
			dispatch(deleteDashBoardSelectedGroup(groupId)),
		deleteDashBoardSelectedGroupAllTabTiles: (groupId: string) =>
			dispatch(deleteDashBoardSelectedGroupAllTabTiles(groupId)),
		addDashBoardFilterGroupTabTiles: (groupId: string) =>
			dispatch(addDashBoardFilterGroupTabTiles(groupId)),
		setDashBoardFilterGroupsTabTiles: (groupId: string, selectedTabTiles: any) =>
			dispatch(setDashBoardFilterGroupsTabTiles(groupId, selectedTabTiles)),
		deleteDashBoardSelectedTabTiles: (groupId: string, selectedTabTiles: any) =>
			dispatch(deleteDashBoardSelectedTabTiles(groupId, selectedTabTiles)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
