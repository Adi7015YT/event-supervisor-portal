import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/gdscLogo.png";

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check authentication status when component mounts and when location changes
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("access");
            setIsAuthenticated(!!token);
        };

        checkAuth();
        // Add event listener for storage changes to handle authentication updates
        window.addEventListener('storage', checkAuth);
        
        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsAuthenticated(false);
        navigate("/");
    };

    // Hide authentication buttons on login page
    const showAuthButton = location.pathname !== "/";

    return (
        <div className="bg-blue-600 flex flex-wrap md:justify-evenly p-4 md:p-0 text-white">
            <div className="flex items-center space-x-2 md:space-x-6 w-full md:w-auto justify-center md:justify-start">
                <img className="h-8 logo" src={logo} alt="Logo" />
                <h1 className="text-lg md:text-xl text-center md:text-left">
                    <span className="md:hidden">GDG on Campus - </span>
                    <span className="hidden md:inline">Google Developer Group on Campus - </span>
                    <strong>MAKAUT</strong>
                </h1>
            </div>
            <div className="py-2 md:py-4 w-full md:w-auto flex justify-center md:justify-end">
                <ul className="flex flex-wrap space-x-4 md:space-x-6">
                    {isAuthenticated && (
                        <li className="hover:bg-sky-500 py-2 px-3 rounded-lg">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                    )}
                    {showAuthButton && (
                        isAuthenticated ? (
                            <li 
                                onClick={handleLogout} 
                                className="cursor-pointer hover:bg-sky-500 py-2 px-3 rounded-lg"
                            >
                                Log Out
                            </li>
                        ) : (
                            <li className="hover:bg-sky-500 py-2 px-3 rounded-lg">
                                <Link to="/">Log In</Link>
                            </li>
                        )
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Header;