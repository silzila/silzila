import React from "react";
//import { registerMap } from "echarts";
import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
// import USA from "../../assets/USA.json";
// import countries from "../../assets/countries.json";
//import { mapData } from "./data";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChartControlsProps } from "../../../redux/ChartPoperties/ChartControlsInterface";
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
			mapJSON = usaJson;
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

	let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];
	let mapData: any[] = [];
	let _dimensionField = chartProperties.properties[propKey].chartAxes[1];
	let _measureField = chartProperties.properties[propKey].chartAxes[2];

	let keyName = fieldName(_dimensionField.fields[0]);
	let valueName = fieldName(_measureField.fields[0]);

	const convertIntoMapData = ()=>{
		//[ 		{ name: 'Puerto Rico', value: 3667084 }, ];	
		if(chartData){
			mapData = chartData?.map(item=>{
				return {
					name : item[keyName],
					value : item[valueName]
				}
			});	
		}			
	}

	const getMinAndMaxValue = (column: string) => {
		if(column && chartControls.properties[propKey]?.chartData){
			const valuesArray = chartControls.properties[propKey]?.chartData?.map((el: any) => {
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

	let mapMinMax: any = getMinAndMaxValue(valueName);

	convertIntoMapData();
	registerGeoMap(chartProperties.properties[propKey].geoLocation);

	const option = {
		geo: {
			map: chartProperties.properties[propKey].geoLocation,
			label: {
				normal: {
					show: true,
					textStyle: {
						color: "#feffff",
						fontSize: 10,
					},
				},
				emphasis: {
					show: true,
					textStyle: {
						color: "#feffff",
						fontSize: 10,
					},
				},
			},
			roam: true,
			zoom: 1.2,
			itemStyle: {
				normal: {
					areaColor: "#eee",
					borderColor: "#1a5cb5",
					borderWidth: 2,
				},
				emphasis: {
					areaColor: "#ed860d",
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					shadowBlur: 20,
					borderWidth: 0,
					shadowColor: "rgba(0, 0, 0, 0.5)",
				},
			},
			zlevel: 1,
		},
		visualMap: {
			left: "right",
			min: Number(mapMinMax.min),
			max: Number(mapMinMax.max),
			inRange: {
				color: interpolateColor("#313695", "#a50026", 20),
			},
			text: ['High', 'Low'],
			calculable: true
		},
		series: [
			{
				name: "foo",
				type: "map",
				roam: true,
				map: 'USA',
				geoIndex: 0,
				data: mapData,
				zlevel: 3,
			},
			
		],
	};

	const RenderChart = () => {		
		return (
			<ReactEcharts option={option} style={{ width: graphDimension.width, height: graphDimension.height }} />
		)	
	};	
	 

	return <>{chartData.length >= 1 ? <RenderChart /> : ""}</>;
};

const mapStateToProps = (state: ChartsMapStateToProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		chartProperties: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(GeoChart);

