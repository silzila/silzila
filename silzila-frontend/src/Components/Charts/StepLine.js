import ReactEcharts from "echarts-for-react";
import { connect } from "react-redux";

const StepLine = ({
	//props
	propKey,

	//state
	chartProp,
}) => {
	var property = chartProp.properties[propKey];
	// console.log(property, "+++++ PROPERTY +++++");
	let chartData = property.chartData ? property.chartData.result : "";
	// console.log(chartData, "+++++ chartData +++++");

	return (
		<>
			{chartData ? (
				<ReactEcharts
					option={{
						legend: {},
						tooltip: {},
						dataset: {
							dimensions: Object.keys(chartData[0]),
							source: chartData,
						},
						xAxis: { type: "category" },
						yAxis: {},
						series: [
							{
								type: "line",
							},
						],
					}}
				/>
			) : (
				""
			)}
		</>
	);
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(StepLine);
