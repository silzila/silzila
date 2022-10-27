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
	checkRelationExists: (value: any) => void;
	table_Id: string;
}

interface CanvasTableColumnsPropsFromState {
	arrows: any[];
}

export type CanvasTableColumnsProps = CanvasTableColumnsPropsFromState &
	CanvasTableColumnsPropsFromParent;
