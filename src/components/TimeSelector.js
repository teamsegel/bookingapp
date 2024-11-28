import React, { useState } from "react";
import "./TimeSelector.css";

const TimeSelector = ({ onClose, onDone }) => {
    const [selectedPeriod, setSelectedPeriod] = useState("Any time");
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");

    // Map time periods to their respective ranges
    const timePeriodToRange = {
        "Any time": { from: "", to: "" },
        Morning: { from: "08:00", to: "12:00" },
        Afternoon: { from: "12:00", to: "18:00" },
        Evening: { from: "18:00", to: "20:00" },
    };

    const handlePeriodClick = (period) => {
        setSelectedPeriod(period);

        // Automatically set From and To based on the selected period
        const range = timePeriodToRange[period];
        setFromTime(range.from);
        setToTime(range.to);
    };

    const handleDoneClick = () => {
        // Prioritize manual input if provided
        if (fromTime && toTime) {
            onDone("Custom", fromTime, toTime);
        } else {
            onDone(selectedPeriod, fromTime, toTime);
        }
    };

    return (
        <div className="time-selector-modal">
            <div className="time-selector-header">
                <button className="back-button" onClick={onClose}>
                    ←
                </button>
                <h2>Time</h2>
            </div>
            <div className="time-selector-body">
                {/* Time Period Buttons */}
                <div className="time-periods">
                    {["Any time", "Morning", "Afternoon", "Evening"].map((period) => (
                        <button
                            key={period}
                            className={`time-period-button ${
                                selectedPeriod === period ? "active" : ""
                            }`}
                            onClick={() => handlePeriodClick(period)}
                        >
                            {period}
                        </button>
                    ))}
                </div>

                {/* From and To Time Inputs */}
                <div className="time-range">
                    <div>
                        <label>From</label>
                        <select
                            value={fromTime}
                            onChange={(e) => setFromTime(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="08:00">08:00</option>
                            <option value="09:00">09:00</option>
                            <option value="10:00">10:00</option>
                            <option value="11:00">11:00</option>
                            <option value="12:00">12:00</option>
                            <option value="13:00">13:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                            <option value="16:00">16:00</option>
                            <option value="17:00">17:00</option>
                            <option value="18:00">18:00</option>
                            <option value="19:00">19:00</option>
                            <option value="20:00">20:00</option>
                        </select>
                    </div>
                    <div>
                        <label>To</label>
                        <select
                            value={toTime}
                            onChange={(e) => setToTime(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="08:00">08:00</option>
                            <option value="09:00">09:00</option>
                            <option value="10:00">10:00</option>
                            <option value="11:00">11:00</option>
                            <option value="12:00">12:00</option>
                            <option value="13:00">13:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                            <option value="16:00">16:00</option>
                            <option value="17:00">17:00</option>
                            <option value="18:00">18:00</option>
                            <option value="19:00">19:00</option>
                            <option value="20:00">20:00</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="time-selector-footer">
                <button className="cancel-button" onClick={onClose}>
                    Cancel
                </button>
                <button className="done-button" onClick={handleDoneClick}>
                    Done
                </button>
            </div>
        </div>
    );
};

export default TimeSelector;
