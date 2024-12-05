import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SalonDetails = () => {
  const { id } = useParams(); // Extract salon ID from URL
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/bizs?biz_id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setSalon(data[0]); // Access the first matching salon
        } else {
          throw new Error("Salon not found");
        }
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!salon) {
    return <p>Salon not found.</p>;
  }

  return (
    <div>
      <h1>{salon.name}</h1>
      <p><strong>Description:</strong> {salon.description}</p>
      <p><strong>Location:</strong> {salon.location}</p>
      <p><strong>Rating:</strong> {salon.rating}</p>
    </div>
  );
};

export default SalonDetails;
