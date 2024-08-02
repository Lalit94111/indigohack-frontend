import React, { useState, useEffect, useRef } from "react";
import { BellIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import AddFlightModal from "./AddFlightModal";
import socket from "../socket";

const Header = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState("0");
  const dropdownRef = useRef(null);
  const bellIconRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleAddFlight = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("registerUser", user_id);
    });

    socket.on("flightUpdate", (data) => {
      console.log("Received flight update:", data);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          id: prevNotifications.length + 1,
          message: data.message,
        },
      ]);
      setNotificationCount((prevCount) => prevCount + 1);
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current && bellIconRef.current) {
      const dropdownElement = dropdownRef.current;
      const bellIconElement = bellIconRef.current;
      const { top: bellTop, height: bellHeight } =
        bellIconElement.getBoundingClientRect();
      const { height: dropdownHeight } =
        dropdownElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      let calculatedTop = bellTop + bellHeight + 8;

      if (calculatedTop + dropdownHeight > viewportHeight) {
        calculatedTop = bellTop - dropdownHeight - 8;
      }

      setDropdownTop(`${calculatedTop}px`);
    }
  }, [isDropdownOpen]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setNotificationCount(0);
    }
  };

  return (
    <div className="relative z-50 bg-sky-400 py-6 px-12 shadow-md text-white font-poppins">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">FlightWatch</h1>
        <div className="flex items-center gap-x-6 relative">
          <button
            aria-label="Notifications"
            className="relative"
            onClick={handleDropdownToggle}
            ref={bellIconRef}
          >
            <BellIcon className="h-7 w-7 text-white" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 ring-2 ring-white text-white text-xs flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 bg-white border border-gray-300 rounded-md shadow-lg"
              style={{ top: dropdownTop, width: "16rem" }}
            >
              <ul className="py-1">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {notification.message}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-gray-700">
                    No notifications
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="flex gap-x-6">
            {isAdmin && (
              <button
                onClick={handleAddFlight}
                className="px-4 py-2 text-sm font-medium text-sky-400 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
              >
                Add Flight
              </button>
            )}
            <a
              href="/"
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-sky-400 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
            >
              Logout
            </a>
          </div>
        </div>
      </div>

      {isAdmin && isModalOpen && <AddFlightModal onClose={closeModal} />}
    </div>
  );
};

export default Header;
