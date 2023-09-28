// import ReactEcharts from "echarts-for-react";
// import { connect } from "react-redux";

// const StepLine = ({
// 	//props
// 	propKey,

// 	//state
// 	chartProp,
// }) => {
// 	var property = chartProp.properties[propKey];
// 	let chartData = property.chartData ? property.chartData.result : "";

// 	return (
// 		<>
// 			{chartData ? (
// 				<ReactEcharts
// 					option={{
// 						legend: {},
// 						tooltip: {},
// 						dataset: {
// 							dimensions: Object.keys(chartData[0]),
// 							source: chartData,
// 						},
// 						xAxis: { type: "category" },
// 						yAxis: {},
// 						series: [
// 							{
// 								type: "line",
// 							},
// 						],
// 					}}
// 				/>
// 			) : (
// 				""
// 			)}
// 		</>
// 	);
// };
// const mapStateToProps = (state) => {
// 	return {
// 		chartProp: state.chartProperties,
// 	};
// };

// export default connect(mapStateToProps, null)(StepLine);
import React from "react";

const StepLine = () => {
	return <div>StepLine</div>;
};

export default StepLine;
