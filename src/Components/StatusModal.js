import React, { useState } from 'react';
import axios from 'axios';

const StatusModal = ({ flight, onClose }) => {
  const [status, setStatus] = useState(null);
  const [departureTime, setDepartureTime] = useState(flight.scheduled_departure);
  const [departureGate, setDepartureGate] = useState(flight.departure_gate);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSave = async () => {
  const BaseURL = process.env.REACT_APP_BACKEND; 
  const type = status; 
  let data = {};

  if (status === "Delayed") {
    data = {
      updated_departure_time: departureTime, 
    };
  } else if (status === 'Gate Change') {
    data = {
      updated_departure_gate: departureGate, 
    };
  }

  console.log(type,data)

  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(`${BaseURL}/flight/${flight.flight_id}`, 
      {
        type: type,
        data:data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    console.log('Update response:', response.data);

    onClose(); 
  } catch (error) {
    console.error('Error updating flight details:', error.message);
  }
};

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Update Flight Details for {flight.flight_id}</h2>
        <div className="space-y-2">
          <label className="block">
            <span className="text-gray-700">Status</span>
            <select
              value={status || flight.status}
              onChange={handleStatusChange}
              className="block w-full mt-1 border rounded p-2"
            >
              <option value="">Change Status</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Gate Change">Gate Change</option>
            </select>
          </label>

          {status === 'Delayed' && (
            <label className="block">
              <span className="text-gray-700">New Departure Time</span>
              <input
                type="datetime-local"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="block w-full mt-1 border rounded p-2"
              />
            </label>
          )}

          {status === 'Gate Change' && (
            <label className="block">
              <span className="text-gray-700">New Departure Gate</span>
              <input
                type="text"
                value={departureGate}
                onChange={(e) => setDepartureGate(e.target.value)}
                className="block w-full mt-1 border rounded p-2"
              />
            </label>
          )}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
