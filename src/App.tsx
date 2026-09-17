import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { BookingPage } from './pages/BookingPage';
import { DashboardPage } from './pages/DashboardPage';
import { BookingsPage } from './pages/BookingsPage';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/dashboard" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <DashboardPage />
            </div>
          } />
          <Route path="/bookings" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <BookingsPage />
            </div>
          } />
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  );
}

export default App;
