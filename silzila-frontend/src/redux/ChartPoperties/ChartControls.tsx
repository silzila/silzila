// This file is used for storing all data related to properties of charts that
// will result in rerender of the chart

import update from "immutability-helper";

const chartControl = {
	properties: {
		1.1: {
			chartData: "",
			isRichText: false,
			richText:
				'<h1 class="ql-align-center ql-indent-2">Content Header</h1><p><span style="background-color: rgb(255, 255, 0);">Paragraph goes here...</span></p><ul><li>This</li><li>is</li><li>List</li></ul><p>Another Paragraph</p><ol><li>Numbered</li><li>List</li><li><a href="https://silzila.org" rel="noopener noreferrer" target="_blank">silzila</a></li></ol>',
			colorScheme: "walden",
			areaBackgroundColor: "#22194D",
			areaOpacity: 0.1,

			colorScale: {
				colorScaleType: "Automatic",
				min: 0,
				max: 0,
				minColor: "#ffffb3",
				maxColor: "#b32d00",
			},

			legendOptions: {
				showLegend: true,
				moveSlider: "Width",
				symbolWidth: 20,
				symbolHeight: 20,
				itemGap: 10,
				position: { pos: "Top", top: "top", left: "center" },
				orientation: "horizontal",
			},

			chartMargin: {
				//for pie and gauge
				radius: 70,
				// for donut and rose
				innerRadius: 30,
				outerRadius: 70,
				// for funnel chart
				funnelRight: 10,
				funnelLeft: 10,
				// for others
				selectedMargin: "top",
				top: 5,
				right: 5,
				bottom: 5,
				left: 5,
			},

			calendarStyleOptions: {
				showSplitLine: true,
				splitLineColor: "black",
				splitLineWidth: 1,
				splitLineType: "solid",
				showDayLabel: true,
				firstDay: 0,
				dayLabelMargin: 5,
				dayLabelPosition: "start",
				dayLabelColor: "black",
				dayLabelFontSize: 12,
				showMonthLabel: true,
				monthLabelMargin: 5,
				monthLabelPosition: "start",
				monthLabelColor: "black",
				monthLabelFontSize: 12,
				showYearLabel: true,
				yearLabelMargin: 24,
				yearLabelPosition: "left",
				yearLabelColor: "black",
				yearLabelFontSize: 12,
				calendarGap: 30,
			},

			boxPlotChartControls: {
				colorBy: "series", // or data,
				minBoxWidth: 10, // px or %,
				maxBoxWidth: 30,
				boxborderWidth: "2", //px
				flipAxis: false,
			},

			treeMapChartControls: {
				treeMapWidth: 80, //%
				treeMapHeight: 80, //%
				leafDepth: 1,
				labelPosition: "insideTopLeft",
				labelRotate: 0, //dropDown hori,verti,vertiflip
				horizondalAlign: "right",
				verticleAlign: "bottom",
				overFlow: "truncate",
				borderWidth: 0,
				gapWidth: 2,
				showBreadCrumb: true,
				bcHeight: 22,
				bcWidth: 25,
				bcColor: "rgba(0,0,0,0.7)",
			},

			sankeyControls: {
				nodeWidth: 10,
				nodeGap: 8,
				nodeAlign: "justify",
				orient: "horizontal",
				draggable: true,
				labelDistance: 5,
				labelRotate: 0,
				overFlow: "truncate",

				labelPosition: "inside",
				opacity: 20,
				curveness: 50,
				nodeColor: "#f589b8",
				linkColor: "grey",
				nodesAndColors: [],
			},

			crossTabStyleOptions: {
				borderWidth: 1,
				lineHeight: 1,
			},
			crossTabHeaderLabelOptions: {
				labelColorManual: false,
				labelColor: "#666666",
				fontSize: 14,
				fontStyle: "normal",
				fontWeigth: "normal",
				fontFamily: "sans-serif",
				fontWeight: "500",
			},
			crossTabCellLabelOptions: {
				labelColorManual: false,
				labelColor: "#666666",
				fontSize: 12,
				fontStyle: "normal",
				fontWeigth: "normal",
				fontFamily: "sans-serif",
				fontWeight: "400",
			},

			labelOptions: {
				showLabel: true,
				labelColorManual: false,
				labelColor: "#666666",
				pieLabel: {
					labelPosition: "outside",
					labelPadding: 0,
				},
				fontSize: 12,
				fontStyle: "normal",
				fontWeigth: "normal",
				fontFamily: "sans-serif",
			},

			formatOptions: {
				labelFormats: {
					formatValue: "Number",
					currencySymbol: "₹",
					enableRounding: "false",
					roundingDigits: 1,
					numberSeparator: "None",
				},

				yAxisFormats: {
					enableRounding: "false",
					roundingDigits: 1,
					numberSeparator: "None",
				},

				xAxisFormats: {
					enableRounding: "false",
					roundingDigits: 1,
					numberSeparator: "None",
				},
			},

			mouseOver: {
				enable: true,
			},

			axisOptions: {
				xSplitLine: false,
				ySplitLine: true,
				inverse: false,
				gaugeAxisOptions: {
					startAngle: 225,
					endAngle: -45,
					showTick: true,
					tickSize: 5,
					tickPadding: 12,
					showAxisLabel: true,
					labelPadding: 17,
					min: 0,
					max: 0,
					isMaxAuto: true,
				},

				gaugeChartControls: {
					isStepsAuto: true,
					stepcolor: [
						{
							color: "#3fb1e3",
							per: 0.4,
							isColorAuto: true,
							stepValue: 40,
							value: 100,
						},
						{
							color: "#6be6c1",
							per: 0.9,
							isColorAuto: true,
							stepValue: 40,
							value: 100,
						},
						{
							color: "#626c91",
							per: 1,
							isColorAuto: true,
							stepValue: 20,
							value: 100,
						},
					],
				},
				pieAxisOptions: {
					pieStartAngle: 90,
					clockWise: true,
				},
				yAxis: {
					position: "left",
					onZero: true,

					showLabel: true,

					name: "",
					nameLocation: "middle",
					nameGap: 15,
					nameColor: "red",
					nameSize: "20",

					// onZeroLeft: true,
					tickSizeLeft: 5,
					tickPaddingLeft: 5,
					tickRotationLeft: 0,

					// onZeroRight: false,
					tickSizeRight: 5,
					tickPaddingRight: 5,
					tickRotationRight: 0,
				},
				xAxis: {
					position: "bottom",
					onZero: true,

					showLabel: true,

					name: "",
					nameLocation: "middle",
					nameGap: 15,
					nameColor: "red",
					nameSize: "20",

					// onZeroBottom: true,
					tickSizeBottom: 5,
					tickPaddingBottom: 5,
					tickRotationBottom: 0,

					// onZeroTop: false,
					tickSizeTop: 5,
					tickPaddingTop: 5,
					tickRotationTop: 0,
				},
				scatterChartMinMax: {
					x_enableMin: false,
					x_minValue: 0,
					x_enableMax: false,
					x_maxValue: 10000,
					y_enableMin: false,
					y_minValue: 0,
					y_enableMax: false,
					y_maxValue: 10000,
				},

				axisMinMax: {
					enableMin: false,
					minValue: 0,
					enableMax: false,
					maxValue: 10000,
				},
			},
		},
	},

	propList: { 1: ["1.1"] },
};

