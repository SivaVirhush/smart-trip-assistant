import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import Features from "./pages/Features";
import CulturalMapsPage from "./pages/CulturalMapsPage";
import LiveTrafficPage from "./pages/LiveTrafficPage";
import CurrentAffairsPage from "./pages/NewsPage";
import CalendarPage from "./features/calendar/pages/CalendarPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Router>
      <div className="App w-100">
        <Header />
        <div className="app-content w-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guest" element={<ChatPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/new" element={<ChatPage />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route path="/features" element={<Features />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/cultural-maps" element={<CulturalMapsPage />} />
            <Route path="/live-traffic" element={<LiveTrafficPage />} />
            <Route path="/current-affairs" element={<CurrentAffairsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
