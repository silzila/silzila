// This component returns one single tile within the tabRibbon.
// Each tile has actions to rename the tile & delete the tile

import { Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { duplicateControl } from "../../redux/ChartProperties/actionsChartControls";
import { duplicateChartProperty } from "../../redux/ChartProperties/actionsChartProperties";
import { actionsToAddTile, renameTile } from "../../redux/TabTile/actionsTabTile";
import "./individualTile.css";

function IndividualTile({
	// props from Parent
	tabName,
	tileName,
	editing,
	selectedTile,
	tabId,
	tileId,
	showDash,

	// functions in parent
	renameTileBegin,
	renameTileComplete,
	selectTile,
	removeTile,
}) {
	const [renameValue, setRenameValue] = useState(tileName);

	const handleTileNameValue = (e) => {
		setRenameValue(e.target.value);
	};

	var menuStyle = { fontSize: "12px", padding: "2px 1rem" };

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => setAnchorEl(null);

	const dispatch = useDispatch();
	const state = useSelector((state) => state);
	// console.log(state);

	function setDuplicateName(fromTileName, newName, count, tabId, nextTileId) {
		state.tileState.tileList[tabId].map((tileKey) => {
			console.log(tileKey);
			if (state.tileState.tiles[tileKey].tileName === newName) {
				count = count + 1;
				newName = `${fromTileName} - copy(${count})`;
				setDuplicateName(fromTileName, newName, count, tabId, nextTileId);
			}
		});
		dispatch(renameTile(tabId, nextTileId, newName));
	}

	const handleDuplicateTile = () => {
		handleClose();

		// get all information about this tile and set in appropriate tile id
		// give a unique tile name

		let tabObj = state.tabState.tabs[state.tabTileProps.selectedTabId];

		var propKey = `${state.tabTileProps.selectedTabId}.${state.tabTileProps.selectedTileId}`;

		var nextPropKey = `${state.tabTileProps.selectedTabId}.${tabObj.nextTileId}`;

		dispatch(
			actionsToAddTile({
				tabId: tabObj.tabId,
				nextTileId: tabObj.nextTileId,
				table: state.tabTileProps.selectedTable,
				fromTab: false,
				selectedDs: state.chartProperties.properties[propKey].selectedDs,
				selectedTablesInDs: state.chartProperties.properties[propKey].selectedTable,
			})
		);

		dispatch(
			duplicateControl(
				nextPropKey,
				JSON.parse(JSON.stringify(state.chartControls.properties[propKey]))
			)
		);

		dispatch(
			duplicateChartProperty(
				nextPropKey,
				JSON.parse(JSON.stringify(state.chartProperties.properties[propKey]))
			)
		);

		var count = 0;
		var fromTileName = state.tileState.tiles[propKey].tileName;
		var newName = `${fromTileName} - copy`;

		setDuplicateName(fromTileName, newName, count, tabObj.tabId, tabObj.nextTileId);
	};

	const RightClickMenu = () => {
		return (
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				open={open}
				onClose={() => handleClose("clickOutside")}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<MenuItem
					onClick={(e) => {
						e.stopPropagation();
						renameTileBegin(tabId, tileId);
						handleClose();
					}}
					sx={menuStyle}
				>
					Rename Tile
				</MenuItem>
				<MenuItem
					onClick={(e) => {
						e.stopPropagation();
						handleDuplicateTile();
						handleClose();
					}}
					sx={menuStyle}
				>
					Duplicate Tile
				</MenuItem>
				<MenuItem
					onClick={(e) => {
						e.stopPropagation();
						removeTile(tabId, tileId);
						handleClose();
					}}
					sx={menuStyle}
				>
					Delete Tile
				</MenuItem>
			</Menu>
		);
	};

	if (selectedTile === tileId && editing) {
		return (
			<form
				style={{ display: "inline" }}
				onSubmit={(evt) => {
					evt.currentTarget.querySelector("input").blur();
					evt.preventDefault();
				}}
			>
				<input
					autoFocus
					value={renameValue}
					onChange={handleTileNameValue}
					className="editTileSelected"
					onBlur={() => renameTileComplete(renameValue, tabId, tileId)}
					title="Press enter or click away to save"
				/>
			</form>
		);
	} else {
		return (
			<span
				className={
					selectedTile === tileId && !showDash
						? "commonTile indiItemHighlightTile"
						: "commonTile indiItemTile"
				}
				onDoubleClick={(e) => {
					e.stopPropagation();
					console.log("Double clicked");
					renameTileBegin(tabId, tileId);
				}}
				onClick={(e) => {
					e.stopPropagation();
					console.log("Left clicked");
					selectTile(tileId, tileName, tabId, tabName);
				}}
				title={`${tileName}. Double click to edit name`}
				onContextMenu={(e) => {
					e.preventDefault();
					e.stopPropagation();
					console.log("Right Click");
					handleClick(e);
				}}
			>
				<span>{tileName}</span>
				<span
					title="Delete Tile"
					className="closeTile"
					onClick={(e) => {
						e.stopPropagation();
						removeTile(tabId, tileId);
					}}
				>
					X
				</span>
				<RightClickMenu />
			</span>
		);
	}
}

export default IndividualTile;
