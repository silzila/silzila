import axios from "axios";
import { serverEndPoint } from "./EnvironmentVariables";
import Logger from "../../Logger";
//import jwtDecode from "jwt-decode";
import { Dispatch } from "redux";
import { CustomDefault, resetUser,userAuthentication } from "../../redux/UserInfo/isLoggedActions";
import { dispatchAction } from "../../redux/globalDispatch";
import {store} from '../../App';
type FetchDataPropType = {
	requestType:"withData" | "noData";
	method: string;
	url: string;
	dispatch?:Dispatch;
	// TODO:need to specify types

	data?: any;
	headers: any;
	token?: string;
};
export interface IAPIResponse {
	status: boolean;
	data: any;
	responseStatusCode?: number;
}

// const CheckTokenValidity = async (token) => {
//     const decoded = jwtDecode(token);
//     let expiry = decoded.exp;

//     // get current time
//     var d = new Date();
//     var currentTime = d.getTime();
//     var currentTimeStr = `${currentTime}`;

//     // check if expired
//     var timeShort = currentTimeStr.substr(0, 10);
//     let diff = expiry - timeShort;

//     if (diff < 7200) {
//         return false;
//     }

//     return token;
// };

const FetchData = async (props: FetchDataPropType):Promise<IAPIResponse> => {
	const { requestType, method, url, headers, data } = props;
	// if (token) {
	//     var token2 = await CheckTokenValidity(token);
	// }

	// if (token2) {
	//  -------- below promise code here --------
	// } else {
	// return { status: false, data: { detail: "Token Expired" } };
	// }

	return new Promise(resolve => {
		// dispatchAction(CustomDefault())
		store.dispatch(CustomDefault());
		switch (requestType) {
			case "withData":
				axios({ method, url: serverEndPoint + url, headers, data, timeout:1000 * 10 })
					.then(res => resolve({ status: true, data: res.data, responseStatusCode: res.status }))
					.catch(err => {
						/**
						 * UnAuthorized access will be handled later 
						 * 401 - UnAuthorized
						 */
						Logger("info", err.response.status??"no val");
						if (err?.response?.data) {
							resolve({ status: false, data: err.response.data , responseStatusCode: err.response?.status});
						} else {
							resolve({ status: false, data: { detail: "Unknown error" }, responseStatusCode: err.response?.status });
						}
					});
				break;

			case "noData":
				axios({ method, url: serverEndPoint + url, headers, timeout:1000 * 10 })
					.then(res => {
						Logger("info", undefined,res);
						resolve({ status: true, data: res.data, responseStatusCode: res.status })
					})
					.catch(err => {
						/**
						 * UnAuthorized access will be handled later 
						 * 401 - UnAuthorized
						 */
						Logger("error", err);
						if (err?.response?.data) {
							resolve({ status: false, data: err.response.data ,responseStatusCode: err.response?.status});
						} else {
							resolve({ status: false, data: { detail: "Unknown error" },responseStatusCode: err.response?.status });
						}
					});
				break;

			default:
				break;
		}
	});
};

export default FetchData;
