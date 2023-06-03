// This component provides individual dropzone
// Each Dropzone can have allowed number of cards.
// Cards can be moved between dropzones & also sorted within a dropzone

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Popover } from "@mui/material";
import ChartFilterGroups from './ChartFilterGroups';
import { useState } from 'react';
import AddIcon from "@mui/icons-material/Add";
import {
	addChartFilterGroupName,
	deleteChartFilterSelectedGroup,
	addChartFilterTabTileName, updateChartFilterSelectedGroups, updateChartFilterGroupsCollapsed
} from "../../redux/ChartFilterGroup/ChartFilterGroupStateActions";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Checkbox } from "@mui/material";
import { ChartFilterGroupsContainerProps } from '../../redux/ChartFilterGroup/ChartFilterGroupInterface';
import { ChartPropertiesStateProps } from '../../redux/ChartPoperties/ChartPropertiesInterfaces';
import { ChartFilterGroupStateProps, groupProp } from '../../redux/ChartFilterGroup/ChartFilterGroupInterface';
import { updateDashBoardGroups, deleteDashBoardSelectedGroup } from '../../redux/DashBoardFilterGroup/DashBoardFilterGroupAction';
import { addDashBoardFilterGroupTabTiles, setDashBoardFilterGroupsTabTiles, deleteDashBoardSelectedGroupAllTabTiles } from '../../redux/DashBoardFilterGroup/DashBoardFilterGroupAction';
import { TileRibbonStateProps } from "../../Components/TabsAndTiles/TileRibbonInterfaces";

const ChartFilterGroupsContainer = ({
	// props
	propKey,
	fromDashboard,

	// state
	chartProp,
	chartGroup,
	dashBoardGroup,
	tileState,
	tabTileProps,

	// dispatch
	addChartFilterGroupName,
	addChartFilterTabTileName,
	updateChartFilterSelectedGroups,
	updateChartFilterGroupsCollapsed,
	deleteChartFilterSelectedGroup,
	updateDashBoardGroups,
	deleteDashBoardSelectedGroup,
	addDashBoardFilterGroupTabTiles,
	setDashBoardFilterGroupsTabTiles,
	deleteDashBoardSelectedGroupAllTabTiles
}: ChartFilterGroupsContainerProps) => {

	let selectedDatasetID = "";
	let datasetGroupList = [];
	let selectedFilterGroups: any = [];


	if (!fromDashboard) {
		selectedDatasetID = chartProp.properties[propKey].selectedDs.id;
		datasetGroupList = chartGroup.datasetGroupsList[selectedDatasetID];
		selectedFilterGroups = chartGroup.tabTile[propKey] || [];
	}
	else {
		selectedFilterGroups = dashBoardGroup.groups;
		datasetGroupList = Object.keys(chartGroup.groups);
	}

	const [showPopover, setShowPopover] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	//const 
	let showFilters: any[] = [];

	//if (!fromDashboard) {
	if (selectedFilterGroups && selectedFilterGroups.length > 0) {
		selectedFilterGroups.forEach((grp: string) => {
			showFilters.push({
				id: grp, name: chartGroup.groups[grp].name,
				filters: chartGroup.groups[grp].filters, isCollapsed: chartGroup.groups[grp].isCollapsed
			});
		})
	}
	//}

	const collapseOtherGroups = () => {
		if (selectedFilterGroups && selectedFilterGroups.length > 0) {
			selectedFilterGroups.forEach((grp: any) => {
				updateChartFilterGroupsCollapsed(grp, true);
			});
		}
	}

	const handleClose = () => {
		setShowPopover(false)
		setAnchorEl(null);

	};

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
		setShowPopover(true)
	};

	const handleCBChange = (event: any) => {
		if (event.target.checked) {
			if (fromDashboard) {
				addDashBoardFilterGroupTabTiles(event.target.name);
				updateDashBoardGroups(event.target.name);


				let tabTilesList: any = [];
				let groupDataSetId = chartGroup.groups[event.target.name].dataSetId;

				[...tileState.tileList[tabTileProps.selectedTabId]].forEach((item: any) => {
					if (chartProp.properties[item].selectedDs.id == groupDataSetId) {
						tabTilesList.push(item);
					}
				});

				setDashBoardFilterGroupsTabTiles(event.target.name, tabTilesList)
			}
			else {
				updateChartFilterSelectedGroups(propKey, event.target.name);
			}
		}
		else {
			if (fromDashboard) {
				deleteDashBoardSelectedGroup(event.target.name);

				deleteDashBoardSelectedGroupAllTabTiles(event.target.name);
			}
			else {
				deleteChartFilterSelectedGroup(propKey, selectedFilterGroups.findIndex((name: string) => name == event.target.name))
			}
		}
	}


	const getNewGroupName = (numOfGroups: number): string => {
		let isUnique = true;

		let newName = "Filter Group " + numOfGroups;

		Object.keys(chartGroup.groups).forEach(grp => {
			if (chartGroup.groups[grp].name == newName) {
				isUnique = false;
				return;
			}
		});

		if (!isUnique) {
			return getNewGroupName(numOfGroups + 1)
		}
		else {
			return newName;
		}
	}

	return (
		<div className="chartFilterGroupContainer">
			<div className="containersHead">
				{!fromDashboard ?
					<div
						title="Create New Playbook"
						className="containerButton"
						onClick={e => {

							if (!(selectedFilterGroups && selectedFilterGroups.length > 0)) {
								addChartFilterTabTileName(selectedDatasetID, propKey);
							}

							//let newGroupName = "Filter Group " + ((datasetGroupList?.length + 1) || 1);
							let numOfGroups = 0;

							if (Object.keys(chartGroup.groups) && Object.keys(chartGroup.groups).length > 0) {
								numOfGroups = Object.keys(chartGroup.groups).length;
							}

							let newGroupName = getNewGroupName(numOfGroups + 1);
							let groupId = selectedDatasetID + "_" + newGroupName + (new Date().getMilliseconds());
							addChartFilterGroupName(selectedDatasetID, groupId, newGroupName);
							collapseOtherGroups();
							updateChartFilterSelectedGroups(propKey, groupId);
						}}
					>
						<AddIcon />
					</div>
					: null}
				<button
					type="button"
					className="buttonCommon"
					style={{ backgroundColor: "transparent" }}
					title="More Options"
					onClick={handleClick}
				>
					<MoreVertIcon aria-describedby={id} style={{ fontSize: "16px", color: "#999999" }} onClick={() => handleClick} />
				</button>
			</div>
			<div>
				{
					showFilters.map((group: groupProp, indx: number) =>
					(
						<ChartFilterGroups key={indx} propKey={propKey} group={group} fromDashboard={fromDashboard}></ChartFilterGroups>
					)
					)
				}

			</div>

			<Popover
				open={showPopover}
				id={id}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<div className="datasetListPopover">
					<div className="datasetListPopoverHeading">
						<div style={{ flex: 1 }}>{"Active Filter Groups"}</div>
					</div>
					<div>
						{
							datasetGroupList?.map((item: any, index: number) => {
								return (
									<label className="UserFilterCheckboxes" key={index}>

										<Checkbox
											checked={selectedFilterGroups.includes(item)}
											name={item}
											style={{
												transform: "scale(0.6)",
												paddingRight: "0px",
											}}
											sx={{
												"&.Mui-checked": {
													color: "orange",
												},

											}}
											onChange={e => handleCBChange(e)}
										/>


										<span
											title={chartGroup.groups[item].name}
											style={{
												marginLeft: 0,
												marginTop: "3.5px",
												justifySelf: "center",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												overflow: "hidden",
											}}
										>
											{chartGroup.groups[item].name}
										</span>
									</label>
								);
							})
						}
					</div>
				</div>
			</Popover>

		</div>
	);
};

