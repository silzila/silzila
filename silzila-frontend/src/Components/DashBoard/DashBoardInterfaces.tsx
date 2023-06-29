import { TabStateProps, TabStateProps2 } from "../../redux/TabTile/TabStateInterfaces";
import { TabTileStateProps, TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";
import { TileStateProps, TileStateProps2 } from "../../redux/TabTile/TileStateInterfaces";

export interface DashBoardProps {
	//props
	showListofTileMenu: boolean;
	dashboardResizeColumn: boolean;
	showDashBoardFilterMenu: boolean;

	//state
	chartGroup: any;
	dashBoardGroup: any;
	tabState: TabStateProps;
	tabTileProps: TabTileStateProps;
	tileState: TileStateProps;
	pageSettings: any;

	// Dispatch
	toggleGraphSize: (tileKey: string, graphSize: boolean) => void;
	resetHighlight: (tabId: number) => void;
	setGridSize: (gridSize: any) => void;
	graphHighlight: (tabId: number, propKey: string, highlight: boolean | any) => void;
	updateDashDetails: (
		checked: boolean,
		propKey: string,
		dashSpecs: any,
		tabId: number,
		propIndex: number
	) => void;
	setShowListofTileMenu: (value: boolean) => void;
	setDashboardResizeColumn: (value: boolean) => void;
	setShowDashBoardFilter: (value: boolean) => void;
	resetPageSettings: () => void; //gridSize{ x: null | number | string; y: null | number | string }
	updateDashBoardGroups: (groupId: string) => void;
	deleteDashBoardSelectedGroup: (groupId: string) => void;
	deleteDashBoardSelectedGroupAllTabTiles: (groupId: string) => void;
	addDashBoardFilterGroupTabTiles: (groupId: string) => void;
	setDashBoardFilterGroupsTabTiles: (groupId: string, selectedTabTiles: any) => void;
	deleteDashBoardSelectedTabTiles: (groupId: string, selectedTabTiles: any) => void;
}

export type DashBoardStateProps = TabStateProps2 & TabTileStateProps2 & TileStateProps2;
