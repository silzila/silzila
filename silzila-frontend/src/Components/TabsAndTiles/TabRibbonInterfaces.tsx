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
import {ChartFilterGroupProps} from "../../redux/ChartFilterGroup/ChartFilterGroupInterface";
import {ChartFilterGroupStateProps} from '../../redux/ChartFilterGroup/ChartFilterGroupInterface';

export type TabRibbonStateProps = TabTileStateProps2 & TabStateProps2 & ChartPropertiesStateProps & ChartFilterGroupStateProps;

export interface TabRibbonProps {
	//state
	tabTileProps: TabTileStateProps;
	tabState: TabStateProps;
	chartProp: ChartPropertiesProps;
	chartGroup:ChartFilterGroupProps;

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
		fromTab: boolean
	) => void;
	addChartFilterTabTileName: (selectedDatasetID: string, tabTileName: string) => void;

}
