// This component houses the dropzones for table fields
// Number of dropzones and its name is returned according to the chart type selected.
// Once minimum number of fields are met for the given chart type, server call is made to get chart data and saved in store

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ChartsInfo from "./ChartsInfo2";
import "./ChartAxes.css";
import DropZone from "./DropZone";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import { Dispatch } from "redux";
import { updateChartData } from "../../redux/ChartPoperties/ChartControlsActions";
import { canReUseData, toggleAxesEdited } from "../../redux/ChartPoperties/ChartPropertiesActions";
import FetchData from "../ServerCall/FetchData";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AxesValuProps, ChartAxesFormattedAxes, ChartAxesProps } from "./ChartAxesInterfaces";
import {
	ChartPropertiesProps,
	ChartPropertiesStateProps,
} from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import {chartFilterGroupEdited} from "../../redux/ChartFilterGroup/ChartFilterGroupStateActions";
import {ChartFilterGroupProps, ChartFilterGroupStateProps} from "../../redux/ChartFilterGroup/ChartFilterGroupInterface";

// format the chartAxes into the way it is needed for api call
export const getChartData = async (
	axesValues: AxesValuProps[],
	chartProp: ChartPropertiesProps,
	chartGroup:ChartFilterGroupProps,
	propKey: string,
	token: string,
	forQueryData?: boolean
) => {
	/*	PRS 21/07/2022	Construct filter object for service call */
	const getChartLeftFilter = (filters:any) => {
		let _type: any = {};

		//let _chartProp = chartProp.properties[propKey].chartAxes[0];
		let _chartProp = filters;

		_type.panelName = "chartFilters";
		_type.shouldAllConditionsMatch = !_chartProp.any_condition_match;
		_type.filters = [];

		/*	To determine filter type	*/
		const _getFilterType = (item: any) => {
			let _type = "";

			switch (item.dataType) {
				case "integer":
				case "decimal":
					_type = "number";
					break;
				case "timestamp":
				case "date":
					_type = "date";
					break;
				default:
					_type = "text";
					break;
			}

			return _type.concat(
				"_",
				item.fieldtypeoption === "Search Condition" ? "search" : "user_selection"
			);
		};

		/*	Set User Selection property */
		const _getUserSelection = (item: any) => {
			if (item.fieldtypeoption === "Search Condition") {
				if (
					item.exprType === "between" &&
					(item.greaterThanOrEqualTo || item.lessThanOrEqualTo)
				) {
					return [item.greaterThanOrEqualTo, item.lessThanOrEqualTo];
				} else if (item.exprInput) {
					return [item.exprInput];
				} else {
					return [""];
				}
			} else {
				return item.userSelection;
			}
		};

		const _isInvalidValue = (val: any) => {
			if (val === undefined || val === null || val === "") {
				return true;
			}

			return false;
		};

		/*	Determine whether to add a particular field	*/
		const _getIsFilterValidToAdd = (item: any) => {
			if (!item.fieldtypeoption) {
				return false;
			}

			if (
				item.fieldtypeoption === "Pick List" &&
				item.userSelection &&
				item.userSelection.length > 0
			) {
				return !item.userSelection.includes("(All)");
			} else if (item.fieldtypeoption === "Search Condition") {
				//   if (
				//     item.exprType === "between" &&
				//     item.greaterThanOrEqualTo &&
				//     item.lessThanOrEqualTo &&
				//     item.rawselectmembers?.length > 0
				//   ) {
				//     if (
				//       item.greaterThanOrEqualTo <= item.rawselectmembers[1] &&
				//       item.lessThanOrEqualTo >= item.rawselectmembers[item.rawselectmembers.length - 1]
				//     ){
				//       return false;
				// 	}
				//   } else

				if (
					item.exprType === "between" &&
					(_isInvalidValue(item.greaterThanOrEqualTo) ||
						_isInvalidValue(item.lessThanOrEqualTo))
				) {
					return false;
				} else if (item.exprType !== "between" && _isInvalidValue(item.exprInput)) {
					return false;
				}
			} else {
				return false;
			}

			return true;
		};

		let _items = [];

		if(_chartProp.fields)
			_items = _chartProp.fields
			else
			_items = _chartProp

		/*	Iterate through each fileds added in the Filter Dropzone	*/
		_items.forEach((item: any) => {
			let _filter: any = {};
			_filter.filterType = _getFilterType(item);
			_filter.tableId = item.tableId;
			_filter.fieldName = item.fieldname;
			_filter.dataType = item.dataType.toLowerCase();
			_filter.shouldExclude = item.includeexclude === "Exclude";

			if (item.fieldtypeoption === "Search Condition") {
				if (item.exprType) {
					_filter.operator = item.exprType;
				} else {
					_filter.operator = item.dataType === "text" ? "begins_with" : "greater_than";
				}
			} else {
				_filter.operator = "in";
			}

			if (item.dataType === "timestamp" || item.dataType === "date") {
				_filter.timeGrain = item.prefix;
			}

			_filter.userSelection = _getUserSelection(item);

			if (_getIsFilterValidToAdd(item)) {
				_type.filters.push(_filter);
			}
		});

		return _type;
	};

	/*	PRS 21/07/2022 */

	var formattedAxes: ChartAxesFormattedAxes = {};
	axesValues.forEach((axis: AxesValuProps) => {
		var dim = "";
		switch (axis.name) {
			case "Filter":
				dim = "filters";
				break;

			case "Dimension":
			case "Date":
			case "Row":
			case "Column":
				dim = "dimensions";
				break;

			case "Location":
				dim = "dims";
				break;

			case "Measure":
				dim = "measures";
				break;

			case "X":
				dim = "measures";
				break;

			case "Y":
				dim = "measures";
				break;
		}

		var formattedFields: any = [];

		axis.fields.forEach((field: any) => {
			var formattedField: any = {
				tableId: field.tableId,
				displayName: field.displayname,
				fieldName: field.fieldname,
				dataType: field.dataType.toLowerCase(),
			};
			if (field.dataType === "date" || field.dataType === "timestamp") {
				formattedField.timeGrain = field.timeGrain;
			}

			if (axis.name === "Measure") {
				formattedField.aggr = field.agg;
			}

			formattedFields.push(formattedField);
		});
		formattedAxes[dim] = formattedFields;
	});

	formattedAxes.fields = [];

	if (
		chartProp.properties[propKey].chartType === "funnel" ||
		chartProp.properties[propKey].chartType === "gauge"
	) {
		formattedAxes.dimensions = [];
	}

	formattedAxes.filterPanels = [];

	/*	PRS 21/07/2022	Get filter object and pushed to request body object	*/

	let _filterZoneFields = chartProp.properties[propKey].chartAxes[0].fields;
	let _hasInvalidFilterData = _filterZoneFields.filter((field: any) => field.isInValidData);

	if (_filterZoneFields.length > 0 && _hasInvalidFilterData && _hasInvalidFilterData.length > 0) {
		console.log("Filter has invalid data.");
	} else {
		let _filterObj = getChartLeftFilter(chartProp.properties[propKey].chartAxes[0]);

		if (_filterObj.filters.length > 0) {
			formattedAxes.filterPanels.push(_filterObj);
		} else {
			formattedAxes.filterPanels = [];
		}

		//chartGroup
		chartGroup.tabTile[propKey]?.forEach((grp:any)=>{
			let rightFilterObj = getChartLeftFilter(chartGroup.groups[grp].filters);

			if (rightFilterObj.filters.length > 0) {
				formattedAxes.filterPanels.push(rightFilterObj);
			}
		})

		var url: string = "";
		if (chartProp.properties[propKey].selectedDs.isFlatFileData) {
			url = `query?datasetid=${chartProp.properties[propKey].selectedDs.id}`;
		} else {
			url = `query?dbconnectionid=${chartProp.properties[propKey].selectedDs.connectionId}&datasetid=${chartProp.properties[propKey].selectedDs.id}`;
		}

		/*	PRS 21/07/2022	*/
		var res: any = await FetchData({
			requestType: "withData",
			method: "POST",
			url: url,
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			data: formattedAxes,
		});

		if (res.status) {
			if (res.data && res.data.length > 0) {
				if (forQueryData) {
					return formattedAxes;
				} else {
					return res.data;
				}
			} else {
				console.log("Change filter conditions.");
			}
		} else {
			console.error("Get Table Data Error", res.data.message);
		}
	}
};

