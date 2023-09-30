// This component returns Individual table along with column names to be displayed in Canvas
// Tables can be given a friendly name by the user
// These tables are draggable

import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { connect } from "react-redux";
import { useXarrow } from "react-xarrows";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CanvasTableColumns from "./CanvasTableColumns";
import RelationshipDefiningComponent from "./RelationshipDefiningComponent";
import {
	actionsOnRemoveTable,
	addArrows,
	addNewRelationship,
	setTempTables,
} from "../../redux/DataSet/datasetActions";
import ShortUniqueId from "short-unique-id";
import ActionPopover from "./ActionPopover";
import { Button, TextField } from "@mui/material";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import {
	ArrowsProps,
	DataSetStateProps,
	RelationshipsProps,
	tableObjProps,
	UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import { Dispatch } from "redux";
import { CanvasTablesProps, RelationObjProps } from "./CanvasTablesIntefaces";
import { newArrowObj } from "./CanvasInterfaces";
import { ColumnsWithUid } from "./DatasetInterfaces";
import { AlertColor } from "@mui/material/Alert";

const CanvasTables = ({
	// props
	tableData,

	// state
	// dataSetState,
	arrows,
	tempTable,
	relationships,
	tables,
	views,

	// dispatch
	addNewRelationship,
	addArrows,
	actionsOnRemoveTable,
	setTempTables,
}: CanvasTablesProps) => {
	//TODO not sure about ref type,need to specify type
	const dragRef = useRef<any>();
	const updateXarrow = useXarrow();

	const [showRelationCard, setShowRelationCard] = useState<boolean>(false);
	const [arrowProp, setArrowProp] = useState<any>([]);
	const [open, setOpen] = useState<boolean>(false);
	const [tableId, setTableId] = useState<string>("");
	// TODO need to specify type
	const [anchorEl, setAnchorEl] = useState<any>();
	const [inputField, setInputField] = useState<boolean>(false);
	const [newName, setNewName] = useState<string>("");

	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [severity, setseverity] = useState<AlertColor>("success");
	const [testMessage, setTestMessage] = useState<string>("");

	const [x, setX] = useState<number | any>(
		tableData.tablePositionX ? tableData.tablePositionX : 0
	);
	const [y, setY] = useState<number | any>(
		tableData.tablePositionY ? tableData.tablePositionY : 0
	);

	var uid = new ShortUniqueId({ length: 8 });

	// when a new arrow is created,check if there is alerady a relation between the two tables of this new arrow
	// If yes, add arrow & link existing relationId
	// If no,
	// 		- open relation popover and get info.
	// 		- Create new relation id
	// 		- Save new arrow and new relation

	// TODO: need to specify type for newArrowObj after testing
	const checkRelationExists = (newArrowObj: newArrowObj) => {
		// if there are no arrows yet between these two tables, add arrow and show popup to define relationship
		if (arrows.length === 0) {
			newArrowObj.relationId = uid();
			setArrowProp(newArrowObj);
			setShowRelationCard(true);
		} else {
			var sameRel = false;
			var sameRelInv = false;

			var sameRelObj = {};
			var sameRelInvObj = {};

			relationships.forEach((rel: RelationshipsProps, i: number) => {
				// check if the relationship already exist by checking
				// if the start table and end table matches between the new arrow and existing realtionships


				if (rel.startId === newArrowObj.startId && rel.endId === newArrowObj.endId) {
					newArrowObj.relationId = rel.relationId;
					newArrowObj.cardinality = rel.cardinality;
					newArrowObj.integrity = rel.integrity;
					newArrowObj.showHead = rel.showHead;
					newArrowObj.showTail = rel.showTail;
					sameRel = true;
					sameRelObj = newArrowObj;
				} else if (rel.startId === newArrowObj.endId && rel.endId === newArrowObj.startId) {
					// If it is in reverse assign the start and end table parameters in reverse

					newArrowObj.relationId = rel.relationId;
					var newReverseArrowObj = JSON.parse(JSON.stringify(newArrowObj));

					newReverseArrowObj.startTableName = newArrowObj.endTableName;
					newReverseArrowObj.startColumnName = newArrowObj.endColumnName;
					newReverseArrowObj.start = newArrowObj.end;
					newReverseArrowObj.table1_uid = newArrowObj.table2_uid;
					newReverseArrowObj.startSchema = newArrowObj.endSchema;

					newReverseArrowObj.endTableName = newArrowObj.startTableName;
					newReverseArrowObj.endColumnName = newArrowObj.startColumnName;
					newReverseArrowObj.end = newArrowObj.start;
					newReverseArrowObj.table2_uid = newArrowObj.table1_uid;
					newReverseArrowObj.endSchema = newArrowObj.startSchema;

					newReverseArrowObj.relationId = rel.relationId;
					newReverseArrowObj.cardinality = rel.cardinality;
					newReverseArrowObj.integrity = rel.integrity;
					newReverseArrowObj.showHead = rel.showHead;
					newReverseArrowObj.showTail = rel.showTail;

					sameRelInv = true;
					sameRelInvObj = newReverseArrowObj;
				}
			});

			if (sameRel) {
				addArrows(sameRelObj);
			}
			if (sameRelInv) {
				addArrows(sameRelInvObj);
			}

			if (!sameRel && !sameRelInv) {
				newArrowObj.relationId = uid();
				setArrowProp(newArrowObj);
				setShowRelationCard(true);
			}
		}
	};

	const addRelationship = (relObj: RelationObjProps) => {
		addNewRelationship(relObj);
	};

	// Remove or rename tables in canvas
	// TODO: need to specify type
	const selectAction = (e: any) => {
		if (open === true) {
			// Remove table from canvas
			if (parseInt(e.target.id) === 1) {
				// get ID of table listed in canvas
				const tempTables: tableObjProps[] = [...tempTable].filter((tab: tableObjProps) => {
					return tab.id !== tableId;
				});

				// remove checked state of the table from Sidebar
				const tables1: UserTableProps[] = [...tables].map((tab: UserTableProps) => {
					if (tab.id === tableId) {
						tab.isSelected = false;
					}
					return tab;
				});
				const views1: any[] = [...views].map((tab: any) => {
					if (tab.id === tableId) {
						tab.isSelected = false;
					}
					return tab;
				});
				var table3 = tableData["isView"] ? views1 : tables1;
				// Remove this table's info from Relationship information
				var is_in_relationship: any = relationships.filter(
					(obj: RelationshipsProps) => obj.startId === tableId || obj.endId === tableId
				)[0];
				if (is_in_relationship) {
					var yes = window.confirm("are you sure you want to remove this table?");
					if (yes) {
						actionsOnRemoveTable(tempTables, table3, tableId);
					}
				} else {
					actionsOnRemoveTable(tempTables, table3, tableId);
				}
			} else if (parseInt(e.target.id) === 2) {
				// Rename table alias in canvas
				setNewName(tableData.alias);
				setInputField(true);
			}
		} else {
			alert("Actions not Set");
		}
		setOpen(false);
	};

	// Focusing the input text field during rename of table
	const selectText = () => {
		var input: any = document.getElementById("name");
		input.select();
	};

	// When changing name of a table, make sure that it is not empty
	const changeTableName = (tableId: string) => {
		var spaceCount = newName.split(" ").length - 1;
		if (newName.length > 0 && newName.length !== spaceCount) {
			const newTable = [...tempTable].map((tab: tableObjProps) => {
				if (tab.table_uid === tableId) {
					tab.alias = newName;
				}
				return tab;
			});
			setTempTables(newTable);
			setNewName("");
			setInputField(false);
		} else {
			setOpenAlert(true);
			setseverity("error");
			setTestMessage("Atleast one letter should be provided");
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// 	setTestMessage("");
			// }, 4000);
		}
	};

	return (
		<div>
			<Draggable
				ref={dragRef}
				handle={`#${tableData.tableName}`}
				bounds="#canvasTableArea"
				position={{
					x: tableData.tablePositionX ? tableData.tablePositionX : x,
					y: tableData.tablePositionY ? tableData.tablePositionY : y,
				}}
				onDrag={() => {
					updateXarrow();
					setX(dragRef.current.state.x);
					setY(dragRef.current.state.y);
				}}
				onStop={() => {
					const newTable: tableObjProps[] = [...tempTable].map((tab: tableObjProps) => {
						if (tab.table_uid === tableData.table_uid) {
							tableData.tablePositionX = x;
							tableData.tablePositionY = y;
						}
						return tab;
					});
					setTempTables(newTable);

					updateXarrow();
				}}
			>
				<div className="draggableBox" ref={dragRef}>
					<div
						className="draggableBoxTitle"
						id={tableData.tableName}
						title={`${tableData.tableName} (${tableData.schema})`}
						onDoubleClick={() => {
							setInputField(true);
							setNewName(tableData.alias);
							selectText();
						}}
					>
						{inputField ? (
							<div
								style={{
									display: "flex",
									padding: "0px 5px 0px 5px",
									width: "auto",
								}}
							>
								<TextField
									autoFocus={true}
									variant="standard"
									id="name"
									value={newName}
									onChange={e => {
										e.preventDefault();
										setNewName(e.target.value);
									}}
								/>
								<Button
									sx={{ fontSize: "12px" }}
									onClick={() => changeTableName(tableData.table_uid)}
								>
									ok
								</Button>
								<Button
									sx={{ fontSize: "12px" }}
									onClick={() => {
										setInputField(false);
										setNewName("");
									}}
								>
									cancel
								</Button>
							</div>
						) : (
							<>
								<div style={{ flex: 1 }}>{tableData.alias}</div>
								<div style={{ cursor: "pointer" }}>
									<MoreVertIcon
										style={{ float: "right" }}
										onClick={e => {
											setTableId(tableData.id);
											setOpen(true);
											setAnchorEl(e.currentTarget);
										}}
									/>
								</div>
							</>
						)}
					</div>

					{tableData.columns.map((item: ColumnsWithUid, index: number) => {
						return (
							<CanvasTableColumns
								key={item.uid}
								dragRef={dragRef}
								columnName={item.columnName}
								itemType={item.dataType}
								itemId={item.uid}
								tableName={tableData.tableName}
								table_uid={tableData.table_uid}
								index={index}
								schema={tableData.schema}
								checkRelationExists={checkRelationExists}
								table_Id={tableData.id}
							/>
						);
					})}
				</div>
			</Draggable>
			<NotificationDialog
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
				openAlert={openAlert}
				severity={severity}
				testMessage={testMessage}
			/>

			<RelationshipDefiningComponent
				showRelationCard={showRelationCard}
				setShowRelationCard={setShowRelationCard}
				arrowProp={arrowProp}
				addRelationship={addRelationship}
			/>
			<ActionPopover
				open={open}
				setOpen={setOpen}
				selectAction={selectAction}
				anchorEl={anchorEl}
				tableData={tableData}
			/>
		</div>
	);
};

const mapStateToProps = (state: DataSetStateProps, ownProps: any) => {
	return {
		tempTable: state.dataSetState.tempTable,
		arrows: state.dataSetState.arrows,
		relationships: state.dataSetState.relationships,
		tables: state.dataSetState.tables,
		views: state.dataSetState.views,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		addNewRelationship: (payload: RelationObjProps) => dispatch(addNewRelationship(payload)),
		addArrows: (payload: any) => dispatch(addArrows(payload)),
		actionsOnRemoveTable: (
			tempTable: tableObjProps[],
			tables: UserTableProps[],
			tableId: string
		) => dispatch(actionsOnRemoveTable(tempTable, tables, tableId)),
		setTempTables: (table: tableObjProps[]) => dispatch(setTempTables(table)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasTables);
