// This component returns Individual table along with column names to be displayed in Canvas
// Tables can be given a friendly name by the user
// These tables are draggable

import React, { useRef, useState } from "react";
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
} from "../../redux/Dataset/datasetActions";
import ShortUniqueId from "short-unique-id";
import ActionPopover from "./ActionPopover";
import { Button, TextField } from "@mui/material";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";

const CanvasTables = ({
	// props
	tableData,

	// state
	dataSetState,

	// dispatch
	addNewRelationship,
	addArrows,
	actionsOnRemoveTable,
	setTempTables,
}) => {
	const dragRef = useRef();
	const updateXarrow = useXarrow();

	const [showRelationCard, setShowRelationCard] = useState(false);
	const [arrowProp, setArrowProp] = useState([]);
	const [open, setOpen] = useState(false);
	const [tableId, setTableId] = useState("");
	const [anchorEl, setAnchorEl] = useState("");
	const [inputField, setInputField] = useState(false);
	const [newName, setNewName] = useState("");

	const [openAlert, setOpenAlert] = useState(false);
	const [severity, setseverity] = useState("success");
	const [testMessage, setTestMessage] = useState("");

	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	var uid = new ShortUniqueId({ length: 8 });

	// when a new arrow is created,check if there is alerady a relation between the two tables of this new arrow
	// If yes, add arrow & link existing relationId
	// If no,
	// 		- open relation popover and get info.
	// 		- Create new relation id
	// 		- Save new arrow and new relation

	const checkRelationExists = (newArrowObj) => {
		// if there are no arrows yet between these two tables, add arrow and show popup to define relationship
		if (dataSetState.arrows.length === 0) {
			newArrowObj.relationId = uid();
			setArrowProp(newArrowObj);
			setShowRelationCard(true);
		} else {
			var sameRel = false;
			var sameRelInv = false;

			var sameRelObj = {};
			var sameRelInvObj = {};

			dataSetState.relationships.forEach((rel, i) => {
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

			//console.log(sameRel);
			//console.log(sameRelInv);
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

	const addRelationship = (relObj) => {
		addNewRelationship(relObj);
	};

	// Remove or rename tables in canvas
	const selectAction = (e) => {
		if (open === true) {
			// Remove table from canvas
			if (parseInt(e.target.id) === 1) {
				// get ID of table listed in canvas
				const tempTables = [...dataSetState.tempTable].filter((tab) => {
					return tab.id !== tableId;
				});

				// remove checked state of the table from Sidebar
				const tables = [...dataSetState.tables].map((tab) => {
					if (tab.id === tableId) {
						tab.isSelected = false;
					}
					return tab;
				});

				// Remove this table's info from Relationship information
				var is_in_relationship = dataSetState.relationships.filter(
					(obj) => obj.startId === tableId || obj.endId === tableId
				)[0];
				if (is_in_relationship) {
					var yes = window.confirm("are you sure you want to remove this table?");
					if (yes) {
						actionsOnRemoveTable(tempTables, tables, tableId);
					}
				} else {
					actionsOnRemoveTable(tempTables, tables, tableId);
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
		var input = document.getElementById("name");
		input.select();
	};

	// When changing name of a table, make sure that it is not empty
	const changeTableName = (tableId) => {
		var spaceCount = newName.split(" ").length - 1;
		if (newName.length > 0 && newName.length !== spaceCount) {
			const newTable = [...dataSetState.tempTable].map((tab) => {
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
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 4000);
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
					console.log(dataSetState.tempTable);
					const newTable = [...dataSetState.tempTable].map((tab) => {
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
									onChange={(e) => {
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
										onClick={(e) => {
											setTableId(tableData.id);
											setOpen(true);
											setAnchorEl(e.currentTarget);
										}}
									/>
								</div>
							</>
						)}
					</div>

					{tableData.columns.map((item, index) => {
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

const mapStateToProps = (state) => {
	return {
		dataSetState: state.dataSetState,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addNewRelationship: (payload) => dispatch(addNewRelationship(payload)),
		addArrows: (payload) => dispatch(addArrows(payload)),
		actionsOnRemoveTable: (tempTables, tables, tableId) =>
			dispatch(actionsOnRemoveTable({ tempTables, tables, tableId })),
		setTempTables: (pl) => dispatch(setTempTables(pl)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasTables);
