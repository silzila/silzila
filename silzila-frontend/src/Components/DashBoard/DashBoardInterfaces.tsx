import { TabStateProps, TabStateProps2 } from "../../redux/TabTile/TabStateInterfaces";
import { TabTileStateProps, TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";
import { TileStateProps, TileStateProps2 } from "../../redux/TabTile/TileStateInterfaces";

export interface DashBoardProps {
	//props
	showListofTileMenu: boolean;
	dashboardResizeColumn: boolean;
	//state
	tabState: TabStateProps;
	tabTileProps: TabTileStateProps;
	tileState: TileStateProps;

	// Dispatch
	toggleGraphSize: (tileKey: number, graphSize: boolean) => void;
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
}

export type DashBoardStateProps = TabStateProps2 & TabTileStateProps2 & TileStateProps2;
