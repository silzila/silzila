// import React from "react";
// import LabelFormatting from "./LabelFormatting";
// import XAxisFormat from "./XAxisFormat";
// import YAxisFormat from "./YAxisFormat";

// const ChartFormat = ({ chartType }) => {
// 	return (
// 		<div className="optionsInfo">
// 			<LabelFormatting />

// 			{chartType === "scatterPlot" ? (
// 				<>
// 					<div
// 						style={{ borderTop: "1px solid rgb(211,211,211)", margin: "1rem 6% 1rem" }}
// 					></div>{" "}
// 					<XAxisFormat chartType={chartType} />{" "}
// 				</>
// 			) : null}

// 			{chartType !== "pie" &&
// 			chartType !== "donut" &&
// 			chartType !== "gauge" &&
// 			chartType !== "rose" &&
// 			chartType !== "crossTab" &&
// 			chartType !== "funnel" &&
// 			chartType !== "heatmap" ? (
// 				<>
// 					<div
// 						style={{ borderTop: "1px solid rgb(211,211,211)", margin: "1rem 6% 1rem" }}
// 					></div>
// 					<YAxisFormat chartType={chartType} />
// 				</>
// 			) : null}
// 		</div>
// 	);
// };

// export default ChartFormat;
import React from "react";

const ChartFormat = (props: any) => {
	return <div>ChartFormat</div>;
};

export default ChartFormat;
