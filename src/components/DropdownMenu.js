import React from "react";
import "./DropdownMenu.css";

const DropdownMenu = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="dropdown-menu">
            <ul>
                <li><a href="#login">Log in</a></li>
                <hr />
                <li><a href="#download">Download the app</a></li>
                <li><a href="#support">Customer support</a></li>
                
                <li><a href="#business">Timy for business</a></li>
            </ul>
        </div>
    );
};

export default DropdownMenu;
