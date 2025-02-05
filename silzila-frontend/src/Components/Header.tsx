import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Assuming you're using react-router for navigation
import styles from './header.module.css';
import { Tooltip, Menu, MenuItem, IconButton, CircularProgress, Typography } from "@mui/material";
import {serverEndPoint, localEndPoint} from "./ServerCall/EnvironmentVariables";
import Cookies from "js-cookie";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { userAuthentication } from "../redux/UserInfo/isLoggedActions";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import FetchData from './ServerCall/FetchData';
import { palette } from '..';
import {DeleteAllCookies} from '../Components/CommonFunctions/CommonFunctions';


const Header = (props:any) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  // State to store user details
  const [user, setUser] = useState(props.isLogged.isUserLogged?{
    firstName: props.isLogged.firstName,
    lastName: props.isLogged.lastName,
    email: props.isLogged.email,
    avatar: props.isLogged.avatar
  }:{
    firstName: '',
    lastName: '',
    email: '',
    avatar: ''
  });
  
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch user details from the API
  // useEffect(() => {
  //   const token =localStorage.getItem('accessToken')
  //   const fetchUserDetails = async () => {
  //     try {
  //       const response = await fetch('https://dev.silzila.com/api/user-details', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           // Include authentication headers if required
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.status} ${response.statusText}`);
  //       }

  //       const data = await response.json();
        
  //       // Assuming the API returns data in the following format:
  //       // { name: 'John Doe', email: 'john.doe@example.com', avatar: '/path/to/avatar.png' }
  //       setUser({
  //         firstName: data.firstName || ' ',
  //         lastName: data.lastName||'',
  //         email: data.email || 'N/A',
  //         avatar: data.profileImage && data.profileImage.trim() !== '' ? `data:image/jpeg;base64,${data.profileImage}` : '/default.png',
  //       });
  //       setLoading(false);
  //     } catch (err) {
  //       console.error(err);
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserDetails();
  // }, []);

  
    const fetchUserDetails = async (forceFetch = false) => {
      if(!forceFetch && props.isLogged.isUserLogged && props.isLogged.email!=='')return
        try {
            // Use the FetchData utility to make the request
            setLoading(true);
            const response = await FetchData({
                requestType: 'withData',
                method: 'GET',
                url: 'user-details',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (!response.status) {
                throw new Error(`Error: ${response.data.detail || 'Unknown error'}`);
            }

            const data = response.data;

            // Assuming the API returns data in the following format:
            // { name: 'John Doe', email: 'john.doe@example.com', avatar: '/path/to/avatar.png' }
            setUser({

                firstName: data.firstName || ' ',
                lastName: data.lastName || '',
                email: data.email || 'N/A',
                avatar: data.profileImage && data.profileImage.trim() !== '' 
                    ? `data:image/jpeg;base64,${data.profileImage}` 
                    : '/default.png',
            });
            props.userAuthentication({
              isUserLogged: true,
              accessToken: props.isLogged.accessToken,
              tokenType: props.isLogged.tokenType,
              access: props.isLogged.access,
              firstName: data.firstName || ' ',
                lastName: data.lastName || '',
                email: data.email || 'N/A',
                avatar: data.profileImage && data.profileImage.trim() !== '' 
                    ? `data:image/jpeg;base64,${data.profileImage}` 
                    : '/default.png',
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
      setTimeout(fetchUserDetails, 2000);
    }, [props.isLogged.email, props.isLogged.isUserLogged]);

useEffect(() => {
  if (location.pathname === '/admin/users') {
    fetchUserDetails(true); // Force-fetch details when navigating to /admin/users
  }
}, [location.pathname]);


  const handleMenuOpen = (event:any) => {
    if (isOpen) {
      handleMenuClose();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  
  

  return (
    <header className={styles.header}>

      <div className={styles.nav}>        
        <div>
          <IconButton 
            onClick={handleMenuOpen}
            aria-haspopup="true"
            aria-expanded={isOpen ? "true" : "false"}
            sx={{
              cursor: "pointer",
              padding:"0 0.2rem",
              // padding: "0 0.3rem",
              // marginRight: "15px",
              "&:hover": {
                cursor: "pointer"
              },
            }} >
            <img 
              src={user.avatar!} 
              alt="Admin"  
              style={{ 
                border: "1px solid gray",
                borderRadius: "50%",
                verticalAlign: "center",
                textAlign: "center",
                width: "1.625rem", height: "1.625rem",
              }}
            />
          </IconButton>

          <Menu 
            anchorEl={anchorEl}
            open={isOpen}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                width: "280px",
                transform: "translate(10px, 7px)",           
                backgroundColor: "white",
                border: "1px solid transparent",
                color: "#616164",
                fontFamily: "Axiforma ExtraBold,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,sans-serif",
              },
            }}
          >
            <div 
              style={{
                height: "200px", 
                border: "1px solid transparent", 
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                justifyContent: "center",
                marginBottom: "0px",
                marginTop: "-8px"
              }}
            >
              {loading ? (
                <CircularProgress color="inherit" 
                sx={{ 
                  display: 'block', 
                  margin: '20px auto', 
                  color: '#007BFF',
                  width: '50px !important', 
                  height: '50px !important'
                }} />
              ) : error ? (
                <Typography variant="body1" color="error"
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginTop: '10px',
                  fontSize: '0.8rem',
                }}>
                  {error}
                </Typography>
              ) : (
                <div>
                  <img 
                    src={user.avatar!} 
                    alt="Admin" 
                    className="adminImage"
                    style={{ 
                      border: "1px solid gray",
                      borderRadius: "50px",
                      marginBottom: "10px",
                      marginTop: "30px",
                      width: "60px", height: "60px",
                    }}
                  />
                <div className='header-name-email-container' 
                 style={{
                    border: "2px solid transparent",
                    width: "260px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    marginLeft: "10px",
                    height: "80px",
                    color: palette.primary.contrastText
                }}>
                  <div className='user-name'
                    style={{
                      height: "30px",
                      border: "1px solid transparent",
                      marginBottom: "0px",
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: palette.primary.contrastText
                    }}
                  >
                   {`${user.firstName} ${user.lastName}`}
                  </div>

                  <div 
                    style={{
                      height: "30px",
                      border: "1px solid transparent",
                      color: palette.primary.contrastText
                    }}
                  >
                    {user.email}
                  </div>
                  </div>
                </div>
              )}
            </div>
              
            <MenuItem  onClick={() => { handleMenuClose(); navigate('/update-profile'); }} style={{height: "50px"}}>
              <Link to="/update-profile" className="menuLink"  onClick={() => { handleMenuClose(); }}  
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                <img 
                  src="/update.png" 
                  alt="Update Profile" 
                  style={{
                    marginRight: "5px", width: "20px", height: "20px"
                  }}
                />
                <span>Update Profile</span>
              </Link>
            </MenuItem>

            <MenuItem 
            onClick={() => { 
              handleMenuClose(); 
              //navigate('/logout');  

              setTimeout(() => {
                if(window.location.protocol === 'https:'){
                  let authToken:any = Cookies.get('authToken');
                  let decodedToken:any = jwtDecode(authToken);
  
                    if(decodedToken.access ===  "community"){
                      window.location.href = `${localEndPoint}auth/community/signin`;
                    }
                    else{
                      window.location.href = `${localEndPoint}auth/business/signin`;
                    }
                }
                else{
                  const payload = {
                    isUserLogged: false,
                    accessToken: "",
                    tokenType: "",
                    access: "", // Store the role in Redux
                    };        
                
                  props.userAuthentication(payload);
                } 

              }, 2000);
     
              DeleteAllCookies();              
              Cookies.remove('authToken');
              localStorage.clear();
            }} 
            style={{
              height: "50px",
              alignItems: "center",
            }}
          >
            <Link to="/login" className="menuLink" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                display: 'flex',
                alignItems: 'center'
              }}>
              <img 
                src="/logout.png" 
                alt="Logout"   
                style={{
                  marginRight: "8px",
                  transform: "translateY(1px)",
                  width: "17px",
                  height: "14px"
                }}
              />
              <span>Logout</span>
            </Link>
          </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
};

// Map dispatch to props
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    userAuthentication: (payload: any) => dispatch(userAuthentication(payload)),
  };
};
const mapStateToProps = (state: any) => {
  return {
    isLogged: state.isLogged,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
