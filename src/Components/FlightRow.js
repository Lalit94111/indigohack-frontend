import React, { useState } from 'react';
import NotificationModal from './NotificationModal';
import StatusModal from './StatusModal';

const FlightRow = ({ flight,isAdmin }) => {
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleNotifyClick = () => setShowNotifyModal(true);
  const handleStatusClick = () => setShowStatusModal(true);

  const handleCloseModal = () => {
    setShowNotifyModal(false);
    setShowStatusModal(false);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Cancelled':
        return 'text-red-500';
      case 'Delayed':
        return 'text-blue-500';
      case 'On Time':
      default:
        return 'text-green-500';
    }
  };

  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">{flight.flight_id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">{flight.airline}</td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getStatusClass(flight.status)}`}>
        {flight.status}
      </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{flight.departure_gate}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(flight.scheduled_departure).toLocaleString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <button
            onClick={handleNotifyClick}
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Get Notified
          </button>
        </td>
        {isAdmin && 
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <button onClick={handleStatusClick} className="text-green-500 hover:text-green-700 font-bold">
              Update Status
            </button>
          </td>
        }
      </tr>
      {showNotifyModal && <NotificationModal flight={flight} onClose={handleCloseModal} />}
      {showStatusModal && (
        <StatusModal flight={flight} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default FlightRow;
