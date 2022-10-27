
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@ tabstate @@@@@@@@@@@@@@@@@@@@@@@@@@@@

type DashLayout= {
				dashboardLayout: string,
				selectedOptionForAuto: string,
				aspectRatio: 
                { height: number, width: number },
				selectedOptionForFixed: string,
				custom: { height: number, width: number },
				customRange: { minHeight: number, minWidth: number, maxHeight: number, maxWidth: number },
			}

type Tabs  ={
   [key:number] : {
            tabId: number,
			tabName: string,
			showDash: boolean,
			dashMode: string,
            dashLayout:DashLayout,
            selectedTileName: string,
			selectedTileId: number,
			nextTileId: number,
			tilesInDashboard: Array<any>,
			dashTilesDetails: Object,
   } 
}
export type StateProp = {
tabs:Tabs,
tabList:number[]
}