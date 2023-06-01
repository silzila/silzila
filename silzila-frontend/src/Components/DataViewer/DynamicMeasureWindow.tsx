import {
	AlertColor,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Table,
	TableHead,
	TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ChartAxes from "../ChartAxes/ChartAxes";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
	changeChartOptionSelected,
	setDynamicMeasureWindowOpen,
} from "../../redux/ChartPoperties/ChartPropertiesActions";
import DisplayTable from "./DisplayTable";
import { getColumnTypes, getTableData } from "./DataViewerBottom";
import { addTableRecords } from "../../redux/SampleTableRecords/SampleTableRecordsActions";
import {
	discardCreationOfFirstDm,
	onDiscardDynamicMeasureCreation,
	setSelectedTableForSelectedDynamicMeasure,
	setSelectedToEdit,
	updateDynamicMeasureName,
} from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import GraphArea from "../GraphArea/GraphArea";
import ChartControlObjects from "../ChartOptions/ChartControlObjects";
import ControlDetail from "../ChartOptions/ControlDetail";
import { createStyles, makeStyles } from "@mui/styles";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";

const DynamicMeasureWindow = ({
	//state
	token,
	sampleRecords,
	tabTileProps,
	chartProperties,
	dynamicMeasureState,

	//dispatch
	addRecords,
	setSelectedTable,
	onDiscardDynamicMeasureCreation,
	setDynamicMeasureWindowOpen,
	discardCreationOfFirstDm,
	setSelectedToEdit,
}: any) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var dynamicMeasurePropKey: string = `${tabTileProps.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`;
	var selectedDynamicMeasureProps =
		dynamicMeasureState.dynamicMeasureProps[dynamicMeasureState.selectedTabId]?.[
			dynamicMeasureState.selectedTileId
		]?.[dynamicMeasurePropKey];

	const [loading, setLoading] = useState<boolean>(false);

	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("");
	const [severity, setSeverity] = useState<AlertColor>("success");

	const handleTableChange = async (table: any, dsUid?: any) => {
		if (table.flatFileId) {
		}
		if (table.id !== selectedDynamicMeasureProps.selectedTable) {
			setSelectedTable({
				[selectedDynamicMeasureProps.selectedDs.id]: table.id,
			});

			if (sampleRecords?.[selectedDynamicMeasureProps.selectedDs?.id]?.[table.id]) {
			} else {
				setLoading(true);
				var dc_uid = selectedDynamicMeasureProps.selectedDs?.connectionId;
				var id = selectedDynamicMeasureProps.selectedDs?.id;

				var tableRecords = await getTableData(dc_uid, table, token);

				var recordsType = await getColumnTypes(dc_uid, table, token);

				addRecords(id, table.id, tableRecords, recordsType);
				setLoading(false);
			}
		}
	};

	var tables: any =
		tabTileProps?.tablesForSelectedDataSets?.[selectedDynamicMeasureProps?.selectedDs?.id];

	const TableListForDs: any = () => {
		if (tables !== undefined) {
			return tables.map((table: any) => {
				return (
					<div
						className={
							table.id ===
							selectedDynamicMeasureProps.selectedTable?.[
								selectedDynamicMeasureProps.selectedDs?.id
							]
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

	const getDynamicMeasureName = () => {
		var count = 0;
		return Object.keys(
			dynamicMeasureState.dynamicMeasureProps[dynamicMeasureState.selectedTabId]?.[
				dynamicMeasureState.selectedTileId
			]
		).forEach((k, i) => {
			if (
				dynamicMeasureState.dynamicMeasureProps[dynamicMeasureState.selectedTabId]?.[
					dynamicMeasureState.selectedTileId
				]?.[k].dynamicMeasureName === Object.keys(selectedDynamicMeasureProps.chartData[0])
			) {
				count = count + 1;
			}

			return count;
		});
	};
	var count = 0;
	const handleOnSave = () => {
		if (selectedDynamicMeasureProps.chartAxes[1].fields.length !== 0) {
			// updateDynamicMeasureName(`${Object.keys(selectedDynamicMeasureProps.chartData[0])}`);
			setDynamicMeasureWindowOpen(propKey, false);
		} else {
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage("Measure Field Can't be Empty");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 2000);
		}
	};

	const handleOnCancel = () => {
		//edit discard
		if (selectedDynamicMeasureProps.selectedToEdit) {
			setSelectedToEdit(
				selectedDynamicMeasureProps.tabId,
				selectedDynamicMeasureProps.tileId,
				selectedDynamicMeasureProps.dynamicMeasureId,
				false
			);
		}
		// creation discard
		else {
			discardCreationOfFirstDm(
				selectedDynamicMeasureProps.tabId,
				selectedDynamicMeasureProps.tileId,
				selectedDynamicMeasureProps.dynamicMeasureId
			);
		}
	};

	return (
		<Dialog
			open={chartProperties.properties[propKey].isDynamicMeasureWindowOpened}
			maxWidth="xl"
			fullWidth={true}
			PaperProps={{
				sx: {
					minHeight: "90%",
				},
			}}
		>
			<DialogTitle
				sx={{
					display: "flex",
					flexDirection: "row",
					columnGap: "2rem",
					fontSize: "16px",
					justifyContent: "flex-end",
					alignContent: "center",
					borderBottom: "2px solid rgba(224,224,224,1)",
				}}
			>
				<Button
					sx={{
						textTransform: "none",
						backgroundColor: "rgba(224,224,224,1)",
						color: "red",
					}}
					onClick={() => {
						setDynamicMeasureWindowOpen(propKey, false);
						handleOnCancel();
					}}
				>
					Cancel
				</Button>
				<Button
					sx={{
						textTransform: "none",
						backgroundColor: "rgb(43, 185, 187)",
						color: "white",
					}}
					onClick={() => {
						handleOnSave();
					}}
				>
					save
				</Button>
			</DialogTitle>
			<DialogContent
				sx={{
					maxWidth: "100%",
					// maxWidth: "fit-content",
					padding: 0,
				}}
			>
				<div className="dataViewerMiddle" style={{ height: "440px" }}>
					<ChartAxes
						tabId={tabTileProps.selectedTabId}
						tileId={tabTileProps.selectedTileId}
					/>
					<GraphArea />
					<div className="rightColumn">
						<div className="rightColumnControlsAndFilters">
							<div
								style={{
									color: " #404040",
									fontWeight: "600",
									padding: "10px 0 0 0.5rem",
									marginBottom: "3px",
									textAlign: "center",
								}}
							>
								Charts Controls
							</div>
							<ChartControlObjects />
							<ControlDetail />
						</div>
					</div>
				</div>
				{tabTileProps.showDataViewerBottom ? (
					<>
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
											title={
												selectedDynamicMeasureProps?.selectedDs?.datasetName
											}
											label="DataSet"
											labelId="selectDataSet"
											value={selectedDynamicMeasureProps?.selectedDs?.id}
											variant="outlined"
											// onChange={e => {
											// 	handleDataSetChange(e.target.value);
											// }}
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
													<MenuItem
														sx={{
															fontSize: "12px",
															padding: "2px 1rem",
														}}
														value={ds.id}
														key={ds.id}
													>
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
							</div>
							{selectedDynamicMeasureProps &&
							selectedDynamicMeasureProps.selectedTable?.[
								selectedDynamicMeasureProps.selectedDs.id
							] ? (
								<div className="tileTableView">
									<DisplayTable
										dsId={selectedDynamicMeasureProps.selectedDs?.id}
										table={
											selectedDynamicMeasureProps.selectedTable[
												selectedDynamicMeasureProps.selectedDs?.id
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
						</div>
					</>
				) : null}
			</DialogContent>
			<NotificationDialog
				openAlert={openAlert}
				severity={severity}
				testMessage={testMessage}
			/>
		</Dialog>
	);
};

const mapStateToProps = (state: any, ownProps: any) => {
	return {
		tabTileProps: state.tabTileProps,
		chartProperties: state.chartProperties,
		sampleRecords: state.sampleRecords,
		token: state.isLogged.accessToken,
		dynamicMeasureState: state.dynamicMeasuresState,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setDynamicMeasureWindowOpen: (propKey: string, chartValue: any) =>
			dispatch(setDynamicMeasureWindowOpen(propKey, chartValue)),
		updateDynamicMeasureName: (name: string) => dispatch(updateDynamicMeasureName(name)),

		addRecords: (id: string, tableId: string, tableRecords: any, columnType: any) =>
			dispatch(addTableRecords(id, tableId, tableRecords, columnType)),
		setSelectedTable: (selectedTable: any) =>
			dispatch(setSelectedTableForSelectedDynamicMeasure(selectedTable)),
		onDiscardDynamicMeasureCreation: () => dispatch(onDiscardDynamicMeasureCreation()),
		discardCreationOfFirstDm: (tabId: number, tileId: number, dmId: number) =>
			dispatch(discardCreationOfFirstDm(tabId, tileId, dmId)),
		setSelectedToEdit: (tabId: number, tileId: number, dmId: number, value: boolean) =>
			dispatch(setSelectedToEdit(tabId, tileId, dmId, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DynamicMeasureWindow);
