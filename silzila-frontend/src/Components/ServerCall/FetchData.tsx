import axios from "axios";
import { serverEndPoint } from "./EnvironmentVariables";
import Logger from "../../Logger";
import { jwtDecode } from "jwt-decode";
import { resetUser, updateToken } from "../../redux/UserInfo/isLoggedActions";
import { store } from '../../App';
import Cookies from "js-cookie";

type FetchDataPropType = {
    requestType: "withData" | "noData";
    method: string;
    url: string;
    checkToken?: boolean;
    data?: any;
    headers: any;
    token?: string;
};

export interface IAPIResponse {
    status: boolean;
    data: any;
    responseStatusCode?: number;
}

// Function to refresh the access token
const refreshToken = async (): Promise<string | null> => {
    try {
        const refreshTokenCookie = Cookies.get('refreshToken');
        if (!refreshTokenCookie) return null;
        const response = await axios.get(`${serverEndPoint}refresh-token`, {
            headers: {
                Authorization: `Bearer ${refreshTokenCookie}`,
            },
            timeout: 10000,
        });

        const newToken = response.data.accessToken;
        return newToken;
    } catch (error) {
        console.error("Token refresh failed", error);
        return null;
    }
};

// Function to check if the token is expired
const isTokenExpired = (token: string): boolean => {
    try {
        const payload = jwtDecode(token);
        if (!payload.exp) return true;
        const expiryTime = payload.exp * 1000;
        return Date.now() >= expiryTime;
    } catch (error) {
        console.error("Invalid token", error);
        return true;
    }
};

// Function to make API requests
const FetchData = async (props: FetchDataPropType): Promise<IAPIResponse> => {
    let { requestType, method, url, headers, data, checkToken = true } = props;
    let token = localStorage.getItem("accessToken");

    if (checkToken) {
        // Check token validity
        if (!token || isTokenExpired(token)) {
            token = await refreshToken();
            if (!token) {
				store.dispatch(resetUser())
                return { status: false, data: { detail: "Token Expired. Please login again." }, responseStatusCode: 401 };
            }
        }
        Logger("info", "Token", token);
        store.dispatch(updateToken(token));
        Logger("info", "Token", "storeDispatch");
        headers = { ...headers, Authorization: `Bearer ${token}` };
    }

    const makeRequest = async (): Promise<IAPIResponse> => {
        try {
            const response = await axios({
                method,
                url: `${serverEndPoint}${url}`,
                headers,
                data: requestType === "withData" ? data : undefined,
                timeout: 10000,
            });
            return { status: true, data: response.data, responseStatusCode: response.status };
        } catch (err: any) {
            Logger("error", err);

            // Handle Unauthorized Access (401)
            // if (err.response?.status === 401) {
            //  token = await refreshToken();
            //  if (token) {
            //      headers.Authorization = `Bearer ${token}`;
            //      return makeRequest(); // Retry with new token
            //  }
            // }

            return {
                status: false,
                data: err?.response?.data || { detail: "Unknown error" },
                responseStatusCode: err.response?.status || 500,
            };
        }
    };

    return makeRequest();
};

export default FetchData;