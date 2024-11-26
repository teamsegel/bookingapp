import React, { useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import { Provider, defaultTheme, Form, TextField, Checkbox, Button } from "@adobe/react-spectrum";

const App = () => {
    const [appointments, setAppointments] = useState([]); // State to hold fetched data
    const [error, setError] = useState(null); // State to handle errors
    const [newName, setNewName] = useState(""); // State for new appointment name
    const [newTime, setNewTime] = useState(""); // State for new appointment time

    // Fetch data from Typicode server
    useEffect(() => {
        fetch("http://localhost:3000/appointments") // URL where json-server is running
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setAppointments(data)) // Update state with fetched data
            .catch((err) => setError(err.message)); // Catch and set any errors
    }, []); // Empty dependency array means this runs only once, on mount

    // Function to add a new appointment
    const addAppointment = () => {
        const newAppointment = { id: Date.now().toString(), name: newName, time: newTime };

        // Update the local state immediately
        setAppointments([...appointments, newAppointment]);

        // Persist the new appointment to json-server
        fetch("http://localhost:3000/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAppointment),
        }).catch((err) => setError(err.message)); // Handle potential errors
    };

    // Function to delete an appointment
    const deleteAppointment = (id) => {
        // Update the local state immediately
        setAppointments(appointments.filter((appointment) => appointment.id !== id));

        // Delete the appointment from json-server
        fetch(`http://localhost:3000/appointments/${id}`, {
            method: "DELETE",
        }).catch((err) => setError(err.message)); // Handle potential errors
    };

    return (
        <Provider theme={defaultTheme}>
            <Form>
                <TextField
                    label="Name"
                    placeholder="Enter your name"
                    value={newName}
                    onChange={setNewName} // Update state on input change
                />
                <TextField
                    label="Time"
                    placeholder="Enter time"
                    value={newTime}
                    onChange={setNewTime} // Update state on input change
                />
                <Checkbox>Confirm Appointment</Checkbox>
                <Button variant="cta" onPress={addAppointment}>Book Appointment</Button>
            </Form>
            
            <h3>Appointments</h3>
            {error ? (
                <p style={{ color: "red" }}>Error: {error}</p>
            ) : (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment.id}>
                            {appointment.name} - {appointment.time}
                            <Button
                                variant="negative"
                                onPress={() => deleteAppointment(appointment.id)}
                                style={{ marginLeft: "10px" }}
                            >
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </Provider>
    );
};

const root = createRoot(document.getElementById("root"))
root.render(<App />)
