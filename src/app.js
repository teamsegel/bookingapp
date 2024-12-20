import React, { useState, useEffect, useRef } from "react";
import { Button, Flex, Heading, TextField, Item, ListView, Text, Tabs, TabList, TabPanels } from "@adobe/react-spectrum";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import mapboxgl from 'mapbox-gl'
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles/App.css";
import {client, readAppointments} from './client/sdk.gen'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SalonDetails from "./components/SalonDetails"; // Adjust the path as needed
import Navbar from "./components/Navbar";
import ConfirmationPage from './components/ConfirmationPage';
import 'mapbox-gl/dist/mapbox-gl.css'


client.setConfig({baseUrl: 'http://localhost:8000'})

const localizer = momentLocalizer(moment);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/available" element={<AvailablePage />} />
        <Route path="/maps" element={<MapPage />} />
        <Route path="/salon/:id" element={<SalonDetails />} />
        <Route path="/confirm" element={<ConfirmationPage />} />
      </Routes>
    </Router>
  );
};

const MapPage = () => {
    const mapRef = useRef()
    const mapContainerRef = useRef()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log(pos.coords)
                mapRef.current.flyTo({
                    center: [pos.coords.longitude, pos.coords.latitude],
                    zoom: 12.34,
                })
            },
            (error) => {
                console.error('geolocation error', error)
            },
            { enableHighAccuracy: true},
        );

        mapboxgl.accessToken = ''
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [14.50694, 46.04984],
            zoom: 11.11,
        })
        return () => {
            mapRef.current.remove()
        }
    }, [])

    return (
        <div class="map-wrapper">
            <div id="map-container" ref={mapContainerRef}></div>
        </div>
    )
}

const AvailablePage = () => {
    //const slots = []
    //const workingFrom = 8
    //const workingUntil = 17
    //for (let i = 0; i < workingUntil-workingFrom; i += 1) {
    //    //for (let j = 0; j < 10
    //    slots[i] = {
    //        id: i,
    //        hour: i+workingFrom, // number
    //        isAvailable: false, // boolean
    //    }
    //}
    //console.log(slots)

    const slots = [
        {
            id: 0,
            hour: 9,
            minute: 0,
            priceEUR: 10,
        },
        {
            id: 1,
            hour: 10,
            minute: 0,
            priceEUR: 10,
        },
        {
            id: 2,
            hour: 10,
            minute: 15,
            priceEUR: 10,
        },
        {
            id: 3,
            hour: 10,
            minute: 15,
            priceEUR: 10,
        },
        {
            id: 4,
            hour: 10,
            minute: 30,
            priceEUR: 10,
        },
        {
            id: 5,
            hour: 10,
            minute: 45,
            priceEUR: 10,
        },
        {
            id: 6,
            hour: 11,
            minute: 0,
            priceEUR: 10,
        },
        {
            id: 7,
            hour: 11,
            minute: 15,
            priceEUR: 10,
        },
        {
            id: 8,
            hour: 11,
            minute: 30,
            priceEUR: 10,
        },
        {
            id: 9,
            hour: 11,
            minute: 45,
            priceEUR: 10,
        },
        {
            id: 10,
            hour: 12,
            minute: 0,
            priceEUR: 10,
        },
        {
            id: 11,
            hour: 13,
            minute: 0,
            priceEUR: 10,
        },
    ]

    const startDate = 14
    const endDate = 30
    const dates = []
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    for (let i = 0; i <= endDate - startDate; i += 1) {
        const dayName = dayNames[(i+5)%7]
        const dayInMonth = (i+startDate).toString()
        dates[i] = {
            key: dayName + dayInMonth,
            dayInMonth: dayInMonth,
            dayName: dayName,
        }
    }

    //console.log(dates)

    //return <div></div>

    //return (
    //    <Tabs aria-label="History of Ancient Rome">
    //      <TabList>
    //        {["FoR"].forEach((it) => <Item key={it}>Founding of Rome</Item>)}
    //      </TabList>
    //      <TabPanels>
    //        {["FoR"].forEach((it) => <Item key={it}>Founding of Rome</Item>)}
    //      </TabPanels>
    //    </Tabs>
    //)

    return (
        <div className="page-container">
            <Tabs items={dates}>
            <div style={{width: '100%', overflowX: 'scroll'}}>
            <div style={{width: '150%'}}>
                <TabList>
                    {(d) => {
                        return (
                            <Item key={d.key}>{d.dayInMonth} {d.dayName}</Item>
                        )
                    }}
                </TabList>
            </div>
            </div>
                <TabPanels>
                    {(d) => {
                        return (
                            <Item key={d.key}>
                                <ListView items={slots}>
                                    {(slot) => {
                                        const formatTimeNumber = (minute /* number */) /* string */ => {
                                            const s = minute.toString()
                                            if (s.length <= 1) {
                                                return `0${s}`
                                            }
                                            return s
                                        }
                                        // radomize by dayInMonth
                                        const formattedHour = formatTimeNumber(slot.hour + d.dayInMonth%4)
                                        const formattedMinute = formatTimeNumber(slot.minute)
                                        return (
                                            <Item>
                                                <Text>{formattedHour}:{formattedMinute}</Text>
                                                <Text slot="description">€ {slot.priceEUR * (slot.hour%2*d.dayInMonth%4+1)}</Text>
                                            </Item>
                                        )
                                    }}
                                </ListView>
                            </Item>
                        )
                    }}
                </TabPanels>
            </Tabs>
        </div>
    )
}