const chartControlsReducer = (state: any = chartControl, action: any) => {
	switch (action.type) {
		case "ADD_NEW_CONTROL":
			let tileKey = `${action.payload.tabId}.${action.payload.tileId}`;
			return {
				properties: {
					...state.properties,
					[tileKey]: {
						chartData: "",
						isRichText: false,
						richText:
							'<h1 class="ql-align-center ql-indent-2">Content Header</h1><p><span style="background-color: rgb(255, 255, 0);">Paragraph goes here...</span></p><ul><li>This</li><li>is</li><li>List</li></ul><p>Another Paragraph</p><ol><li>Numbered</li><li>List</li><li><a href="https://silzila.org" rel="noopener noreferrer" target="_blank">silzila</a></li></ol>',
						colorScheme: "walden",
						areaBackgroundColor: "#22194D",
						areaOpacity: 0.1,

						colorScale: {
							colorScaleType: "Automatic",
							min: 0,
							max: 0,
							minColor: "#ffffb3",
							maxColor: "#b32d00",
						},

						legendOptions: {
							showLegend: true,
							moveSlider: "Width",
							symbolWidth: 20,
							symbolHeight: 20,
							itemGap: 10,
							position: { pos: "Top", top: "top", left: "center" },
							orientation: "horizontal",
						},

						chartMargin: {
							//for pie and gauge
							radius: 70,
							// for donut and rose
							innerRadius: 30,
							outerRadius: 70,
							// for funnel chart
							funnelRight: 10,
							funnelLeft: 10,
							// for others
							selectedMargin: "top",
							top: 5,
							right: 5,
							bottom: 5,
							left: 5,
						},

						calendarStyleOptions: {
							showSplitLine: true,
							splitLineColor: "black",
							splitLineWidth: 1,
							splitLineType: "solid",
							showDayLabel: true,
							firstDay: 0,
							dayLabelMargin: 5,
							dayLabelPosition: "start",
							dayLabelColor: "black",
							dayLabelFontSize: 12,
							showMonthLabel: true,
							monthLabelMargin: 5,
							monthLabelPosition: "start",
							monthLabelColor: "black",
							monthLabelFontSize: 12,
							showYearLabel: true,
							yearLabelMargin: 24,
							yearLabelPosition: "left",
							yearLabelColor: "black",
							yearLabelFontSize: 12,
							calendarGap: 30,
						},

						boxPlotChartControls: {
							colorBy: "series", // or data,
							minBoxWidth: 10, // px or %,
							maxBoxWidth: 30,
							boxborderWidth: "2", //px
							flipAxis: false,
						},

						treeMapChartControls: {
							treeMapWidth: 80, //%
							treeMapHeight: 80, //%
							leafDepth: 1,
							labelPosition: "insideTopLeft",
							labelRotate: 0, //dropDown hori,verti,vertiflip
							horizondalAlign: "right",
							verticleAlign: "bottom",
							overFlow: "truncate",
							borderWidth: 0,
							gapWidth: 2,
							showBreadCrumb: true,
							bcHeight: 22,
							bcWidth: 25,
							bcColor: "rgba(0,0,0,0.7)",
						},

						sankeyControls: {
							nodeWidth: 10,
							nodeGap: 8,
							nodeAlign: "justify",
							orient: "horizontal",
							draggable: true,
							labelDistance: 5,
							labelRotate: 0,
							overFlow: "truncate",

							labelPosition: "inside",
							opacity: 20,
							curveness: 50,
							nodeColor: "#f589b8",
							linkColor: "grey",
							nodesAndColors: [],
						},

						crossTabStyleOptions: {
							borderWidth: 1,
							lineHeight: 1,
						},
						crossTabHeaderLabelOptions: {
							labelColorManual: false,
							labelColor: "#666666",
							fontSize: 14,
							fontStyle: "normal",
							fontWeigth: "normal",
							fontFamily: "sans-serif",
							fontWeight: "500",
						},
						crossTabCellLabelOptions: {
							labelColorManual: false,
							labelColor: "#666666",
							fontSize: 12,
							fontStyle: "normal",
							fontWeigth: "normal",
							fontFamily: "sans-serif",
							fontWeight: "400",
						},

						labelOptions: {
							showLabel: true,
							labelColorManual: false,
							labelColor: "#666666",
							pieLabel: {
								labelPosition: "outside",
								labelPadding: 0,
							},
							fontSize: 12,
							fontStyle: "normal",
							fontWeigth: "normal",
							fontFamily: "sans-serif",
						},

						formatOptions: {
							labelFormats: {
								formatValue: "Number",
								currencySymbol: "₹",
								enableRounding: "false",
								roundingDigits: 1,
								numberSeparator: "None",
							},

							yAxisFormats: {
								enableRounding: "false",
								roundingDigits: 1,
								numberSeparator: "None",
							},

							xAxisFormats: {
								enableRounding: "false",
								roundingDigits: 1,
								numberSeparator: "None",
							},
						},

						mouseOver: {
							enable: true,
						},

						axisOptions: {
							xSplitLine: false,
							ySplitLine: true,
							inverse: false,
							gaugeAxisOptions: {
								startAngle: 225,
								endAngle: -45,
								showTick: true,
								tickSize: 5,
								tickPadding: 12,
								showAxisLabel: true,
								labelPadding: 17,
								min: 0,
								max: 0,
								isMaxAuto: true,
							},

							gaugeChartControls: {
								isStepsAuto: true,
								stepcolor: [
									{
										color: "#3fb1e3",
										per: 0.4,
										isColorAuto: true,
										stepValue: 40,
										value: 100,
									},
									{
										color: "#6be6c1",
										per: 0.9,
										isColorAuto: true,
										stepValue: 40,
										value: 100,
									},
									{
										color: "#626c91",
										per: 1,
										isColorAuto: true,
										stepValue: 20,
										value: 100,
									},
								],
							},
							pieAxisOptions: {
								pieStartAngle: 90,
								clockWise: true,
							},
							yAxis: {
								position: "left",
								onZero: true,

								showLabel: true,

								name: "",
								nameLocation: "middle",
								nameGap: 15,
								nameColor: "red",
								nameSize: "20",

								// onZeroLeft: true,
								tickSizeLeft: 5,
								tickPaddingLeft: 5,
								tickRotationLeft: 0,

								// onZeroRight: false,
								tickSizeRight: 5,
								tickPaddingRight: 5,
								tickRotationRight: 0,
							},
							xAxis: {
								position: "bottom",
								onZero: true,

								showLabel: true,

								name: "",
								nameLocation: "middle",
								nameGap: 15,
								nameColor: "red",
								nameSize: "20",

								// onZeroBottom: true,
								tickSizeBottom: 5,
								tickPaddingBottom: 5,
								tickRotationBottom: 0,

								// onZeroTop: false,
								tickSizeTop: 5,
								tickPaddingTop: 5,
								tickRotationTop: 0,
							},
							scatterChartMinMax: {
								x_enableMin: false,
								x_minValue: 0,
								x_enableMax: false,
								x_maxValue: 10000,
								y_enableMin: false,
								y_minValue: 0,
								y_enableMax: false,
								y_maxValue: 10000,
							},

							axisMinMax: {
								enableMin: false,
								minValue: 0,
								enableMax: false,
								maxValue: 10000,
							},
						},
					},
				},
				propList: {
					...state.propList,
					[action.payload.tabId]: [...state.propList[action.payload.tabId], tileKey],
				},
			};

		case "ADD_NEW_CONTROL_FROM_TAB":
			let tileKey2 = `${action.payload.tabId}.${action.payload.tileId}`;

			return {
				properties: {
					...state.properties,
					[tileKey2]: {
						chartData: "",
						isRichText: false,
						richText:
							'<h1 class="ql-align-center ql-indent-2">Content Header</h1><p><span style="background-color: rgb(255, 255, 0);">Paragraph goes here...</span></p><ul><li>This</li><li>is</li><li>List</li></ul><p>Another Paragraph</p><ol><li>Numbered</li><li>List</li><li><a href="https://silzila.org" rel="noopener noreferrer" target="_blank">silzila</a></li></ol>',
						colorScheme: "walden",
						areaBackgroundColor: "#22194D",
						areaOpacity: 0.1,

						colorScale: {
							colorScaleType: "Automatic",
							min: 0,
							max: 0,
							minColor: "#ffffb3",
							maxColor: "#b32d00",
						},

						legendOptions: {
							showLegend: true,
							moveSlider: "Width",
							symbolWidth: 20,
							symbolHeight: 20,
							itemGap: 10,
							position: { pos: "Top", top: "top", left: "center" },
							orientation: "horizontal",
						},

						chartMargin: {
							//for pie and gauge
							radius: 70,
							// for donut and rose
							innerRadius: 30,
							outerRadius: 70,
							// for funnel chart
							funnelRight: 10,
							funnelLeft: 10,
							// for others
							selectedMargin: "top",
							top: 5,
							right: 5,
							bottom: 5,
							left: 5,
						},

						calendarStyleOptions: {
							showSplitLine: true,
							splitLineColor: "black",
							splitLineWidth: 1,
							splitLineType: "solid",
							showDayLabel: true,
							firstDay: 0,
							dayLabelMargin: 5,
							dayLabelPosition: "start",
							dayLabelColor: "black",
							dayLabelFontSize: 12,
							showMonthLabel: true,
							monthLabelMargin: 5,
							monthLabelPosition: "start",
							monthLabelColor: "black",
							monthLabelFontSize: 12,
							showYearLabel: true,
							yearLabelMargin: 24,
							yearLabelPosition: "left",
							yearLabelColor: "black",
							yearLabelFontSize: 12,
							calendarGap: 30,
						},

						boxPlotChartControls: {
							colorBy: "series", // or data,
							minBoxWidth: 10, // px or %,
							maxBoxWidth: 30,
							boxborderWidth: "2", //px
							flipAxis: false,
						},

						treeMapChartControls: {
							treeMapWidth: 80, //%
							treeMapHeight: 80, //%
							leafDepth: 1,
							labelPosition: "insideTopLeft",
							labelRotate: 0, //dropDown hori,verti,vertiflip
							horizondalAlign: "right",
							verticleAlign: "bottom",
							overFlow: "truncate",
							borderWidth: 0,
							gapWidth: 2,
							showBreadCrumb: true,
							bcHeight: 22,
							bcWidth: 25,
							bcColor: "rgba(0,0,0,0.7)",
						},

						sankeyControls: {
							nodeWidth: 10,
							nodeGap: 8,
							nodeAlign: "justify",
							orient: "horizontal",
							draggable: true,
							labelDistance: 5,
							labelRotate: 0,
							overFlow: "truncate",

							labelPosition: "inside",
							opacity: 20,
							curveness: 50,
							nodeColor: "#f589b8",
							linkColor: "grey",
							nodesAndColors: [],
						},

						crossTabStyleOptions: {
							borderWidth: 1,
							lineHeight: 1,
						},
						crossTabHeaderLabelOptions: {
							labelColorManual: false,
							labelColor: "#666666",
							fontSize: 14,
							fontStyle: "normal",
							fontWeigth: "normal",
							fontFamily: "sans-serif",
							fontWeight: "500",
						},
						crossTabCellLabelOptions: {
							labelColorManual: false,
							labelColor: "#666666",
							fontSize: 12,
							fontStyle: "normal",
							fontWeigth: "normal",
							fontFamily: "sans-serif",
							fontWeight: "400",
						},

						labelOptions: {
							showLabel: true,
							labelColorManual: false,
							labelColor: "#666666",
							pieLabel: {
								labelPosition: "outside",
								labelPadding: 0,
							},
							fontSize: 12,
							fontStyle: "normal",
							fontWeigth: "normal",
							fontFamily: "sans-serif",
						},

						formatOptions: {
							labelFormats: {
								formatValue: "Number",
								currencySymbol: "₹",
								enableRounding: "false",
								roundingDigits: 1,
								numberSeparator: "None",
							},

							yAxisFormats: {
								enableRounding: "false",
								roundingDigits: 1,
								numberSeparator: "None",
							},

							xAxisFormats: {
								enableRounding: "false",
								roundingDigits: 1,
								numberSeparator: "None",
							},
						},

						mouseOver: {
							enable: true,
						},

						axisOptions: {
							xSplitLine: false,
							ySplitLine: true,
							inverse: false,
							gaugeAxisOptions: {
								startAngle: 225,
								endAngle: -45,
								showTick: true,
								tickSize: 5,
								tickPadding: 12,
								showAxisLabel: true,
								labelPadding: 17,
								min: 0,
								max: 0,
								isMaxAuto: true,
							},

							gaugeChartControls: {
								isStepsAuto: true,
								stepcolor: [
									{
										color: "#3fb1e3",
										per: 0.4,
										isColorAuto: true,
										stepValue: 40,
										value: 100,
									},
									{
										color: "#6be6c1",
										per: 0.9,
										isColorAuto: true,
										stepValue: 40,
										value: 100,
									},
									{
										color: "#626c91",
										per: 1,
										isColorAuto: true,
										stepValue: 20,
										value: 100,
									},
								],
							},
							pieAxisOptions: {
								pieStartAngle: 90,
								clockWise: true,
							},
							yAxis: {
								position: "left",
								onZero: true,

								showLabel: true,

								name: "",
								nameLocation: "middle",
								nameGap: 15,
								nameColor: "red",
								nameSize: "20",

								// onZeroLeft: true,
								tickSizeLeft: 5,
								tickPaddingLeft: 5,
								tickRotationLeft: 0,

								// onZeroRight: false,
								tickSizeRight: 5,
								tickPaddingRight: 5,
								tickRotationRight: 0,
							},
							xAxis: {
								position: "bottom",
								onZero: true,

								showLabel: true,

								name: "",
								nameLocation: "middle",
								nameGap: 15,
								nameColor: "red",
								nameSize: "20",

								// onZeroBottom: true,
								tickSizeBottom: 5,
								tickPaddingBottom: 5,
								tickRotationBottom: 0,

								// onZeroTop: false,
								tickSizeTop: 5,
								tickPaddingTop: 5,
								tickRotationTop: 0,
							},
							scatterChartMinMax: {
								x_enableMin: false,
								x_minValue: 0,
								x_enableMax: false,
								x_maxValue: 10000,
								y_enableMin: false,
								y_minValue: 0,
								y_enableMax: false,
								y_maxValue: 10000,
							},

							axisMinMax: {
								enableMin: false,
								minValue: 0,
								enableMax: false,
								maxValue: 10000,
							},
						},
					},
				},
				propList: { ...state.propList, [action.payload.tabId]: [tileKey2] },
			};

		case "DELETE_CONTROLS":
			return update(state, {
				properties: { $unset: [action.payload.propKey] },
				propList: { [action.payload.tabId]: { $splice: [[action.payload.tileIndex, 1]] } },
			});

		case "DELETE_CONTROLS_OF_TAB":
			let propsToRemove = state.propList[action.payload];
			return update(state, {
				properties: { $unset: propsToRemove },
				propList: { $unset: [action.payload] },
			});

		case "UPDATE_CHART_DATA":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartData: { $set: action.payload.chartData },
					},
				},
			});

		case "DUPLICATE_CHART_CONTROL":
			console.log(action.payload);
			return update(state, {
				properties: { [action.payload.propKey]: { $set: action.payload.chartControl } },
			});

		// ########################################
		// Color theme

		case "CHANGE_COLOR_SCHEME":
			return update(state, {
				properties: {
					[action.payload.propKey]: { colorScheme: { $set: action.payload.color } },
				},
			});
		case "AREA_COLOR_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						[action.payload.option]: { $set: action.payload.value },
					},
				},
			});

		// ########################################
		// Legend

		case "UPDATE_LEGEND_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						legendOptions: { [action.payload.option]: { $set: action.payload.value } },
					},
				},
			});

		case "RESET_LEGEND_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartMargin: { $set: action.payload.marginValues },
						legendOptions: { $set: action.payload.legendValues },
					},
				},
			});

		// ########################################
		// Margin

		case "SELECTED_MARGIN":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartMargin: { selectedMargin: { $set: action.payload.margin } },
					},
				},
			});

		case "UPDATE_CHART_MARGINS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartMargin: { [action.payload.option]: { $set: action.payload.value } },
					},
				},
			});

		// ########################################
		// MouseOver

		case "ENABLE_MOUSE_OVER":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						mouseOver: { enable: { $set: action.payload.enable } },
					},
				},
			});

		// ########################################
		// Grid & Axis

		case "ENABLE_GRID":
			switch (action.payload.value) {
				case "xSplitLine":
				case "ySplitLine":
					return update(state, {
						properties: {
							[action.payload.propKey]: {
								axisOptions: {
									[action.payload.value]: { $set: action.payload.show },
								},
							},
						},
					});
				case "axisBottom":
				case "axisLeft":
				case "axisTop":
				case "axisRight":
					return update(state, {
						properties: {
							[action.payload.propKey]: {
								axisOptions: { selectedAxis: { $set: action.payload.value } },
							},
						},
					});

				default:
					return state;
			}

		case "AXIS_MIN_MAX":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							axisMinMax: {
								[action.payload.axisKey]: { $set: action.payload.axisValue },
							},
						},
					},
				},
			});

		case "AXIS_MIN_MAX_FOR_SCATTER":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							scatterChartMinMax: {
								[action.payload.axisKey]: { $set: action.payload.axisValue },
							},
						},
					},
				},
			});
		case "SET_COLOR_SCALE_OPTION":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						colorScale: {
							[action.payload.option]: { $set: action.payload.value },
						},
					},
				},
			});

		case "LOAD_CHART_CONTROLS":
			return action.payload;

		case "RESET_CHART_CONTROLS":
			return chartControl;

		case "UPDATE_CROSSTAB_STYLE_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						crossTabStyleOptions: {
							[action.payload.option]: { $set: action.payload.value },
						},
					},
				},
			});

		case "UPDATE_CROSSTAB_HEADER_LABEL_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						crossTabHeaderLabelOptions: {
							[action.payload.option]: { $set: action.payload.value },
						},
					},
				},
			});

		case "UPDATE_CROSSTAB_CELL_LABEL_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						crossTabCellLabelOptions: {
							[action.payload.option]: { $set: action.payload.value },
						},
					},
				},
			});

		case "UPDATE_CROSSTAB_STYLE_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						crossTabStyleOptions: {
							[action.payload.option]: { $set: action.payload.value },
						},
					},
				},
			});

		case "UPDATE_CROSSTAB_HEADER_LABEL_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						crossTabHeaderLabelOptions: {
							[action.payload.option]: { $set: action.payload.value },
						},
					},
				},
			});

		case "UPDATE_CROSSTAB_CELL_LABEL_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						crossTabCellLabelOptions: {
							[action.payload.option]: { $set: action.payload.value },
						},
					},
				},
			});

		case "UPDATE_LABEL_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						labelOptions: { [action.payload.option]: { $set: action.payload.value } },
					},
				},
			});

		case "UPDATE_FORMAT_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						formatOptions: {
							[action.payload.formatType]: {
								[action.payload.option]: { $set: action.payload.value },
							},
						},
					},
				},
			});

		case "UPDATE_LABEL_POSITION":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						labelOptions: {
							pieLabel: { labelPosition: { $set: action.payload.value } },
						},
					},
				},
			});
		case "UPDATE_LABEL_PADDING":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						labelOptions: {
							pieLabel: { labelPadding: { $set: action.payload.value } },
						},
					},
				},
			});
		case "UPDATE_REVERSE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: { inverse: { $set: action.payload.value } },
					},
				},
			});
		case "UPDATE_PIE_AXIS_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							pieAxisOptions: {
								[action.payload.option]: { $set: action.payload.value },
							},
						},
					},
				},
			});

		case "UPDATE_AXIS_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							[action.payload.axis]: {
								[action.payload.option]: {
									$set: action.payload.value,
								},
							},
						},
					},
				},
			});
		case "UPDATE_GAUGE_AXIS_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							gaugeAxisOptions: {
								[action.payload.option]: {
									$set: action.payload.value,
								},
							},
						},
					},
				},
			});
		case "ADDING_NEW_STEP":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							gaugeChartControls: {
								stepcolor: {
									$splice: [[action.payload.index, 0, action.payload.value]],
								},
							},
						},
					},
				},
			});

		case "CHANGING_VALUES_OF_STEPS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							gaugeChartControls: {
								stepcolor: { $set: action.payload.value },
							},
						},
					},
				},
			});
		case "SWITCH_STEPS_AUTO_MANUAL":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							gaugeChartControls: {
								isStepsAuto: { $set: action.payload.value },
							},
						},
					},
				},
			});
		case "UPDATE_CALENDER_STYLE_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						calendarStyleOptions: {
							[action.payload.option]: {
								$set: action.payload.value,
							},
						},
					},
				},
			});

		case "UPDATE_BOXPLOT_STYLE_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						boxPlotChartControls: {
							[action.payload.option]: {
								$set: action.payload.value,
							},
						},
					},
				},
			});
		case "UPDATE_TREEMAP_STYLE_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						treeMapChartControls: {
							[action.payload.option]: {
								$set: action.payload.value,
							},
						},
					},
				},
			});
		case "UPDATE_SANKEY_STYLE_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						sankeyControls: {
							[action.payload.option]: {
								$set: action.payload.value,
							},
						},
					},
				},
			});

		case "UPDATE_RICH_TEXT":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						richText: {
							$set: action.payload.value,
						},
					},
				},
			});
		default:
			return state;
	}
};

export default chartControlsReducer;
