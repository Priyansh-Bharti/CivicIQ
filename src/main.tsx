/**
 * Application Entry Point
 * Initializes the React application, sets up the router, and mounts the root component to the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ENV } from './utils/env';

// Explicitly access ENV to trigger validation at boot
if (!ENV) {
  console.error('Failed to initialize application environment.');
}

/**
 * Initializes and renders the application root.
 */
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
}
