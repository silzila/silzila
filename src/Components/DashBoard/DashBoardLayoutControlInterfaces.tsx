export interface DashBoardLayoutProps {
	// State
	tabTileProps: any;
	tabState: any;
	//Dispatch
	setDashLayout: (tabId: number, value: any) => void;
	setDashLayoutSelectedOptionForAuto: (tabId: number, value: any) => void;
	setDashLayoutSelectedOptionForFixed: (tabId: number, value: any) => void;
	setAspectRatioHeight: (tabId: number, value: any) => void;
	setAspectRatioWidth: (tabId: number, value: any) => void;
	setCustomHeight: (tabId: number, value: any) => void;
	setCustomWidth: (tabId: number, value: any) => void;
	setCustomRMinWidth: (tabId: number, value: any) => void;
	setCustomRMinHeight: (tabId: number, value: any) => void;
	setCustomRMaxWidth: (tabId: number, value: any) => void;
	setCustomRMaxHeight: (tabId: number, value: any) => void;
	setDashboardResizeColumn: (value: boolean) => void;
}
