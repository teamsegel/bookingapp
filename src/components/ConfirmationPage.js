import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import Navbar from "./Navbar"; 
import "../styles/ConfirmationPage.css";

const ConfirmationPage = () => {
  const location = useLocation();
  const {
    salon,
    selectedHaircut,
    selectedProfessional,
    selectedDate,
    selectedTime,
  } = location.state || {}; // Destructure data from location.state

  if (!salon) {
    return <p>Error: Salon details not found.</p>;
  }

  const handleConfirm = () => {
    alert("Booking Confirmed! Thank you for choosing us.");
    // Optionally, redirect to a thank-you page or home
  };

  return (
    <div className="page-container">
      <Navbar resetToBookingPage={() => window.location.replace("/")} showButtons={false} />
      <div className="content">
        <div className="confirmation-card">
          <h1 className="confirmation-title">Review and Confirm</h1>
          <div className="salon-info">
            <h2>{salon.name}</h2>
            <p>{salon.location}</p>
          </div>
          <div className="booking-details">
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Service:</strong> {selectedHaircut}</p>
            <p><strong>Professional:</strong> {selectedProfessional || "Any professional"}</p>
          </div>
          <div className="payment-section">
            <h3>Total: €25</h3>
            <button className="payment-button">Pay at Venue</button>
          </div>
          <div className="important-info">
            <h4>Important Info</h4>
            <p>🔴 Please notify us in case of cancellations at least 24 hours in advance.</p>
            <p>🚗 Parking is available near the salon.</p>
          </div>
          <button className="confirm-button" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
      <footer className="footer">© 2024 Timy.com</footer>
    </div>
  );
};

export default ConfirmationPage;
