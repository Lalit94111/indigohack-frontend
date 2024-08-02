import React, { useState } from 'react';
import axios from 'axios';

const NotificationModal = ({ flight, onClose }) => {
  const [notifications, setNotifications] = useState({
    email: false,
    sms: false,
    app: false,
  });

  const handleChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSave = async () => {
    const options =
      (notifications.email ? 1 : 0) |
      (notifications.sms ? 2 : 0) |
      (notifications.app ? 4 : 0);

    const requestBody = {
      flight_id: flight.flight_id,
      options,
    };


    try {
      const token = localStorage.getItem('token');
      const BaseURL = process.env.REACT_APP_BACKEND;

      const response = await axios.post(`${BaseURL}/user/subscribe`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onClose()
      console.log('Notification preferences saved:', response.data);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Get Notified for {flight.flight_id}</h2>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="email"
              checked={notifications.email}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span className="ml-2">Email</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="sms"
              checked={notifications.sms}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span className="ml-2">SMS</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="app"
              checked={notifications.app}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span className="ml-2">App Notification</span>
          </label>
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

export default NotificationModal;
