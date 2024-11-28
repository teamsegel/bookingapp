import React from "react";

const BookingSearch = () => {
    return (
        <div className="booking-container">
            {/* Header */}
            <h1 className="booking-header">Book local beauty and wellness services</h1>

            {/* Search Form */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="All treatments and venues"
                    className="search-input"
                />
                <input
                    type="text"
                    placeholder="Current location"
                    className="search-input"
                />
                <div className="date-time-container">
                    <input type="date" className="date-input" />
                    <input type="time" className="time-input" />
                </div>
                <button className="search-button">Search Fresha</button>
            </div>

            {/* Footer */}
            <p className="booking-stats">
                <strong>649,192</strong> appointments booked today
            </p>

            {/* App Button */}
            <div className="get-app">
                <button className="get-app-button">Get the app</button>
            </div>
        </div>
    );
};

export default BookingSearch;