const mapStateToProps = (state: ChartPropertiesStateProps & ChartFilterGroupStateProps & TileRibbonStateProps) => {
	return {
		chartProp: state.chartProperties,
		chartGroup: state.chartFilterGroup,
		dashBoardGroup: state.dashBoardFilterGroup,
		tileState: state.tileState,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		addChartFilterGroupName: (selectedDatasetID: string, groupId: string, groupName: string) =>
			dispatch(addChartFilterGroupName(selectedDatasetID, groupId, groupName)),

		updateChartFilterGroupsCollapsed: (groupId: string, collapsed: boolean) =>
			dispatch(updateChartFilterGroupsCollapsed(groupId, collapsed)),

		addChartFilterTabTileName: (selectedDatasetID: string, tabTileName: string) =>
			dispatch(addChartFilterTabTileName(selectedDatasetID, tabTileName)),

		updateChartFilterSelectedGroups: (groupId: string, filters: any) =>
			dispatch(updateChartFilterSelectedGroups(groupId, filters)),

		deleteChartFilterSelectedGroup: (tabTileName: string, groupIndex: number) =>
			dispatch(deleteChartFilterSelectedGroup(tabTileName, groupIndex)),

		updateDashBoardGroups: (groupId: string) =>
			dispatch(updateDashBoardGroups(groupId)),


		deleteDashBoardSelectedGroup: (groupId: string) =>
			dispatch(deleteDashBoardSelectedGroup(groupId)),

		deleteDashBoardSelectedGroup: (groupId: string) =>
			dispatch(deleteDashBoardSelectedGroup(groupId)),

		deleteDashBoardSelectedGroupAllTabTiles:(groupId: string) =>
			dispatch(deleteDashBoardSelectedGroupAllTabTiles(groupId)),
		addDashBoardFilterGroupTabTiles: (groupId: string) =>
			dispatch(addDashBoardFilterGroupTabTiles(groupId)),
		setDashBoardFilterGroupsTabTiles: (groupId: string, selectedTabTiles: any) =>
			dispatch(setDashBoardFilterGroupsTabTiles(groupId, selectedTabTiles))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartFilterGroupsContainer);
