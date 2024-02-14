import {
	ChartPropertiesProps,
	ChartPropertiesStateProps,
} from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { TabStateProps, TabStateProps2 } from "../../redux/TabTile/TabStateInterfaces";
import { TabTileStateProps, TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";
import { TileStateProps, TileStateProps2 } from "../../redux/TabTile/TileStateInterfaces";
import {ChartFilterGroupProps} from "../../redux/ChartFilterGroup/ChartFilterGroupInterface";
import {ChartFilterGroupStateProps} from '../../redux/ChartFilterGroup/ChartFilterGroupInterface';

export interface TileRibbonProps {
	//state
	tabTileProps: TabTileStateProps;
	tabState: TabStateProps;
	tileState: TileStateProps;
	tableData: any;
	chartProp: ChartPropertiesProps;
	chartGroup:ChartFilterGroupProps;
	//Dispatch
	addTile: (
		tabId: number,
		nextTileId: number,
		table: any,
		selectedDataset: any,
		selectedTables: any
	) => void;
	selectTile: (
		tabId: number,
		tileName: string,
		tileId: number,
		nextTileId: number,
		fromTab: any,
		fileId: any
	) => void;
	enableRenameTile: (tabId: number, tileId: number, isTrue: boolean) => void;
	completeRenameTile: (
		tabId: number,
		tileId: number,
		renameValue: string,
		nextTileId: number,
		isTrue: boolean
	) => void;
	removeTile: (tabId: number, tileId: number, tileIndex: number) => void;
	addChartFilterTabTileName: (selectedDatasetID: string, tabTileName: string) => void;
}

export type TileRibbonStateProps = TabTileStateProps2 &
	TabStateProps2 &
	TileStateProps2 &
	ChartPropertiesStateProps &
	ChartFilterGroupStateProps &
	any;
