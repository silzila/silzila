import LabelFormatting from "./LabelFormatting";
import XAxisFormat from "./XAxisFormat";
import YAxisFormat from "./YAxisFormat";

const ChartFormat = ({ chartType }: { chartType: string }) => {
	console.log('The chart type is ', chartType)

	return (
		<div className="optionsInfo" style={{ paddingTop: "6px" }}>

			<LabelFormatting />

			{/* {chartType === "scatterPlot" ? (
				<>
					<div
						style={{ borderTop: "1px solid rgb(211,211,211)", margin: "1rem 6% 1rem" }}
					></div>{" "}
					<XAxisFormat />{" "}
				</>
			) : null}

			{chartType !== "pie" &&
				chartType !== "donut" &&
				chartType !== "gauge" &&
				chartType !== "rose" &&
				chartType !== "crossTab" &&
				chartType !== "table" &&
				chartType !== "funnel" &&
				chartType !== "simplecard" &&
				chartType !== "heatmap" ? (
				<>
					<div
						style={{ borderTop: "1px solid rgb(211,211,211)", margin: "1rem 6% 1rem" }}
					></div>
					<YAxisFormat chartType={chartType} />
				</>
			) : null} */}
		</div>
	);
};

export default ChartFormat;
