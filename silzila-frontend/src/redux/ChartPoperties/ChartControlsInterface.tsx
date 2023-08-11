export interface ChartControlsProps {
	chartData: any;
	queryResult: any;
	richText: string;
	colorScheme: string;
	areaBackgroundColor: string;
	areaOpacity: number;

	colorScale: ChartConColorScale;
	cardControls: CardControls;
	legendOptions: ChartConLegendOptions;
	chartMargin: ChartConChartMargin;
	calendarStyleOptions: ChartConCalenderStyleOptions;
	boxPlotChartControls: ChartConBoxPlotChartControls;
	treeMapChartControls: ChartConTreeMapChartControls;
	sankeyControls: ChartConSankeyControls;
	crossTabStyleOptions: ChartConCrossTabStyleOptions;
	crossTabHeaderLabelOptions: ChartConCrosstabHeaderLabelOptions;
	crossTabCellLabelOptions: ChartConCrossTabCellLabelOptions;
	labelOptions: ChartConLabelOptions;
	formatOptions: ChartConFormateOptions;
	axisOptions: ChartConAxisOptions;
	tableConditionalFormats: any;

	mouseOver: {
		enable: boolean;
	};
}
export interface ChartControlProperties {
	[key: string]: ChartControlsProps;
}

interface ChartConColorScale {
	colorScaleType: string;
	min: number;
	max: number;
	minColor: string;
	maxColor: string;
}

interface ChartConLegendOptions {
	showLegend: boolean;
	moveSlider: string;
	symbolWidth: number;
	symbolHeight: number;
	itemGap: number;
	position: { pos: string; top: string; left: string };
	orientation: string;
	left: string;
	top: string;
}

interface ChartConChartMargin {
	radius: number;
	innerRadius: number;
	outerRadius: number;
	funnelRight: number;
	funnelLeft: number;
	selectedMargin: string;
	top: number;
	right: number;
	bottom: number;
	left: number;
}

interface ChartConCalenderStyleOptions {
	showSplitLine: boolean;
	splitLineColor: string;
	splitLineWidth: number;
	splitLineType: string;
	showDayLabel: boolean;
	firstDay: number;
	dayLabelMargin: number;
	dayLabelPosition: string;
	dayLabelColor: string;
	dayLabelFontSize: number;
	showMonthLabel: boolean;
	monthLabelMargin: number;
	monthLabelPosition: string;
	monthLabelColor: string;
	monthLabelFontSize: number;
	showYearLabel: boolean;
	yearLabelMargin: number;
	yearLabelPosition: string;
	yearLabelColor: string;
	yearLabelFontSize: number;
	calendarGap: number;
	pieceWise: boolean;
	height: number;
	width: number;
	orientation: string;
}

export interface ChartConBoxPlotChartControls {
	colorBy: string;
	minBoxWidth: number; // px or %,
	maxBoxWidth: number;
	boxborderWidth: number; //px
	flipAxis: boolean;
}

interface ChartConTreeMapChartControls {
	treeMapWidth: number;
	treeMapHeight: number;
	leafDepth: number;
	labelPosition: string;
	labelRotate: number;
	horizondalAlign: string;
	verticalAlign: string;
	overFlow: string;
	borderWidth: number;
	gapWidth: number;
	showBreadCrumb: boolean;
	bcHeight: number;
	bcWidth: number;
	bcColor: string;
}

interface ChartConSankeyControls {
	nodeWidth: number;
	nodeGap: number;
	nodeAlign: string;
	orient: string;
	draggable: boolean;
	labelDistance: number;
	labelRotate: number;
	overFlow: string;

	labelPosition: string;
	opacity: number;
	curveness: number;
	nodeColor: string;
	linkColor: string;
	nodesAndColors: any[];
}

interface ChartConCrossTabStyleOptions {
	borderWidth: number;
	lineHeight: number;
}

interface ChartConCrosstabHeaderLabelOptions {
	labelColorManual: boolean;
	labelColor: string;
	fontSize: number;
	fontStyle: string;
	fontWeigth: string;
	fontFamily: string;
	fontWeight: number | string;
}

