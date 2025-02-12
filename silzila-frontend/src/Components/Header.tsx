import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Assuming you're using react-router for navigation
import styles from './header.module.css';
import { Tooltip, Menu, MenuItem, IconButton, CircularProgress, Typography } from "@mui/material";
import {serverEndPoint, localEndPoint} from "./ServerCall/EnvironmentVariables";
import Cookies from "js-cookie";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { resetUser, userAuthentication } from "../redux/UserInfo/isLoggedActions";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import FetchData from './ServerCall/FetchData';
import { palette } from '..';
import {DeleteAllCookies} from '../Components/CommonFunctions/CommonFunctions';
import { useDispatch } from 'react-redux';
import { fromRoute, navigatetTo } from './CommonFunctions/aliases';


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
  const dispatch=useDispatch()
    const fetchUserDetails = async (forceFetch = false) => {
      if(!forceFetch && props.isLogged.isUserLogged && props.isLogged.email!=='')return
        try {
            // Use the FetchData utility to make the request
            setLoading(true);
            const apiUrl = `${localEndPoint}user-details`; 
            const response = await FetchData({
                requestType: 'withData',
                method: 'GET',
                url: apiUrl,
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

  

    const handleLogout = () => {
      dispatch(resetUser())
      DeleteAllCookies();              
      Cookies.remove('authToken');
      localStorage.clear();
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      
    }

// useEffect(() => {
//   if (location.pathname === '/admin/users') {
//     fetchUserDetails(true); // Force-fetch details when navigating to /admin/users
//   }
// }, [location.pathname]);


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
              if (
                props.from === fromRoute.dataViewer &&
                typeof props.saveAndNavigateTo === "function"
              )
              props.saveAndNavigateTo(navigatetTo.login);
              else{
                handleLogout()
              }
              
            }} 
            style={{
              height: "50px",
              alignItems: "center",
            }}
          >
            <div  className="menuLink" 
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
            </div>
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
