import { Card } from '../../Components/ChartAxes/ChartAxesInterfaces';


export interface ChartFilterGroupProps {
	tabTile: any;
	datasetGroupsList: any;
	groups: any;
	chartFilterGroupEdited: boolean;
}


export interface ChartFilterGroupStateProps {
	chartFilterGroup: ChartFilterGroupProps;
}


export interface UserFilterCardProps extends Card {
	token: string,

	// dispatch
	deleteDropZoneItems: (propKey: string, binIndex: number, itemIndex: number) => void;

	updateQueryParam: (
		propKey: string,
		binIndex: number,
		itemIndex: number,
		item: any
	) => void;

	updateLeftFilterItem: (propKey: string, bIndex: number, item: any) => void;

	updtateFilterExpandeCollapse: (propKey: string, bIndex: number, item: any) => void;

	sortAxes: (propKey: string, bIndex: number, dragUId: any, uId: any) => void;
	revertAxes: (propKey: string, bIndex: number, uId: any, originalIndex: number) => void;
}