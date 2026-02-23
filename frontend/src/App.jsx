import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TenderPage from "./pages/TenderPage";
import ReportPage from "./pages/ReportPage";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="container mt-3">
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tender" element={<TenderPage />} />
        <Route path="/report" element={<ReportPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;