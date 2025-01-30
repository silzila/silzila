// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import styles from './navbar.module.css';

// const Navbar = () => {
//     const location = useLocation();
//     const currentPath = location.pathname;

//     return (
//         <header className={styles.header}>
//             <div className={styles.buttonRow}>
//                 <div className={styles.usersContainer}>
//                     <Link to="/admin/users" className={`${styles.button} ${currentPath === '/admin/users' ? styles.active : ''}`}>
//                         <img src="/user.png" alt="Users" width={20} height={20} />
//                         <span className={styles.buttonText}>Users</span>
//                         {/* <img src="/info.png" alt="Info" width={13} height={13} className={styles.infoIcon} /> */}
//                         {/* <div className={styles.tooltip}>
//                         This section lists the users that have been added to your organisation account. Click/Hover on a user to view detailed information about the particular user to change any specific user-settings.
//                     </div>    */}
//                     </Link>
//                 </div>
//                 <div className={styles.groupsContainer}>
//                     <Link to="/admin/groups" className={`${styles.button} ${currentPath === '/admin/groups' ? styles.active : ''}`}>
//                         <img src="/groups.png" alt="Groups" width={20} height={20} />
//                         <span className={styles.buttonText}>Groups</span>
//                     </Link>
//                 </div>

//                 <div className={styles.adminsContainer}>
//                     <Link to="/admin/admins" className={`${styles.button} ${currentPath === '/admin/admins' ? styles.active : ''}`}>
//                         <img src="/admin.png" alt="Admin" width={20} height={20} />
//                         <span className={styles.buttonText}>Admins</span>
//                     </Link>
//                 </div>
//                 {/* <div className={styles.workContainer}>
//                     <Link to="/home/workspace" className={`${styles.button} ${currentPath === '/home/workspace' ? styles.active : ''}`}>
//                         <img src="/workspace.png" alt="Workspace" width={20} height={20} />
//                         <span className={styles.buttonText}>Workspace</span>
//                     </Link>
//                 </div> */}
//             </div>
//         </header>
//     );
// };

// export default Navbar;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./navbar.module.css";
import { jwtDecode } from "jwt-decode";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Tooltip } from "@mui/material";
import { fontSize, palette } from "..";

interface NavbarProps {
  isCollapsed: boolean;
  toggleNavbar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isCollapsed, toggleNavbar }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  // Tooltip state
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Assume you get the token from localStorage or any auth service
  const token = localStorage.getItem("accessToken");
  let access: any = null;

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      access = decodedToken.access; // Access could be 'user' or 'admin'
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // If the user access is 'user', do not show the navbar
  if (access === "user") {
    return null;
  }

  return (
    <header
      className={` ${
        isCollapsed ? styles.collapsedHeader : styles.expandedHeader
      }`}
    >
      <div className={styles.navContent}>
        <div className={styles.navbarLogo}>
          <img
            src="/logo.png"
            alt="Company Logo"
            style={{ width: "30px", height: "30px", marginLeft: "-10px" }}
            className="navbar-img"
          />
          <span
            className={styles.navbarLogoName}
            style={{
              fontSize: fontSize.xxl,
              color: palette.primary.contrastText,
            }}
          >
            Silzila
          </span>
        </div>

        <div className={styles.navbarButtonRow}>
          <div className={styles.navbarHomeContainer}>
            <Link
              to="/workspace"
              className={`${styles.navbarButton} ${
                location.pathname === "/" ? styles.navbarActive : ""
              }`}
            >
              <img
                src="/home.png"
                alt="Home"
                style={{ width: "23px", height: "23px", marginLeft: "-5px" }}
              />
              {!isCollapsed && (
                <span
                  className={styles.navbarButtonText}
                  style={{
                    fontSize: fontSize.large,
                    color: palette.primary.contrastText,
                  }}
                >
                  Home
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Future Update
        <div className={styles.navbarButtonRow}>
          <div className={styles.navbarFolderContainer}>
            <Link to="/" className={styles.navbarButton}>
              <img
                src="/folder_work.png"
                alt="Folder"
                style={{ width: "19px", height: "19px", marginLeft: "-1px" }}
              />
              {!isCollapsed && (
                <span className={styles.navbarButtonText}>Explore</span>
              )}
            </Link>
          </div>
        </div> */}

      </div>

      <div onClick={toggleNavbar} className={styles.toggleNavbar}>
        <Tooltip
          title={isCollapsed ? "Expand" : "Collapse"}
          placement="right"
          onOpen={() => setTooltipOpen(true)}
          onClose={() => setTooltipOpen(false)}
          open={tooltipOpen}
        >
          <div
            className={styles.expandCollapsed}
            onClick={() => {
              setTooltipOpen(false);
              toggleNavbar();
            }}
          >
            {isCollapsed ? (
              <ArrowForwardIosIcon
                fontSize="small"
                style={{
                  color: palette.primary.contrastText,
                }}
                // style={{ width: "20px", height: "20px", color: "#616464" }}
              />
            ) : (
              <ArrowBackIosIcon
                fontSize="small"
                style={{
                  color: palette.primary.contrastText,
                  marginLeft: "5px",
                }}
                // style={{ width: "20px", height: "20px", color: "#616464" }}
              />
            )}
          </div>
        </Tooltip>
      </div>
    </header>
  );
};

export default Navbar;
