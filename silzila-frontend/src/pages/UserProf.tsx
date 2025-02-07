import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Navbar from '../Components/Navbar';
import AddUser from '../Components/AddUser';
import "./pages.css";
import { fontSize } from '..';

const UpdateProfile = () => {
  const Breadcrumb = () => {
    return (
        <div className="breadcrumb">
            <div className="breadcrumb-header">
               
               <Link to="/" className="breadcrumb-link">
                  <a style={{fontSize:fontSize.medium}}>Home</a>
                </Link>

                <span className="breadcrumb-current" style={{fontSize:fontSize.medium}}>Update Profile</span>
            </div>
        </div>
    );
};
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const storedState = typeof window !== 'undefined' ? localStorage.getItem('navbarCollapsed') : null;
    return storedState ? JSON.parse(storedState) : false;
});

const toggleNavbar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== 'undefined') {
        localStorage.setItem('navbarCollapsed', JSON.stringify(newState));
    }
};

useEffect(() => {
    const storedState = localStorage.getItem('navbarCollapsed');
    if (storedState) {
        setIsCollapsed(JSON.parse(storedState));
    }
}, []);

  return (
    <>
      <div style={{padding: "0.5rem",}}>
      <Header />
      </div>
      <div className="layout-container">
                <div className={`navbar-container ${isCollapsed ? 'collapsed' : ''}`}>
                    <Navbar isCollapsed={isCollapsed} toggleNavbar={toggleNavbar} />
                </div>
                <div className="component-container">
                    <Breadcrumb />
                    <AddUser />
                </div>
            </div>
    </>
  );
}

export default UpdateProfile;
