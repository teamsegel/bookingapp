import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/SalonDetails.css";

const SalonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [haircutTypes, setHaircutTypes] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [showHaircutModal, setShowHaircutModal] = useState(false);
  const [selectedHaircut, setSelectedHaircut] = useState(null);
  const [showProfessionalModal, setShowProfessionalModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/bizs");
        if (!response.ok) {
          throw new Error("Failed to fetch salon details");
        }
        const data = await response.json();

        const matchedSalon = data.find((salon) => salon.biz_id === parseInt(id, 10));
        setSalon(matchedSalon || null);

        if (matchedSalon) {
          setHaircutTypes(matchedSalon.haircut_types || []);
          setProfessionals(matchedSalon.professionals || []);
        }
      } catch (error) {
        console.error("Error fetching salon details:", error);
        setSalon(null);
      }
    };

    fetchSalonDetails();
  }, [id]);

  const handleBookAppointment = () => {
    setShowHaircutModal(true);
  };

  const handleHaircutContinue = () => {
    setShowHaircutModal(false);
    setShowProfessionalModal(true);
  };

  const handleProfessionalContinue = () => {
    setShowProfessionalModal(false);
    setShowDateTimeModal(true);
  };

  const handleDateTimeConfirm = () => {
    setShowDateTimeModal(false);
    setShowLoginModal(true);
  };

  const handleLoginContinue = () => {
    navigate("/confirm", {
      state: {
        salon,
        selectedHaircut,
        selectedProfessional,
        selectedDate,
        selectedTime,
      },
    });
  };

  return (
    <div>
      <Navbar
        resetToBookingPage={() => window.location.replace("/")}
        showButtons={false}
      />
      {salon ? (
        <div className="salon-details">
          <h1 className="salon-title">{salon.name}</h1>
          <p>{salon.description}</p>
          <p>{salon.location}</p>
          <p>Rating: {salon.rating}</p>

          <button
            className="book-appointment-button"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </button>

          {/* Haircut Selection Modal */}
          {showHaircutModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Select Haircut</h2>
                <ul className="haircut-types-list">
                  {haircutTypes.map((type, index) => (
                    <li
                      key={index}
                      className={`haircut-type ${
                        selectedHaircut === type ? "selected" : ""
                      }`}
                      onClick={() => setSelectedHaircut(type)}
                    >
                      {type}
                    </li>
                  ))}
                </ul>
                <button
                  className="continue-button"
                  disabled={!selectedHaircut}
                  onClick={handleHaircutContinue}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Professional Selection Modal */}
          {showProfessionalModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Select Professional</h2>
                <ul className="professional-list">
                  {professionals.map((prof, index) => (
                    <li
                      key={index}
                      className={`professional ${
                        selectedProfessional === prof ? "selected" : ""
                      }`}
                      onClick={() => setSelectedProfessional(prof)}
                    >
                      {prof}
                    </li>
                  ))}
                </ul>
                <button
                  className="continue-button"
                  disabled={!selectedProfessional}
                  onClick={handleProfessionalContinue}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Date and Time Selection Modal */}
          {showDateTimeModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Select Date and Time</h2>
                <div>
                  <label htmlFor="date">Date:</label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="time">Time:</label>
                  <input
                    type="time"
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
                <button
                  className="continue-button"
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleDateTimeConfirm}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Login Modal */}
          {showLoginModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Log in or Sign Up</h2>
                <button className="social-login-button">Continue with Facebook</button>
                <button className="social-login-button">Continue with Google</button>
                <div className="or-divider">OR</div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="email-input"
                />
                <button className="continue-button" onClick={handleLoginContinue}>
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Salon not found</p>
      )}
    </div>
  );
};

export default SalonDetails;
