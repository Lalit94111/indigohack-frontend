import React, { useState } from "react";
import axios from "axios";
import { useFlights } from "../Context/FlightContext";

const AddFlightModal = ({ onClose }) => {
  const { getNewFlight } = useFlights();
  const [flightId, setFlightId] = useState("");
  const [airline, setAirline] = useState("");
  const [status, setStatus] = useState("");
  const [departureGate, setDepartureGate] = useState("");
  const [arrivalGate, setArrivalGate] = useState("");
  const [scheduledDeparture, setScheduledDeparture] = useState("");
  const [scheduledArrival, setScheduledArrival] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const flightData = {
      flight_id: flightId,
      airline,
      status,
      departure_gate: departureGate,
      arrival_gate: arrivalGate,
      scheduled_departure: scheduledDeparture,
      scheduled_arrival: scheduledArrival,
    };

    console.log("Submitting flight data:", flightData);

    try {
      const token = localStorage.getItem("token");
      const BaseURL = process.env.REACT_APP_BACKEND;
      const response = await axios.post(`${BaseURL}/flight/add`, flightData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Flight added:", response.data);
      onClose();
      await getNewFlight(flightId);
    } catch (error) {
      console.error("Error adding flight:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Add Flight</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Flight ID", value: flightId, onChange: setFlightId, placeholder: "Flight Id" },
            { label: "Airline", value: airline, onChange: setAirline, placeholder: "Airline" },
            { label: "Status", value: status, onChange: setStatus, placeholder: "Status" },
            { label: "Departure Gate", value: departureGate, onChange: setDepartureGate, placeholder: "Departure Gate" },
            { label: "Arrival Gate", value: arrivalGate, onChange: setArrivalGate, placeholder: "Arrival Gate" },
          ].map(({ label, value, onChange, placeholder }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 block w-full p-2 text-black rounded-md border-gray-300 shadow-sm sm:text-sm"
                placeholder={placeholder}
                required
              />
            </div>
          ))}
          {[
            { label: "Scheduled Departure", value: scheduledDeparture, onChange: setScheduledDeparture },
            { label: "Scheduled Arrival", value: scheduledArrival, onChange: setScheduledArrival },
          ].map(({ label, value, onChange }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="datetime-local"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 block w-full p-2 text-black rounded-md border-gray-300 shadow-sm sm:text-sm"
                required
              />
            </div>
          ))}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 rounded-md text-white"
            >
              Add Flight
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlightModal;
