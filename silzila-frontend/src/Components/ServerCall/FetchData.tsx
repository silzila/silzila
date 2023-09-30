import axios from "axios";
import { serverEndPoint } from "./EnvironmentVariables";
import Logger from "../../Logger";
//import jwtDecode from "jwt-decode";

type FetchDataPropType = {
	requestType: string;
	method: string;
	url: string;
	// TODO:need to specify types

	data?: any;
	headers: any;
	token?: string;
};

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

const FetchData = async (props: FetchDataPropType) => {
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
		switch (requestType) {
			case "withData":
				axios({ method, url: serverEndPoint + url, headers, data, timeout:1000 * 10 })
					.then(res => resolve({ status: true, data: res.data }))
					.catch(err => {
						Logger("error", err);
						if (err?.response?.data) {
							resolve({ status: false, data: err.response.data });
						} else {
							resolve({ status: false, data: { detail: "Unknown error" } });
						}
					});
				break;

			case "noData":
				axios({ method, url: serverEndPoint + url, headers, timeout:1000 * 10 })
					.then(res => resolve({ status: true, data: res.data }))
					.catch(err => {
						Logger("error", err);
						if (err?.response?.data) {
							resolve({ status: false, data: err.response.data });
						} else {
							resolve({ status: false, data: { detail: "Unknown error" } });
						}
					});
				break;

			default:
				break;
		}
	});
};

export default FetchData;
