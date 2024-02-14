import { RelationObjProps } from "./CanvasTablesIntefaces";

export interface RelationshipDefiningComponentProps {
	// props
	id?: string;
	showRelationCard: boolean;
	setShowRelationCard: React.Dispatch<React.SetStateAction<boolean>>;
	arrowProp?: any;

	existingArrow?: any;
	setExistingArrow?: any;
	existingArrowProp?: any;
	setExistingArrowProp?: any;
	addRelationship?: (relObj: RelationObjProps) => void | undefined;
	// state
	arrows?: any;

	// dispatch
	addArrows?: any;
	removeRelationship?: any;
	removeArrows?: any;
	removeIndiArrow?: any;
	updateRelationship?: any;
}

export interface rowUniq {
	id: number;
	name: string;
}
export interface rowMat {
	id: number;
	name: string;
	image: string;
}
