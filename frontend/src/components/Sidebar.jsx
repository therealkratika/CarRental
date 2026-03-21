import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthSDK } from "../Api/sdk";
import './Sidebar.css'
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await AuthSDK.logout();
    navigate("/login");
  };

  // helper to highlight active link
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">

      {/* Logo */}
      <h2 className="logo">DRIVEOX</h2>

      {/* Navigation */}
      <nav className="nav-links">

        <Link
          to="/dashboard"
          className={isActive("/dashboard") ? "active" : ""}
        >
          🏠 Home
        </Link>

        <Link
          to="/dashboard/browse"
          className={isActive("/dashboard/browse") ? "active" : ""}
        >
          🚗 Browse Cars
        </Link>

        <Link
          to="/dashboard/bookings"
          className={isActive("/dashboard/bookings") ? "active" : ""}
        >
          📅 My Bookings
        </Link>

        <Link
          to="/dashboard/my-cars"
          className={isActive("/dashboard/my-cars") ? "active" : ""}
        >
          🚘 My Cars
        </Link>

        <Link
          to="/dashboard/add-car"
          className={`highlight ${
            isActive("/dashboard/add-car") ? "active" : ""
          }`}
        >
          ➕ Add Car
        </Link>

        <Link
          to="/dashboard/profile"
          className={isActive("/dashboard/profile") ? "active" : ""}
        >
          👤 Profile
        </Link>

      </nav>

      {/* Logout */}
      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>

    </div>
  );
}