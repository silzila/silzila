import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import * as CrossTab from "../CrossTab/CrossTab";
import { BuildTable } from "../CrossTab/BuildTable";
import "../CrossTab/CrossTab.css";
import { ChartsMapStateToProps, ChartsReduxStateProps } from "../ChartsCommonInterfaces";
import { formatChartLabelValue } from "../../ChartOptions/Format/NumberFormatter";
import Logger from "../../../Logger";

const TableChart = ({
	propKey,
	graphDimension,

	//state
	chartControls,
	chartProperties,
}: ChartsReduxStateProps) => {
	let enable = false,
		defaultTemplate = false,
		chartDataCSV: any = { rows: [], columns: [] },
		crossTabData: any[] = [],
		columnObj = {
			rowIndex: 0,
			isRowField: false,
			isHeaderField: false,
			parentColumnSpan: 1,
			columnSpan: 2,
			rowSpan: 1,
			compareObj: {},
			displayData: "",
			skip: false,
		},
		rowObj = {
			index: 0,
			rowSpan: 1,
			columnSpan: 1,
			compareObj: {},
			columnList: [],
			displayData: "",
			columnItems: [],
		},
		dustbinRows: any[] = [],
		dustbinColumns: any[] = [],
		dustbinValues: any[] = [];

	var property = chartControls.properties[propKey];
	var chartPropAxes = chartProperties.properties[propKey].chartAxes;

	let chartPropData = property.chartData ? property.chartData : "";

	let tempFormatedChartPropData = CrossTab.cloneData(chartPropData ?? {});
	Logger("info", JSON.stringify(tempFormatedChartPropData));

	const [showAsColumn, setShowAsColumn] = React.useState(true);

	const [formatedChartPropData, setFormatedChartPropData] = useState([]);

	/*
  To apply chart data format from 'property.formatOptions'. Deep cloned chart  data is used.
  */
	useEffect(() => {
		if (tempFormatedChartPropData) {
			var chartDataKeys = Object.keys(tempFormatedChartPropData[0] || []);
			let _formChartData: any = [];

			tempFormatedChartPropData.forEach((item: any) => {
				let formattedValue: any = {};

				for (let i = 0; i < chartDataKeys.length; i++) {
					/*  Need to format only numeric values  */
					if (typeof item[chartDataKeys[i]] === "number") {
						let _isMeasureField = dustbinValues.find(field =>
							chartDataKeys[i].includes(field.fieldname)
						);
						/*  Need to format Measure dustbin fields */
						if (_isMeasureField && chartDataKeys[i].includes("of")) {
							formattedValue[chartDataKeys[i]] = formatChartLabelValue(
								property,
								item[chartDataKeys[i]]
							);
						} else {
							formattedValue[chartDataKeys[i]] = item[chartDataKeys[i]];
						}
					} else {
						formattedValue[chartDataKeys[i]] = item[chartDataKeys[i]];
					}
				}

				_formChartData.push(formattedValue);
			});

			setFormatedChartPropData(_formChartData);
		}
	}, [chartPropData, property.formatOptions]);

	/*
    Assign deeply cloned values from Dustbins
  */
	if (chartPropAxes[1] && chartPropAxes[1].fields && chartPropAxes[1].fields.length > 0) {
		dustbinRows = CrossTab.cloneData(chartPropAxes[1].fields);
	}

	// if (chartPropAxes[2] && chartPropAxes[2].fields && chartPropAxes[2].fields.length > 0) {
	// 	dustbinColumns = CrossTab.cloneData(chartPropAxes[2].fields);
	// }

	if (chartPropAxes[2] && chartPropAxes[2].fields && chartPropAxes[2].fields.length > 0) {
		dustbinValues = CrossTab.cloneData(chartPropAxes[2].fields);
	}

	/*
    To update the ColumnSpan of header segment
*/
	const updateColSpan = (noValue?: boolean) => {
		/*  Need to add those measure fields values to ColumnCSV collection.  */
		if (dustbinValues.length > 1 && showAsColumn) {
			chartDataCSV.columns = CrossTab.addDusbinValuesMeasuresInChartData(
				dustbinValues,
				chartDataCSV.columns
			);

			for (let hdrRow = crossTabData.length - 1; hdrRow >= 0; hdrRow--) {
				for (
					let colIndex = 0;
					colIndex < crossTabData[hdrRow].columnItems.length;
					colIndex++
				) {
					let colData = crossTabData[hdrRow].columnItems[colIndex];
					let spanSize = 1;

					/*  Last row of the Column header span always of size 1 */
					if (hdrRow + 1 === crossTabData.length) {
						spanSize = 1;
					} else if (hdrRow + 2 === crossTabData.length) {
						/*  Last but above row of the Column header span always of size measure fields count */
						spanSize = dustbinValues.length;
					} else if (hdrRow - 1 === 0) {
						/* Top row column span calulated from ColumnCSV list with matching data list lenght  */
						let _list = chartDataCSV.columns.filter((item: any) =>
							item.includes(colData.displayData)
						);
						spanSize = _list.length;
					} else {
						let compObj = "";

						Object.keys(colData.compareObj).forEach(key => {
							compObj = compObj.concat(colData.compareObj[key], ",");
						});

						let _list = chartDataCSV.columns.filter((item: any) =>
							item.includes(compObj)
						);
						spanSize = _list.length;
					}

					colData.columnSpan = spanSize || 1;
				}
			}
		} else {
			/*  No measure fields where added, so no values in the cell */
			if (noValue) {
				for (let hdrRow = crossTabData.length - 1; hdrRow >= 0; hdrRow--) {
					for (
						let colIndex = 0;
						colIndex < crossTabData[hdrRow].columnItems.length;
						colIndex++
					) {
						let colData = crossTabData[hdrRow].columnItems[colIndex];
						let spanSize = 1;

						if (hdrRow - 1 === crossTabData.length) {
							spanSize = 1;
						} else {
							let compObj = "";

							Object.keys(colData.compareObj).forEach(key => {
								compObj = compObj.concat(colData.compareObj[key], ",");
							});

							let _list = chartDataCSV.columns.filter((item: any) =>
								item.includes(compObj)
							);
							spanSize = _list.length;
						}

						colData.columnSpan = spanSize || 1;
					}
				}
			} else {
				updateColSpanHasValue(crossTabData, formatedChartPropData);
			}
		}
	};

	/* Column span calulated from compare object list lenght  */
	const updateColSpanHasValue = (crossTabData: any, formatedChartPropData: any) => {
		for (var hdrRow = 0; hdrRow < crossTabData.length; hdrRow++) {
			for (let colIndex = 0; colIndex < crossTabData[hdrRow].columnItems.length; colIndex++) {
				let colData = crossTabData[hdrRow].columnItems[colIndex];
				let _list = CrossTab.getFilteredChartPropDataByCompareObject(
					formatedChartPropData,
					colData.compareObj
				);
				colData.columnSpan = _list.length || 1;
			}
		}
	};

	/*
    Push Dusbin Rows into crossTabData Header Area collection
*/
	const appendRowsFieldsAsColumns = () => {
		for (let i = crossTabData.length - 1; i >= 0; i--) {
			let tempColumns = [];

			for (let row = 0; row < dustbinRows.length; row++) {
				let tempColumnObj = CrossTab.cloneData(columnObj);

				if (i === crossTabData.length - 1) {
					tempColumnObj.displayData = CrossTab.getKeyWithPrefix(dustbinRows[row], "row");
				} else {
					/*  Feature added to include Column field to the column header  */
					if (row === dustbinRows.length - 1) {
						tempColumnObj.displayData = CrossTab.getKeyWithPrefix(dustbinColumns[i], "row");

					}
				}

				tempColumnObj.isRowField = true;
				tempColumnObj.isHeaderField = true;
				tempColumns.push(tempColumnObj);
			}

			/*  TODO:: During measure swap feature, added those measures to rows  */
			if (dustbinValues.length > 1 && !showAsColumn) {
				let tempColumnObj = CrossTab.cloneData(columnObj);
				tempColumnObj.displayData = "";
				tempColumnObj.isRowField = true;
				tempColumnObj.isHeaderField = true;
				tempColumns.push(tempColumnObj);
			}

			crossTabData[i].columnItems = [...tempColumns, ...crossTabData[i].columnItems];
		}
	};

	const appendRowsFieldsAsColumnsForColumnOnly = () => {
		for (let i = crossTabData.length - 1; i >= 0; i--) {
			let tempColumns:any = [];

			///	for (let row = 0; row < dustbinColumns.length; row++) {
			let tempColumnObj = CrossTab.cloneData(columnObj);

				// if (i === crossTabData.length - 1) {
				// 	tempColumnObj.displayData = CrossTab.getKeyWithPrefix(dustbinColumns[row], "col");
				// } else {
				// 	/*  Feature added to include Column field to the column header  */
				// 	if (row === dustbinColumns.length - 1) {
						tempColumnObj.displayData = CrossTab.getKeyWithPrefix(dustbinColumns[i], "col");;
				// 	}
				// }


			crossTabData[i].columnItems = [...tempColumns, ...crossTabData[i].columnItems];
		}
	};

	/*  To populate the cell(table body) with measure values. User doesn't added row fields  */
	const populateTableBodydataWithoutRow = () => {
		/*  TODO:: during measure swap, show measures in rows*/
		if (!showAsColumn) {
			chartDataCSV.rows = CrossTab.addDusbinValuesMeasuresInChartData(
				dustbinValues,
				chartDataCSV.rows
			);
		}

		let tempRowObj = CrossTab.cloneData(rowObj);
		let columnIndex = 0;

		columnIndex = dustbinColumns.length;

		if (crossTabData[columnIndex] && crossTabData[columnIndex].columnItems) {
			crossTabData[columnIndex].columnItems.forEach((item: any, colIndex: number) => {
				let tempColumnObj = CrossTab.cloneData(columnObj);
				let compareObj = CrossTab.cloneData(item.compareObj);

				if (dustbinValues.length === 1) {
					let _filteredData = CrossTab.getFilteredChartPropDataByCompareObject(
						formatedChartPropData,
						compareObj
					)[0];

					if (_filteredData) {
						let _key = CrossTab.getKeyWithPrefix(dustbinValues[0], "val");
						tempColumnObj.displayData = _filteredData[_key];
					} else {
						tempColumnObj.displayData = "";
					}
					tempColumnObj.columnSpan = item.columnSpan;
					tempColumnObj.compareObj = compareObj;
				} else {
					if (showAsColumn) {
						let _filteredData = CrossTab.getFilteredChartPropDataByCompareObject(
							formatedChartPropData,
							compareObj
						)[0];

						if (_filteredData) {
							tempColumnObj.displayData = _filteredData[item.displayData];
							compareObj[item.displayData] = tempColumnObj.displayData;
						} else {
							tempColumnObj.displayData = "";
						}
						tempColumnObj.columnSpan = item.columnSpan;
					} else {
						let _filteredData = CrossTab.getFilteredChartPropDataByCompareObject(
							formatedChartPropData,
							compareObj
						)[0];

						if (_filteredData) {
							let valueField = dustbinValues.find(

								(dustVal) =>
									CrossTab.getKeyWithPrefix(dustVal, "val") === item.displayData
							);

							let _key = CrossTab.getKeyWithPrefix(valueField, "val");
							tempColumnObj.displayData = _filteredData[_key];
						} else {
							tempColumnObj.displayData = "";
						}
						tempColumnObj.columnSpan = item.columnSpan;
					}
					tempColumnObj.compareObj = compareObj;
				}
				tempRowObj.columnItems.push(tempColumnObj);
				tempRowObj.index = tempRowObj.index + 1;
			});
			crossTabData.push(tempRowObj);
		}
	};

	const populateTableBodydata = (noValue?: boolean) => {
		if (!showAsColumn) {
			chartDataCSV.rows = CrossTab.addDusbinValuesMeasuresInChartData(
				dustbinValues,
				chartDataCSV.rows
			);
		}

		/*  From chart data collection need to run the loop for distinct rows */
		chartDataCSV.rows.forEach((row: any, rowIndex: number) => {
			let tempRowObj = CrossTab.cloneData(rowObj);
			let columnIndex = 0;

			if (noValue) {
				columnIndex = dustbinColumns.length - 1;
			} else {
				columnIndex = dustbinColumns.length;
			}

			if (crossTabData[columnIndex] && crossTabData[columnIndex].columnItems) {
				crossTabData[columnIndex].columnItems.forEach((item: any, colIndex: number) => {
					let tempColumnObj = CrossTab.cloneData(columnObj);
					let compareObj = CrossTab.cloneData(item.compareObj);
					let rowValues = row.split(CrossTab.delimiter);

					if (item.isRowField) {
						if (rowIndex === 0) {
							tempColumnObj.displayData = rowValues[colIndex];
							tempColumnObj.isHeaderField = true;
							compareObj[item.displayData] = tempColumnObj.displayData;
						} else {
							let lastColumnIndex = 0;

							lastColumnIndex = dustbinRows.length;

							if (!showAsColumn && dustbinValues.length > 1) {
								lastColumnIndex += 1;
							}

							if (lastColumnIndex - 1 !== colIndex) {
								// let previousRowData = CrossTab.getPreviousRowColumnData(
								// 	crossTabData,
								// 	dustbinColumns,
								// 	dustbinValues,
								// 	showAsColumn,
								// 	rowIndex,
								// 	colIndex
								// );

								//if (
								// 	previousRowData &&
								// 	previousRowData.displayData === rowValues[colIndex]
								// ) {
								// 	// previousRowData.rowSpan =
								// 	// 	rowIndex - parseInt(previousRowData.rowIndex) + 1;
								// 	// tempColumnObj.skip = true;
								// } else {
								tempColumnObj.displayData = rowValues[colIndex];
								compareObj[dustbinRows[colIndex].fieldname] =
									tempColumnObj.displayData;
								//	}
							} else {
								tempColumnObj.displayData = rowValues[colIndex];
								compareObj[dustbinRows[colIndex]?.fieldname] =
									tempColumnObj.displayData;
							}
						}
						tempColumnObj.isHeaderField = true;
						tempColumnObj.isRowField = true;
						tempColumnObj.compareObj = compareObj;
					} else {
						if (noValue) {
							tempColumnObj.displayData = "";
							tempColumnObj.columnSpan = 1;
						} else if (dustbinValues.length === 1) {
							for (let i = 0; i < dustbinRows.length; i++) {
								compareObj[CrossTab.getKeyWithPrefix(dustbinRows[i], "row")] =
									rowValues[i];
							}

							let _filteredData = CrossTab.getFilteredChartPropDataByCompareObject(
								formatedChartPropData,
								compareObj
							)[0];

							if (_filteredData) {
								let _key = CrossTab.getKeyWithPrefix(dustbinValues[0], "val");
								tempColumnObj.displayData = _filteredData[_key];

								let _compareObj = CrossTab.cloneData(compareObj);
								_compareObj[_key] = _filteredData[_key];
								tempColumnObj.compareObj = _compareObj;
							} else {
								tempColumnObj.displayData = "";
							}
							tempColumnObj.columnSpan = item.columnSpan;
						} else {
							for (let i = 0; i < dustbinRows.length; i++) {
								compareObj[CrossTab.getKeyWithPrefix(dustbinRows[i], "row")] =
									rowValues[i];
							}

							if (showAsColumn) {
								let _filteredData =
									CrossTab.getFilteredChartPropDataByCompareObject(
										formatedChartPropData,
										compareObj
									)[0];

								if (_filteredData) {
									tempColumnObj.displayData = _filteredData[item.displayData];

									let _compareObj = CrossTab.cloneData(compareObj);
									_compareObj[item.displayData] = _filteredData[item.displayData];
									tempColumnObj.compareObj = _compareObj;
								} else {
									tempColumnObj.displayData = "";
								}
								tempColumnObj.columnSpan = item.columnSpan;
							} else {
								let _filteredData =
									CrossTab.getFilteredChartPropDataByCompareObject(
										formatedChartPropData,
										compareObj
									)[0];

								if (_filteredData) {
									let tempValue =
										rowValues[row.split(CrossTab.delimiter).length - 2];
									let valueField = dustbinValues.find(
										(dustVal) =>
											CrossTab.getKeyWithPrefix(dustVal, "val") === tempValue
									);

									let _key = CrossTab.getKeyWithPrefix(valueField, "val");
									tempColumnObj.displayData = _filteredData[_key];

									let _compareObj = CrossTab.cloneData(compareObj);
									_compareObj[_key] = _filteredData[_key];
									tempColumnObj.compareObj = _compareObj;
								} else {
									tempColumnObj.displayData = "";
								}
								tempColumnObj.columnSpan = item.columnSpan;
							}
						}
					}
					tempColumnObj.rowIndex = rowIndex;
					tempRowObj.columnItems.push(tempColumnObj);
					tempRowObj.index = tempRowObj.index + 1;
				});
				crossTabData.push(tempRowObj);
			}
		});
	};

	/*
    Push Dusbin Values Measures into crossTabData Header Area collection
*/

	const addMeasureValuesInColumnHeaderArea = () => {
		if (dustbinValues.length > 0) {
			let tempRowObj = CrossTab.cloneData(rowObj);
			let previousColumnItems = crossTabData[crossTabData.length - 1].columnItems;

			for (let i = 0; i < previousColumnItems.length; i++) {
				let _chartDataObj: any = {};
				dustbinValues.forEach(val => {
					let tempColumnObj = CrossTab.cloneData(columnObj);
					tempColumnObj.displayData = CrossTab.getKeyWithPrefix(
						val,
						"val",
						_chartDataObj
					); /*	Set Unique field display name	*/
					tempColumnObj.agg = val.agg;
					tempColumnObj.compareObj = previousColumnItems[i].compareObj;
					tempColumnObj.isHeaderField = true;
					tempRowObj.columnItems.push(tempColumnObj);

					_chartDataObj[tempColumnObj.displayData] = "";
				});
			}
			crossTabData.push(tempRowObj);
		}
	};

	const constructColumnHeaderArea = () => {
		for (let i = 0; i < dustbinColumns.length; i++) {
			if (i === 0) {
				// let tempColumnObj = CrossTab.cloneData(columnObj);
				let tempRowObj = CrossTab.cloneData(rowObj);

				let _headerColumnList = CrossTab.getColumnList(i, chartDataCSV.columns);
				tempRowObj.columnList.push(_headerColumnList);

				_headerColumnList.forEach(col => {
					let tempColumnObj = CrossTab.cloneData(columnObj);
					tempColumnObj.displayData = col;
					tempColumnObj.compareObj[CrossTab.getKeyWithPrefix(dustbinColumns[i], "col")] =
						col;
					tempColumnObj.isHeaderField = true;
					tempRowObj.columnItems.push(tempColumnObj);
				});
				crossTabData.push(tempRowObj);
			} else {
				let tempRowObj = CrossTab.cloneData(rowObj);

				for (let colItem = 0; colItem < crossTabData[i - 1].columnItems.length; colItem++) {
					let _currentCompObj = crossTabData[i - 1].columnItems[colItem].compareObj;

					let list = CrossTab.getFilteredChartPropDataByCompareObject(
						formatedChartPropData,
						_currentCompObj
					);
					/*  For each row there can be may Chat data objects, so based on the Dusbin column index need to filter distinct Column headers*/
					let distinctList = CrossTab.getDistinctList(
						dustbinColumns,
						_currentCompObj,
						i,
						list
					);

					/* IMPROMENT

         let _list = chartDataCSV.columns.filter(item => item.includes(crossTabData[i].columnItems[colItem].displayData))

         CrossTab.getColumnList(i, _list).forEach() --> form comp obj then filter using "getFilteredChartPropDataByCompareObject"
         */

					distinctList = distinctList || [];
					tempRowObj.columnList.push(distinctList);

					distinctList.forEach(item => {
						let tempColumnObj = CrossTab.cloneData(columnObj);
						let tempCompareObj = CrossTab.cloneData(_currentCompObj);
						tempColumnObj.displayData =
							item[CrossTab.getKeyWithPrefix(dustbinColumns[i], "col")];
						tempCompareObj[CrossTab.getKeyWithPrefix(dustbinColumns[i], "col")] =
							tempColumnObj.displayData;
						tempColumnObj.compareObj = tempCompareObj;
						tempColumnObj.parentColumnSpan = distinctList.length;
						tempRowObj.columnItems.push(tempColumnObj);
						tempColumnObj.isHeaderField = true;
					});
				}
				crossTabData.push(tempRowObj);
			}
		}

		if (showAsColumn) {
			addMeasureValuesInColumnHeaderArea();
		}
	};

	/*  Construct crossTabData object to show chart for atleat one field in all 3 dustbins  */
	const showChartForAtleastOneDusbinField = (noValue?: boolean) => {
		constructColumnHeaderArea();
		updateColSpan(noValue);
		appendRowsFieldsAsColumns();
		populateTableBodydata(noValue);
	};

	/*  Construct crossTabData object to show chart with column fields only  */
	const showColumnsOnlyChart = () => {
		constructColumnHeaderArea();
		updateColSpan(true);
		appendRowsFieldsAsColumnsForColumnOnly();
	};

	/*  Construct crossTabData object to show chart with row fields only  */
	const showRowsOnlyChart = () => {
		let tempRowObj1 = CrossTab.cloneData(rowObj);

		dustbinRows.forEach(rowItem => {
			let tempColumnObj = CrossTab.cloneData(columnObj);
			tempColumnObj.displayData = CrossTab.getKeyWithPrefix(rowItem, "row");
			tempColumnObj.isHeaderField = true;
			tempRowObj1.columnItems.push(tempColumnObj);
		});

		crossTabData.push(tempRowObj1);

		for (let i = 0; i < chartDataCSV.rows.length; i++) {
			let tempRowObj = CrossTab.cloneData(rowObj);
			let compObj: any = {};
			let rowItemArray = chartDataCSV.rows[i].split(CrossTab.delimiter);

			rowItemArray.forEach((val: any, index: number) => {
				if (val) {
					let tempColumnObj = CrossTab.cloneData(columnObj);
					compObj[CrossTab.getKeyWithPrefix(dustbinRows[index], "row")] = val;

					// let previousRowData = CrossTab.getPreviousRowColumnData(
					// 	crossTabData,
					// 	dustbinColumns,
					// 	dustbinValues,
					// 	showAsColumn,
					// 	i,
					// 	index
					// );

					// if (previousRowData && previousRowData.displayData === val) {
					// 	// if (index + 2 !== rowItemArray.length) {
					// 	// 	previousRowData.rowSpan = i - parseInt(previousRowData.rowIndex) + 1;
					// 	// 	tempColumnObj.skip = true;
					// 	// } else {
					// 	// 	previousRowData.rowSpan = 1;
					// 	// 	tempColumnObj.displayData = val;
					// 	// }
					// } else {
					tempColumnObj.displayData = val;
					tempColumnObj.isRowField = true;
					//}
					tempColumnObj.compareObj = compObj;

					tempColumnObj.rowIndex = i;
					tempRowObj.columnItems.push(tempColumnObj);
				}
			});

			crossTabData.push(tempRowObj);
		}

		defaultTemplate = false;
	};

	/*  Construct crossTabData object to show chart with value/measure fields only  */

	const showValuesOnlyChart = () => {
		if (showAsColumn) {
			let tempRowObj1 = CrossTab.cloneData(rowObj);
			let _chartDataObj: any = {};

			dustbinValues.forEach(rowItem => {
				let tempColumnObj = CrossTab.cloneData(columnObj);
				tempColumnObj.displayData = CrossTab.getKeyWithPrefix(
					rowItem,
					"val",
					_chartDataObj
				); /*	Set Unique field display name	*/
				tempColumnObj.isHeaderField = true;
				tempRowObj1.columnItems.push(tempColumnObj);

				_chartDataObj[tempColumnObj.displayData] = "";
			});

			crossTabData.push(tempRowObj1);

			let tempRowObj = CrossTab.cloneData(rowObj);
			Object.keys(formatedChartPropData[0]).forEach((key, idx) => {
				let tempColumnObj = CrossTab.cloneData(columnObj);
				tempColumnObj.displayData = formatedChartPropData[0][key];

				let _compareObj: any = {};
				_compareObj[key] = tempColumnObj.displayData;
				tempColumnObj.compareObj = _compareObj;

				tempRowObj.columnItems.push(tempColumnObj);
			});

			crossTabData.push(tempRowObj);
		} else {
			Object.keys(formatedChartPropData[0]).forEach(key => {
				let tempRowObj = CrossTab.cloneData(rowObj);
				let tempColumnObj = CrossTab.cloneData(columnObj);

				tempColumnObj.displayData = key;
				tempColumnObj.isHeaderField = true;
				tempRowObj.columnItems.push(tempColumnObj);

				tempColumnObj = CrossTab.cloneData(columnObj);

				tempColumnObj.displayData = formatedChartPropData[0][key];
				tempRowObj.columnItems.push(tempColumnObj);

				crossTabData.push(tempRowObj);
			});
		}

		defaultTemplate = false;
	};

	/*  Construct crossTabData object to show chart with value/measure fields and column fields  */
	const showColumnsAndValuesChart = () => {
		constructColumnHeaderArea();
		updateColSpan();
		populateTableBodydataWithoutRow();
		appendRowsFieldsAsColumnsForColumnOnly();

		//defaultTemplate = false;
	};

	const addColumnItemsFromRowBoj = (dustbinList: any, tempRowObj1: any, dusbinName: string) => {
		let _chartDataObj: any = {};

		dustbinList.forEach((rowItem: any) => {
			let tempColumnObj = CrossTab.cloneData(columnObj);
			tempColumnObj.displayData = CrossTab.getKeyWithPrefix(
				rowItem,
				dusbinName,
				_chartDataObj
			); /*	Set Unique field display name	*/
			tempColumnObj.isHeaderField = true;
			tempRowObj1.columnItems.push(tempColumnObj);

			_chartDataObj[tempColumnObj.displayData] = "";
		});
	};

	/*  Construct crossTabData object to show chart with value/measure fields and row fields  */
	const showRowsAndValuesChart = () => {
		let tempRowObj1 = CrossTab.cloneData(rowObj);

		addColumnItemsFromRowBoj(dustbinRows, tempRowObj1, "row");
		addColumnItemsFromRowBoj(dustbinValues, tempRowObj1, "val");

		crossTabData.push(tempRowObj1);

		let columnsHeader: string[] = [];
		tempRowObj1.columnItems.forEach((item:any)=>{
			columnsHeader.push(item?.displayData)
		})

		formatedChartPropData.forEach((data, index) => {
			let tempRowObj = CrossTab.cloneData(rowObj);
			let compObj: any = {};

			columnsHeader.forEach((key, pos) => {
				let tempColumnObj = CrossTab.cloneData(columnObj);

				if (pos > dustbinRows.length - 1) {
					tempColumnObj.displayData = data[key];
				} else {
					// let previousRowData = CrossTab.getPreviousRowColumnData(
					// 	crossTabData,
					// 	dustbinColumns,
					// 	dustbinValues,
					// 	showAsColumn,
					// 	index,
					// 	pos,
					// 	true
					// );

					// if (previousRowData && previousRowData.displayData === data[key]) {
					// 	// previousRowData.rowSpan = index - parseInt(previousRowData.rowIndex) + 1;
					// 	// tempColumnObj.skip = true;
					// } else {
					tempColumnObj.displayData = data[key];
					tempColumnObj.isRowField = true;
					tempColumnObj.isHeaderField = true;
					//}
				}

				if (!tempColumnObj.isHeaderField && !tempColumnObj.isRowField) {
					dustbinValues.forEach(field => {
						delete compObj[field.fieldname + "__" + field.agg];
					});

					compObj[key] = data[key];
				} else {
					compObj[key] = data[key];
				}

				tempColumnObj.compareObj = CrossTab.cloneData(compObj);
				tempColumnObj.rowIndex = index;
				tempRowObj.columnItems.push(tempColumnObj);
			});

			tempRowObj.index = index;
			crossTabData.push(tempRowObj);
		});

		defaultTemplate = false;
	};

	/*  Construct crossTabData object to show chart with column and row fields  */

	const showColumnsAndRowsChart = () => {
		showChartForAtleastOneDusbinField(true);
		defaultTemplate = false;
	};

	/*  To determine how to construct CrossTabData object based dustbin fields count */
	const showAtleastOneEmptyDusbinFieldsChart = () => {
		if (dustbinColumns.length === 0 && dustbinRows.length > 0 && dustbinValues.length > 0) {
			showRowsAndValuesChart();
		} else if (
			dustbinColumns.length > 0 &&
			dustbinRows.length === 0 &&
			dustbinValues.length > 0
		) {
			showColumnsAndValuesChart();
		} else if (
			dustbinColumns.length > 0 &&
			dustbinRows.length > 0 &&
			dustbinValues.length === 0
		) {
			showColumnsAndRowsChart();
		} else if (
			dustbinColumns.length === 0 &&
			dustbinRows.length === 0 &&
			dustbinValues.length > 0
		) {
			showValuesOnlyChart();
		} else if (
			dustbinColumns.length > 0 &&
			dustbinRows.length === 0 &&
			dustbinValues.length === 0
		) {
			showColumnsOnlyChart();
		} else if (
			dustbinColumns.length === 0 &&
			dustbinRows.length > 0 &&
			dustbinValues.length === 0
		) {
			showRowsOnlyChart();
		} else {
			defaultTemplate = true;
		}
	};

	/* To determine to show chart  */
	if (formatedChartPropData.length > 0) {
		enable = true;

		formatedChartPropData.forEach(data => {
			let _combineRow = "",
				_combineColumn = "";

			dustbinRows.forEach(rowField => {
				_combineRow = _combineRow.concat(
					data[CrossTab.getKeyWithPrefix(rowField, "row")],
					CrossTab.delimiter
				);
			});

			dustbinColumns.forEach(colField => {
				_combineColumn = _combineColumn.concat(
					data[CrossTab.getKeyWithPrefix(colField, "col")],
					CrossTab.delimiter
				);
			});

			if (_combineRow && !chartDataCSV.rows.includes(_combineRow)) {
				chartDataCSV.rows.push(_combineRow);
			}

			if (_combineColumn && !chartDataCSV.columns.includes(_combineColumn)) {
				chartDataCSV.columns.push(_combineColumn);
			}
		});

		/*  To determine how to construct CrossTabData object based dustbin fields count */
		if (dustbinColumns.length > 0 && dustbinRows.length > 0 && dustbinValues.length > 0) {
			showChartForAtleastOneDusbinField();
			defaultTemplate = false;
		} else {
			showAtleastOneEmptyDusbinFieldsChart();
		}
	} else {
		enable = false;
	}

	/*
  Render function
  */

	return (
		<div
			style={{
				width: graphDimension.width,
				height: graphDimension.height,
			}}
		>
			{/* TODO:: feature to swap measures to Rows / Columns. Default to show as columns.
        dustbinValues.length > 1 && dustbinRows.length > 0 && dustbinColumns.length > 0 ? (
        <button onClick={(e) => setShowAsColumn(!showAsColumn)}>Swap Measures</button>
      ) : null */}
			{enable ? (
				defaultTemplate ? (
					<div
						style={{ overflowX: "scroll", maxWidth: "1100px", maxHeight: "500px" }}
					></div>
				) : (
					<BuildTable
						crossTabData={crossTabData}
						dustbinRows={dustbinRows}
						dustbinValues={dustbinValues}
						dustbinColumns={dustbinColumns}
						formatedChartPropData={formatedChartPropData}
						chartControls={chartControls}
						chartProperties={chartProperties}
						propKey={propKey}
					></BuildTable>
				)
			) : null}
		</div>
	);
};

const mapStateToProps = (state: ChartsMapStateToProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		chartProperties: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(TableChart);
