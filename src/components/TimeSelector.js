import React, { useState } from "react";
import "./TimeSelector.css"; // Create and style this file

const TimeSelector = ({ onClose, onDone }) => {
    const [selectedPeriod, setSelectedPeriod] = useState("Any time");
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");

    const handlePeriodClick = (period) => {
        setSelectedPeriod(period);
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
                        </select>
                    </div>
                    <div>
                        <label>To</label>
                        <select
                            value={toTime}
                            onChange={(e) => setToTime(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="12:00">12:00</option>
                            <option value="13:00">13:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                            <option value="16:00">16:00</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="time-selector-footer">
                <button className="cancel-button" onClick={onClose}>
                    Cancel
                </button>
                <button
                    className="done-button"
                    onClick={() => onDone(selectedPeriod, fromTime, toTime)}
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default TimeSelector;