const HomePage = () => {

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
  const [events, setEvents] = useState([]);
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    appt_id: "",
    customer_freeform_name: "",
    customer_notes: "",
    appt_at_freeform: "",
    appt_duration: "",
  });

  const handleDeleteAppointment = async (appointment) => {
    try {
        const response = await fetch(`http://localhost:3000/appts/${appointment.appt_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            alert("Appointment deleted successfully!");
            // Remove the deleted appointment from the events list
            setEvents((prevEvents) => prevEvents.filter((event) => event.appt_id !== appointment.appt_id));
            setSelectedAppointment(null); // Close the modal
        } else {
            alert("Failed to delete appointment.");
        }
    } catch (error) {
        console.error("Error deleting appointment:", error);
    }
};


  const [selectedAppointment, setSelectedAppointment] = useState(null);


  // Fetch appointments for the udar
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
    //    const resp = await readAppointments()  //to be bale to fetch from server
    //    const appts = resp.data
        const resp = await fetch("http://localhost:3000/appts");
        const appts = await resp.json(); // Correctly parse JSON

        const parsedEvents = appts.map((appt) => {
            const startTime = moment(appt.appt_at_freeform, "YYYY-MM-DD hh:mm A").toDate();
            const durationInMinutes = parseInt(appt.appt_duration) || 30; // Default to 30 minutes if duration is missing
            const endTime = new Date(startTime.getTime() + durationInMinutes * 60*1000 );
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

  // **Handle Add Appointment Submit**
  const handleAddAppointmentSubmit = async () => {
    try {
        // Fetch current appointments to determine the highest appt_id
        const response = await fetch("http://localhost:3000/appts");
        const appointments = await response.json();

        // Calculate the next appt_id
        const maxApptId = Math.max(...appointments.map(appt => parseInt(appt.appt_id, 10) || 0), 0);
        const nextApptId = maxApptId + 1;

        // Format the date
        const formattedDate = moment(newAppointment.appt_at_freeform, "YYYY-MM-DD hh:mm A").format("YYYY-MM-DD hh:mm A");

        // Create the new appointment payload
        const newAppt = {
            ...newAppointment,
            appt_id: nextApptId, // Set the calculated appt_id
            appt_at_freeform: formattedDate,
        };

        // Send the new appointment to the fake server
        const postResponse = await fetch("http://localhost:3000/appts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newAppt),
        });

        if (postResponse.ok) {
            alert("Appointment added successfully!");
            setShowAddAppointmentModal(false);

            // Refresh appointments list
            const updatedAppointments = await postResponse.json();
            setEvents((prevEvents) => [...prevEvents, updatedAppointments]);
        } else {
            alert("Failed to add appointment.");
        }
    } catch (error) {
        console.error("Error adding appointment:", error);
    }
};



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
      <Navbar
  resetToBookingPage={resetToBookingPage}
  setIsBusinessPage={setIsBusinessPage}
  setIsBusinessOverviewPage={setIsBusinessOverviewPage}
/>

      {/* Pages */}
      <div className="content">
      {isBusinessPage ? (
      <div className="content">
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
      </div>
      ) :isBusinessOverviewPage ? (
        <div className="business-overview-section">
            <Heading level={2} className="overview-heading">
                Appointments Overview
            </Heading>
            <Button
                variant="primary"
                onPress={() => setShowAddAppointmentModal(true)}
                style={{ marginBottom: "20px" }}
            >
                Add Appointment
            </Button>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600, margin: "50px" }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => setSelectedAppointment(event)} // Set selected appointment
            />
            {showAddAppointmentModal && (
                <div className="modal">
                    <Heading level={3}>Add New Appointment</Heading>
                    <TextField
                        label="Customer Name"
                        value={newAppointment.customer_freeform_name}
                        onChange={(value) =>
                            setNewAppointment({
                                ...newAppointment,
                                customer_freeform_name: value,
                            })
                        }
                    />
                    <TextField
                        label="Notes"
                        value={newAppointment.customer_notes}
                        onChange={(value) =>
                            setNewAppointment({
                                ...newAppointment,
                                customer_notes: value,
                            })
                        }
                    />
                    <TextField
                        label="Start Time (e.g., 2024-12-03 9:45 AM)"
                        value={newAppointment.appt_at_freeform}
                        onChange={(value) =>
                            setNewAppointment({
                                ...newAppointment,
                                appt_at_freeform: value,
                            })
                        }
                    />
                    <TextField
                        label="Duration (e.g., 20min)"
                        value={newAppointment.appt_duration}
                        onChange={(value) =>
                            setNewAppointment({
                                ...newAppointment,
                                appt_duration: value,
                            })
                        }
                    />
                    <Button
                        variant="cta"
                        onPress={handleAddAppointmentSubmit}
                    >
                        Add Appointment
                    </Button>
                    <Button
                        variant="secondary"
                        onPress={() => setShowAddAppointmentModal(false)}
                    >
                        Cancel
                    </Button>
                </div>
            )}
            {selectedAppointment && (
                <div className="modal">
                    <Heading level={3}>Appointment Details</Heading>
                    <p>
                        <strong>Customer Name:</strong>{" "}
                        {selectedAppointment.title.split(":")[0]}
                    </p>
                    <p>
                        <strong>Notes:</strong>{" "}
                        {selectedAppointment.description}
                    </p>
                    <p>
                        <strong>Start Time:</strong>{" "}
                        {moment(selectedAppointment.start).format(
                            "YYYY-MM-DD hh:mm A"
                        )}
                    </p>
                    <p>
                        <strong>End Time:</strong>{" "}
                        {moment(selectedAppointment.end).format(
                            "YYYY-MM-DD hh:mm A"
                        )}
                    </p>
                    <Button
                        variant="cta"
                        onPress={() =>
                            handleDeleteAppointment(selectedAppointment)
                        }
                    >
                        Delete Appointment
                    </Button>
                    <Button
                        variant="secondary"
                        onPress={() => setSelectedAppointment(null)}
                    >
                        Close
                    </Button>
                </div>
            )}
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
        className="salon-card"
        key={salon.biz_id}
        onClick={() => window.location.href = `/salon/${salon.biz_id}`} // Navigate when clicked
        role="button"
        tabIndex={0} // Allow keyboard focus
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            window.location.href = `/salon/${salon.biz_id}`;
          }
        }}
      >
        <div className="salon-details">
          <Heading level={3}>{salon.name || "No Name Available"}</Heading>
          <p>{salon.description || "No Description Available"}</p>
          <p>Location: {salon.location || "No Location Available"}</p>
        </div>
      </div>
    ))
  ) : (
    <p>No salons found. Try adjusting your search criteria.</p>
  )}
</div>

        </div>
      )}
      </div>
    {/* Footer */}
    <footer className="footer">© 2024 Timy.com</footer>
    </div>
  );
};

export default App;
