// This component is part of Dataset Create / edit page
// Present in the very bottom of the page
// Used for naming the dataset & saving it

import { Close } from "@mui/icons-material";
import { Button, Dialog, MenuItem, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { resetState, setDatabaseNametoState } from "../../redux/DataSet/datasetActions";
import { useNavigate } from "react-router-dom";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import FetchData from "../ServerCall/FetchData";
import { Dispatch } from "redux";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import {
	ArrowsProps,
	DataSetStateProps,
	RelationshipsProps,
	tableObjProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import {
	BottomBarProps,
	relationshipServerObjProps,
	tablesSelectedInSidebarProps,
} from "./BottomBarInterfaces";
import { SaveButtons } from "../DataConnection/ConfirmFlatFileData";
import { TextFieldBorderStyle } from "../DataConnection/EditFlatFileData";
import { AlertColor } from "@mui/material/Alert";

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
	datasetName,
	database,
	isFlatFile,

	// dispatch
	resetState,
}: BottomBarProps) => {
	const [fname, setFname] = useState<string>(datasetName);
	const [sendOrUpdate, setSendOrUpdate] = useState<string>("Save");
	const [open, setOpen] = useState<boolean>(false);

	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("");
	const [severity, setSeverity] = useState<AlertColor>("success");
	const [selectedButton, setselectedButton] = useState<string>(editMode ? "Update" : "Save");

	const navigate = useNavigate();

	const tablesWithoutRelation: string[] = [];

	useEffect(() => {
		if (editMode) {
			setSendOrUpdate("Update");
		}
	}, []);

	// Check if every table has atleast one relationship before submitting the dataset
	const checkTableRelationShip = async (
		tablesSelectedInSidebar: tablesSelectedInSidebarProps[],
		tablesWithRelation: string[]
	) => {
		if (tablesSelectedInSidebar.length > 1) {
			tablesSelectedInSidebar.map((el: tablesSelectedInSidebarProps) => {
				if (tablesWithRelation.includes(el.table)) {
					// //console.log("----");
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
					tablesWithoutRelation.map((el: string) => "\n" + el)
			);
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 4000);
		}

		// case where there is only one table and no relations or
		// if all the tables have relations defined,
		// prepare data to be saved in server and submit
		var relationshipServerObj: relationshipServerObjProps[] = [];
		if (
			tablesWithoutRelation.length === 0 ||
			(tablesSelectedInSidebar.length === 1 && relationships.length === 0)
		) {
			relationships.forEach((relation: RelationshipsProps) => {
				var relationObj: relationshipServerObjProps = {
					table1: relation.startId,
					table2: relation.endId,
					cardinality: relation.cardinality,
					refIntegrity: relation.integrity,
					table1Columns: [],
					table2Columns: [],
				};

				var arrowsForRelation: ArrowsProps[] = [];
				arrowsForRelation = arrows.filter(
					(arr: ArrowsProps) => arr.relationId === relation.relationId
				);
				////console.log(arrowsForRelation);
				var tbl1: string[] = [];
				var tbl2: string[] = [];
				arrowsForRelation.forEach((arr: ArrowsProps) => {
					tbl1.push(arr.startColumnName);
					tbl2.push(arr.endColumnName);
				});

				////console.log(tbl1, tbl2);
				relationObj.table1Columns = tbl1;
				relationObj.table2Columns = tbl2;

				////console.log(relationObj);
				relationshipServerObj.push(relationObj);
			});

			////console.log(relationshipServerObj);

			//console.log(tablesSelectedInSidebar);

			var apiurl: string;

			if (editMode) {
				apiurl = "dataset/" + dsId;
			} else {
				apiurl = "dataset";
			}

			// TODO: need to specify type
			var options: any = await FetchData({
				requestType: "withData",
				method: editMode ? "PUT" : "POST",
				url: apiurl,
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				data: {
					connectionId: isFlatFile ? null : connection,
					datasetName: fname,
					isFlatFileData: isFlatFile,
					dataSchema: {
						tables: [...tablesSelectedInSidebar],
						relationships: [...relationshipServerObj],
					},
				},
			});
			if (options.status) {
				// //console.log(options.data);
				setSeverity("success");
				setOpenAlert(true);
				setTestMessage("Saved Successfully!");
				setTimeout(() => {
					setOpenAlert(false);
					setTestMessage("");
					navigate("/datahome");
				}, 2000);
			} else {
				////console.log(options.data.detail);
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
			//console.log(database);
			const tablesSelectedInSidebar: any[] =
				// tablesSelectedInSidebarProps[]
				tempTable.map((el: tableObjProps) => {
					return {
						table: el.tableName,
						schema: el.schema,
						id: el.id,
						alias: el.alias,
						tablePositionX: el.tablePositionX,
						tablePositionY: el.tablePositionY,
						database: el.databaseName,
						flatFileId: isFlatFile ? el.table_uid : null,
					};
				});
			////console.log(tablesSelectedInSidebar);
			const listOfStartTableNames: string[] = [];
			const listOfEndTableNames: string[] = [];
			arrows.forEach((el: ArrowsProps) => {
				listOfStartTableNames.push(el.startTableName);
				listOfEndTableNames.push(el.endTableName);
			});
			const tablesWithRelation: string[] = [...listOfStartTableNames, ...listOfEndTableNames];

			////console.log(tablesSelectedInSidebar, tablesWithRelation);
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
	const classes = SaveButtons();

	return (
		<div className="bottomBar">
			{/* <Button variant="contained" onClick={onCancelOnDataset} id="cancelButton">
				{editMode ? "Back" : "Cancel"}
			</Button> */}

			<div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
				<Tooltip title="Click to Edit">
					<TextField
						sx={{
							flex: 1,
							margin: "auto 20px",
							maxWidth: "200px",
						}}
						InputProps={TextFieldBorderStyle}
						inputProps={{
							style: {
								height: "35px",

								padding: "0px 10px",
								fontSize: "14px",
								color: "#3B3C36",
							},
						}}
						InputLabelProps={{
							sx: {
								fontSize: "12px",
							},
						}}
						onChange={e => {
							e.preventDefault();
							setFname(e.target.value);
						}}
						value={fname}
						label="Dataset Name"
					/>
				</Tooltip>

				<TextField
					sx={{
						flex: 1,
						maxWidth: "150px",
					}}
					SelectProps={{
						MenuProps: {
							anchorOrigin: {
								vertical: "top",
								horizontal: "left",
							},
						},
					}}
					className={classes.root}
					value={"Save"}
					variant="outlined"
					select
				>
					<MenuItem value={"Save"} onClick={onSendData}>
						Save
					</MenuItem>

					<MenuItem
						value={editMode ? "Back" : "Cancel"}
						onClick={(e: any) => {
							setselectedButton(e.target.value);
							onCancelOnDataset();
						}}
					>
						{editMode ? "Back" : "Cancel"}
					</MenuItem>
				</TextField>

				{/* <Button variant="contained" onClick={onSendData} id="setButton">
					{sendOrUpdate}
				</Button> */}
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

const mapStateToProps = (state: isLoggedProps & DataSetStateProps) => {
	return {
		token: state.isLogged.accessToken,
		tempTable: state.dataSetState.tempTable,
		arrows: state.dataSetState.arrows,
		relationships: state.dataSetState.relationships,
		connection: state.dataSetState.connection,
		datasetName: state.dataSetState.datasetName,
		dsId: state.dataSetState.dsId,
		database: state.dataSetState.databaseName,
		isFlatFile: state.dataSetState.isFlatFile,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		resetState: () => dispatch(resetState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
