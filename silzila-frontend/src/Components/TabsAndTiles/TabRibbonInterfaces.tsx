import {
	ChartPropertiesProps,
	ChartPropertiesStateProps,
} from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { TabStateProps, TabStateProps2 } from "../../redux/TabTile/TabStateInterfaces";
import {
	TabTileStateProps,
	TabTileStateProps2,
	TabTilPropsSelectedDatasetList,
} from "../../redux/TabTile/TabTilePropsInterfaces";

export type TabRibbonStateProps = TabTileStateProps2 & TabStateProps2 & ChartPropertiesStateProps;

export interface TabRibbonProps {
	//state
	tabTileProps: TabTileStateProps;
	tabState: TabStateProps;
	chartProp: ChartPropertiesProps;

	//Dispatch
	addTab: (
		tabId: number,
		table: any,
		selectedDs: TabTilPropsSelectedDatasetList,
		selectedTablesInDs: any
	) => void;
	selectTab: (tabName: string, tabId: number, showDash: boolean, dashMode: string) => void;
	removeTab: (tabName: string, tabId: number, tabToRemoveIndex: number, newObj?: any) => void;
	enableRenameTab: (tabId: number, isTrue: boolean) => void;
	completeRenameTab: (renameValue: string, tabId: number) => void;
	selectTile: (
		tabId: number,
		tileName: string,
		tileId: number,
		nextTileId: number,
		// fileId: number,
		fromTab: boolean
	) => void;
}
