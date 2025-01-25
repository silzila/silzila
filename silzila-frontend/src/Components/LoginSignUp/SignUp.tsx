// Sign up component. Used to create new accounts

import { AlertColor } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FetchData from "../ServerCall/FetchData";
import { SignUpDetails } from "./LoginSignUpInterfaces";
import Header from "./Header";
import "./header.css";
import "./openSource_register.css";
import NotificationDialogRegister from "../CommonFunctions/DialogComponentforRegister";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

	const showAlert = (message: string, severity: "success" | "error") => {
		setTestMessage(message);
		setSeverity(severity);
		setOpenAlert(true);  
	};	

  const isFormValid = () =>
    email.trim() !== "" && password.trim() !== "" && firstName.trim() !== "";

  const isPasswordValid = () => password.trim().length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError("*Please fill in Email, First name and Password");
      return;
    }

    if (!isPasswordValid()) {
      setError("*Password should have at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await FetchData({
        requestType: "withData",
        method: "POST",
        url: "auth/signup",
        data: {
					name: `${firstName} ${lastName}`,
					username: email,
					password,
					device: "web",
				},
        headers: { "Content-Type": "application/json" },
      });

      if (response.status) {
        console.log("Registration successful:", response.data);
        showAlert("Registration successful! Please check your email for verification.", "success"); 
				setError(null);
        //navigate("/login");
      }
    } catch (error: any) {
      if (error.response) {
        if (
          error.response.status === 400 &&
          error.response.data ===
            "Email is already taken!"
        ) {
          showAlert(error.response.data, "success");
          setError("");
        } else {
          showAlert(
            "An error occurred. Please check your input and try again.",
            "error"
          );
          setError("An error occurred. Please check your input and try again.");
        }
      } else {
        console.error("Unexpected error:", error);
        showAlert(
          "A network error occurred. Please try again later.",
          "error"
        );
        setError("A network error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

	return (
		<div className="community-register-container-login">
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
		<div className="right-side">
			{loading ? (
				<div className="loading-overlay">
					<div className="loading-container">
						<p>Registering User...</p>
						<div className="user-spinner"></div>
					</div>
				</div>
			) : null}
			<div className="community-register-login-box">
				<form onSubmit={handleSubmit} className="community-register-form">
					<h3 className="community-register-h3">Personal Registration</h3>
					<input
						type="email"
						className="community-register-input"
						id="email"
						name="email"
						placeholder="Email*"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<div className="community-register-side-by-side">
						<input
							type="text"
							id="first-name"
							className="community-register-side-by-side-input"
							name="first-name"
							placeholder="First Name*"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
						<input
							type="text"
							id="last-name"
							className="community-register-side-by-side-input"
							name="last-name"
							placeholder="Last Name"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</div>
					<input
						type="password"
						id="password"
						className="community-register-input"
						name="password"
						placeholder="Password*"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{error && <p className="error">{error}</p>}{" "}
					{/* Display error message if error state is not null */}
					<div className="community-register-register-buttons">
						<button
							type="submit"
							className="community-register-register-button"
						>
							Register
						</button>
					</div>
					<div className="community-register-login-link2">
						Already Registered?
						<Link
							to="/login"
							className="community-register-login-link2"
						>
							<span className="nested-link">Log In</span>
						</Link>
					</div>
					<div className="community-register-terms-link-container">
						<div>
							<Link
								to="/terms-of-use"
								className="community-register-terms-link"
							>
								<span className="nested-link">Terms of Use</span>
							</Link>
						</div>
						<div>
							<Link
								to="/privacy-policy"
								className="community-register-terms-link"
							>
								<span className="nested-link">Privacy Policy</span>
							</Link>
						</div>
					</div>
					<div className="community-register-data-security">
							<p>We take data security very seriously. All your data is encrypted at-rest and in-motion.</p>
						</div>
				</form>
			</div>
		</div>

		<NotificationDialogRegister
        openAlert={openAlert}
        severity={severity}
        testMessage={testMessage}
        onCloseAlert={() => {
          if (severity === "success")
            window.location.href = "/login";
          setOpenAlert(false);
          setTestMessage("");
        }}
      />

	</div>
	);
};

export default SignUp;
