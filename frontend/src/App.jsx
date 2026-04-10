import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/forgotPassword";
import BrowseBooks from "./pages/BrowseBook";
import MyBooks from "./pages/MyBook";
import AddBook from "./pages/AddBook";
import ProfilePage from "./pages/ProfilePage";
// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import "./App.css";

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

/* ================= DASHBOARD ================= */
const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Routes>
          <Route path="browse" element={<BrowseBooks />} />
          <Route path="my-books" element={<MyBooks />} />
          <Route path="add-book" element={<AddBook />} />
          <Route path="profile" element={<ProfilePage />} />


          <Route path="*" element={<Navigate to="browse" />} />
        </Routes>
      </div>
    </div>
  );
};

/* ================= APP ================= */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ LANDING WITH NAVBAR */}
        <Route
          path="/"
          element={
            <>
              <Navbar cartCount={0} />
              <Landing />
            </>
          }
        />

        {/* ❌ NO NAVBAR BELOW */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}