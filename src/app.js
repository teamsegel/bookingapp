import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar"; // Import Navbar
import BookingSearch from "./components/BookingSearch"; // Import BookingSearch
import "./styles/styles.css"; // Import global styles

const App = () => {
    return (
        <>
            <Navbar /> {/* Add Navbar */}
            <BookingSearch />
        </>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
