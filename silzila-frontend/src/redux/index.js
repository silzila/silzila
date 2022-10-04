import { combineReducers } from "redux";

import loggedReducer from "./UserInfo/isLogged";


const allReducers = combineReducers({
	isLogged: loggedReducer,
	
});

export default allReducers;
