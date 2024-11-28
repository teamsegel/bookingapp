import React, { useState } from "react";
import TimeSelector from "./TimeSelector";

const BookingSearch = () => {
    const [isTimeSelectorOpen, setIsTimeSelectorOpen] = useState(false);
    const [selectedTimePeriod, setSelectedTimePeriod] = useState("Select Time");

    const handleOpenTimeSelector = () => {
        setIsTimeSelectorOpen(true);
    };

    const handleCloseTimeSelector = () => {
        setIsTimeSelectorOpen(false);
    };

    const handleDoneTimeSelector = (timePeriod, fromTime, toTime) => {
        if (timePeriod === "Any time") {
            setSelectedTimePeriod("Any time");
        } else if (fromTime && toTime) {
            setSelectedTimePeriod(`${fromTime} - ${toTime}`);
        } else {
            setSelectedTimePeriod(timePeriod);
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
                    {selectedTimePeriod}
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
