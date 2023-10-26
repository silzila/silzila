// This component houses
// 	- Option to switch dataset, L
// 	- List of tables for selected dataset
// 	- Tablle for sample records

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
// import {
// 	setSelectedDsInTile,
// 	setSelectedTableInTile,
// } from "../../redux/ChartProperties/actionsChartProperties";
// import { addTableRecords } from "../../redux/SampleTableRecords/sampleTableRecordsActions";
// import {
// 	actionsToAddTile,
// 	setSelectedDataSetList,
// 	setTablesForSelectedDataSets,
// } from "../../redux/TabTile/actionsTabTile";
import FetchData from "../ServerCall/FetchData";
import { ChangeConnection } from "../CommonFunctions/DialogComponents";
import DatasetListPopover from "../CommonFunctions/PopOverComponents/DatasetListPopover";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import "./dataViewerBottom.css";
import DisplayTable from "./DisplayTable";
import {
	setSelectedDsInTile,
	setSelectedTableInTile,
} from "../../redux/ChartPoperties/ChartPropertiesActions";
import { addTableRecords } from "../../redux/SampleTableRecords/SampleTableRecordsActions";
import { DataViewerBottomProps, DataViewerBottomStateProps } from "./DataViewerBottomInterfaces";
import {
	actionsToAddTile,
	setSelectedDataSetList,
	setTablesForSelectedDataSets,
} from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import { IndChartPropProperties } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import Logger from "../../Logger";

export const getTableData = async (dc_uid: string, tableObj: any, token: string) => {
	var database: string = tableObj.database;
	var schema: string = tableObj.schema;
	var table: string = tableObj.table;
	var url: string = "";
	if (tableObj.flatFileId) {
		url = `file-data-sample-records/${tableObj.flatFileId}`;
	} else {
		url = `sample-records/${dc_uid}/20?database=${database}&schema=${schema}&table=${table}`;
	}

	var res: any = await FetchData({
		requestType: "noData",
		method: "GET",
		url: url,
		headers: { Authorization: `Bearer ${token}` },
	});

	if (res.status) {
		return res.data;
	} else {
		Logger("info", "Get Table Data Error", res);
	}
};

export const getColumnTypes = async (dc_uid: string, tableObj: any, token: string) => {
	var database: string = tableObj.database;
	var schema: string = tableObj.schema;
	var table: string = tableObj.table;
	var url: string = "";
	if (tableObj.flatFileId) {
		url = `file-data-column-details/${tableObj.flatFileId}`;
	} else {
		url = `metadata-columns/${dc_uid}?database=${database}&schema=${schema}&table=${table}`;
	}

	var res: any = await FetchData({
		requestType: "noData",
		method: "GET",
		url: url,
		headers: { Authorization: `Bearer ${token}` },
	});

	if (res.status) {
		let finalResult: any = [];
		if (tableObj.flatFileId) {
			finalResult = res.data.map((el: any) => {
				return {
					columnName: el.fieldName,
					dataType: el.dataType,
				};
			});
		} else {
			finalResult = res.data;
		}
		return finalResult;
	} else {
		Logger("info", "Get Table ColumnsType Error", res);
	}
};

