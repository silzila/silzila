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
} from "../../redux/Dataset/datasetActions";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import {
	FindCardinality,
	FindIntegrity,
	FindRowMatchId,
	FindRowUniqueId,
} from "../CommonFunctions/FindIntegrityAndCordinality";
import data from "./Data.json";
import "./RelationshipDefining.css";

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
}) => {
	var textStyle = {
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

	const [rowUniqueId1, setRowUniqueId1] = useState("");
	const [rowMatchId1, setRowMatchId1] = useState(0);
	const [rowUniqueId2, setRowUniqueId2] = useState("");
	const [rowMatchId2, setRowMatchId2] = useState(0);

	const [openAlert, setOpenAlert] = useState(false);
	const [severity, setSeverity] = useState("success");
	const [testMessage, setTestMessage] = useState("");

	useEffect(() => {
		if (existingArrow) {
			let uniqueId = FindRowUniqueId(existingArrowProp.cardinality);
			let MatchId = FindRowMatchId(existingArrowProp.integrity);
			//console.log(uniqueId, MatchId);
			setRowUniqueId1(uniqueId.rowUniqueId1);
			setRowUniqueId2(uniqueId.rowUniqueId2);
			setRowMatchId1(MatchId.rowMatchId1);
			setRowMatchId2(MatchId.rowMatchId2);
		}
	}, [existingArrow]);

	// ====================cardinality======================

	const Cardinality = () => {
		if (rowUniqueId1 !== "" && rowUniqueId2 !== "") {
			if (parseInt(rowUniqueId1) === 1 && parseInt(rowUniqueId2) === 1) {
				return <span style={textStyle}>One to One</span>;
			} else if (parseInt(rowUniqueId1) === 1 && parseInt(rowUniqueId2) === 2) {
				return <span style={textStyle}>One to Many</span>;
			} else if (parseInt(rowUniqueId1) === 2 && parseInt(rowUniqueId2) === 1) {
				return <span style={textStyle}>Many to One</span>;
			} else if (parseInt(rowUniqueId1) === 2 && parseInt(rowUniqueId2) === 2) {
				return <span style={textStyle}>Many to Many</span>;
			}
		} else {
			return <span style={textStyle}></span>;
		}
	};

	// ===========================================
	// integrity
	// ===========================================
	const Integrity = () => {
		if (parseInt(rowMatchId1) !== 0 && parseInt(rowMatchId2) !== 0) {
			if (parseInt(rowMatchId1) === 1 && parseInt(rowMatchId2) === 1) {
				return <JoinFull sx={iconStyle} />;
			}
			if (parseInt(rowMatchId1) === 1 && parseInt(rowMatchId2) === 2) {
				return <JoinLeft sx={iconStyle} />;
			}
			if (parseInt(rowMatchId1) === 2 && parseInt(rowMatchId2) === 1) {
				return <JoinRight sx={iconStyle} />;
			}
			if (parseInt(rowMatchId1) === 2 && parseInt(rowMatchId2) === 2) {
				return <JoinInner sx={iconStyle} />;
			}
		} else return <span style={textStyle}></span>;
	};

	// ====================================== other fnc================

	const onClose = () => {
		setShowRelationCard(false);

		setRowUniqueId1("");
		setRowMatchId1(0);
		setRowUniqueId2("");
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
			const newRelObj = {
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
			//console.log(newArrowObj);
			addArrows(newArrowObj);
			addRelationship(newRelObj);
			onClose();
		} else {
			setSeverity("error");
			setTestMessage("please select a value in all the fields");
			setOpenAlert(true);
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
				setSeverity("");
			}, 3000);
		}
	};

	const onDelete = () => {
		//console.log("Deleting Relation", existingArrowProp.relationId);
		removeRelationship(existingArrowProp.relationId);
		removeArrows(existingArrowProp.relationId);

		onClose();
	};

	const onUpdate = () => {
		//console.log("update the relations now");
		//console.log(existingArrowProp.relationId);

		const newRelObj = {
			...existingArrowProp,
			relationId: existingArrowProp.relationId,
			isSelected: false,
			integrity: FindIntegrity(rowMatchId1, rowMatchId2),
			cardinality: FindCardinality(rowUniqueId1, rowUniqueId2),
			showHead: FindShowHead(),
			showTail: FindShowTail(),
		};
		//console.log(newRelObj);

		updateRelationship(existingArrowProp.relationId, newRelObj);
		onClose();
	};

	const deleteSingleArrow = (arrow) => {
		//console.log("Deleting arrow from Rel Popover", arrow.start, arrow.end);
		removeIndiArrow(arrow.start, arrow.end);
	};

	var menuStyle = { padding: "0.25rem", fontSize: "12px" };

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

	const RenderArrows = () => {
		var arrowsSubset = [];
		if (existingArrowProp) {
			arrowsSubset = arrows.filter((arr) => arr.relationId === existingArrowProp.relationId);
		}

		if (arrowsSubset.length > 0) {
			return (
				<div className="relationSelectSection">
					<div className="relationPopoverSideHeading">Arrows</div>
					<div className="relationArrowList">
						{arrowsSubset.map((arrow, index) => {
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
									onChange={(e) => {
										setRowUniqueId1(e.target.value);
									}}
								>
									{data.rowUniqueness.map((el) => {
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
									onChange={(e) => {
										setRowUniqueId2(e.target.value);
									}}
								>
									{data.rowUniqueness.map((el) => {
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
									onChange={(e) => {
										setRowMatchId1(e.target.value);
									}}
								>
									{data.rowMatch.map((el) => {
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
									onChange={(e) => {
										setRowMatchId2(e.target.value);
									}}
								>
									{data.rowMatch.map((el) => {
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

const mapStateToProps = (state) => {
	return {
		arrows: state.dataSetState.arrows,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addArrows: (payload) => dispatch(addArrows(payload)),
		removeRelationship: (pl) => dispatch(removeRelationshipFromCanvas(pl)),
		removeArrows: (pl) => dispatch(removeArrowsFromcanvas(pl)),
		removeIndiArrow: (start, end) => dispatch(removeIndiArrowFromRelPopover(start, end)),
		updateRelationship: (relationId, relation) =>
			dispatch(updateRelationship(relationId, relation)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RelationshipDefiningComponent);
