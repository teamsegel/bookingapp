import React, { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import "./Navbar.css";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1>Timy</h1>
            </div>
            <div className="navbar-right">
                {/* For Business Button */}
                <button className="business-btn">For business</button>

                {/* Log in Button */}
                <button className="login-btn">Log in</button>

                {/* Hamburger Menu */}
                <div className="menu-icon" onClick={toggleDropdown}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* Dropdown Menu */}
                <DropdownMenu isOpen={isDropdownOpen} onClose={closeDropdown} />
            </div>
        </nav>
    );
};

export default Navbar;
