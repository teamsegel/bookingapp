import React, { useState, useEffect } from "react";
import { Button, Flex, Heading, TextField } from "@adobe/react-spectrum";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles/App.css";
import {client, readAppointments} from './client/sdk.gen'

client.setConfig({baseUrl: 'http://localhost:8000'})

const localizer = momentLocalizer(moment);

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
  const [isBusinessOverviewPage, setIsBusinessOverviewPage] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [events, setEvents] = useState([]);

  // Fetch appointments for the calendar
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:3000/appts");
        const appts = await response.json();

        const parsedEvents = appts.map((appt) => {
          const startTime = moment(appt.appt_at_freeform, "YYYY-MM-DD hh:mm A").toDate();
          const endTime = new Date(startTime.getTime() + 45 * 60 * 1000); // 45-minute duration
          return {
            title: `${appt.customer_freeform_name}: ${appt.customer_notes}`,
            start: startTime,
            end: endTime,
            description: appt.customer_notes,
          };
        });

        setEvents(parsedEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAppointments();
  }, []);

  // **New handleSearch Function**
  const handleSearch = async () => {
    try {
      const response = await fetch("http://localhost:3000/bizs");
      const salons = await response.json();

      // Filter salons based on search parameters (if needed)
      const filteredSalons = salons.filter((salon) => {
        return (
          (!searchParams.salonName || salon.name.toLowerCase().includes(searchParams.salonName.toLowerCase())) &&
          (!searchParams.location || salon.location?.toLowerCase().includes(searchParams.location.toLowerCase()))
        );
      });

      setResults(filteredSalons);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching salon data:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setSearchParams({ ...searchParams, [key]: value });
  };

  const handleSalonSelect = (salon) => setSelectedSalon(salon);

  const handleBookingSubmit = () => {
    alert("Booking submitted successfully!");
    setSelectedSalon(null);
  };

  const resetToBookingPage = () => {
    setShowResults(false);
    setIsBusinessPage(false);
    setIsBusinessOverviewPage(false);
    setSearchParams({
      salonName: "",
      location: "",
      date: "",
      time: "",
    });
    setSelectedSalon(null);
  };

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "#3174ad",
      borderRadius: "5px",
      color: "white",
      border: "none",
      display: "block",
      padding: "5px",
    },
  });

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
          <Button variant="primary" className="overview-button" onPress={() => setIsBusinessOverviewPage(true)}>
            Business Overview
          </Button>
        </Flex>
      </nav>

      {/* Pages */}
      {isBusinessPage ? (
        <div className="business-section">
          <Heading level={2} className="business-heading">
            Add Your Business
          </Heading>
          <div className="business-form">
            <TextField
              aria-label="Business Name"
              placeholder="Enter Business Name"
              flex
            />
            <TextField
              aria-label="Description"
              placeholder="Enter Description"
              flex
            />
            <TextField
              aria-label="Working Hours"
              placeholder="Enter Working Hours (e.g., 9 AM - 6 PM)"
              flex
            />
            <TextField
              aria-label="Location"
              placeholder="Enter Location"
              flex
            />
            <Button variant="cta" className="submit-business-button">
              Submit Business
            </Button>
          </div>
        </div>
      ) : isBusinessOverviewPage ? (
        <div className="business-overview-section">
          <Heading level={2} className="overview-heading">
            Appointments Overview
          </Heading>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600, margin: "50px" }}
            eventPropGetter={eventStyleGetter}
            tooltipAccessor={(event) => event.description}
          />
        </div>
      ) : !showResults ? (
        <div className="hero-section">
          <Heading level={1} className="hero-text">
            Book local beauty and wellness services
          </Heading>
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
            {results.length > 0 ? (
              results.map((salon) => (
                <div
                  className={`salon-card ${selectedSalon?.biz_id === salon.biz_id ? "selected" : ""}`}
                  key={salon.biz_id}
                  onClick={() => handleSalonSelect(salon)}
                >
                  <div className="salon-details">
                    <Heading level={3}>{salon.name || "No Name Available"}</Heading>
                    <p>{salon.description || "No Description Available"}</p>
                    <p>Location: {salon.location || "No Location Available"}</p>
                    <p>Rating: {salon.rating || "No Rating Available"}</p>
                  </div>
                  {selectedSalon?.biz_id === salon.biz_id && (
                    <div className="booking-form">
                      <TextField label="Customer Name" placeholder="Enter your name" flex />
                      <TextField label="Appointment Note" placeholder="Add a note" flex />
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
              ))
            ) : (
              <p>No salons found. Try adjusting your search criteria.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
