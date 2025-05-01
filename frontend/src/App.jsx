import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './features/home/HomePage';
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
