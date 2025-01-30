import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Header from '../Components/Header';
import SubWorkspaceDetails from '../Components/SubWorkspaceDetails';
import "./pages.css";
import { fontSize, palette } from '..';

const SubWorkDetails = () => { 
 const Breadcrumb = () => {
    const location = useLocation();
    const parentWorkspaceName = location.state?.wname || localStorage.getItem("workspaceName") || "SubWorkspace Details";
    const childWorkspaceName = location.state?.name || localStorage.getItem("childWorkspaceName") || ""; 
    const parentId = location.state?.parentId || localStorage.getItem("parentId");

    useEffect(() => {
        if (location.state?.wname) localStorage.setItem("workspaceName", location.state.wname);
        if (location.state?.name) localStorage.setItem("childWorkspaceName", location.state.name);
        if (location.state?.parentId) localStorage.setItem("parentId", location.state.parentId);
    }, [location.state]);

    console.log('Breadcrumb:', { parentWorkspaceName, childWorkspaceName, parentId });
        return (
            <div className="breadcrumb">
                <div className="breadcrumb-header">
                    <Link to="/" className="breadcrumb-link">
                        <a style={{fontSize:fontSize.medium,color:palette.primary.contrastText}}>Home</a>
                    </Link>
                    
                    <Link to="/" className="breadcrumb-link">
                        <a style={{fontSize:fontSize.medium,color:palette.primary.contrastText}}>Workspace</a>
                    </Link>
                    
                    <Link to={`/workspace/${parentId}`} className="breadcrumb-link">
                        <a className="breadcrumb-current" style={{fontSize:fontSize.medium,color:palette.primary.contrastText}}>{parentWorkspaceName}</a>
                    </Link>

                        <span className="breadcrumb-current" style={{fontSize:fontSize.medium,color:palette.primary.contrastText}}>{childWorkspaceName}</span>
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
            <div style={{
        padding: "0.5rem",}}>
                        <Header />
                        </div>
            <div className="layout-container">
                <div className={`navbar-container ${isCollapsed ? 'collapsed' : ''}`}>
                    <Navbar isCollapsed={isCollapsed} toggleNavbar={toggleNavbar} />
                </div>
                <div className="component-container">
                    <Breadcrumb />
                    <SubWorkspaceDetails/>
                </div>
            </div>
        </>
    )
}
export default SubWorkDetails;