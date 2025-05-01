/**
 * App.jsx
 * 
 * Main application component that sets up routing and layout.
 * 
 * @component
 * @description
 * This is the root component of the application that:
 * - Sets up React Router for navigation
 * - Defines the main routes:
 *   - Home page (/)
 *   - Itinerary detail page (/itinerary/:id)
 * 
 * @example
 * <App />
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './features/itinerary/HomePage';
import ItineraryDetailPage from './features/itinerary/ItineraryDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/itinerary/:id" element={<ItineraryDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
