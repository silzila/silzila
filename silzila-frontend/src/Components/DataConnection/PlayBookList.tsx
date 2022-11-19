// List of Playbooks created by the user is displayed here.
// Users can delete any playbook
// Creating new and editing existing playbook are handled in other child components

import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import update from "immutability-helper";

import { Dispatch } from "redux";
import { updateChartData } from "../../redux/ChartPoperties/ChartControlsActions";
import { setSelectedDsInTile } from "../../redux/ChartPoperties/ChartPropertiesActions";
import { storePlayBookCopy, updatePlaybookUid } from "../../redux/PlayBook/PlayBookActions";
import { loadPlaybook } from "../../redux/TabTile/actionsTabTile";
import {
	setSelectedDataSetList,
	setTablesForSelectedDataSets,
} from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import DatasetListPopover from "../CommonFunctions/PopOverComponents/DatasetListPopover";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import { getColumnTypes, getTableData } from "../DataViewer/DataViewerBottom";
import FetchData from "../ServerCall/FetchData";
import { PbSelectedDataset, PlayBookProps } from "./PlayBookInterfaces";

const PlayBookList = ({
	// state
	token,
	// dispatch
	setSelectedDataSetList,
	setTablesForDs,
	setSelectedDs,
	loadPlayBook,
	updatePlayBookId,
	storePlayBookCopy,
}: PlayBookProps) => {
	const [playBookList, setPlayBookList] = useState<any[]>([]);

	const [openPopOver, setOpenPopOver] = useState<boolean>(false);
	const [selectedDataset, setSelectedDataset] = useState<PbSelectedDataset>();
	const [loading, setLoading] = useState<boolean>(false);

	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("");
	const [severity, setSeverity] = useState<string>("success");

	var navigate = useNavigate();

	console.log(selectedDataset);

	useEffect(() => {
		getInformation();
		// eslint - disable - next - line;
	}, []);

	// Get list of saved playbooks
	const getInformation = async () => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: "playbook/",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (result.status) {
			console.log(result.data, "Playbook list");

			setPlayBookList(result.data);
		} else {
			//console.log(result.data.detail);
		}
	};

	// Creating new play book requires to select a dataset. On selecting that dataset,
	// 		tables for that dataset is retrieved & stored
	// 		Selected dataset is stored
	useEffect(() => {
		const fetchData = async () => {
			if (selectedDataset) {
				setSelectedDataSetList(selectedDataset);

				var datasetFromServer: any = await getTables(selectedDataset.id);
				setTablesForDs({ [selectedDataset.id]: datasetFromServer });
				setSelectedDs(1.1, selectedDataset);

				navigate("/dataviewer");
			}
		};

		fetchData();
	}, [selectedDataset]);

	// Get tables for a dataset from server
	const getTables = async (uid: string) => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `ds/get-ds-tables/${uid}`,
			headers: { Authorization: `Bearer ${token}` },
		});

		if (result.status) {
			return result.data;
		} else {
			//console.log(result.data.detail);
		}
	};

	// Retrive all required data for each playbook from server like
	// 		- Table records and recordTypes, and
	// 		- create fresh charts with latest data
	//  	- Update the local store with the new data

	const getPlayBookDataFromServer = async (pbUid: string) => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `pb/get-pb/${pbUid}`,
			headers: { Authorization: `Bearer ${token}` },
		});

		if (result.status) {
			setLoading(true);

			var pb = result.data;

			var selectedDatasetsInPlaybook = pb.content.tabTileProps.selectedDataSetList;

			// Get list of tables for a given dataset and save here
			var tablesForSelectedDatasetsCopy = {};
			await Promise.all(
				selectedDatasetsInPlaybook.map(async (sampleDs: any) => {
					var result2: any = await FetchData({
						requestType: "noData",
						method: "GET",
						url: `ds/get-ds-tables/${sampleDs.ds_uid}`,
						headers: { Authorization: `Bearer ${token}` },
					});

					if (result2.status) {
						// tablesForSelectedDatasetsCopy[sampleDs.ds_uid] = result2.data;
					}
				})
			);
			pb.content.tabTileProps.tablesForSelectedDataSets = tablesForSelectedDatasetsCopy;

			// for each tile in playbook, if it has minimum required cards in dropzones, get chart data from server
			var newChartControl = JSON.parse(JSON.stringify(pb.content?.chartControl));
			await Promise.all(
				Object.keys(pb.content.chartControl.properties).map(async property => {
					var axesValue = JSON.parse(
						JSON.stringify(pb.content.chartProperty.properties[property].chartAxes)
					);

					var minReq: any = true;
					// var minReq:any = checkMinRequiredCards(pb.content.chartProperty, property);
					var serverCall = false;
					if (minReq) {
						serverCall = true;
					} else {
						newChartControl.properties[property].chartData = "";
					}

					if (serverCall) {
						if (
							pb.content.chartProperty.properties[property].chartType ===
							"scatterPlot"
						) {
							var combinedValues = { name: "Measure", fields: [] };
							var values1 = axesValue[2].fields;
							var values2 = axesValue[3].fields;
							var allValues = values1.concat(values2);
							combinedValues.fields = allValues;
							axesValue.splice(2, 2, combinedValues);
						}

						if (
							pb.content.chartProperty.properties[property].chartType === "heatmap" ||
							pb.content.chartProperty.properties[property].chartType === "crossTab"
						) {
							var combinedValues2 = { name: "Dimension", fields: [] };
							var values3 = axesValue[1].fields;
							var values4 = axesValue[2].fields;
							var allValues2 = values3.concat(values4);
							combinedValues2.fields = allValues2;
							axesValue.splice(1, 2, combinedValues2);
						}
						////console.log(axesValue);
						// getChartData(axesValue, pb.content.chartProperty, property, token).then(
						// 	(data:any) => {
						// 		newChartControl.properties[property].chartData = data;
						// 	}
						// );
					}
				})
			);

			// Get all tables for selected Dataset and display them here
			var sampleRecords = { recordsColumnType: {} };
			await Promise.all(
				Object.keys(pb.content.chartProperty.properties).map(async prop => {
					var tableInfo = pb.content.chartProperty.properties[prop];

					var dc_uid = tableInfo.selectedDs?.dc_uid;
					var ds_uid = tableInfo.selectedDs?.ds_uid;

					var selectedTableForThisDataset =
						pb.content.tabTileProps.tablesForSelectedDataSets[ds_uid].filter(
							(tbl: any) => tbl.id === tableInfo.selectedTable[ds_uid]
						)[0];

					if (selectedTableForThisDataset) {
						var tableRecords = await getTableData(
							dc_uid,
							selectedTableForThisDataset.schema_name,
							selectedTableForThisDataset.table_name,
							token
						);

						var recordsType = await getColumnTypes(
							dc_uid,
							selectedTableForThisDataset.schema_name,
							selectedTableForThisDataset.table_name,
							token
						);

						// Format the data retrieved to required JSON for saving in store
						// if (sampleRecords[ds_uid] !== undefined) {
						// 	sampleRecords = update(sampleRecords, {
						// 		recordsColumnType: {
						// 			[ds_uid]: {
						// 				[selectedTableForThisDataset.id]: { $set: recordsType },
						// 			},
						// 		},
						// 		[ds_uid]: {
						// 			[selectedTableForThisDataset.id]: { $set: tableRecords },
						// 		},
						// 	});
						// } else {
						// 	var recordsCopy = JSON.parse(JSON.stringify(sampleRecords));
						// 	var dsObj = { [ds_uid]: {} };

						// 	recordsCopy = update(recordsCopy, {
						// 		$merge: dsObj,
						// 		recordsColumnType: { $merge: dsObj },
						// 	});

						// 	sampleRecords = update(recordsCopy, {
						// 		recordsColumnType: {
						// 			[ds_uid]: {
						// 				[selectedTableForThisDataset.id]: { $set: recordsType },
						// 			},
						// 		},
						// 		[ds_uid]: {
						// 			[selectedTableForThisDataset.id]: { $set: tableRecords },
						// 		},
						// 	});
						// }
					}
				})
			);

			setLoading(false);

			pb.content.chartControl = newChartControl;
			pb.content.sampleRecords = sampleRecords;
			loadPlayBook(pb.content);
			updatePlayBookId(pb.name, pb.pb_uid, pb.description);

			var pbCopy = pb.content;
			delete pbCopy.sampleRecords;
			storePlayBookCopy(pbCopy);

			navigate("/dataviewer");
		}
	};

	// Delete a playbook
	const deletePlayBook = async (pbUid: string) => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "DELETE",
			url: `playbook/${pbUid}`,
			headers: { Authorization: `Bearer ${token}` },
		});
		if (result.status) {
			setSeverity("success");
			setOpenAlert(true);
			setTestMessage("Deleted Successfully!");
			getInformation();
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 2000);
		} else {
			//console.log(result.detail);
		}
	};

	return (
		<div className="dashboardsContainer">
			<div className="containersHead">
				<div className="containerTitle">Playbooks</div>

				<DatasetListPopover
					showCard={openPopOver}
					setShowCard={setOpenPopOver}
					setSelectedDataset={setSelectedDataset}
					popOverTitle="Select a Dataset to use with PlayBook"
				/>
				<input
					className="containerButton"
					type="button"
					value="New"
					onClick={e => {
						setOpenPopOver(true);
					}}
				/>
			</div>
			<div className="connectionListContainer">
				{playBookList &&
					playBookList.map(pb => {
						return (
							<SelectListItem
								key={pb.name}
								render={(xprops: any) => (
									<div
										className={
											xprops.open
												? "dataConnectionListSelected"
												: "dataConnectionList"
										}
										onMouseOver={() => xprops.setOpen(true)}
										onMouseLeave={() => xprops.setOpen(false)}
										onClick={() => {
											getPlayBookDataFromServer(pb.pb_uid);
										}}
									>
										<div className="dataConnectionName">{pb.name}</div>
										{xprops.open ? (
											<Tooltip
												title="Delete playbook"
												arrow
												placement="right-start"
											>
												<div
													className="dataHomeDeleteIcon"
													onClick={e => {
														e.stopPropagation();

														var yes = window.confirm(
															"Are you sure you want to Delete this Playbook?"
														);
														if (yes) {
															deletePlayBook(pb.pb_uid);
														}
													}}
												>
													<DeleteIcon
														style={{
															width: "1rem",
															height: "1rem",
															margin: "auto",
														}}
													/>
												</div>
											</Tooltip>
										) : null}
									</div>
								)}
							/>
						);
					})}

				<NotificationDialog
					openAlert={openAlert}
					severity={severity}
					testMessage={testMessage}
					onCloseAlert={() => {
						setOpenAlert(false);
						setTestMessage("");
					}}
				/>
			</div>

			{loading ? <LoadingPopover /> : null}
		</div>
	);
};

const mapStateToProps = (state: isLoggedProps) => {
	return {
		token: state.isLogged.accessToken,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setSelectedDataSetList: (dataset: PbSelectedDataset) =>
			dispatch(setSelectedDataSetList(dataset)),
		setTablesForDs: (tablesObj: any) => dispatch(setTablesForSelectedDataSets(tablesObj)),
		setSelectedDs: (propKey: number, selectedDs: any) =>
			dispatch(setSelectedDsInTile(propKey, selectedDs)),
		loadPlayBook: (playBook: any) => dispatch(loadPlaybook(playBook)),
		updatePlayBookId: (
			playBookName: string,
			playBookUid: string,
			description: string,
			oldContent: string | any
		) => dispatch(updatePlaybookUid(playBookName, playBookUid, description, oldContent)),
		storePlayBookCopy: (pb: any) => dispatch(storePlayBookCopy(pb)),
		updateChartData: (propKey: number, chartData: string) =>
			dispatch(updateChartData(propKey, chartData)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayBookList);
