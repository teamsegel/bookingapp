import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SalonDetails = () => {
  const { id } = useParams(); // Get the salon ID from the URL
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/bizs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch salon details");
        }
        const data = await response.json();
        setSalon(data);
      } catch (error) {
        console.error("Error fetching salon details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!salon) return <p>Salon not found</p>;

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
