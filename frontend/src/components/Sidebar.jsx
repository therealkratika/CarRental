import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthSDK } from "../Api/sdk";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await AuthSDK.logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <h2 className="logo">BOOKLOOP</h2>

      <nav className="nav-links">

        <Link
          to="/dashboard/browse"
          className={isActive("/dashboard/browse") ? "active" : ""}
        >
          📚 Browse Books
        </Link>

        <Link
          to="/dashboard/my-books"
          className={isActive("/dashboard/my-books") ? "active" : ""}
        >
          📖 My Books
        </Link>

        <Link
          to="/dashboard/add-book"
          className={`highlight ${
            isActive("/dashboard/add-book") ? "active" : ""
          }`}
        >
          ➕ Add Book
        </Link>

      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}