interface ChartConCrossTabCellLabelOptions {
	labelColorManual: boolean;
	labelColor: string;
	fontSize: number;
	fontStyle: string;
	fontWeigth: string;
	fontFamily: string;
	fontWeight: number | string;
}

export interface ChartConLabelOptions {
	showLabel: boolean;
	labelColorManual: boolean;
	labelColor: string;
	pieLabel: {
		labelPosition: string;
		labelPadding: number;
	};
	fontSize: number;
	fontStyle: string;
	fontWeigth: string;
	fontFamily: string;
}

export interface ChartConLabelFormates {
	formatValue: string;
	currencySymbol: any;
	enableRounding: boolean;
	roundingDigits: number;
	numberSeparator: string | any;
}

export interface ChartConYAxisFormats {
	enableRounding: boolean;
	roundingDigits: number;
	numberSeparator: string | any;
}
export interface ChartConXAxisFormats {
	enableRounding: boolean;
	roundingDigits: number;
	numberSeparator: string | any;
}

interface ChartConFormateOptions {
	labelFormats: ChartConLabelFormates;

	yAxisFormats: ChartConYAxisFormats;

	xAxisFormats: ChartConXAxisFormats;
}

interface ChartConGaugeAxisOptions {
	startAngle: number;
	endAngle: number;
	showTick: boolean;
	tickSize: number;
	tickPadding: number;
	showAxisLabel: boolean;
	labelPadding: number;
	min: number;
	max: number;
	isMaxAuto: boolean;
}
interface ChartConGaugeChartControls {
	isStepsAuto: boolean;
	stepcolor: ChartConStepColor[];
}

interface ChartConStepColor {
	color: string;
	per: number;
	isColorAuto: boolean;
	stepValue: number;
	value: number;
}

interface ChartConPieAxisOptions {
	pieStartAngle: number;
	clockWise: boolean;
}

export interface ChartConYAxis {
	position: string;
	onZero: boolean;

	showLabel: boolean;

	name: string;
	nameLocation: string;
	nameGap: number;
	nameColor: string;
	nameSize: number;

	tickSizeLeft: number;
	tickPaddingLeft: number;
	tickRotationLeft: number;

	tickSizeRight: number;
	tickPaddingRight: number;
	tickRotationRight: number;
}

export interface ChartConXAxis {
	position: string;
	onZero: boolean;

	showLabel: boolean;

	name: string;
	nameLocation: string;
	nameGap: number;
	nameColor: string;
	nameSize: number;

	tickSizeBottom: number;
	tickPaddingBottom: number;
	tickRotationBottom: number;

	tickSizeTop: number;
	tickPaddingTop: number;
	tickRotationTop: number;
}

interface ChartConScatterChartMinMax {
	x_enableMin: boolean;
	x_minValue: number;
	x_enableMax: boolean;
	x_maxValue: number;
	y_enableMin: boolean;
	y_minValue: number;
	y_enableMax: boolean;
	y_maxValue: number;
}

interface ChartConAxisMinMax {
	enableMin: boolean;
	minValue: number;
	enableMax: boolean;
	maxValue: number;
}

interface CardControls {
	height: number;
	width: number;
	fontSize: number;
	subtextFontSize: number;
	isDragging: boolean;
	mainTextPos: any;
	subTextPos: any;
	subText: string;
	borderTickness: number;
	borderRadius: number;
	borderColor: string;
	dashStyle: string;
	fontStyle: string;
}

export interface ChartConAxisOptions {
	xSplitLine: boolean;
	ySplitLine: boolean;
	inverse: boolean;
	gaugeAxisOptions: ChartConGaugeAxisOptions;

	gaugeChartControls: ChartConGaugeChartControls;
	pieAxisOptions: ChartConPieAxisOptions;
	yAxis: ChartConYAxis;
	xAxis: ChartConXAxis;
	scatterChartMinMax: ChartConScatterChartMinMax;
	axisMinMax: ChartConAxisMinMax;
}

export interface ChartControl {
	properties: ChartControlProperties;
	propList: { [key: number | string]: string[] };
}

export interface ChartControlStateProps {
	chartControls: ChartControl;
}
