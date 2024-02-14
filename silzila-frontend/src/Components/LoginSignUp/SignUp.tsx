// Sign up component. Used to create new accounts

import { Button } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	validateEmail,
	validateEqualValues,
	validateMandatory,
	validatePassword,
} from "../CommonFunctions/CommonFunctions";
import FetchData from "../ServerCall/FetchData";
import { SignUpDetails } from "./LoginSignUpInterfaces";

const initialState = {
	name: "",
	nameError: "",

	email: "",
	emailError: "",

	password: "",
	passwordError: "",

	password2: "",
	password2Error: "",
};

const SignUp = () => {
	const navigate = useNavigate();

	const [account, setAccount] = useState<SignUpDetails>(initialState);

	const [signUpStatus, setSignUpStatus] = useState<boolean>(false);
	const [signUpError, setSignUpError] = useState<boolean>(false);
	const [serverErrorMessage, setServerErrorMessage] = useState<string>("");

	const resetNameError = () => {
		setAccount({
			...account,
			nameError: "",
		});

		setSignUpError(false);
	};

	const resetEmailError = () => {
		setAccount({
			...account,
			emailError: "",
		});

		setSignUpError(false);
	};

	const resetPasswordError = () => {
		setAccount({
			...account,
			passwordError: "",
		});

		setSignUpError(false);
	};

	const resetPassword2Error = () => {
		setAccount({
			...account,
			password2Error: "",
		});

		setSignUpError(false);
	};

	const handleSubmit = async () => {
		var canSignUp = false;

		// Check if there is someinput in all fields
		if (
			account.name.length > 0 &&
			account.email.length > 0 &&
			account.password.length > 0 &&
			account.password2.length > 0 &&
			account.nameError === "" &&
			account.emailError === "" &&
			account.passwordError === "" &&
			account.password2Error === ""
		) {
			canSignUp = true;
		}

		if (canSignUp) {
			var form = {
				name: account.name,
				username: account.email,
				password: account.password,
				device: "web",
			};
			// TODO:need to specify types
			var response: any = await FetchData({
				requestType: "withData",
				method: "POST",
				url: "auth/signup",
				data: form,
				headers: { "Content-Type": "application/json" },
			});

			if (response.status) {
				setSignUpStatus(true);

				setTimeout(() => {
					navigate("/login");
				}, 2000);
			} else {
				setSignUpError(true);
				setServerErrorMessage(response.data.detail);
			}
		} else {
			setSignUpError(true);
			setServerErrorMessage("Provide all details above");
		}
	};

	return (
		<div className="bgImage">
			<div id="container1">
				<h2>Welcome to Silzila</h2>
				<form
					onSubmit={e => {
						e.preventDefault();
						handleSubmit();
					}}
					autoComplete="on"
				>
					<div id="formElement">
						<input
							type="text"
							placeholder="Name"
							value={account.name}
							onChange={e =>
								setAccount({
									...account,
									name: e.target.value,
								})
							}
							className="inputElement"
							onFocus={resetNameError}
							onBlur={() => {
								setSignUpError(false);
								var valid = validateMandatory(account.name);
								if (valid) {
									setAccount({ ...account, nameError: "" });
								} else {
									setAccount({ ...account, nameError: "Enter your name" });
								}
							}}
						/>
						<div id="error">{account.nameError}</div>
					</div>

					<div id="formElement">
						<input
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
								setSignUpError(false);
								var valid = validateEmail(account.email);
								if (valid) {
									setAccount({ ...account, emailError: "" });
								} else {
									setAccount({ ...account, emailError: "Provide a valid email" });
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
							onFocus={resetPasswordError}
							onBlur={() => {
								setSignUpError(false);
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

					<div id="formElement">
						<input
							type="password"
							placeholder="Re-enterPassword"
							value={account.password2}
							onChange={e =>
								setAccount({
									...account,
									password2: e.target.value,
								})
							}
							className="inputElement"
							onFocus={resetPassword2Error}
							onBlur={() => {
								setSignUpError(false);
								var valid = validateEqualValues(
									account.password2,
									account.password
								);
								if (valid) {
									setAccount({ ...account, password2Error: "" });
								} else {
									setAccount({
										...account,
										password2Error: "Passwords don't match",
									});
								}
							}}
						/>
						<div id="error">{account.password2Error}</div>
					</div>
					{signUpStatus ? (
						<span className="loginSuccess">
							<h4>Sign up successfully!</h4>
							<p>Redirecting to login page....</p>
						</span>
					) : (
						<React.Fragment>
							{signUpError ? <p className="loginFail">{serverErrorMessage}</p> : null}
							<div className="buttonText">
								<Button
									id="loginSignupButton"
									variant="contained"
									type="submit"
									value="Sign Up"
									onClick={e => {
										e.preventDefault();
										handleSubmit();
									}}
								>
									sign Up
								</Button>
								<br />
								<span id="emailHelp">
									Already have an account?{" "}
									<Link to="/login" style={{ color: "#5502fb" }}>
										Login
									</Link>
								</span>
							</div>
						</React.Fragment>
					)}
				</form>
			</div>
		</div>
	);
};

export default SignUp;
