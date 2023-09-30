// Login Page. For existing users.This will be the first component to show to users

import React, { useRef, useState } from "react";
import { validateEmail, validatePassword } from "../CommonFunctions/CommonFunctions";
// import FetchData from "../ServerCall/FetchData";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import "./LoginSignUp.css";
import { userAuthentication } from "../../redux/UserInfo/isLoggedActions";
import { LoggedDetailsType } from "../../redux/UserInfo/IsLoggedInterfaces";
import { Dispatch } from "redux";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import { DispatchProps, LogginDetails } from "./LoginSignUpInterfaces";
import FetchData from "../ServerCall/FetchData";

const initialState = {
	email: "",
	emailError: "",

	password: "",
	passwordError: "",
};

const Login = (props: DispatchProps) => {
	const [account, setAccount] = useState<LogginDetails>(initialState);
	const [loginStatus, setLoginStatus] = useState<boolean>(false);
	const [loginError, setLoginError] = useState<boolean>(false);
	const [serverErrorMessage, setServerErrorMessage] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);
	const inputRef = useRef(null);
	const navigate = useNavigate();

	//  *************************************************************
	//  Email

	const resetEmailError = () => {
		setAccount({
			...account,
			emailError: "",
		});

		setLoginError(false);
	};

	//  *************************************************************
	//  Password

	const resetPwdError = () => {
		setAccount({
			...account,
			passwordError: "",
		});
	};

	//  *************************************************************
	//  Submit actions

	async function handleSubmit(
		e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
	) {
		e.preventDefault();
		setLoading(true);

		// Enable login if all inputs are not null and have valid formats
		var canLogin = false;
		if (
			account.email.length > 0 &&
			account.password.length > 0 &&
			account.emailError === "" &&
			account.passwordError === ""
		) {
			canLogin = true;
		}

		if (canLogin) {
			// const form = new FormData();
			// form.append("email", account.email);
			// form.append("password", account.password);

			let form = {
				email: account.email,
				password: account.password,
			};
			// TODO need to specify type
			var response: any = await FetchData({
				requestType: "withData",
				method: "POST",
				url: "auth/signin",
				data: form,
				headers: { "Content-Type": "application/json" },
			});
			if (response.status) {
				setLoginStatus(true);
				var payload = {
					isUserLogged: true,
					accessToken: response.data.accessToken,
					tokenType: response.data.tokenType,
				};
				props.userAuthentication(payload);
				setTimeout(() => {
					navigate("/datahome");
				}, 1000);
			} else {
				setLoginError(true);
				setServerErrorMessage(response.data.detail);
			}
		} else {
			setLoginError(true);
			setServerErrorMessage("Provide valid credentials");
		}
		setLoading(false);
	}

	return (
		<div className="bgImage">
			<div id="container1">
				<h2>Welcome to Silzila!</h2>

				<form
					onSubmit={e => {
						e.preventDefault();
						handleSubmit(e);
					}}
					autoComplete="on"
				>
					<div id="formElement">
						<input
							ref={inputRef}
							type="text"
							placeholder="Email"
							value={account.email}
							onChange={e =>
								setAccount({
									...account,
									email: e.target.value,
								})
							}
							className="inputElement"
							onFocus={resetEmailError}
							onBlur={() => {
								setLoginError(false);
								var valid = validateEmail(account.email);
								if (valid) {
									setAccount({ ...account, emailError: "" });
								} else {
									setAccount({
										...account,
										emailError: "Enter valid email address",
									});
								}
							}}
						/>
						<div id="error">{account.emailError}</div>
					</div>

					<div id="formElement">
						<input
							type="password"
							placeholder="Password"
							value={account.password}
							onChange={e =>
								setAccount({
									...account,
									password: e.target.value,
								})
							}
							className="inputElement"
							onFocus={resetPwdError}
							onBlur={() => {
								setLoginError(false);
								var valid = validatePassword(account.password);
								if (valid) {
									setAccount({ ...account, passwordError: "" });
								} else {
									setAccount({
										...account,
										passwordError: "Minimum 8 characters",
									});
								}
							}}
						/>
						<div id="error">{account.passwordError}</div>
					</div>

					<div className="buttonSuccess">
						{loginStatus ? (
							<span className="loginSuccess">
								<h4>Logged in successfully!</h4>
								<p>Redirecting....</p>
							</span>
						) : (
							<React.Fragment>
								{loginError ? (
									<p className="loginFail">{serverErrorMessage}</p>
								) : null}
								<div className="buttonText">
									<Button
										id="loginSignupButton"
										variant="contained"
										type="submit"
										value="Login"
										onClick={e => {
											e.preventDefault();
											handleSubmit(e);
										}}
									>
										Login
									</Button>
									<br />
									<span id="emailHelp">
										Dont have an account yet?{" "}
										<Link to="/signup" style={{ color: "#5502fb" }}>
											Sign Up
										</Link>
									</span>
								</div>
							</React.Fragment>
						)}
					</div>
				</form>
				{loading ? <LoadingPopover /> : null}
			</div>
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
