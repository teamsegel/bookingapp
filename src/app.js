import React, { useState, useEffect } from "react";
import { Button, Flex, Heading, TextField } from "@adobe/react-spectrum";
import "./styles/App.css";

const App = () => {
  const [searchParams, setSearchParams] = useState({
    salonName: "",
    location: "",
    date: "",
    time: "",
  });
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState(null);

  useEffect(() => {
    // Simulate fetching data from db_develop.json
    const fetchSalons = async () => {
      const mockData = [
        {
          id: 1,
          name: "Sample Salon",
          distance: "3.5 km",
          address: "123 Example St",
          services: [{ name: "Haircut", price: "$20", time: "10:00 AM" }],
          image: "",
          rating: "4.8",
          reviews: "20",
        },
        {
          id: 2,
          name: "Another Salon",
          distance: "2.8 km",
          address: "456 Example Ave",
          services: [{ name: "Manicure", price: "$15", time: "11:00 AM" }],
          image: "",
          rating: "4.6",
          reviews: "15",
        },
      ];
      setResults(mockData);
    };
    fetchSalons();
  }, []);

  const handleSearch = () => {
    setShowResults(true);
  };

  const handleInputChange = (key, value) => {
    setSearchParams({ ...searchParams, [key]: value });
  };

  const handleSalonSelect = (salon) => {
    setSelectedSalon(salon);
  };

  const handleBookingSubmit = () => {
    alert("Booking submitted successfully!");
    setSelectedSalon(null); // Close the expanded view
  };

  return (
    <div className="page-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo" onClick={() => setShowResults(false)} style={{ cursor: "pointer" }}>
            fresha
        </div>
        <Flex direction="row" alignItems="center" gap="size-200">
            <Button
            variant="primary"
            className="business-button"
            >
            For business
            </Button>
            <Button
            variant="primary"
            className="customer-button"
            onPress={() => {
                // Reset any state to reflect the "current" page
                setShowResults(false);
                setSearchParams({
                salonName: "",
                location: "",
                date: "",
                time: "",
                });
                setSelectedSalon(null); // Deselect any salon if selected
            }}
            >
            Customer
            </Button>
            <Button isQuiet className="menu-button">
            <span className="menu-icon">☰</span>
            </Button>
        </Flex>
        </nav>

      {/* Hero Section */}
      {!showResults ? (
        <div className="hero-section">
          <Heading level={1} className="hero-text">
            Book local beauty and wellness services
          </Heading>
          {/* Search Box */}
          <div className="search-box">
            <Flex direction="row" gap="size-150" width="100%">
              <TextField
                aria-label="Salon Name"
                placeholder="Name of the Salon"
                value={searchParams.salonName}
                onChange={(e) => handleInputChange("salonName", e)}
                flex
              />
              <TextField
                aria-label="Location"
                placeholder="Location"
                value={searchParams.location}
                onChange={(e) => handleInputChange("location", e)}
                flex
              />
            </Flex>
            <Flex direction="row" gap="size-150" width="100%">
              <TextField
                aria-label="Date"
                placeholder="Any date"
                type="date"
                value={searchParams.date}
                onChange={(e) => handleInputChange("date", e)}
                flex
              />
              <TextField
                aria-label="Time"
                placeholder="Any time"
                type="time"
                value={searchParams.time}
                onChange={(e) => handleInputChange("time", e)}
                flex
              />
            </Flex>
            <Button variant="cta" className="search-button" onPress={handleSearch}>
              Search Services
            </Button>
          </div>
        </div>
      ) : (
        <div className="results-section">
          <Heading level={2} className="results-heading">
            Salons matching your search
          </Heading>
          <div className="results-container">
            {results.map((salon) => (
              <div
                className={`salon-card ${selectedSalon?.id === salon.id ? "selected" : ""}`}
                key={salon.id}
                onClick={() => handleSalonSelect(salon)}
              >
                <div className="salon-image">
                  <img
                    src={salon.image || "https://via.placeholder.com/150"}
                    alt={salon.name || "Placeholder"}
                    style={{ width: "100%", height: "100%", borderRadius: "10px" }}
                  />
                </div>
                <div className="salon-details">
                  <Heading level={3}>{salon.name || "No Name Available"}</Heading>
                  <p>{salon.address || "No Address Available"}</p>
                  <p>{salon.distance || "No Distance Available"}</p>
                  <p>
                    Rating: {salon.rating || "N/A"} ({salon.reviews || "0"} reviews)
                  </p>
                  {selectedSalon?.id === salon.id && (
                    <div className="booking-form">
                      <TextField label="Customer Name" placeholder="Enter your name" flex />
                      <TextField label="Note" placeholder="Add a note" flex />
                      <TextField label="Date" type="date" flex />
                      <TextField label="Time" type="time" flex />
                      <Button
                        variant="cta"
                        onPress={handleBookingSubmit}
                        className="submit-button"
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
