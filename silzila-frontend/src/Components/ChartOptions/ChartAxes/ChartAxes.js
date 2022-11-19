// This component houses the dropzones for table fields
// Number of dropzones and its name is returned according to the chart type selected.
// Once minimum number of fields are met for the given chart type, server call is made to get chart data and saved in store

import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import ChartsInfo from "./ChartsInfo2";
import "./ChartAxes.css";
import DropZone from "./DropZone";
import FetchData from "../../ServerCall/FetchData";
import { updateChartData } from "../../redux/ChartProperties/actionsChartControls";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import { canReUseData, toggleAxesEdited } from "../../redux/ChartProperties/actionsChartProperties";


// format the chartAxes into the way it is needed for api call
export const getChartData = async (axesValues, chartProp, propKey, token) => {

/*	PRS 21/07/2022	Construct filter object for service call */	
const getChartLeftFilter = () => {
  let _type = {};

  let _chartProp = chartProp.properties[propKey].chartAxes[0];

  _type.panel_name = "chart_filters";
  _type.any_condition_match = _chartProp.any_condition_match || false;
  _type.filters = [];

  /*	To determine filter type	*/
  const _getFilterType = (item) => {
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
  const _getUserSelection = (item) => {
    if (item.fieldtypeoption === "Search Condition") {
      if (item.exprType === "between" && (item.greaterThanOrEqualTo || item.lessThanOrEqualTo)) {
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

  const _isInvalidValue = (val)=>{

	if(val === undefined || val === null || val === "")
	{
		return true
	}

	return false;
  }

  /*	Determine whether to add a particular field	*/
  const _getIsFilterValidToAdd = (item) => {
    if (item.fieldtypeoption === "Pick List" && item.userSelection) {
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
	  
		if (item.exprType === "between" && (_isInvalidValue(item.greaterThanOrEqualTo) || _isInvalidValue(item.lessThanOrEqualTo))) {
			return false;
		} else if (item.exprType !== "between" && _isInvalidValue(item.exprInput)) {
			return false;
		}
	}

    return true;
  };

  /*	Iterate through each fileds added in the Filter Dropzone	*/
  _chartProp.fields.forEach((item) => {
    let _filter = {};
    _filter.filter_type = _getFilterType(item);
    _filter.table_id = item.tableId;
    _filter.field_name = item.fieldname;
    _filter.data_type = item.dataType;
    _filter.exclude = item.includeexclude === "Exclude";

    if (item.fieldtypeoption === "Search Condition") {
      if (item.exprType) {
        _filter.condition = item.exprType;
      } else {
        _filter.condition = item.dataType === "text" ? "begins_with" : "greater_than";
      }
    }

    if (item.dataType === "timestamp" || item.dataType === "date") {
      _filter.time_grain = item.prefix;
    }

    _filter.user_selection = _getUserSelection(item);

    if (_getIsFilterValidToAdd(item)) {
      _type.filters.push(_filter);
    }
  });

  return _type;
};

/*	PRS 21/07/2022 */

	var formattedAxes = {};
	axesValues.forEach((axis) => {
		var dim = "";
		switch (axis.name) {
			case "Filter":
				dim = "filters";
				break;

			case "Dimension":
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

		var formattedFields = [];

		axis.fields.forEach((field) => {
			var formattedField = {
				table_id: field.tableId,
				display_name: field.displayname,
				field_name: field.fieldname,
				data_type: field.dataType,
			};
			if (field.dataType === "date" || field.dataType === "timestamp") {
				formattedField.time_grain = field.time_grain;
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
		formattedAxes.dims = [];
	}

	formattedAxes.filters = [];

	/*	PRS 21/07/2022	Get filter object and pushed to request body object	*/

	let _filterZoneFields = chartProp.properties[propKey].chartAxes[0].fields;
	let _hasInvalidFilterData = _filterZoneFields.filter(field=> field.isInValidData);

	if(_filterZoneFields.length > 0 && _hasInvalidFilterData && _hasInvalidFilterData.length > 0){
		console.log("Filter has invalid data.");
	}
	else{
		let _filterObj = getChartLeftFilter();

		if(_filterObj.filters.length > 0){
			formattedAxes.filters.push(_filterObj);
		}
	
		console.log(JSON.stringify(formattedAxes));
	
		/*	PRS 21/07/2022	*/
	
	
		var res = await FetchData({
			requestType: "withData",
			method: "POST",
			url:
				"ds/query/" +
				chartProp.properties[propKey].selectedDs.dc_uid +
				"/" +
				chartProp.properties[propKey].selectedDs.ds_uid,
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			data: formattedAxes,
		});
	
		if (res.status) {
			if(res.data && res.data.result.length > 0)
			{
				return res.data;
			}
			else{
				console.log("Change filter conditions.");
			}
			
		} else {
			console.log("Get Table Data Error", res.data.detail);
		}
	}	
};

// given chart type, check if the dropzones have required number of fields
export const checkMinRequiredCards = (chartProp, propKey) => {
	var minReqMet = [];
	ChartsInfo[chartProp.properties[propKey].chartType].dropZones.forEach((zone, zoneI) => {
		chartProp.properties[propKey].chartAxes[zoneI].fields.length >= zone.min
			? minReqMet.push(true)
			: minReqMet.push(false);
	});

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

	// dispatch
	updateChartData,
	toggleAxesEdit,
	reUseOldData,
}) => {
	const [loading, setLoading] = useState(false);

	var propKey = `${tabId}.${tileId}`;
	var dropZones = [];
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

		let serverCall = false;

		if (chartProp.properties[propKey].axesEdited) {
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
			var combinedValues = { name: "Measure", fields: [] };
			var values1 = axesValues[2].fields;
			var values2 = axesValues[3].fields;
			var allValues = values1.concat(values2);
			combinedValues.fields = allValues;
			axesValues.splice(2, 2, combinedValues);
		}

		if (
			chartProp.properties[propKey].chartType === "heatmap" ||
			chartProp.properties[propKey].chartType === "crossTab" ||
			chartProp.properties[propKey].chartType === "boxPlot"
		) {
			var combinedValues = { name: "Dimension", fields: [] };
			var values1 = axesValues[1].fields;
			var values2 = axesValues[2].fields;
			var allValues = values1.concat(values2);
			combinedValues.fields = allValues;
			axesValues.splice(1, 2, combinedValues);
		}

		if (serverCall) {
			setLoading(true);
			getChartData(axesValues, chartProp, propKey, token).then((data) => {
				updateChartData(propKey, data);
				setLoading(false);
			});
		}
	}, [chartProp.properties[propKey].chartAxes, chartProp.properties[propKey].chartType,chartProp.properties[propKey].filterRunState]);

	const resetStore = () => {
		toggleAxesEdit(propKey);
		reUseOldData(propKey);
	};

	return (
		<div className="charAxesArea">
			{dropZones.map((zone, zoneI) => (
				<DropZone bIndex={zoneI} name={zone} propKey={propKey} key={zoneI} />
			))}
			{loading ? <LoadingPopover /> : null}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		userFilterGroup: state.userFilterGroup,
		chartProp: state.chartProperties,
		token: state.isLogged.accessToken,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateChartData: (propKey, chartData) => dispatch(updateChartData(propKey, chartData)),
		toggleAxesEdit: (propKey) => dispatch(toggleAxesEdited(propKey, false)),
		reUseOldData: (propKey) => dispatch(canReUseData(propKey, false)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartAxes);
