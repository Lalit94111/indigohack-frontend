import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { FlightProvider } from './Context/FlightContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FlightProvider>
    <App />
  </FlightProvider>
);


