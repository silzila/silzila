// Sign up component. Used to create new accounts

import { AlertColor, Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FetchData from "../ServerCall/FetchData";
import { SignUpDetails } from "./LoginSignUpInterfaces";
import Header from "./Header";
import "./header.css";
import "./openSource_register.css";
import NotificationDialogRegister from "../CommonFunctions/DialogComponentforRegister";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Logger from "../../Logger";
import { PopUpSpinner } from "../CommonFunctions/DialogComponents";
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
	const [showPassword, setShowPassword] = useState(false);
	const showAlert = (message: string, severity: "success" | "error") => {
		setTestMessage(message);
		setSeverity(severity);
		setOpenAlert(true);  
	};	

  const isFormValid = () =>
    email.trim() !== "" && password.trim() !== "" && firstName.trim() !== "";

  const isPasswordValid = () => password.trim().length >= 6;

	const isFirstNameValid = () => /^[a-zA-Z\s]*$/.test(firstName);
  const islastNameValid = () => /^[a-zA-Z\s]*$/.test(lastName);

  const handleSubmit = async (e: React.FormEvent) => {
	Logger("info","form submitted")
    e.preventDefault();

    if (!isFormValid()) {
		Logger("info","form not valid")
      setError("*Please fill in Email, First name and Password");
      return;
    }

    if (!isPasswordValid()) {
		Logger("info","password not valid")
		setError("*Password should have at least 6 characters");
		return;
	}
	
		if (!isFirstNameValid()) {
			Logger("info","password not valid")
      setError("*First Name should only contain alphabets");
      return;
    }
		
    if (!islastNameValid()) {
			Logger("info","password not valid")
      setError("*Last Name should only contain alphabets");
      return;
    }

    setLoading(true);

    try {
		Logger("info","fetching data")
      const response = await FetchData({
        requestType: "withData",
        method: "POST",
        url: "auth/signup",
        data: {
					firstName, 
					lastName,
					username: email,
					password,
					device: "web",
				},
        headers: { "Content-Type": "application/json" },
		checkToken: false,
      });

      if (response.status) {
        // console.log("Registration successful:", response.data);
        showAlert("Registration successful!", "success"); 
				setError(null);
        //navigate("/login");
      }
    } catch (error: any) {
		Logger("error",error)
      if (error.response) {
        if (
          error.response.status === 400 &&
          error.response.data ===
            "Email is already taken!"
        ) {
          showAlert(error.response.data, "error");
          setError("");
        } else {
          showAlert(
            "An error occurred. Please check your input and try again.",
            "error"
          );
          setError("An error occurred. Please check your input and try again.");
        }
      } else {
        // console.error("Unexpected error:", error);
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
				<PopUpSpinner show={!loading} />
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
					<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						width: '100%',
						border:'1px solid #ddd',
						borderRadius:'7px',
						backgroundColor:'white',
						height:'fit-content',
						marginBottom:'1rem',
						
					}}
					>
					<input
						type={showPassword ? "text" : "password"}
						id="login-password"
						name="login-password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						style={{
							border:'none',flexGrow:1,
							marginBottom:'0',
							outline:'none',
						}}
					/>
					<IconButton
						aria-label="toggle password visibility"
						sx={{
							marginRight:0
						}}
						onClick={() => setShowPassword(!showPassword)}
						edge="end">
						{
							showPassword ? <RemoveRedEyeIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small"/>
						}
					</IconButton>


					</Box>
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
							<p>All data is stored locally, and passwords cannot be recovered if lost.</p>
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
          navigate("/login");
          setOpenAlert(false);
          setTestMessage("");
        }}
      />

	</div>
	);
};

export default SignUp;