// given chart type, check if the dropzones have required number of fields
export const checkMinRequiredCards = (chartProp: any, propKey: string) => {
	var minReqMet = [];
	ChartsInfo[chartProp.properties[propKey].chartType].dropZones.forEach(
		(zone: any, zoneI: number) => {
			chartProp.properties[propKey].chartAxes[zoneI].fields.length >= zone.min
				? minReqMet.push(true)
				: minReqMet.push(false);
		}
	);

	if (chartProp.properties[propKey].chartType === "crossTab") {
		if (
			chartProp.properties[propKey].chartAxes[1].fields.length > 0 ||
			chartProp.properties[propKey].chartAxes[2].fields.length > 0 ||
			chartProp.properties[propKey].chartAxes[3].fields.length > 0
		) {
			minReqMet.push(true);
		} else {
			minReqMet.push(false);
		}
	}

	if (minReqMet.includes(false)) {
		return false;
	} else {
		return true;
	}
};

const ChartAxes = ({
	// props
	tabId,
	tileId,

	// state
	token,
	chartProp,
	chartGroup,
	changeLocation,

	// dispatch
	updateChartData,
	toggleAxesEdit,
	reUseOldData,
	chartFilterGroupEdited
}: ChartAxesProps) => {
	const [loading, setLoading] = useState<boolean>(false);

	var propKey: string = `${tabId}.${tileId}`;
	var dropZones: any = [];
	for (let i = 0; i < ChartsInfo[chartProp.properties[propKey].chartType].dropZones.length; i++) {
		dropZones.push(ChartsInfo[chartProp.properties[propKey].chartType].dropZones[i].name);
	}

	// const usePrevious = (value) => {
	// 	const ref = useRef();
	// 	useEffect(() => {
	// 	  ref.current = value;
	// 	});
	// 	return ref.current;
	// }

	//   const {chartFilter} = chartProp.properties[propKey].chartAxes[0];
	//   const prevFilter = usePrevious({chartFilter});

	// every time chartAxes or chartType is changed, check if
	// new data must be obtained from server
	// check for minimum requirements in each dropzone for the given chart type
	// if not reset the data

	useEffect(() => {
		const axesValues = JSON.parse(JSON.stringify(chartProp.properties[propKey].chartAxes));

		//console.log(prevFilter);

		/*	To sort chart data	based on field name	*/
		const sortChartData = (chartData: any[]): any[] => {
			let result: any[] = [];

			if (chartData && chartData.length > 0) {
				let _zones: any = axesValues.filter((zones: any) => zones.name !== "Filter");
				//let _zonesFields:any = [];
				let _fieldTempObject: any = {};
				let _chartFieldTempObject: any = {};

				// _zones.forEach((zone:any)=>{
				// 	_zonesFields = [..._zonesFields, ...zone.fields]
				// });

				/*	Find and return field's new name	*/
				const findFieldName = (name: string, i: number = 2): string => {
					if (_fieldTempObject[`${name}(${i})`] !== undefined) {
						i++;
						return findFieldName(name, i);
					} else {
						return `${name}(${i})`;
					}
				};

				/*	Find and return field's new name	*/
				const findFieldIndexName = (name: string, i: number = 2): string => {
					if (_chartFieldTempObject[`${name}_${i}`] !== undefined) {
						i++;
						return findFieldIndexName(name, i);
					} else {
						return `${name}_${i}`;
					}
				};

				_zones.forEach((zoneItem: any) => {
					zoneItem.fields.forEach((field: any, index: number) => {
						let _nameWithAgg: string = "";

						if (zoneItem.name === "Measure") {
							if (field.dataType !== "date" && field.dataType !== "timestamp") {
								_nameWithAgg = field.agg
									? `${field.agg} of ${field.fieldname}`
									: field.fieldname;
							} else {
								let _timeGrain: string = field.timeGrain || "";
								_nameWithAgg = field.agg
									? `${field.agg} ${_timeGrain} of ${field.fieldname}`
									: field.fieldname;
							}
						} else {
							if (field.dataType !== "date" && field.dataType !== "timestamp") {
								_nameWithAgg = field.agg
									? `${field.agg} of ${field.fieldname}`
									: field.fieldname;
							} else {
								let _timeGrain: string = field.timeGrain || "";
								_nameWithAgg = _timeGrain
									? `${_timeGrain} of ${field.fieldname}`
									: field.fieldname;
							}
						}

						if (_chartFieldTempObject[field.fieldname] !== undefined) {
							let _name = findFieldIndexName(field.fieldname);

							field["NameWithIndex"] = _name;
							_chartFieldTempObject[_name] = "";
						} else {
							field["NameWithIndex"] = field.fieldname;
							_chartFieldTempObject[field.fieldname] = "";
						}

						if (_fieldTempObject[_nameWithAgg] !== undefined) {
							let _name = findFieldName(_nameWithAgg);

							field["NameWithAgg"] = _name;
							_fieldTempObject[_name] = "";
						} else {
							field["NameWithAgg"] = _nameWithAgg;
							_fieldTempObject[_nameWithAgg] = "";
						}
					});
				});

				chartData.forEach((data: any) => {
					let _chartDataObj: any = {};

					_zones.forEach((zoneItem: any) => {
						zoneItem.fields.forEach((field: any) => {
							_chartDataObj[field.NameWithAgg] = data[field.NameWithIndex];
						});
					});

					result.push(_chartDataObj);
				});
			}

			return result;
		};

		let serverCall = false;

		if (chartProp.properties[propKey].axesEdited || chartGroup.chartFilterGroupEdited) {
			if (chartProp.properties[propKey].reUseData) {
				serverCall = false;
			} else {
				var minReq = checkMinRequiredCards(chartProp, propKey);
				if (minReq) {
					serverCall = true;
				} else {
					updateChartData(propKey, "");
				}
			}
			resetStore();
		}

		if (chartProp.properties[propKey].chartType === "scatterPlot") {
			var combinedValuesForMeasure = { name: "Measure", fields: [] };
			var values1 = axesValues[2].fields;
			var values2 = axesValues[3].fields;
			var allValues = values1.concat(values2);
			combinedValuesForMeasure.fields = allValues;
			axesValues.splice(2, 2, combinedValuesForMeasure);
		}

		if (
			chartProp.properties[propKey].chartType === "heatmap" ||
			chartProp.properties[propKey].chartType === "crossTab" ||
			chartProp.properties[propKey].chartType === "boxPlot"
		) {
			var combinedValuesForDimension = { name: "Dimension", fields: [] };
			var values1 = axesValues[1].fields;
			var values2 = axesValues[2].fields;
			var allValues = values1.concat(values2);
			combinedValuesForDimension.fields = allValues;
			axesValues.splice(1, 2, combinedValuesForDimension);
		}

		if (serverCall) {
			setLoading(true);
			getChartData(axesValues, chartProp, chartGroup, propKey, token).then(data => {
				updateChartData(propKey, sortChartData(data));
				setLoading(false);
			});
		}
	}, [
		chartProp.properties[propKey].chartAxes,
		chartProp.properties[propKey].chartType,
		chartProp.properties[propKey].filterRunState,
		chartGroup.chartFilterGroupEdited
	]);

	const resetStore = () => {
		toggleAxesEdit(propKey);
		reUseOldData(propKey);
		chartFilterGroupEdited(false);
	};

	var menuItemStyle = {
		fontSize: "12px",
		padding: "2px 1rem",
		// borderBottom: "1px solid lightgray",
	};

	return (
		<div className="charAxesArea">
			{chartProp.properties[propKey].chartType === "geoChart" && (
				<div
					style={{ backgroundColor: "#d3d3d3", display: "flex", flexDirection: "column" }}
				>
					<span className="axisTitle"></span>
					<FormControl size="small" sx={{ margin: "0.5rem" }}>
						<InputLabel sx={{ fontSize: "12px", lineHeight: "1.5rem" }}>
							Select Map
						</InputLabel>
						<Select
							sx={{ fontSize: "14px", height: "1.5rem", backgroundColor: "white" }}
							label="Select Map"
							value={chartProp.properties[propKey].geoLocation}
							onChange={e => {
								console.log(e.target.value);
								changeLocation(propKey, e.target.value);
							}}
						>
							<MenuItem sx={menuItemStyle} value="world">
								World
							</MenuItem>

							<MenuItem sx={menuItemStyle} value="brazil">
								Brazil
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="china">
								China
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="france">
								France
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="germany">
								Germany
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="india">
								India
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="japan">
								Japan
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="nigeria">
								Nigeria
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="southAfrica">
								South Africa
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="uk">
								United Kingdom
							</MenuItem>
							<MenuItem sx={menuItemStyle} value="usa">
								USA
							</MenuItem>
						</Select>
					</FormControl>
				</div>
			)}
			{dropZones.map((zone: any, zoneI: any) => (
				<DropZone bIndex={zoneI} name={zone} propKey={propKey} key={zoneI} />
			))}
			{loading ? <LoadingPopover /> : null}
		</div>
	);
};

const mapStateToProps = (state: ChartPropertiesStateProps & isLoggedProps & ChartFilterGroupStateProps, ownProps: any) => {
	return {
		// tabTileProps: state.tabTileProps,
		// userFilterGroup: state.userFilterGroup,
		chartProp: state.chartProperties,
		token: state.isLogged.accessToken,
		chartGroup: state.chartFilterGroup

	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateChartData: (propKey: string, chartData: any) =>
			dispatch(updateChartData(propKey, chartData)),
		toggleAxesEdit: (propKey: string) => dispatch(toggleAxesEdited(propKey, false)),
		reUseOldData: (propKey: string) => dispatch(canReUseData(propKey, false)),
	chartFilterGroupEdited:(isEdited : boolean) =>
		dispatch(chartFilterGroupEdited(isEdited))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartAxes);
