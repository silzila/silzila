// import React from "react";
// import { registerMap } from "echarts";
// import ReactEcharts from "echarts-for-react";
// import USA from "../../assets/USA.json";
// import countries from "../../assets/countries.json";
// import { mapData } from "./data";

// const option = {
// 	geo: {
// 		map: "countries",
// 		label: {
// 			normal: {
// 				show: true,
// 				textStyle: {
// 					color: "#feffff",
// 					fontSize: 10,
// 				},
// 			},
// 			emphasis: {
// 				show: true,
// 				textStyle: {
// 					color: "#feffff",
// 					fontSize: 10,
// 				},
// 			},
// 		},
// 		roam: false,
// 		zoom: 1.2,
// 		itemStyle: {
// 			normal: {
// 				areaColor: "#eee",
// 				borderColor: "#1a5cb5",
// 				borderWidth: 2,
// 			},
// 			emphasis: {
// 				areaColor: "#ed860d",
// 				shadowOffsetX: 0,
// 				shadowOffsetY: 0,
// 				shadowBlur: 20,
// 				borderWidth: 0,
// 				shadowColor: "rgba(0, 0, 0, 0.5)",
// 			},
// 		},
// 		zlevel: 1,
// 	},
// 	visualMap: {
// 		left: "right",
// 		min: 500000,
// 		max: 38000000,
// 		inRange: {
// 			color: [
// 				"#313695",
// 				"#4575b4",
// 				"#74add1",
// 				"#abd9e9",
// 				"#e0f3f8",
// 				"#ffffbf",
// 				"#fee090",
// 				"#fdae61",
// 				"#f46d43",
// 				"#d73027",
// 				"#a50026",
// 			],
// 		},
// 	},
// 	series: [
// 		{
// 			name: "foo",
// 			type: "map",
// 			geoIndex: 0,
// 			data: mapData,
// 			zlevel: 3,
// 		},
// 		{
// 			name: "bar",
// 			type: "effectScatter",
// 			animation: false,
// 			// data: pointData,
// 			coordinateSystem: "geo",
// 			showEffectOn: "render",
// 			rippleEffect: {
// 				scale: 3,
// 				brushType: "fill",
// 			},
// 			itemStyle: {
// 				normal: {
// 					color: "red",
// 					shadowBlur: 5,
// 					shadowColor: "red",
// 				},
// 			},
// 			zlevel: 1,
// 		},
// 	],
// };

// registerMap(
// 	"countries",
// 	countries,

// 	{
// 		Alaska: {
// 			left: -131,
// 			top: 25,
// 			width: 15,
// 		},
// 		Hawaii: {
// 			left: -110,
// 			top: 28,
// 			width: 5,
// 		},
// 		"Puerto Rico": {
// 			left: -76,
// 			top: 26,
// 			width: 2,
// 		},
// 	}
// );

// const GeoChart = () => {
// 	return <ReactEcharts option={option} />;
// };

// export default GeoChart;
import React from "react";

const GeoChart = () => {
	return <div>GeoChart</div>;
};

export default GeoChart;
