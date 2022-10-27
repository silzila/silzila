import axios from "axios";
import { serverEndPoint } from "./EnvironmentVariables";
//import jwtDecode from "jwt-decode";

type FetchDataPropType = {
    requestType:"withData",
    method:string,
    url:string,
    // TODO:need to specify types

    data?:any,
    headers:any,
    token?:string,
	
}


type FetchDataPropTypeForNoData = {
    requestType:"noData",
    method:string,
    url:string,


    // TODO:need to specify types (data)

    // data:null,
    headers:any,
    token?:string,
}

type PropsType = FetchDataPropType | FetchDataPropTypeForNoData


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
//     console.log(`Current time: ${timeShort} \nExpiry time: ${expiry} \nDifference: ${diff}`);

//     if (diff < 7200) {
//         return false;
//     }

//     return token;
// };

const FetchDataForIndMethod = async (props
    : PropsType )=>{
	
	return new Promise((resolve) => {
		switch (props.method) {
			case "POST":
                if(props.requestType === "withData")
				{axios({ method: props.method, url: serverEndPoint + props.url, headers:props.headers, data:props.data })
					.then((res) => resolve({ status: true, data: res.data }))
					.catch((err) => {
						// console.log(err);
						if (err?.response?.data) {
							resolve({ status: false, data: err.response.data });
						} else {
							resolve({ status: false, data: { detail: "Unknown error" } });
						}
					});}
				break;
            case "DELETE":
				if(props.requestType === 'noData'){
                   	axios({ method:props.method, url: serverEndPoint + props.url, headers:props.headers })
					.then((res) => resolve({ status: true, data: res.data }))
					.catch((err) => {
						// console.log(err);
						if (err?.response?.data) {
							resolve({ status: false, data: err.response.data });
						} else {
							resolve({ status: false, data: { detail: "Unknown error" } });
						}
					});}
				break;
			case "GET":
                if(props.requestType === 'noData'){
                   	axios({ method:props.method, url: serverEndPoint + props.url, headers:props.headers })
					.then((res) => resolve({ status: true, data: res.data }))
					.catch((err) => {
						// console.log(err);
						if (err?.response?.data) {
							resolve({ status: false, data: err.response.data });
						} else {
							resolve({ status: false, data: { detail: "Unknown error" } });
						}
					});}
				break;

		

			default:
				break;
		}
	});
};

export default FetchDataForIndMethod;
