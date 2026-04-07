import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/forgotPassword";

import BrowseBooks from "./pages/BrowseBook";
import MyBooks from "./pages/MyBook";
import AddBook from "./pages/AddBook";

// Layout
import Sidebar from "./components/Sidebar";
import "./App.css";
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user"); // or Firebase check

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Routes>
          <Route path="browse" element={<BrowseBooks />} />
          <Route path="my-books" element={<MyBooks />} />
          <Route path="add-book" element={<AddBook />} />

          {/* default redirect */}
          <Route path="*" element={<Navigate to="browse" />} />
        </Routes>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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