import React, { useState, useEffect } from "react";
import { Button, Flex, Heading, TextField } from "@adobe/react-spectrum";
import "./styles/App.css";
import {client, readAppointments} from './client/sdk.gen'

client.setConfig({baseUrl: 'http://localhost:8000'})

const App = () => {
  // example FastAPI usage
  // look at client/sdk.gen file to see all available functions
  useEffect(() => {
    (async () => {
      const resp = await readAppointments()
      const appts = resp.data
      console.log(appts)
    })()
  }, [])

  const [searchParams, setSearchParams] = useState({
    salonName: "",
    location: "",
    date: "",
    time: "",
  });
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [isBusinessPage, setIsBusinessPage] = useState(false);

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

  const resetToBookingPage = () => {
    setShowResults(false);
    setIsBusinessPage(false);
    setSearchParams({
      salonName: "",
      location: "",
      date: "",
      time: "",
    });
    setSelectedSalon(null);
  };

  const handleBusinessInputChange = (key, value) => {
    setSelectedSalon({ ...selectedSalon, [key]: value });
  };

  const handleBusinessSubmit = () => {
    alert(`Business Details Submitted:\n${JSON.stringify(selectedSalon, null, 2)}`);
    setIsBusinessPage(false);
    setSelectedSalon(null);
  };

  return (
    <div className="page-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo" onClick={resetToBookingPage} style={{ cursor: "pointer" }}>
          fresha
        </div>
        <Flex direction="row" alignItems="center" gap="size-200">
          <Button variant="primary" className="business-button" onPress={() => setIsBusinessPage(true)}>
            For business
          </Button>
          <Button variant="primary" className="customer-button" onPress={resetToBookingPage}>
            Customer
          </Button>
          <Button isQuiet className="menu-button">
            <span className="menu-icon">☰</span>
          </Button>
        </Flex>
      </nav>

      {/* Page Content */}
      {isBusinessPage ? (
        <div className="business-section">
          <Heading level={2} className="business-heading">
            Add Your Business
          </Heading>
          <div className="business-form">
            <TextField
              aria-label="Business Name"
              placeholder="Enter Business Name"
              value={selectedSalon?.name || ""}
              onChange={(e) => handleBusinessInputChange("name", e)}
              flex
            />
            <TextField
              aria-label="Description"
              placeholder="Enter Description"
              value={selectedSalon?.description || ""}
              onChange={(e) => handleBusinessInputChange("description", e)}
              flex
            />
            <TextField
              aria-label="Working Hours"
              placeholder="Enter Working Hours (e.g., 9 AM - 6 PM)"
              value={selectedSalon?.workingHours || ""}
              onChange={(e) => handleBusinessInputChange("workingHours", e)}
              flex
            />
            <TextField
              aria-label="Location"
              placeholder="Enter Location"
              value={selectedSalon?.location || ""}
              onChange={(e) => handleBusinessInputChange("location", e)}
              flex
            />
            <Button
              variant="cta"
              className="submit-business-button"
              onPress={handleBusinessSubmit}
            >
              Submit Business
            </Button>
          </div>
        </div>
      ) : !showResults ? (
        <div className="hero-section">
          <Heading level={1} className="hero-text">
            Book local beauty and wellness services
          </Heading>
          {/* Search Section */}
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
