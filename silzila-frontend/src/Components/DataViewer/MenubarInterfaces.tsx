import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";

export type MapStateProps = isLoggedProps;

interface MenubarPropsFromState {
	token: string;
}

interface MenubarPropsFromParent {
	from: string;
}

interface MenubarPropsFromDispatch {
	resetUser: () => void;
}

export type MenubarProps = MenubarPropsFromState &
	MenubarPropsFromParent &
	MenubarPropsFromDispatch;
