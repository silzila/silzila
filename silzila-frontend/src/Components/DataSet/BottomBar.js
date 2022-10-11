// This component is part of Dataset Create / edit page
// Present in the very bottom of the page
// Used for naming the dataset & saving it

import { Close } from "@mui/icons-material";
import { Button, Dialog, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ShortUniqueId from "short-unique-id";
import { resetState } from "../../redux/Dataset/datasetActions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import FetchData from "../../ServerCall/FetchData";

const BottomBar = ({
	//props
	editMode,

	// state
	tempTable,
	arrows,
	relationships,
	token,
	connection,
	dsId,
	friendly_name,

	// dispatch
	resetState,
}) => {
	const [fname, setFname] = useState(friendly_name);
	const [sendOrUpdate, setSendOrUpdate] = useState("Save");
	const [open, setOpen] = useState(false);

	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("");
	const [severity, setSeverity] = useState("success");

	const navigate = useNavigate();

	const tablesWithoutRelation = [];

	useEffect(() => {
		if (editMode) {
			setSendOrUpdate("Update");
		}
	}, []);

	// Check if every table has atleast one relationship before submitting the dataset
	const checkTableRelationShip = async (tablesSelectedInSidebar, tablesWithRelation) => {
		if (tablesSelectedInSidebar.length > 1) {
			tablesSelectedInSidebar.map((el) => {
				if (tablesWithRelation.includes(el.table)) {
					// console.log("----");
				} else {
					tablesWithoutRelation.push(el.table);
				}
			});
		}

		// If there is a table without relation, show a warning
		if (tablesWithoutRelation.length !== 0) {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(
				"Error: Every table should have atleast one relationship.\n" +
					"tables with no Relationship\n" +
					tablesWithoutRelation.map((el) => "\n" + el)
			);
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 4000);
		}

		// case where there is only one table and no relations or
		// if all the tables have relations defined,
		// prepare data to be saved in server and submit
		var relationshipServerObj = [];
		if (
			tablesWithoutRelation.length === 0 ||
			(tablesSelectedInSidebar.length === 1 && relationships.length === 0)
		) {
			relationships.forEach((relation) => {
				var relationObj = {
					table1: relation.startId,
					table2: relation.endId,
					cardinality: relation.cardinality,
					ref_integrity: relation.integrity,
					table1_columns: [],
					table2_columns: [],
				};

				var arrowsForRelation = [];
				arrowsForRelation = arrows.filter((arr) => arr.relationId === relation.relationId);
				//console.log(arrowsForRelation);
				var tbl1 = [];
				var tbl2 = [];
				arrowsForRelation.forEach((arr) => {
					tbl1.push(arr.startColumnName);
					tbl2.push(arr.endColumnName);
				});

				//console.log(tbl1, tbl2);
				relationObj.table1_columns = tbl1;
				relationObj.table2_columns = tbl2;

				//console.log(relationObj);
				relationshipServerObj.push(relationObj);
			});

			//console.log(relationshipServerObj);

			var meth;
			var apiurl;
			if (editMode) {
				meth = "PUT";
				apiurl = "dataset/" + dsId;
			} else {
				meth = "POST";
				apiurl = "dataset";
			}

			var options = await FetchData({
				requestType: "withData",
				method: meth,
				url: apiurl,
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				data: {
					connectionId: connection,
					datasetName: fname,
					isFlatFileData : false,
					dataSchema: {
						tables: [...tablesSelectedInSidebar],
						relationships: relationshipServerObj,
					},
				},
			});
			if (options.status) {
				// console.log(options.data);
				setSeverity("success");
				setOpenAlert(true);
				setTestMessage("Saved Successfully!");
				setTimeout(() => {
					setOpenAlert(false);
					setTestMessage("");
					navigate("/datahome");
				}, 2000);
			} else {
				//console.log(options.data.detail);
				setSeverity("error");
				setOpenAlert(true);
				setTestMessage(options.data.detail);
				setTimeout(() => {
					setOpenAlert(false);
					setTestMessage("");
				}, 4000);
			}
		}

		// Potential repeat of code in above section
		// if (tablesSelectedInSidebar.length > 1 && relationships.length === 0) {
		// 	setSeverity("error");
		// 	setOpenAlert(true);
		// 	setTestMessage(
		// 		"Error: Every table should have atleast one relationship.\n" +
		// 			"tables with no Relationship\t" +
		// 			tablesWithoutRelation.map((el) => el)
		// 	);
		// 	setTimeout(() => {
		// 		setOpenAlert(false);
		// 		setTestMessage("");
		// 	}, 4000);
		// }
	};

	// After send/update button is clicked
	const onSendData = () => {
		// If dataset name is provided,
		// prepare the tables with relations list and
		// check if table relationships and arrows meet requirements
		if (fname !== "") {
			const tablesSelectedInSidebar = tempTable.map((el) => {
				return {
					table: el.tableName,
					schema: el.schema,
					id: el.id,
					alias: el.alias,
					tablePositionX: el.table_position.x,
					tablePositionY: el.table_position.y,
				};
			});
			//console.log(tablesSelectedInSidebar);
			const listOfStartTableNames = [];
			const listOfEndTableNames = [];
			arrows.forEach((el) => {
				listOfStartTableNames.push(el.startTableName);
				listOfEndTableNames.push(el.endTableName);
			});
			const tablesWithRelation = [...listOfStartTableNames, ...listOfEndTableNames];

			//console.log(tablesSelectedInSidebar, tablesWithRelation);
			checkTableRelationShip(tablesSelectedInSidebar, tablesWithRelation);
		} else {
			// If dataSet name is not provided, show error
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Please Enter A Dataset Name");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 4000);
		}
	};

	const onCancelOnDataset = () => {
		setOpen(true);
	};

	return (
		<div className="bottomBar">
			<Button variant="contained" onClick={onCancelOnDataset} id="cancelButton">
				{editMode ? "Back" : "Cancel"}
			</Button>

			<div>
				<TextField
					size="small"
					label="Dataset Name"
					value={fname}
					onChange={(e) => setFname(e.target.value)}
					variant="outlined"
					sx={{ marginRight: "3rem", backgroundColor: "white" }}
				/>

				<Button variant="contained" onClick={onSendData} id="setButton">
					{sendOrUpdate}
				</Button>
			</div>

			<NotificationDialog
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
				severity={severity}
				testMessage={testMessage}
				openAlert={openAlert}
			/>

			<Dialog open={open}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						padding: "5px",
						width: "350px",
						height: "auto",
						justifyContent: "center",
					}}
				>
					<div style={{ fontWeight: "bold", textAlign: "center" }}>
						{editMode ? "CANCEL DATASET EDIT" : "CANCEL DATASET CREATION"}
						<Close style={{ float: "right" }} onClick={() => setOpen(false)} />
						<br />
						<br />
						<p style={{ fontWeight: "normal" }}>
							{editMode
								? "Any unsaved changes will be discarded, do you want to exit anyway?"
								: "Cancel will reset this dataset creation. Do you want to discard the progress?"}
						</p>
					</div>
					<div
						style={{ padding: "15px", justifyContent: "space-around", display: "flex" }}
					>
						<Button
							style={{ backgroundColor: "red" }}
							variant="contained"
							onClick={() => {
								resetState();
								setOpen(false);
								if (editMode) {
									navigate("/dataHome");
								}
							}}
						>
							Ok
						</Button>
					</div>
				</div>
			</Dialog>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		token: state.isLogged.accessToken,
		// schema: state.dataSetState.schema,
		tempTable: state.dataSetState.tempTable,
		arrows: state.dataSetState.arrows,
		relationships: state.dataSetState.relationships,
		connection: state.dataSetState.connection,
		friendly_name: state.dataSetState.friendly_name,
		dsId: state.dataSetState.dsId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		resetState: () => dispatch(resetState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
