import {Card} from '../ChartAxes/ChartAxesInterfaces';

export interface PatternCollectionType {
	[key: string]: string;	
}


export interface UserFilterCardProps extends Card {
	token:string,

	// dispatch
	deleteDropZoneItems: (propKey:  string, binIndex: number, itemIndex: number, currentChartAxesName : string) => void;

	updateQueryParam: (
		propKey:  string,
		binIndex: number,
		itemIndex: number,
		item: any
	) => void;

    updateLeftFilterItem:(propKey: string, bIndex:number, item:any, currentChartAxesName : string) => void;

    updtateFilterExpandeCollapse:(propKey: string, bIndex:number, item:any) =>void;

	sortAxes: (propKey:  string, bIndex: number, dragUId: any, uId: any, currentChartAxesName : string) => void;
	revertAxes: (propKey:  string, bIndex: number, uId: any, originalIndex: number, currentChartAxesName : string) => void;
}