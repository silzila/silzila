import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Navbar from '../Components/Navbar';
import WorkspaceList from '../Components/Workspace';
import "./pages.css";
import { fontSize, palette } from '..';

const Workspace = () => {
    const Breadcrumb = () => {
        return (
            <div className="breadcrumb"style={{fontSize:fontSize.medium ,color:palette.primary.contrastText}}>
                <div className="breadcrumb-header">
                   
                    <span className="breadcrumb-link">
                       <a style={{fontSize:fontSize.medium}}></a>
                    </span>
                   
                    <span className="breadcrumb-link">
                        <a></a>
                    </span>
    
                    <a className="breadcrumb-current" style={{fontSize:fontSize.medium}}></a>
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
                    <WorkspaceList />
                </div>
            </div>
        </>
    );
};

export default Workspace;