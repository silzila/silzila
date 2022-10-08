export const playBookData = {
	name: "T4",
	data: {
		tabState: {
			tabs: {
				1: {
					tabId: 1,
					tabName: "Tab - 1",
					showDash: false,
					dashMode: "Edit",
					dashLayout: {
						dashboardLayout: "Auto",
						selectedOptionForAuto: "Full Screen",
						aspectRatio: {
							height: 9,
							width: 16,
						},
						selectedOptionForFixed: "HD",
						custom: {
							height: 9,
							width: 16,
						},
						customRange: {
							minHeight: 9,
							minWidth: 16,
							maxHeight: 12,
							maxWidth: 24,
						},
					},
					selectedTileName: "Tile - 1",
					selectedTileId: 1,
					nextTileId: 3,
					tilesInDashboard: ["1.1", "1.2"],
					dashTilesDetails: {
						1.1: {
							name: "Tile - 1",
							highlight: false,
							propKey: "1.1",
							tileId: 1,
							width: 16,
							height: 11,
							x: 0,
							y: 0,
						},
						1.2: {
							name: "Tile - 2",
							highlight: true,
							propKey: "1.2",
							tileId: 2,
							width: 13,
							height: 11,
							x: 19,
							y: 0,
						},
					},
				},
			},
			tabList: [1],
		},
		tileState: {
			tiles: {
				1.1: {
					tabId: 1,
					tileId: 1,
					tileName: "Tile - 1",
					graphSizeFull: false,
				},
				1.2: {
					tabId: 1,
					tileId: 2,
					tileName: "Tile - 2",
					graphSizeFull: false,
				},
			},
			tileList: {
				1: ["1.1", "1.2"],
			},
		},
		tabTileProps: {
			selectedTabName: "Tab - 1",
			selectedTabId: 1,
			nextTabId: 2,
			editTabName: false,
			selectedTileName: "Tile - 1",
			selectedTileId: 1,
			nextTileId: 3,
			editTileName: false,
			dragging: false,
			chartPropUpdated: false,
			showDash: false,
			dashMode: "Edit",
			dashGridSize: {
				x: 59,
				y: 47,
			},
			columnsOnlyDisplay: false,
			showDataViewerBottom: true,
			selectedControlMenu: "Charts",
			selectedDataSetList: [
				{
					friendly_name: "one big table",
					dc_uid: "post",
					ds_uid: "3tgLpg",
				},
			],
			tablesForSelectedDataSets: {
				"3tgLpg": [
					{
						table_name: "pos_transaction",
						schema_name: "pos_denormalized",
						id: "pt",
						alias: "pos_transaction",
					},
				],
			},
		},
		chartProperty: {
			properties: {
				1.1: {
					tabId: 1,
					tileId: 1,
					chartType: "multibar",
					axesEdited: true,
					chartAxes: [
						{
							name: "Filter",
							fields: [],
						},
						{
							name: "Dimension",
							fields: [
								{
									fieldname: "order_date",
									displayname: "order_date",
									dataType: "date",
									tableId: "pt",
									uId: "16b2",
									time_grain: "year",
								},
							],
						},
						{
							name: "Measure",
							fields: [
								{
									fieldname: "sales",
									displayname: "sales",
									dataType: "decimal",
									tableId: "pt",
									uId: "ce48",
									agg: "sum",
								},
								{
									fieldname: "profit",
									displayname: "profit",
									dataType: "decimal",
									tableId: "pt",
									uId: "160e",
									agg: "sum",
								},
							],
						},
					],
					selectedDs: {
						friendly_name: "one big table",
						dc_uid: "post",
						ds_uid: "3tgLpg",
					},
					selectedTable: {
						dspost: "s",
						"3tgLpg": "pt",
					},
					titleOptions: {
						fontSize: 28,
						chartTitle: "Sales, profit by year of order_date",
						generateTitle: "Auto",
					},
					chartOptionSelected: "Title",
				},
				1.2: {
					tabId: 1,
					tileId: 2,
					chartType: "donut",
					axesEdited: true,
					chartAxes: [
						{
							name: "Filter",
							fields: [],
						},
						{
							name: "Dimension",
							fields: [
								{
									fieldname: "category",
									displayname: "category",
									dataType: "text",
									tableId: "pt",
									uId: "67f3",
								},
							],
						},
						{
							name: "Measure",
							fields: [
								{
									fieldname: "sales",
									displayname: "sales",
									dataType: "decimal",
									tableId: "pt",
									uId: "580d",
									agg: "sum",
								},
							],
						},
					],
					selectedDs: {
						friendly_name: "one big table",
						dc_uid: "post",
						ds_uid: "3tgLpg",
					},
					selectedTable: {
						dspost: "s",
						"3tgLpg": "pt",
					},
					titleOptions: {
						fontSize: 28,
						chartTitle: "Sales by category",
						generateTitle: "Auto",
					},
					chartOptionSelected: "Colors",
					reUseData: false,
				},
			},
			propList: {
				1: ["1.1", "1.2"],
			},
		},
		chartControl: {
			properties: {
				1.1: {
					chartData: {},
					colorScheme: "walden",
					legendOptions: {
						showLegend: true,
						moveSlider: "Width",
						symbolWidth: 20,
						symbolHeight: 20,
						itemGap: 10,
						position: {
							pos: "Top",
							top: "top",
							left: "center",
						},
						orientation: "horizontal",
					},
					chartMargin: {
						selectedMargin: "top",
						top: 30,
						right: 5,
						bottom: 25,
						left: 65,
					},
					mouseOver: {
						enable: true,
					},
					axisOptions: {
						xSplitLine: false,
						ySplitLine: true,
						axisMinMax: {
							enableMin: false,
							minValue: 0,
							enableMax: false,
							maxValue: 10000,
						},
					},
				},
				1.2: {
					chartData: {},
					colorScheme: "walden",
					legendOptions: {
						showLegend: true,
						moveSlider: "Item Width",
						symbolWidth: 25,
						symbolHeight: 25,
						itemGap: 2,
					},
					chartMargin: {
						selectedMargin: "top",
						top: 30,
						right: 5,
						bottom: 25,
						left: 65,
					},
					mouseOver: {
						enable: true,
					},
					axisOptions: {
						xSplitLine: false,
						ySplitLine: true,
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
				1: ["1.1", "1.2"],
			},
		},
	},
};
