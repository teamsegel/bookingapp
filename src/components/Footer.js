import React from "react";
import "./Footer.css"; // Import the CSS file for styling
import appleLogo from "./assets/apple-logo.png"; // Add the Apple logo image
import googleLogo from "./assets/google-logo.png"; // Add the Google logo image

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-logo">
                    <h1>Timy</h1>
                    <button className="app-btn">
                        Get the app
                        <img
                            src={appleLogo}
                            alt="Download on the App Store"
                            className="app-icon"
                        />
                        <img
                            src={googleLogo}
                            alt="Get it on Google Play"
                            className="app-icon"
                        />
                    </button>
                </div>
                <div className="footer-columns">
                    <div className="footer-column">
                        <h3>For business</h3>
                        <ul>
                            <li>For partners</li>
                            <li>Pricing</li>
                            <li>Card terminals</li>
                            <li>Support</li>
                            <li>Status</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>About Timy</h3>
                        <ul>
                            <li>Careers</li>
                            <li>Customer Support</li>
                            <li>Blog</li>
                            <li>Sitemap</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Legal</h3>
                        <ul>
                            <li>Privacy Policy</li>
                            <li>Terms of service</li>
                            <li>Terms of use</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Find us on social</h3>
                        <ul>
                            <li>Facebook</li>
                            <li>Twitter</li>
                            <li>LinkedIn</li>
                            <li>Instagram</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-language">
                    <span>🌐 English</span>
                </div>
                <div className="footer-copyright">
                    © 2024 Timy.com
                </div>
            </div>
        </footer>
    );
};

export default Footer;
