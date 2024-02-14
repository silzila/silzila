// This is a popover displayed either during creating or editing an arrow (relationship) between two table columns
// Allows user to define the cardinality and referential integrity between tables
// eg: One to many relation, keep all / matching rows between tables

import {
	CloseOutlined,
	Delete,
	JoinFull,
	JoinInner,
	JoinLeft,
	JoinRight,
} from "@mui/icons-material";
import { Button, MenuItem, Popover, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
	addArrows,
	removeArrowsFromcanvas,
	removeIndiArrowFromRelPopover,
	removeRelationshipFromCanvas,
	updateRelationship,
} from "../../redux/DataSet/datasetActions";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import {
	FindCardinality,
	FindIntegrity,
	FindRowMatchId,
	FindRowUniqueId,
} from "../CommonFunctions/FindIntegrityAndCordinality";
import data from "./Data.json";
import "./RelationshipDefining.css";
import CSS from "csstype";
import { Dispatch } from "redux";
import { ArrowsProps, DataSetStateProps } from "../../redux/DataSet/DatasetStateInterfaces";
import {
	RelationshipDefiningComponentProps,
	rowMat,
	rowUniq,
} from "./RelationshipDefiningComponentInterfaces";
import { AlertColor } from "@mui/material/Alert";

const RelationshipDefiningComponent = ({
	// props
	showRelationCard,
	setShowRelationCard,
	arrowProp,

	existingArrow,
	setExistingArrow,
	existingArrowProp,
	setExistingArrowProp,
	addRelationship,
	// state
	arrows,

	// dispatch
	addArrows,
	removeRelationship,
	removeArrows,
	removeIndiArrow,
	updateRelationship,
}: RelationshipDefiningComponentProps) => {
	var textStyle: CSS.Properties = {
		whiteSpace: "nowrap",
		padding: "0 0.5rem",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "12px",
		fontWeight: "bold",
		minWidth: "6.5rem",
	};

	var iconStyle = {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		minWidth: "6.5rem",
		margin: "auto",
	};

	const [rowUniqueId1, setRowUniqueId1] = useState<number>(0);
	const [rowMatchId1, setRowMatchId1] = useState<number>(0);
	const [rowUniqueId2, setRowUniqueId2] = useState<number>(0);
	const [rowMatchId2, setRowMatchId2] = useState<number>(0);

	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [severity, setSeverity] = useState<AlertColor>("success");
	const [testMessage, setTestMessage] = useState<string>("");

	useEffect(() => {
		if (existingArrow) {
			let uniqueId: any = FindRowUniqueId(existingArrowProp.cardinality);
			let MatchId: any = FindRowMatchId(existingArrowProp.integrity);
			setRowUniqueId1(uniqueId.rowUniqueId1);
			setRowUniqueId2(uniqueId.rowUniqueId2);
			setRowMatchId1(MatchId.rowMatchId1);
			setRowMatchId2(MatchId.rowMatchId2);
		}
	}, [existingArrow]);

	// ====================cardinality======================

	const Cardinality: any = () => {
		if (rowUniqueId1 !== 0 && rowUniqueId2 !== 0) {
			if (rowUniqueId1 === 1 && rowUniqueId2 === 1) {
				return <span style={textStyle}>One to One</span>;
			} else if (rowUniqueId1 === 1 && rowUniqueId2 === 2) {
				return <span style={textStyle}>One to Many</span>;
			} else if (rowUniqueId1 === 2 && rowUniqueId2 === 1) {
				return <span style={textStyle}>Many to One</span>;
			} else if (rowUniqueId1 === 2 && rowUniqueId2 === 2) {
				return <span style={textStyle}>Many to Many</span>;
			}
		} else {
			return <span style={textStyle}></span>;
		}
	};

	// ===========================================
	// integrity
	// ===========================================
	const Integrity: any = () => {
		if (rowMatchId1 !== 0 && rowMatchId2 !== 0) {
			if (rowMatchId1 === 1 && rowMatchId2 === 1) {
				return <JoinFull sx={iconStyle} />;
			}
			if (rowMatchId1 === 1 && rowMatchId2 === 2) {
				return <JoinLeft sx={iconStyle} />;
			}
			if (rowMatchId1 === 2 && rowMatchId2 === 1) {
				return <JoinRight sx={iconStyle} />;
			}
			if (rowMatchId1 === 2 && rowMatchId2 === 2) {
				return <JoinInner sx={iconStyle} />;
			}
		} else return <span style={textStyle}></span>;
	};

	// ====================================== other fnc================

	const onClose = () => {
		setShowRelationCard(false);

		setRowUniqueId1(0);
		setRowMatchId1(0);
		setRowUniqueId2(0);
		setRowMatchId2(0);
		if (existingArrow) {
			setExistingArrow(false);
			setExistingArrowProp({});
		}
	};

	const FindShowHead = () => {
		if (rowUniqueId2 === 1) {
			return false;
		}
		if (rowUniqueId2 === 2) {
			return true;
		}
	};

	const FindShowTail = () => {
		if (rowUniqueId1 === 1) {
			return false;
		}
		if (rowUniqueId1 === 2) {
			return true;
		}
	};

	const onSet = () => {
		if (rowMatchId1 && rowMatchId2 && rowUniqueId1 && rowUniqueId2) {
			const newArrowObj = {
				...arrowProp,
				isSelected: false,
				integrity: FindIntegrity(rowMatchId1, rowMatchId2),
				cardinality: FindCardinality(rowUniqueId1, rowUniqueId2),
				showHead: FindShowHead(),
				showTail: FindShowTail(),
			};
			const newRelObj: any = {
				integrity: FindIntegrity(rowMatchId1, rowMatchId2),
				cardinality: FindCardinality(rowUniqueId1, rowUniqueId2),
				startId: newArrowObj.startId,
				endId: newArrowObj.endId,
				relationId: newArrowObj.relationId,
				startTableName: newArrowObj.startTableName,
				endTableName: newArrowObj.endTableName,
				showHead: FindShowHead(),
				showTail: FindShowTail(),
			};
			addArrows(newArrowObj);
			addRelationship?.(newRelObj);
			onClose();
		} else {
			setSeverity("error");
			setTestMessage("please select a value in all the fields");
			setOpenAlert(true);
			// setTimeout(() => {
			// 	setOpenAlert(false);
			// 	setTestMessage("");
			// 	setSeverity("success");
			// }, 3000);
		}
	};

	const onDelete = () => {
		removeRelationship(existingArrowProp.relationId);
		removeArrows(existingArrowProp.relationId);

		onClose();
	};

	const onUpdate = () => {

		const newRelObj = {
			...existingArrowProp,
			relationId: existingArrowProp.relationId,
			isSelected: false,
			integrity: FindIntegrity(rowMatchId1, rowMatchId2),
			cardinality: FindCardinality(rowUniqueId1, rowUniqueId2),
			showHead: FindShowHead(),
			showTail: FindShowTail(),
		};

		updateRelationship(existingArrowProp.relationId, newRelObj);
		onClose();
	};

	const deleteSingleArrow = (arrow: ArrowsProps) => {
		removeIndiArrow(arrow.start, arrow.end);
	};

	var menuStyle: CSS.Properties = { padding: "0.25rem", fontSize: "12px" };

	const TableNames = () => {
		if (arrowProp) {
			return (
				<React.Fragment>
					<span className="relationPopoverTableHeading">{arrowProp.startTableName}</span>
					<span className="relationPopoverTableHeading">{arrowProp.endTableName}</span>
				</React.Fragment>
			);
		} else if (existingArrowProp) {
			return (
				<React.Fragment>
					<span className="relationPopoverTableHeading">
						{existingArrowProp.startTableName}
					</span>
					<span className="relationPopoverTableHeading">
						{existingArrowProp.endTableName}
					</span>
				</React.Fragment>
			);
		} else return null;
	};

	const RenderArrows: any = () => {
		var arrowsSubset = [];
		if (existingArrowProp) {
			arrowsSubset = arrows.filter(
				(arr: ArrowsProps) => arr.relationId === existingArrowProp.relationId
			);
		}

		if (arrowsSubset.length > 0) {
			return (
				<div className="relationSelectSection">
					<div className="relationPopoverSideHeading">Arrows</div>
					<div className="relationArrowList">
						{arrowsSubset.map((arrow: ArrowsProps, index: number) => {
							return (
								<div className="relationArrow" key={index}>
									<div className="relationArrowTableName">
										{arrow.startColumnName}
									</div>
									<div className="relationArrowTableName">
										{arrow.endColumnName}
									</div>
									{arrowsSubset.length > 1 ? (
										<Delete
											sx={{ padding: "4px" }}
											onClick={() => deleteSingleArrow(arrow)}
										/>
									) : null}
								</div>
							);
						})}
					</div>
				</div>
			);
		} else return null;
	};

	return (
		<React.Fragment>
			<Popover
				open={showRelationCard}
				anchorReference="anchorEl"
				anchorOrigin={{
					vertical: "center",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "center",
					horizontal: "center",
				}}
				sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
			>
				<div className="relationPopover">
					<div className="relationPopoverHeader">
						<span className="relationPopoverHeading">Table Relationship</span>
						<CloseOutlined
							onClick={onClose}
							sx={{
								cursor: "pointer",
								borderRadius: "4px",
								"&:hover": { backgroundColor: "rgba(0,0,0,0.2)", color: "red" },
							}}
						/>
					</div>
					<div className="relationPopoverBody">
						<div className="relationTablesHeading">
							<TableNames />
						</div>
						<div className="relationSelectSection">
							<div className="relationPopoverSideHeading">
								Select Uniqueness (Cardinality)
							</div>
							<div style={{ display: "flex", padding: "0.5rem 1rem 0" }}>
								<Select
									value={rowUniqueId1}
									fullWidth
									size="small"
									sx={{ minWidth: "190px", fontSize: "12px" }}
									// TODO need to specify type
									onChange={(e: any) => {
										setRowUniqueId1(e.target.value);
									}}
								>
									{data.rowUniqueness.map((el: rowUniq) => {
										return (
											<MenuItem style={menuStyle} key={el.id} value={el.id}>
												{el.name}
											</MenuItem>
										);
									})}
								</Select>
								<Cardinality />
								<Select
									value={rowUniqueId2}
									fullWidth
									size="small"
									sx={{ minWidth: "190px", fontSize: "12px" }}
									onChange={(e: any) => {
										setRowUniqueId2(e.target.value);
									}}
								>
									{data.rowUniqueness.map((el: rowUniq) => {
										return (
											<MenuItem style={menuStyle} key={el.id} value={el.id}>
												{el.name}
											</MenuItem>
										);
									})}
								</Select>
							</div>
						</div>
						<div className="relationSelectSection">
							<div className="relationPopoverSideHeading">
								Select Row Match (Referential Integrity)
							</div>
							<div style={{ display: "flex", padding: "0.5rem 1rem 0" }}>
								<Select
									value={rowMatchId1}
									fullWidth
									size="small"
									sx={{ minWidth: "190px", fontSize: "12px" }}
									onChange={(e: any) => {
										setRowMatchId1(e.target.value);
									}}
								>
									{data.rowMatch.map((el: rowMat) => {
										return (
											<MenuItem style={menuStyle} key={el.id} value={el.id}>
												{el.name}
											</MenuItem>
										);
									})}
								</Select>
								<Integrity />
								<Select
									value={rowMatchId2}
									fullWidth
									size="small"
									sx={{ minWidth: "190px", fontSize: "12px" }}
									onChange={(e: any) => {
										setRowMatchId2(e.target.value);
									}}
								>
									{data.rowMatch.map((el: rowMat) => {
										return (
											<MenuItem style={menuStyle} key={el.id} value={el.id}>
												{el.name}
											</MenuItem>
										);
									})}
								</Select>
							</div>
						</div>
						<RenderArrows />

						<div
							style={{
								display: "flex",
								justifyContent: "center",
								paddingBottom: "1rem",
								marginTop: "2rem",
							}}
						>
							{existingArrowProp ? (
								<Button onClick={onDelete} id="deleteButton">
									Delete
								</Button>
							) : (
								<Button onClick={onClose} id="cancelButton">
									cancel
								</Button>
							)}

							<Button onClick={existingArrowProp ? onUpdate : onSet} id="setButton">
								{existingArrowProp ? "Ok" : "Set"}
							</Button>
						</div>
					</div>
				</div>
			</Popover>
			<NotificationDialog
				openAlert={openAlert}
				severity={severity}
				testMessage={testMessage}
			/>
		</React.Fragment>
	);
};

const mapStateToProps = (state: DataSetStateProps) => {
	return {
		arrows: state.dataSetState.arrows,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		addArrows: (payload: any) => dispatch(addArrows(payload)),
		removeRelationship: (pl: any) => dispatch(removeRelationshipFromCanvas(pl)),
		removeArrows: (pl: any) => dispatch(removeArrowsFromcanvas(pl)),
		removeIndiArrow: (start: any, end: any) =>
			dispatch(removeIndiArrowFromRelPopover(start, end)),
		updateRelationship: (relationId: any, relation: any) =>
			dispatch(updateRelationship(relationId, relation)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RelationshipDefiningComponent);
