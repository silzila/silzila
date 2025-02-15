// Login Page. For existing users.This will be the first component to show to users

import React, { useRef, useState, useEffect } from "react";
import { validateEmail, validatePassword } from "../CommonFunctions/CommonFunctions";
// import FetchData from "../ServerCall/FetchData";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { AlertColor, Button } from "@mui/material";
import "./LoginSignUp.css";
import { userAuthentication } from "../../redux/UserInfo/isLoggedActions";
import { LoggedDetailsType } from "../../redux/UserInfo/IsLoggedInterfaces";
import { Dispatch } from "redux";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import { DispatchProps, LogginDetails } from "./LoginSignUpInterfaces";
import FetchData from "../ServerCall/FetchData";
import Header from "./Header";
import "./header.css";
import "./openSource_signin.css";
import {DeleteAllCookies} from '../CommonFunctions/CommonFunctionsCookies';
import Cookies from "js-cookie";
import { serverEndPoint, localEndPoint } from "../ServerCall/EnvironmentVariables";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";

const Login = (props: DispatchProps) => {
	const navigate = useNavigate();
	const [loginStatus, setLoginStatus] = useState<boolean>(false);
	const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (message: string, severity: AlertColor) => {
    setTestMessage(message);
    setSeverity(severity);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    }, 3000);
  };

  useEffect(()=>{
    //Cookies.remove("authToken");
    //DeleteAllCookies();
  },[])

	const isFormValid = () => email.trim() !== "" && password.trim() !== ""; // Basic validation

	//  *************************************************************
	//  Submit actions

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError("*Please fill in both Email and Password");
      return; // Prevent submission if form is invalid
    }

			// TODO need to specify type
		try {
			const response: any = await FetchData({
				requestType: "withData",
				method: "POST",
				url: "auth/signin",
				data: {
					username: email,
					password: password, 
					device: "web",
				},
				headers: { "Content-Type": "application/json" },
			});;		
			if (response.status) {
				setLoginStatus(true);
				var payload = {
					isUserLogged: true,
					accessToken: response.data.accessToken,
					tokenType: response.data.tokenType,
					firstName: response.data.firstName || " ",
          lastName: response.data.lastName || "",
          email: response.data.email || "N/A",
          avatar: response.data.profileImage?.trim()
            ? `data:image/jpeg;base64,${response.data.profileImage}`
            : "/default.png",
        };
				localStorage.setItem("accessToken", payload.accessToken);
				
				setIsLoading(false);

				// Set the auth token in cookies
				const domain = new URL(localEndPoint).hostname
					.split(".")
					.slice(-2)
					.join(".");
	
				Cookies.set("authToken", response.data.accessToken, {
					sameSite: "None", // Cross-site cookie
					secure: true,
					domain: domain, // Cross-subdomain cookie
					path: "/",
					expires: 1, // 1 day
				});
				Cookies.set("refreshToken", response.data.refreshToken, {
					sameSite: "none", // Cross-site cookie
					secure: true,
					domain: domain, // Cross-subdomain cookie
					path: "/",
					expires: 1, // 1 day
				});
	
				// Redirect to the home page
				setEmail("");
				setPassword("");
				showAlert("Login Successful.", "success");
				setTimeout(() => {
					props.userAuthentication(payload);
					navigate("/workspace");
				}, 3000);
			 }
			} catch (error: any) {
				// console.error("Login error:", error);
		
				// Check if the error contains a specific message about email verification
				if (error.response && error.response.data && error.response.data.error) {
					const { error: apiError, message, status } = error.response.data;
		
					// Check for specific error messages
					if (apiError === "Unauthorized" || status === 401) {
						// Handle "Unauthorized" error specifically
						setError("Invalid credentials. Please check your email and password.");
					}

					} else {
						// Generic fallback for errors without a clear API response
						setError("Login Failed. Please try again.");
						//showAlert("An unexpected error occurred. Please try again.", "error");
					}
		
				setIsLoading(false); // Stop loading spinner
		}
	}

	return (
		<div className="container-login">
		<Header />
		<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundImage: 'url("/bg.png")',
					backgroundSize: "cover",
					backgroundPosition: "center",
					zIndex: -1,
				}}
			></div>
		{isLoading ? (
			<div className="loading-overlay">
				<div className="loading-container">
					<h3>Logging in...</h3>
					<div className="user-spinner"></div>
				</div>
			</div>
		) : null}
		<div className="right-side">
			<div className="login-box">

				<form onSubmit={handleSubmit} className="form">
					<h3>Personal Login</h3>
					<input
						type="email"
						id="login-email"
						name="login-email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						id="login-password"
						name="login-password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{error && <p className="error">{error}</p>}

					<div className="community-signin-login-button-container">
						<button type="submit" className="community-signin-login-button">
							Login
						</button>
					</div>

					<div className="community-signin-forgot-new-button-container">
						<div className="community-signin-login-link-new">
							New User?{" "}
								<Link to="/signup">
								<span>Register here</span>
							</Link>
						</div>
					</div>
					
				</form>
			</div>
		</div>
		<NotificationDialog
        openAlert={openAlert}
        severity={severity}
        testMessage={testMessage}
        onCloseAlert={() => {
          setOpenAlert(false);
          setTestMessage("");
        }}
      />
	</div>
	);
};
// TODO need to specify type
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		userAuthentication: (payload: LoggedDetailsType) => dispatch(userAuthentication(payload)),
	};
};
export default connect(null, mapDispatchToProps)(Login);
