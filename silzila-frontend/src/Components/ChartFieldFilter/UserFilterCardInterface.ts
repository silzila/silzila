import {Card} from '../ChartAxes/ChartAxesInterfaces';

export interface PatternCollectionType {
	[key: string]: string;	
}


export interface UserFilterCardProps extends Card {
	token:string,

	// dispatch
	deleteDropZoneItems: (propKey: number | string, binIndex: number, itemIndex: number) => void;

	updateQueryParam: (
		propKey: number | string,
		binIndex: number,
		itemIndex: number,
		item: any
	) => void;

    updateLeftFilterItem:(propKey:number, bIndex:number, item:any) => void;

    updtateFilterExpandeCollapse:(propKey:number | string, bIndex:number, item:any) =>void;

	sortAxes: (propKey: number, bIndex: number, dragUId: any, uId: any) => void;
	revertAxes: (propKey: number, bIndex: number, uId: any, originalIndex: number) => void;
}