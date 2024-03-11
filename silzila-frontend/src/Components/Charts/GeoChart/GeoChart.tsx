import React from "react";
//import { registerMap } from "echarts";
import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
// import USA from "../../assets/USA.json";
// import countries from "../../assets/countries.json";
//import { mapData } from "./data";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChartControlsProps, ChartConGeoChartControls } from "../../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../../ChartOptions/Color/ColorScheme";
import {
	formatChartLabelValue,
	formatChartYAxisValue,
} from "../../ChartOptions/Format/NumberFormatter";

import {
	ChartsMapStateToProps,
	ChartsReduxStateProps,
	FormatterValueProps,
} from "../ChartsCommonInterfaces";


import usaJson from './GeoJSON/USMapData.json';
import worldJSON from './GeoJSON/WorldData.json';
import indiaJSON from './GeoJSON/IndiaMapData.json';
import brazilJSON from './GeoJSON/BrazilMapData.json';
import chinaJSON from './GeoJSON/ChinaMapData.json';
import franceJSON from './GeoJSON/FranceMapData.json';
import germanyJSON from './GeoJSON/GermanyMapData.json';
import japanMapJSON from './GeoJSON/JapanMapData.json';
import australiaJSON from './GeoJSON/AustraliaMapData.json';
import southAfricaJSON from './GeoJSON/SouthAfricaMapData.json';
import ukJSON from './GeoJSON/UKMapData.json';
import nigeriaJSON from './GeoJSON/NigeriaMapData.json';

import {interpolateColor, generateRandomColorArray, fieldName, getLabelValues} from '../../CommonFunctions/CommonFunctions';


async function registerGeoMap(name: string){
	//https://code.highcharts.com/mapdata/
	//https://github.com/adarshbiradar/maps-geojson/tree/master/states
	var ROOT_PATH = 'https://echarts.apache.org/examples';
	var mapJSON:any = {};

	switch (name) {
		case 'usa':
			mapJSON = usaJson;
			break;
		case 'world':
			mapJSON = worldJSON;
			break;
		case 'india':
			mapJSON = indiaJSON;
			break;
		case 'brazil':
			mapJSON = brazilJSON;
			break;
		case 'china':
			mapJSON = chinaJSON;
			break;
		case 'france':
			mapJSON = franceJSON;
			break;
		case 'germany':
			mapJSON = germanyJSON;
			break;
		case 'nigeria':
			mapJSON = nigeriaJSON;
			break;
		case 'japan':
			mapJSON = japanMapJSON;
			break;
		case 'australia':			
			mapJSON = australiaJSON;
			break;
		case 'southAfrica':
			mapJSON = southAfricaJSON;
			break;
		case 'uk':
			mapJSON = ukJSON;
			break;
		default:
			mapJSON = worldJSON;
			break;
	}	


	if(name == 'usa'){
		echarts.registerMap(name, mapJSON, {
			Alaska: {     
			  left: -149,
			  top: 49,
			  width: 23
			},
			Hawaii: {
			  left: -141,
			  top: 28,
			  width: 5
			},
			'Puerto Rico': {     
			  left: -76,
			  top: 20,
			  width: 2
			}
		  });
	}
	else{
		echarts.registerMap(name, mapJSON, {});
	}	
}



const GeoChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControls,
	chartProperties
}: ChartsReduxStateProps) => {
	
	var chartControl: ChartControlsProps = chartControls.properties[propKey];

	var geoStyle: ChartConGeoChartControls =
		chartControls.properties[propKey].geoChartControls || {};

	let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];
	let mapData: any[] = [];
	let _dimensionField = chartProperties.properties[propKey].chartAxes[1];
	let _measureField = chartProperties.properties[propKey].chartAxes[2];
	let keyName = fieldName(_dimensionField.fields[0]);
	let valueName = fieldName(_measureField.fields[0]);	
	const [options, setOptions] = useState({});

	registerGeoMap(chartProperties.properties[propKey].geoLocation);

	//var property = chartControls.properties[propKey];
	//let chartPropData = property.chartData ? property.chartData : "";

	//const [formatedChartPropData, setFormatedChartPropData] = useState([]);
	//let tempFormatedChartPropData = JSON.parse(JSON.stringify(chartPropData));
	
	// useEffect(() => {
	// 	if (tempFormatedChartPropData) {
	// 		var chartDataKeys = Object.keys(tempFormatedChartPropData[0] || []);
	// 		let _formChartData: any = [];

	// 		tempFormatedChartPropData.forEach((item: any) => {
	// 			let formattedValue: any = {};

	// 			for (let i = 0; i < chartDataKeys.length; i++) {
	// 				/*  Need to format only numeric values  */
	// 				if (typeof item[chartDataKeys[i]] === "number") {
	// 					let _isMeasureField = _measureField.fields.find(field =>
	// 						chartDataKeys[i].includes(field.fieldname)
	// 					);
	// 					/*  Need to format Measure dustbin fields */
	// 					if (_isMeasureField && chartDataKeys[i].includes("of")) {
	// 						formattedValue[chartDataKeys[i]] = formatChartLabelValue(
	// 							property,
	// 							item[chartDataKeys[i]]
	// 						);
	// 					} else {
	// 						formattedValue[chartDataKeys[i]] = item[chartDataKeys[i]];
	// 					}
	// 				} else {
	// 					formattedValue[chartDataKeys[i]] = item[chartDataKeys[i]];
	// 				}
	// 			}

	// 			_formChartData.push(formattedValue);
	// 		});

	// 		setFormatedChartPropData(_formChartData);
	// 	}
	// }, [chartPropData, property.formatOptions]);

	const convertIntoMapData = ()=>{
		if(chartData && chartData.length > 0){
			mapData = chartData?.map(item=>{
				return {
					name : item[keyName]?.trim(),
					value : item[valueName] || 0
				}
			});	
		}			
	}

	const getMinAndMaxValue = (column: string) => {
		if(column && chartData){
			const valuesArray = chartData?.map((el: any) => {
				return el[column];
			});		
			const minValue = Number(Math.min(...valuesArray)).toFixed(2);
			const maxValue =  Number(Math.max(...valuesArray)).toFixed(2);	
	
			return { min: minValue, max: maxValue };
		}
		else{
			return {min: "0", max: "100"};
		}		
	};

	useEffect(() => {	
		let mapMinMax: any = getMinAndMaxValue(valueName);
		convertIntoMapData();

		setOptions({
			geo: {		
				map: chartProperties.properties[propKey].geoLocation,
				silent:false,
				aspectScale: geoStyle.aspectScale,
				show: true,
				emphasis:{
					focus: geoStyle.enableSelfEmphasis ? 'self' : 'normal'
				},
				select:{
					disabled : true
				},
				label: {
					normal: {
						show: graphDimension.height > 140 && graphDimension.height > 150
						? chartControl.labelOptions.showLabel
						: false,
						textStyle: {
							color: chartControl.labelOptions.labelColorManual
							? chartControl.labelOptions.labelColor
							: null,
							fontSize: chartControl.labelOptions.fontSize - 4,
						},
					},
					emphasis: {
						show: graphDimension.height > 140 && graphDimension.height > 150
						? chartControl.labelOptions.showLabel
						: false,
						textStyle: {
							color: chartControl.labelOptions.labelColorManual
							? chartControl.labelOptions.labelColor
							: null,
							fontSize: chartControl.labelOptions.fontSize - 4,
						},
					},
				},
				roam: true,
				zoom: geoStyle.mapZoom,
				itemStyle: {
					normal: {
						areaColor:  geoStyle.areaColor,
						borderColor:  geoStyle.borderColor,
						borderWidth:  geoStyle.boderWidth,
					},
					emphasis: {
						areaColor:  geoStyle.emphasisAreaColor,
						shadowOffsetX: 0,
						shadowOffsetY: 0,
						shadowBlur: 20,
						borderWidth: 0,
						shadowColor: "rgba(0, 0, 0, 0.5)",
					},
				},
				zlevel: 1,
			},
			/* null / {}	*/
			tooltip: chartControls.properties[propKey].mouseOver.enable ? {
				trigger: 'item',
				showDelay: 0,
				transitionDuration: 0.2
			  } : null,
			visualMap: chartData && chartData.length > 0  ? {
				left: 'right',
				min: geoStyle.minValue === '' ? Number(isNaN(mapMinMax.min) ? 0 : mapMinMax.min) : isNaN(Number(geoStyle.minValue)) ? 0 : Number(geoStyle.minValue),
				max: geoStyle.maxValue === '' ?  Number(isNaN(mapMinMax.max) ? 100 : mapMinMax.max) :isNaN(Number(geoStyle.maxValue)) ? 100 : Number(geoStyle.maxValue),
				inRange: {
					color: interpolateColor(geoStyle.minColor, geoStyle.maxColor, 20),
				},
				text: ['Max', 'Min'],
				calculable: true,
				show: geoStyle.showVisualScale
			} : null,		
			series: [
				{
					name: valueName,
					type: "map",
					roam: true,
					map: 'USA',
					geoIndex: 0,
					data: mapData || [],
					zlevel: 3,					
				},
				
			],
		})

	}, [chartData, chartControl,chartProperties ]);



	const RenderChart = () => {		
		return (
			<ReactEcharts option={options} style={{ width: graphDimension.width, height: graphDimension.height }} />
		)	
	};	
	 

	return <RenderChart />;
};

const mapStateToProps = (state: ChartsMapStateToProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		chartProperties: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(GeoChart);

