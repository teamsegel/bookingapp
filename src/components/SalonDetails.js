import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar"; // Adjust the path
import '../styles/SalonDetails.css';


const SalonDetails = () => {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/bizs?biz_id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch salon details");
        }
        const data = await response.json();
        setSalon(data[0]);
      } catch (error) {
        console.error("Error fetching salon details:", error);
        setSalon(null);
      }
    };

    fetchSalonDetails();
  }, [id]);
  const fetchSalonDetails = async () => {
    try {
      const response = await fetch("http://localhost:3000/bizs");
      if (!response.ok) {
        throw new Error("Failed to fetch salon details");
      }
      const data = await response.json();
      console.log(data); // Check the structure of the data
  
      const matchedSalon = data.find((salon) => salon.id === parseInt(id, 10));
      console.log(matchedSalon); // Check if the matched salon includes a `name`
      setSalon(matchedSalon || null);
    } catch (error) {
      console.error("Error fetching salon details:", error);
      setSalon(null);
    }
  };
  return (
    <div>
      <Navbar
        resetToBookingPage={() => window.location.replace("/")}
        showButtons={false} // Hide the buttons
      />
      {salon ? (
        <div className="salon-details">
<h1 className="salon-title">{salon.name}</h1>
          <p>{salon.description}</p>
          <p>{salon.location}</p>
          <p>Rating: {salon.rating}</p>
        </div>
      ) : (
        <p>Salon not found</p>
      )}
    </div>
  );
};

export default SalonDetails;
