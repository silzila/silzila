import { ArrowsProps } from "../../redux/DataSet/DatasetStateInterfaces";
import { ArrowObj } from "./CanvasInterfaces";

interface CanvasTableColumnsPropsFromParent {
	key: string;
	dragRef: any;
	columnName: string;
	itemType: string;
	itemId: string;
	tableName: string;
	table_uid: string;
	index: number;
	schema: string;
	checkRelationExists: (value: ArrowObj | any) => void;
	table_Id: string;
	tableHasCustomQuery: boolean;
}

interface CanvasTableColumnsPropsFromState {
	arrows: ArrowsProps[];
}

export type CanvasTableColumnsProps = CanvasTableColumnsPropsFromState &
	CanvasTableColumnsPropsFromParent;
