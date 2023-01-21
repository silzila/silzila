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
import AddIcon from "@mui/icons-material/Add";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

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

	// console.log(selectedDataset);

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
			// console.log(result.data, "Playbook list");

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
				console.log(datasetFromServer);
				setTablesForDs({ [selectedDataset.id]: datasetFromServer.dataSchema.tables });
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
			url: `dataset/${uid}`,
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
			url: `playbook/${pbUid}`,
			headers: { Authorization: `Bearer ${token}` },
		});

		if (result.status) {
			// console.log(result.data);
			setLoading(true);

			var pb = result.data;

			var selectedDatasetsInPlaybook = pb.content.content.tabTileProps.selectedDataSetList;

			// Get list of tables for a given dataset and save here
			var tablesForSelectedDatasetsCopy: any = {};
			await Promise.all(
				selectedDatasetsInPlaybook.map(async (sampleDs: any) => {
					var result2: any = await FetchData({
						requestType: "noData",
						method: "GET",
						url: `dataset/${sampleDs.id}`,
						headers: { Authorization: `Bearer ${token}` },
					});

					if (result2.status) {
						// tablesForSelectedDatasetsCopy[sampleDs.id] = result2.data;
						tablesForSelectedDatasetsCopy[sampleDs.id] = result2.data.dataSchema.tables;
					}
				})
			);
			console.log(tablesForSelectedDatasetsCopy);
			pb.content.content.tabTileProps.tablesForSelectedDataSets =
				tablesForSelectedDatasetsCopy;

			// for each tile in playbook, if it has minimum required cards in dropzones, get chart data from server
			var newChartControl = JSON.parse(JSON.stringify(pb.content.content?.chartControl));
			console.log(newChartControl);
			await Promise.all(
				Object.keys(pb.content.content.chartControl.properties).map(async property => {
					var axesValue = JSON.parse(
						JSON.stringify(
							pb.content.content.chartProperty.properties[property].chartAxes
						)
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
							pb.content.content.chartProperty.properties[property].chartType ===
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
							pb.content.content.chartProperty.properties[property].chartType ===
								"heatmap" ||
							pb.content.content.chartProperty.properties[property].chartType ===
								"crossTab"
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
			var sampleRecords: any = { recordsColumnType: {} };
			await Promise.all(
				Object.keys(pb.content.content.chartProperty.properties).map(async prop => {
					var tableInfo = pb.content.content.chartProperty.properties[prop];

					var dc_uid = tableInfo.selectedDs?.connectionId;
					var ds_uid = tableInfo.selectedDs?.id;

					var selectedTableForThisDataset =
						pb.content.content.tabTileProps.tablesForSelectedDataSets[ds_uid].filter(
							(tbl: any) => tbl.id === tableInfo.selectedTable[ds_uid]
						)[0];

					if (selectedTableForThisDataset) {
						var tableRecords = await getTableData(
							dc_uid,
							selectedTableForThisDataset,
							token
						);

						var recordsType = await getColumnTypes(
							dc_uid,
							selectedTableForThisDataset,
							token
						);

						// Format the data retrieved to required JSON for saving in store
						if (sampleRecords[ds_uid] !== undefined) {
							sampleRecords = update(sampleRecords, {
								recordsColumnType: {
									[ds_uid]: {
										[selectedTableForThisDataset.id]: { $set: recordsType },
									},
								},
								[ds_uid]: {
									[selectedTableForThisDataset.id]: { $set: tableRecords },
								},
							});
						} else {
							var recordsCopy = JSON.parse(JSON.stringify(sampleRecords));
							var dsObj = { [ds_uid]: {} };

							recordsCopy = update(recordsCopy, {
								$merge: dsObj,
								recordsColumnType: { $merge: dsObj },
							});

							sampleRecords = update(recordsCopy, {
								recordsColumnType: {
									[ds_uid]: {
										[selectedTableForThisDataset.id]: { $set: recordsType },
									},
								},
								[ds_uid]: {
									[selectedTableForThisDataset.id]: { $set: tableRecords },
								},
							});
							console.log(sampleRecords);
						}
					}
				})
			);

			setLoading(false);

			pb.content.content.chartControl = newChartControl;
			pb.content.content.sampleRecords = sampleRecords;
			loadPlayBook(pb.content.content);
			updatePlayBookId(pb.name, pb.id, pb.description);

			var pbCopy = pb.content.content;
			delete pbCopy.sampleRecords;

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
				<div className="containerTitle">
					<DashboardOutlinedIcon style={{ marginRight: "10px", color: "#555555" }} />
					Playbooks
				</div>

				<DatasetListPopover
					showCard={openPopOver}
					setShowCard={setOpenPopOver}
					setSelectedDataset={setSelectedDataset}
					popOverTitle="Select a Dataset to use with PlayBook"
				/>
				<div
					title="Click to Add New Playbook"
					className="containerButton"
					onClick={e => {
						setOpenPopOver(true);
					}}
				>
					<AddIcon />
				</div>
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
											getPlayBookDataFromServer(pb.id);
										}}
									>
										<div className="dataConnectionName">{pb.name}</div>
										<div>
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
																deletePlayBook(pb.id);
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
		setSelectedDs: (propKey: number | string, selectedDs: any) =>
			dispatch(setSelectedDsInTile(propKey, selectedDs)),
		loadPlayBook: (playBook: any) => dispatch(loadPlaybook(playBook)),
		updatePlayBookId: (
			playBookName: string,
			playBookUid: string,
			description: string,
			oldContent?: string | any
		) => dispatch(updatePlaybookUid(playBookName, playBookUid, description, oldContent)),
		storePlayBookCopy: (pb: any) => dispatch(storePlayBookCopy(pb)),
		updateChartData: (propKey: number | string, chartData: string | any) =>
			dispatch(updateChartData(propKey, chartData)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayBookList);
