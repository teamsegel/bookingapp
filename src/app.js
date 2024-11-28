import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import BookingSearch from "./components/BookingSearch";
import NearbySalons from "./components/NearbySalons";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer"; // Import Footer component
import "./styles/styles.css";

const App = () => {
    return (
        <>
            <Navbar />
            <BookingSearch />
            <NearbySalons />
            <Reviews />
            <Footer /> {/* Add the Footer */}
        </>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