const DataViewerBottom = ({
	// state
	token,
	tabTileProps,
	chartProps,
	sampleRecords,
	tabState,

	// dispatch
	setSelectedDataSetList,
	setSelectedDs,
	setSelectedTable,
	setTablesForDs,
	addRecords,
	addTile,
}: DataViewerBottomProps) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var selectedChartProp: IndChartPropProperties = chartProps.properties[propKey];

	var tables: any = tabTileProps?.tablesForSelectedDataSets?.[selectedChartProp?.selectedDs?.id];

	const [open, setOpen] = useState<boolean>(false);
	const [selectedDataset, setSelectedDataset] = useState<string | any>("");
	const [loading, setLoading] = useState<boolean>(false);

	const [openChangeDatasetDlg, setOpenChangeDatasetDlg] = useState<boolean>(false);
	const [addNewOrChooseExistingDS, setAddNewOrChooseExistingDS] = useState<string>("");

	// When a new dataset is added to the tile for work,
	// set it in SelectedDataSet of tabTileProps
	// useEffect(async () => {
	useEffect(() => {
		if (selectedDataset !== "") {
			var isAlready = tabTileProps.selectedDataSetList.filter(
				(ds: string | any) => ds === selectedDataset
			);
			if (isAlready.length > 0) {
				window.alert("Dataset already in selected list");
			} else {
				setSelectedDataSetList(selectedDataset);
				setSelectedDs(propKey, selectedDataset);
				setOpen(false);
			}
		}
	}, [selectedDataset]);

	// When a Dataset is selected, make sure the tables for that dataset is present in store.
	// If not, get it from server and save in store
	// useEffect(async() => {
	useEffect(() => {
		const fetchData = async () => {
			if (
				tabTileProps?.tablesForSelectedDataSets?.[selectedChartProp?.selectedDs?.id] ===
				undefined
			) {
				setLoading(true);
				// var tablesFromServer = await getTables(selectedChartProp.selectedDs?.ds_uid);
				var tablesFromServer: any = await getTables(selectedChartProp.selectedDs?.id);
				setTablesForDs({ [selectedDataset.id]: tablesFromServer?.dataSchema?.tables });
				setLoading(false);
			}
		};

		fetchData();
	}, [selectedChartProp.selectedDs]);

	const getTables = async (uid: any) => {
		var result: any = await FetchData({
			requestType: "noData",
			method: "GET",
			url: `dataset/${uid}`,
			headers: { Authorization: `Bearer ${token}` },
		});

		if (result.status) {
			return result.data;
		} else {
		}
	};

	// const handleDataSetChange = (value) => {
	// 	if (value === "addNewDataset") {
	// 		setOpen(true);
	// 	} else {
	// 		var dsObj = tabTileProps.selectedDataSetList.filter((ds) => ds.ds_uid === value)[0];
	// 		setSelectedDs(propKey, dsObj);
	// 	}
	// };

	/*When a table selected in dataset is changed,
	check if this table's sample records are already present
	if yes,display them. If no, get the table records and save in store*/

	const handleTableChange = async (table: any, dsUid?: any) => {
		if (table.flatFileId) {
		}
		if (table.id !== selectedChartProp.selectedTable) {
			setSelectedTable(propKey, { [selectedChartProp.selectedDs.id]: table.id });

			if (sampleRecords?.[selectedChartProp.selectedDs?.id]?.[table.id]) {
			} else {
				setLoading(true);
				var dc_uid = selectedChartProp.selectedDs?.connectionId;
				var id = selectedChartProp.selectedDs?.id;

				var tableRecords = await getTableData(dc_uid, table, token);

				var recordsType = await getColumnTypes(dc_uid, table, token);

				addRecords(id, table.id, tableRecords, recordsType);
				setLoading(false);
			}
		}
	};

	// List of tables for a dataset, displayed
	const TableListForDs: any = () => {
		if (tables !== undefined) {
			return tables.map((table: any) => {
				return (
					<div
						className={
							table.id ===
							selectedChartProp.selectedTable?.[selectedChartProp.selectedDs?.id]
								? "dsIndiTableInTileSelected"
								: "dsIndiTableInTile"
						}
						key={table.id}
						onClick={() => {
							handleTableChange(table);
						}}
					>
						{table.alias}
					</div>
				);
			});
		} else return null;
	};

	var selectInput = { fontSize: "12px", padding: "2px 1rem" };

	/* when the dataset itself is changed,
	if there are no added fields in dropzone, allow the change.
	else, open a new tile with the selected dataset*/
	const handleDataSetChange = (value: any) => {
		const axes = chartProps.properties[propKey].chartAxes;
		setAddNewOrChooseExistingDS(value);
		if (value === "addNewDataset") {
			var count = 0;
			axes.forEach((ax: any) => {
				if (ax.fields.length > 0) {
					count = count + 1;
				}
			});
			if (count > 0) {
				setOpenChangeDatasetDlg(true);
			} else {
				setOpen(true);
			}
		} else {
			var count = 0;
			axes.forEach((ax: any) => {
				if (ax.fields.length > 0) {
					count = count + 1;
				}
			});

			if (count > 0) {
				setOpenChangeDatasetDlg(true);
			} else {
				var dsObj = tabTileProps.selectedDataSetList.filter(
					(ds: any) => ds.id === value
				)[0];
				setSelectedDs(propKey, dsObj);
			}
		}
	};

	const onChangeOrAddDataset = () => {
		let tabObj = tabState.tabs[tabTileProps.selectedTabId];

		addTile(
			tabObj.tabId,
			tabObj.nextTileId,
			tabTileProps.selectedTable,
			chartProps.properties[propKey].selectedDs,
			chartProps.properties[propKey].selectedTable
		);

		setOpenChangeDatasetDlg(false);
		if (addNewOrChooseExistingDS === "addNewDataset") {
			setOpen(true);
		} else {
			var dsObj = tabTileProps.selectedDataSetList.filter(
				(ds: any) => ds.id === addNewOrChooseExistingDS
			)[0];
			setSelectedDs(`${tabObj.tabId}.${tabObj.nextTileId}`, dsObj);
		}
	};
	return (
		<React.Fragment>
			{chartProps.properties[propKey].chartType === "richText" ? null : (
				<div className="dataViewerBottom">
					<div className="dataSetAndTableList">
						<div className="dataSetSelect">
							<FormControl
								sx={{
									"& .MuiInputBase-root": {
										borderRadius: "0px",
									},
								}}
								fullWidth
								size="small"
								style={{
									background: "white",
									fontSize: "12px",
									borderRadius: "4px",
								}}
							>
								<InputLabel
									id="selectDataSet"
									sx={{
										fontSize: "12px",
										lineHeight: "1.5rem",
										"&.Mui-focused": {
											color: "#2bb9bb",
										},
									}}
									shrink={true}
								>
									DataSet
								</InputLabel>

								<Select
									title={selectedChartProp.selectedDs.datasetName}
									label="DataSet"
									labelId="selectDataSet"
									value={selectedChartProp.selectedDs?.id}
									variant="outlined"
									onChange={e => {
										handleDataSetChange(e.target.value);
									}}
									sx={{
										height: "1.5rem",
										fontSize: "13px",
										color: "grey",

										"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
											borderColor: "#2bb9bb",
											color: "#2bb9bb",
										},
										"&:hover .MuiOutlinedInput-notchedOutline": {
											borderColor: "#2bb9bb",
											color: "#2bb9bb",
										},
										"&.Mui-focused .MuiSvgIcon-root ": {
											fill: "#2bb9bb !important",
										},
									}}
									notched={true}
								>
									<MenuItem
										sx={{
											fontSize: "12px",
											padding: "2px 1rem",
											borderBottom: "1px solid lightgray",
										}}
										value="addNewDataset"
									>
										Add Dataset
									</MenuItem>

									{tabTileProps.selectedDataSetList.map((ds: any) => {
										return (
											<MenuItem sx={selectInput} value={ds.id} key={ds.id}>
												{ds.datasetName}
											</MenuItem>
										);
									})}
								</Select>
							</FormControl>
						</div>

						<div className="tileTableList">
							<div className="tablescontainerinDataviewerBottom">
								<TableListForDs />
							</div>
						</div>
						<DatasetListPopover
							showCard={open}
							setShowCard={setOpen}
							popOverTitle="Select Dataset"
							setSelectedDataset={setSelectedDataset}
						/>
					</div>
					{selectedChartProp.selectedTable?.[selectedChartProp.selectedDs.id] ? (
						<div className="tileTableView">
							<DisplayTable
								dsId={selectedChartProp.selectedDs?.id}
								table={
									selectedChartProp.selectedTable[
										selectedChartProp.selectedDs?.id
									]
								}
							/>
						</div>
					) : (
						<div
							className="axisInfo"
							style={{
								flex: "1",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							Select any table from the list on left to show records here
						</div>
					)}
					{loading ? <LoadingPopover /> : null}
					<ChangeConnection
						onChangeOrAddDataset={onChangeOrAddDataset}
						open={openChangeDatasetDlg}
						setOpen={setOpenChangeDatasetDlg}
						heading="CHANGE DATASET"
						message="Want to open in new tile?"
					/>
				</div>
			)}
		</React.Fragment>
	);
};

