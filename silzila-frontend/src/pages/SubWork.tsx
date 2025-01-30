import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Header from '../Components/Header';
import SubWorkspace from '../Components/SubWorkspace';
import "./pages.css";

const SubWork = () => {
    const Breadcrumb = () => {
        const location = useLocation();
        const parentWorkspaceName = location.state?.wname || localStorage.getItem("workspaceName") || "SubWorkspace";
       
        useEffect(() => {
            if (location.state?.wname) localStorage.setItem("workspaceName", location.state.wname);
        }, [location.state]);

        return (
            <div className="breadcrumb">
                <div className="breadcrumb-header">
                   
                    <Link to="/" className="breadcrumb-link">
                       <a>Home</a>
                    </Link>
                   
                    <Link to="/" className="breadcrumb-link">
                        <a>Workspace</a>
                    </Link>

                    <span className="breadcrumb-current">{parentWorkspaceName}</span>
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
            <div className="" style={{padding:'0.5rem'}}>
            <Header />
            </div>
            <div className="layout-container">
                <div className={`navbar-container ${isCollapsed ? 'collapsed' : ''}`}>
                    <Navbar isCollapsed={isCollapsed} toggleNavbar={toggleNavbar} />
                </div>
                <div className="component-container">
                    <Breadcrumb />
                    <SubWorkspace />
                </div>
            </div>         
        </>
    );
}

export default SubWork;
