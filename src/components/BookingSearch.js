import React, { useState } from "react";
import TimeSelector from "./TimeSelector";

const BookingSearch = () => {
    const [isTimeSelectorOpen, setIsTimeSelectorOpen] = useState(false);
    const [selectedTimeWindow, setSelectedTimeWindow] = useState("Any time");

    const handleOpenTimeSelector = () => {
        setIsTimeSelectorOpen(true);
    };

    const handleCloseTimeSelector = () => {
        setIsTimeSelectorOpen(false);
    };

    const handleDoneTimeSelector = (timePeriod, fromTime, toTime) => {
        if (timePeriod === "Custom" && fromTime && toTime) {
            setSelectedTimeWindow(`${fromTime} - ${toTime}`);
        } else if (timePeriod === "Any time") {
            setSelectedTimeWindow("Any time");
        } else {
            setSelectedTimeWindow(timePeriod);
        }
        setIsTimeSelectorOpen(false);
    };

    return (
        <div className="booking-container">
            <h1 className="booking-header">Book local beauty and wellness services</h1>
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
                    <button className="time-button" onClick={handleOpenTimeSelector}>
                        {selectedTimeWindow}
                    </button>
                </div>
                <button className="search-button">Search Timy</button>
            </div>
            <p className="booking-stats">
                <strong>649,192</strong> appointments booked today
            </p>

            {isTimeSelectorOpen && (
                <TimeSelector
                    onClose={handleCloseTimeSelector}
                    onDone={handleDoneTimeSelector}
                />
            )}
        </div>
    );
};

export default BookingSearch;
