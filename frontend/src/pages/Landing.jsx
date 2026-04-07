import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookSDK } from "../Api/bookSDK";
import "./Landing.css";

export default function Landing() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from your API
  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await BookSDK.getAllBooks(); // 🔁 adjust if name differs
        setBooks(res || []);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);
  const categories = ["Fiction", "Programming", "Science", "History", "Other"];

  return (
    <div className="landing">
      <section className="hero">
        <div className="container hero-grid">

          <div className="hero-left">
            <span className="badge"> Your Reading Partner</span>

            <h1>
              Read More, <span>Spend Less</span>
            </h1>

            <p>
              Buy, rent, or sell books at affordable prices. Smart reading starts here.
            </p>

            <div className="hero-buttons">
              <Link to="/signup?rentOnly=true" className="btn primary">
                Rent Books →
              </Link>

              <Link to="/books" className="btn secondary">
                Buy Used Books
              </Link>
            </div>

            <div className="stats">
              <div>
                <h3>{books.length}+</h3>
                <p>Books</p>
              </div>
              <div>
                <h3>1000+</h3>
                <p>Users</p>
              </div>
              <div>
                <h3>₹50</h3>
                <p>Start Price</p>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80"
              alt="books"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <h3>📚 Huge Collection</h3>
              <p>Thousands of books across categories</p>
            </div>

            <div className="feature-card">
              <h3>💸 Affordable</h3>
              <p>Cheaper than market prices</p>
            </div>

            <div className="feature-card">
              <h3>⏳ Flexible Rental</h3>
              <p>Rent books anytime</p>
            </div>

            <div className="feature-card">
              <h3>📈 Earn Money</h3>
              <p>Sell your old books easily</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <div className="container">
          <h2>Browse Categories</h2>

          <div className="category-grid">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/books?category=${cat}`}
                className="category-card"
              >
                📖
                <p>{cat}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="featured">
        <div className="container">
          <div className="featured-header">
            <h2>Featured Books</h2>
            <Link to="/books">View All →</Link>
          </div>

          {loading ? (
            <p className="loading">Loading books...</p>
          ) : (
            <div className="book-grid">
              {books.slice(0, 6).map((book) => (
                <div key={book.id} className="book-card">
                  <img
                    src={book.image || "https://via.placeholder.com/150"}
                    alt={book.title}
                  />

                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p className="author">{book.author}</p>
                    <p className="price">₹{book.price}</p>

                    <Link to={`/dashboard/${book.id}`} className="view-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Have Books You Don’t Need?</h2>
        <p>Sell them and earn instantly.</p>

        <Link to="/add-book" className="btn white">
          Start Selling →
        </Link>
      </section>
    </div>
  );
}