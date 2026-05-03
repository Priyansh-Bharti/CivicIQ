/**
 * Main Application Component
 * Orchestrates the application's routing and core layout structure.
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages for improved bundle efficiency
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Timeline = lazy(() => import('./pages/Timeline').then(m => ({ default: m.Timeline })));
const Checklist = lazy(() => import('./pages/Checklist').then(m => ({ default: m.Checklist })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

/**
 * Fallback component for unmatched routes.
 */
const NotFound: React.FC = (): React.JSX.Element => (
  <div className="p-20 text-center text-3xl font-hero text-navy">
    404 - Not Found
  </div>
);

/**
 * Main App entry point defining the routing table.
 * @returns {React.JSX.Element} The rendered application.
 */
function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <main id="main-content">
        <Suspense fallback={
          <div className="h-screen w-screen flex items-center justify-center bg-navy">
            <div className="w-12 h-12 border-4 border-amber border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route 
              path="/timeline" 
              element={
                <ProtectedRoute>
                  <Timeline />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checklist" 
              element={
                <ProtectedRoute>
                  <Checklist />
                </ProtectedRoute>
              } 
            />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </ErrorBoundary>
  );
}

export default App;
