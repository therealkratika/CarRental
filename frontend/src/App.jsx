import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/forgotPassword";

import BrowseBooks from "./pages/BrowseBook";
import MyBooks from "./pages/MyBook";
import AddBook from "./pages/AddBook";
import ProfilePage from "./pages/ProfilePage";

/* ================= PROTECTED ROUTE ================= */

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/login" replace />;
};

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      
      <Sidebar />
      <div className="flex-1 min-w-0">
        <main className="pt-20 md:pt-8 p-4 md:p-8 h-screen overflow-y-auto">
          <Routes>
            <Route path="browse" element={<BrowseBooks />} />
            <Route path="my-books" element={<MyBooks />} />
            <Route path="add-book" element={<AddBook />} />
            <Route path="profile" element={<ProfilePage />} />

            <Route
              path="*"
              element={<Navigate to="browse" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

/* ================= APP ================= */

export default function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white">
              <Navbar cartCount={0} />
              <Landing />
            </div>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}