const mapStateToProps = (state: DataViewerBottomStateProps) => {
	return {
		token: state.isLogged.accessToken,
		tabTileProps: state.tabTileProps,
		chartProps: state.chartProperties,
		sampleRecords: state.sampleRecords,
		tabState: state.tabState,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setSelectedDataSetList: (dataset: string) => dispatch(setSelectedDataSetList(dataset)),
		setTablesForDs: (tablesObj: any) => dispatch(setTablesForSelectedDataSets(tablesObj)),
		setSelectedDs: (propKey: string, selectedDs: any) =>
			dispatch(setSelectedDsInTile(propKey, selectedDs)),
		setSelectedTable: (propKey: string, selectedTable: any) =>
			dispatch(setSelectedTableInTile(propKey, selectedTable)),
		addRecords: (id: string, tableId: string, tableRecords: any, columnType: any) =>
			dispatch(addTableRecords(id, tableId, tableRecords, columnType)),
		addTile: (
			tabId: number,
			nextTileId: number,
			table: any,
			selectedDataset: any,
			selectedTables: any
		) =>
			dispatch(
				actionsToAddTile({
					tabId,
					nextTileId,
					table,
					fromTab: false,
					selectedDs: selectedDataset,
					selectedTablesInDs: selectedTables,
				})
			),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewerBottom);
