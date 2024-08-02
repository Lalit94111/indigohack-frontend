import React from "react";
import Header from "../Components/Header";
import FlightRow from "../Components/FlightRow";
import axios from "axios";
import { useState, useEffect } from "react";
import { useFlights } from "../Context/FlightContext";
import socket from "../socket";

const Flights = () => {
  const { flights, setFlights, updateFlightData } = useFlights();
  // const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role==='true');
  }, []);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const token = localStorage.getItem("token");
        const BaseURL = process.env.REACT_APP_BACKEND;
        const response = await axios.get(`${BaseURL}/flight/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFlights(response.data);
      } catch (err) {
        setError("Failed to fetch flights.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [setFlights]);

  useEffect(() => {
    socket.on("fetch_updated_flight", (updatedFlight) => {
      console.log("Flight updated:", updatedFlight.flight_id);
      updateFlightData(updatedFlight.flight_id); 
    });

    
    return () => {
      socket.off("fetch_updated_flight"); 
    };
  }, [updateFlightData]);

  return (
    <>
      <Header isAdmin = {isAdmin} />
      <div className="mt-16 mx-4 sm:mx-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-base font-bold text-black-500 uppercase tracking-wider">
                  Flight ID
                </th>
                <th className="px-6 py-3 text-left text-base font-bold text-black-500 uppercase tracking-wider">
                  Airline
                </th>
                <th className="px-6 py-3 text-left text-base font-bold text-black-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-base font-bold text-black-500 uppercase tracking-wider">
                  Departure Gate
                </th>
                <th className="px-6 py-3 text-left text-base font-bold text-black-500 uppercase tracking-wider">
                  Scheduled Departure
                </th>
                <th className="px-6 py-3 text-left text-base font-bold text-black-500 uppercase tracking-wider">
                  Get Notified
                </th>
                {isAdmin && 
                <th className="px-6 py-3 text-left text-base font-bold text-black-500 uppercase tracking-wider">
                  Update Status
                </th>
                }
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flights.map((flight, index) => (
                <FlightRow key={index} flight={flight} isAdmin = {isAdmin}/>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Flights;
