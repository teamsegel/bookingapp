import React, { useState, useEffect } from "react";
import { Button, Flex, Heading, TextField } from "@adobe/react-spectrum";
import "./styles/App.css";

const App = () => {
  const [showResults, setShowResults] = useState(false);
  const [isBusinessPage, setIsBusinessPage] = useState(false); // Tracks if we're on the business page
  const [salonDetails, setSalonDetails] = useState({
    id: "",
    name: "",
    distance: "",
    address: "",
    services: [{ name: "", price: "", time: "" }],
    image: "",
    rating: "",
    reviews: "",
  });

  const [results, setResults] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);

  useEffect(() => {
    // Simulate fetching data
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
      ];
      setResults(mockData);
    };
    fetchSalons();
  }, []);

  const handleSalonInputChange = (key, value, index = null) => {
    if (index !== null) {
      // Update services
      const updatedServices = [...salonDetails.services];
      updatedServices[index][key] = value;
      setSalonDetails({ ...salonDetails, services: updatedServices });
    } else {
      // Update other salon fields
      setSalonDetails({ ...salonDetails, [key]: value });
    }
  };

  const handleAddSalon = () => {
    const newSalon = { ...salonDetails, id: results.length + 1 };
    setResults([...results, newSalon]);
    setSalonDetails({
      id: "",
      name: "",
      distance: "",
      address: "",
      services: [{ name: "", price: "", time: "" }],
      image: "",
      rating: "",
      reviews: "",
    });
    setIsBusinessPage(false); // Return to customer page after adding
  };

  return (
    <div className="page-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo" onClick={() => setShowResults(false)} style={{ cursor: "pointer" }}>
          fresha
        </div>
        <Flex direction="row" alignItems="center" gap="size-200">
          <Button variant="primary" className="business-button" onPress={() => setIsBusinessPage(true)}>
            For business
          </Button>
          <Button variant="primary" className="customer-button" onPress={() => setIsBusinessPage(false)}>
            Customer
          </Button>
          <Button isQuiet className="menu-button">
            <span className="menu-icon">☰</span>
          </Button>
        </Flex>
      </nav>

      {/* Page Content */}
      {!isBusinessPage ? (
        !showResults ? (
          <div className="hero-section">
            <Heading level={1} className="hero-text">
              Book local beauty and wellness services
            </Heading>
            {/* Search Section */}
            <div className="search-box">
              <Flex direction="row" gap="size-150" width="100%">
                <TextField aria-label="Salon Name" placeholder="Name of the Salon" flex />
                <TextField aria-label="Location" placeholder="Location" flex />
              </Flex>
              <Flex direction="row" gap="size-150" width="100%">
                <TextField aria-label="Date" type="date" flex />
                <TextField aria-label="Time" type="time" flex />
              </Flex>
              <Button variant="cta" className="search-button" onPress={() => setShowResults(true)}>
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
                  onClick={() => setSelectedSalon(salon)}
                >
                  <Heading level={3}>{salon.name || "No Name Available"}</Heading>
                  <p>{salon.address || "No Address Available"}</p>
                  <p>{salon.distance || "No Distance Available"}</p>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="business-section">
          <Heading level={2} className="business-heading">
            Add Your Salon
          </Heading>
          <div className="business-form">
            <TextField
              aria-label="Salon Name"
              placeholder="Salon Name"
              value={salonDetails.name}
              onChange={(e) => handleSalonInputChange("name", e)}
              flex
            />
            <TextField
              aria-label="Distance"
              placeholder="Distance"
              value={salonDetails.distance}
              onChange={(e) => handleSalonInputChange("distance", e)}
              flex
            />
            <TextField
              aria-label="Address"
              placeholder="Address"
              value={salonDetails.address}
              onChange={(e) => handleSalonInputChange("address", e)}
              flex
            />
            <TextField
              aria-label="Service Name"
              placeholder="Service Name"
              value={salonDetails.services[0].name}
              onChange={(e) => handleSalonInputChange("name", e, 0)}
              flex
            />
            <TextField
              aria-label="Service Price"
              placeholder="Service Price"
              value={salonDetails.services[0].price}
              onChange={(e) => handleSalonInputChange("price", e, 0)}
              flex
            />
            <TextField
              aria-label="Service Time"
              placeholder="Service Time"
              value={salonDetails.services[0].time}
              onChange={(e) => handleSalonInputChange("time", e, 0)}
              flex
            />
            <Button variant="cta" className="add-salon-button" onPress={handleAddSalon}>
              Add Salon
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
