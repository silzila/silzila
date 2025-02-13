import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./adduser.css";
import { AlertColor } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { NotificationDialog } from "./CommonFunctions/DialogComponents";
import FetchData from "./ServerCall/FetchData";
import { serverEndPoint } from "./ServerCall/EnvironmentVariables";
import { fontSize, palette } from "..";
import { connect } from "react-redux";
import { userAuthentication } from "../redux/UserInfo/isLoggedActions";
import { ffDialogTitle, ffButtonStyle } from "../Components/Controls/muiStyles";
import HoverButton from "./Buttons/HoverButton";

interface DecodedToken {
  tenant: string;
  access: string;
}

const AddUser = (props: any) => {
  const location = useLocation();
  const isUpdating = location.pathname.includes("update");
  const [image, setImage] = useState("/default.png");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [testMessage, setTestMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    image: "/default.png",
  });
  const [domain, setDomain] = useState("");
  const [emailUsername, setEmailUsername] = useState("");
  const [lockEmail, setLockEmail] = useState(false);
{ /*feature to be added 
 const domainParts = props.domainId.split("@");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        // const tenant = decoded.tenant;
        const tenant = domainParts.at(-1); // domain id
        setDomain(`@${tenant}`);

        if (decoded.access === "community") {
          setLockEmail(true);
        }
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);} */}

  // Fetch user details if updating
  // useEffect(() => {
  //     const fetchUserDetails = async () => {
  //         if (isUpdating) {
  //             setLoading(true);
  //             try {
  //                 const token = localStorage.getItem('accessToken');
  //                 const response = await axios.get('https://dev.silzila.com/api/user-details', {
  //                     headers: {
  //                         'Authorization': `Bearer ${token}`,
  //                     },
  //                 });
  //                 const data = response.data;

  //                 // Prepopulate the fields with the fetched user data
  //                 setFirstName(data.firstName || '');
  //                 setLastName(data.lastName || '');
  //                 setEmail(data.email || '');

  //                 if (data.email) {
  //                     const [username, domainPart] = data.email.split('@');
  //                     setEmailUsername(username || '');
  //                     setDomain(`@${domainPart}` || '');
  //                 }

  //                 // Check if a profile image exists, otherwise use default image
  //                 setImage(data.profileImage ? `data:image/jpeg;base64,${data.profileImage}` : '/default.png');

  //                     setOriginalData({
  //                         firstName: data.firstName || '',
  //                         lastName: data.lastName || '',
  //                         email: data.email || '',
  //                         image: data.profileImage
  //                             ? `data:image/jpeg;base64,${data.profileImage}`
  //                             : '/default.png',
  //                     });
  //             } catch (err) {
  //                 console.error(err);
  //                 setErrors({ general: 'Failed to fetch user details.' });
  //             } finally {
  //                 setLoading(false);
  //             }
  //             }
  //     };

  //     fetchUserDetails();
  // }, [isUpdating]);

  const fetchUserDetails = async () => {
    if (isUpdating) {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await FetchData({
          requestType: "noData",
          method: "GET",
          url: "user-details",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        // Prepopulate the fields with the fetched user data
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");

        if (data.email) {
          const [username, domainPart] = data.email.split("@");
          setEmailUsername(username || "");
          setDomain(`@${domainPart}` || "");
        }

        // Check if a profile image exists, otherwise use default image
        setImage(
          data.profileImage
            ? `data:image/jpeg;base64,${data.profileImage}`
            : "/default.png"
        );

        setOriginalData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          image: data.profileImage
            ? `data:image/jpeg;base64,${data.profileImage}`
            : "/default.png",
        });
        props.userAuthentication({
          ...props.isLogged,
          email: data.email,
          lastName: data.lastName,
          firstName: data.firstName,
          avatar: data.profileImage
            ? `data:image/jpeg;base64,${data.profileImage}`
            : "/default.png",
        });
      } catch (err) {
        console.error(err);
        setErrors({ general: "Failed to fetch user details." });
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, [isUpdating]);

  const isFormChanged = () => {
    return (
      firstName !== originalData.firstName ||
      lastName !== originalData.lastName ||
      email !== originalData.email ||
      image !== originalData.image
    );
  };

  // Reset form function
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setEmailUsername("");
    setPassword("");
    setImage("/default.png");
    setImageFile(null);
    setImageName("");
    setPhoto(null);
    setErrors({});
  };

  const showAlert = (message: string, severity: AlertColor) => {
    setTestMessage(message);
    setSeverity(severity);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    }, 3000);
  };

  // Validation function
  const validateForm = () => {
    const errors: any = {};

    if (!firstName.trim()) {
      errors.firstName = "First Name is required";
    }

    if (!emailUsername.trim()) {
      errors.email = "Email username is required";
    } else {
      const emailUsernameRegex = /^[a-zA-Z0-9._%+-]+$/;
      if (!emailUsername.match(emailUsernameRegex)) {
        errors.email = "Please provide a valid email username";
      }
    }

    if (!isUpdating && password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  // Handle form submission for both Add and Update
  // const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsSubmitting(true);
  //     setErrors({});

  //     if (isUpdating && !isFormChanged()) {
  //         showAlert('No changes made to update.', 'info');
  //         return;
  //      }
  //     const email = `${emailUsername}${domain}`;
  //     const validationErrors = validateForm();
  //     if (Object.keys(validationErrors).length > 0) {
  //         setErrors(validationErrors);
  //         setIsSubmitting(false);
  //         return;
  //     }

  //     try {
  //         const formData = new FormData();
  //         formData.append('firstName', firstName);
  //         formData.append('lastName', lastName);
  //         formData.append('email', email);

  //         if (!isUpdating) {
  //             formData.append('password', password);  // Append the actual password
  //         }

  //         const apiUrl = isUpdating ? 'https://dev.silzila.com/api/user/update' : 'https://dev.silzila.com/api/user/add';
  //         const method = isUpdating ? 'put' : 'post';

  //         // Append profile image file if available
  //         if (imageFile) {
  //             formData.append('profileImage', imageFile);
  //             console.log(imageFile);
  //         }

  //         const token = localStorage.getItem('accessToken');
  //         await axios({
  //             method,
  //             url: apiUrl,
  //             data: formData,
  //             headers: {
  //                 'Authorization': `Bearer ${token}`,
  //                 'Content-Type': 'multipart/form-data',
  //             },
  //         });
  //         showAlert(isUpdating ? 'User details updated successfully!' : 'User added successfully!', 'success');
  //         setTimeout(() => navigate('/admin/users'), 3100);
  //     } catch (err) {
  //         console.error(err);
  //         setErrors({ general: 'Failed to submit form.' });
  //         showAlert('An error occurred while submitting the form.', 'error');
  //     } finally {
  //         setIsSubmitting(false);
  //     }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (isUpdating && !isFormChanged()) {
      showAlert("No changes made to update.", "info");
      return;
    }

    const email = `${emailUsername}${domain}`;
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);

      if (!isUpdating) {
        formData.append("password", password); // Append the actual password
        formData.append("sendWelcomeMail", "true");
      }

      // Append profile image file if available
      // if (imageFile) {
      //   formData.append("profileImage", imageFile);
      //   console.log(imageFile);
      // }

      if (imageFile) {
        const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validImageTypes.includes(imageFile.type)) {
          showAlert("Only JPG, JPEG, and PNG files are allowed", "error");
          return;
        } else {
          formData.append("profileImage", imageFile);
          console.log(imageFile);
        }
      }

      const apiUrl = isUpdating ? "user/update" : "user/add"; // No leading slash
      const method = isUpdating ? "PUT" : "POST";

      const token = localStorage.getItem("accessToken");
      setLoading(true);

      const response = await FetchData({
        requestType: "withData", // As we are sending form data
        method,
        url: apiUrl,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      if (response.status) {
        setLoading(false);
        setTimeout(() => {
          isUpdating ? navigate("/") : navigate("/admin/users");
        }, 2000);
        showAlert(
          isUpdating
            ? "User details updated successfully!"
            : "User added successfully!",
          "success"
        );
      } else if (response.data === "Email is already registered") {
        setLoading(false);
        showAlert(
          "User is already registered! Please add another user.",
          "warning"
        );
        setErrors({ general: "User is already registered." });
      } else {
        setLoading(false);

        setErrors({ general: "Failed to submit form." });
        showAlert("An error occurred while submitting the form.", "error");
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: "Failed to submit form." });
      showAlert("An error occurred while submitting the form.", "error");
    } finally {
      setIsSubmitting(false);
      fetchUserDetails();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validImageTypes.includes(file.type)) {
        showAlert("Only JPG, JPEG, and PNG files are allowed", "error");
        fileInput.value = "";
        return;
      }

      if (file.size > 1048576) {
        showAlert("File size should not exceed 1MB", "error");
        fileInput.value = "";
        return;
      }
      setImage(URL.createObjectURL(file));
      setImageName(file.name);
      setPhoto(file);
      setImageFile(file);
      console.log(URL.createObjectURL(file));
    }
  };

  const handleImageDelete = () => {
    setImage("/default.png");
    setImageName("");
    setPhoto(null);
  };

  return (
    <div className="profile-user-container">
      <div className="profile-header-image-form-container">
        {loading ? (
          <div className="loading-container" style={{ overflow: "hidden" ,paddingBottom:'20px'}}>
            <div className="user-spinner"></div>
          </div>
        ) : (
          <>
            <h2
              style={{
                fontSize: fontSize.xxl,
                color: palette.primary.contrastText,
                paddingBottom:"20px",
              }}
            >
              {isUpdating ? "Update Profile" : "Create New User"}
            </h2>

            <div
              className={
                isUpdating
                  ? "profile-photo-form-container-update-mode"
                  : "profile-photo-form-container"
              }
            >
              <div className="profile-photo-container">
                {image === "/default.png" ? (
                  <>
                    <div className="profile-image">
                      <img
                        src="/default.png"
                        alt="Default"
                        className="profile-default-preview"
                      />
                    </div>
                    <div className="profile-upload-button">
                      <label
                        style={{ cursor: "pointer", fontSize: fontSize.medium }}
                      >
                        Choose File
                        <input
                          type="file"
                          onChange={handleImageChange}
                          className="profile-file-input"
                          style={{ fontSize: fontSize.medium }}
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="profile-image-uploaded">
                      <img
                        src={image}
                        alt="Uploaded"
                        className="profile-photo-uploaded-preview"
                      />
                      <img
                        src="/cross.png"
                        alt="Delete"
                        className="profile-delete-icon"
                        onClick={handleImageDelete}
                      />
                    </div>

                    <div className="profile-image-info">
                      <span
                        style={{
                          fontSize: fontSize.medium,
                          color: palette.primary.contrastText,
                        }}
                      >
                        {imageName}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="profile-user-details">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="profile-input-row">
                    <input
                      type="text"
                      placeholder="First Name*"
                      className="profile-input-field-first-row"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{
                        fontSize: fontSize.medium,
                        color: palette.primary.contrastText,
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="profile-input-field-second-row"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{
                        fontSize: fontSize.medium,
                        color: palette.primary.contrastText,
                      }}
                    />
                    {errors.firstName && (
                      <p
                        className="profile-error"
                        // style={{
                        //   fontSize: fontSize.medium,
                        //   color: palette.primary.contrastText,
                        // }}
                      >
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="profile-input-row">
                    <input
                      type="text"
                      placeholder="Email username*"
                      className="profile-input-field-first-row"
                      value={emailUsername}
                      readOnly={lockEmail}
                      disabled={lockEmail}
                      onChange={(e) => {
                        const username = e.target.value.replace(/@.*/, "");
                        setEmailUsername(username);
                      }}
                      style={{
                        fontSize: fontSize.medium,
                        color: palette.primary.contrastText,
                      }}
                    />

                    <input
                      type="text"
                      className="profile-input-field-second-row"
                      value={domain}
                      readOnly
                      style={{
                        cursor: "not-allowed",
                        fontSize: fontSize.medium,
                        color: palette.primary.contrastText,
                      }}
                    />
                    {errors.email && (
                      <p
                        className="profile-error"
                        // style={{
                        //   fontSize: fontSize.medium,
                        //   color: palette.primary.contrastText,
                        // }}
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {!isUpdating && (
                    <div className="profile-input-row profile-password-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password*"
                        className="profile-input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // style={{
                        //   fontSize: fontSize.medium,
                        //   color: palette.primary.contrastText,
                        // }}
                      />
                      <button
                        type="button"
                        className="profile-eye-button"
                        onMouseOver={() => setShowPassword(true)}
                        onMouseLeave={() => setShowPassword(false)}
                      >
                        <img
                          src="/eye.png"
                          height="15px"
                          width="15px"
                          alt="Show Password"
                        ></img>
                      </button>
                      {errors.password && (
                        <p
                          className="profile-error"
                          // style={{
                          //   fontSize: fontSize.medium,
                          //   color: palette.primary.contrastText,
                          // }}
                        >
                          {errors.password}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="profile-button-row">
                    <HoverButton
                      sx={{
                        ...ffButtonStyle,
                        border: `1px solid ${palette.primary.contrastText}`,
                        fontSize: fontSize.medium,
                        lineHeight: "normal",
                        marginRight: "1rem",
                        height: "32px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        width: "90px",
                        boxSizing: "border-box",
                        transition: "all 0.3s",
                        fontFamily: "Roboto-Light",
                      }}
                      text={isUpdating ? "Back" : "Reset"}
                      hoverColor="secondary.contrastText"
                      color="primary.contrastText"
                      hoverBackgroundColor="primary.contrastText"
                      backgroundColor="secondary.contrastText"
                      transitionTime="0.2s"
                      onClick={() => {
                        if (isUpdating) {
                          navigate("/");
                          fetchUserDetails();
                        } else {
                          resetForm();
                        }
                      }}
                    />
                    <HoverButton
                      sx={{
                        ...ffButtonStyle,
                        border: `1px solid ${palette.primary.main}`,
                        fontSize: fontSize.medium,
                        lineHeight: "normal",
                        marginRight: "1rem",
                        height: "32px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        width: "90px",
                        boxSizing: "border-box",
                        transition: "all 0.3s",
                        fontFamily: "Roboto-Light",
                      }}
                      type="submit"
                      text={isUpdating ? "Update" : "Create User"}
                      color="primary.main"
                      hoverColor="secondary.contrastText"
                      backgroundColor="secondary.contrastText"
                      hoverBackgroundColor="primary.main"
                      transitionTime="0.2s"
                    />
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
      <NotificationDialog
        openAlert={openAlert}
        severity={severity}
        testMessage={testMessage}
        onCloseAlert={() => {
          setOpenAlert(false);
          setTestMessage("");
        }}
        // sx={{
        //   marginLeft: "16.7rem",
        // }}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    domainId: state.isLogged.email,
    isLogged: state.isLogged,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    userAuthentication: (payload: any) => dispatch(userAuthentication(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
