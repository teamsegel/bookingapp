import React from "react";
import "./Navbar.css"; // Import the corresponding CSS file

const Navbar = () => {
    return (
        <nav className="navbar">
            {/* Left Logo */}
            <div className="navbar-logo">
                <h1>Timy</h1>
            </div>

            {/* Right Section */}
            <div className="navbar-right">
                <button className="business-btn">For business</button>
                <div className="menu-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
