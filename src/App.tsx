/**
 * Main Application Component
 * Orchestrates the application's routing and core layout structure.
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Timeline } from './pages/Timeline';
import { Checklist } from './pages/Checklist';
import { About } from './pages/About';

/**
 * Fallback component for unmatched routes.
 */
const NotFound: React.FC = (): JSX.Element => (
  <div className="p-20 text-center text-3xl font-hero text-navy">
    404 - Not Found
  </div>
);

/**
 * Main App entry point defining the routing table.
 * @returns {JSX.Element} The rendered application.
 */
function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/checklist" element={<Checklist />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
