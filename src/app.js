import React from "react";
import { Button, Flex, Heading, Text, TextField } from "@adobe/react-spectrum";
import "./styles/App.css";

const App = () => {
  return (
    <div className="page-container">
      {/* Navbar */}
      <nav className="navbar">
        <Text className="logo">fresha</Text>
        <Flex direction="row" alignItems="center" gap="size-200">
          <Button variant="primary" className="business-button">
            For business
          </Button>
          <Button isQuiet className="menu-button">
            <span className="menu-icon">☰</span>
          </Button>
        </Flex>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <Heading level={1} className="hero-text">
          Book local beauty and wellness services
        </Heading>
        {/* Search Box */}
        <div className="search-box">
          <TextField aria-label="Treatments" placeholder="All treatments and venues" />
          <TextField aria-label="Location" placeholder="Current location" />
          <Flex direction="row" gap="size-150" width="100%">
            <TextField aria-label="Date" placeholder="Any date" flex />
            <TextField aria-label="Time" placeholder="Any time" flex />
          </Flex>
          <Button variant="cta" className="search-button">
            Search Services
          </Button>
        </div>
        {/* Stats */}
        <Heading level={3} className="stats">
          460,652 appointments booked today
        </Heading>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <Button variant="primary">Get the app</Button>
      </div>
    </div>
  );
};

export default App;
