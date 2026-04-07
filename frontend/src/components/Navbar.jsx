import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ cartCount = 0 }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar">
  <div className="nav-container">

    {/* LEFT */}
    <div className="nav-left">
      <Link to="/" className="logo">
        <div className="logo-box">📚</div>
        <div className="logo-text">
          <span>BookHub</span>
          <p>Read More, Spend Less</p>
        </div>
      </Link>
    </div>

    {/* CENTER */}
    <div className="nav-center">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
    </div>

    {/* RIGHT */}
    <div className="nav-right">
      <Link to="/books">Browse</Link>

      <Link to="/dashboard" className="icon">❤️</Link>

      <Link to="/cart" className="icon cart">
        🛒
        {cartCount > 0 && <span className="badge">{cartCount}</span>}
      </Link>

      <Link to="/login" className="login-btn">
        Login
      </Link>
    </div>

  </div>
</nav>
  );
}