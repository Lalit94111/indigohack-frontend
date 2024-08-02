import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const FlightContext = createContext();

export const useFlights = () => useContext(FlightContext);

export const FlightProvider = ({ children }) => {
  const [flights, setFlights] = useState([]);

  const updateFlightData = async (flight_id) => {
    try {
      const token = localStorage.getItem("token");
      const BaseURL = process.env.REACT_APP_BACKEND;
      const response = await axios.get(`${BaseURL}/flight/${flight_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFlights((prevFlights) =>
        prevFlights.map((flight) =>
          flight.flight_id === flight_id ? response.data : flight
        )
      );
    } catch (error) {
      console.error("Error updating flight data:", error);
    }
  };

  const getNewFlight = async (flight_id) => {
    try {
      const token = localStorage.getItem("token");
      const BaseURL = process.env.REACT_APP_BACKEND;
      const response = await axios.get(`${BaseURL}/flight/${flight_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFlights([...flights,response.data]);
    } catch (error) {
      console.error("Error Adding flight:", error);
    }
  };

  return (
    <FlightContext.Provider value={{ flights, setFlights, updateFlightData,getNewFlight }}>
      {children}
    </FlightContext.Provider>
  );
};
