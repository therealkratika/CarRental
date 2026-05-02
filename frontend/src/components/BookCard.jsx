import { useState, useEffect } from "react";
import { BookSDK } from "../Api/bookSDK";
import "./BookCard.css";

export default function BookCard({ book, onSelect, onRefresh }) {
  const [wishlisted, setWishlisted] = useState(book.isWishlisted || false);
  const [loading, setLoading] = useState(false);

  // Keep local heart in sync with database if the book prop updates
  useEffect(() => {
    setWishlisted(book.isWishlisted || false);
  }, [book.isWishlisted, book._id]);

  const handleWishlist = async (e) => {
    // Stop click from opening the modal/refreshing page
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    // 1. Optimistic UI update: Turn red immediately
    const previousState = wishlisted;
    setWishlisted(!previousState);

    try {
      setLoading(true);
      if (previousState) {
        await BookSDK.removeFromWishlist(book._id);
      } else {
        await BookSDK.addToWishlist(book._id);
      }

      // 2. Trigger parent refresh silently
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      console.error(err);
      // 3. Rollback if the server fails
      setWishlisted(previousState);
      alert("Wishlist update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-card" onClick={() => onSelect && onSelect(book)}>
      <div className="image-container">
        <img
          src={book.image || "https://dummyimage.com/200x250/cccccc/000000&text=No+Image"}
          alt={book.title}
        />
        <div className="tags">
          {book.isForRent && <span className="tag rent">For Rent</span>}
          {book.condition && <span className="tag condition">{book.condition}</span>}
        </div>
      </div>

      <div className="card-body">
        <span className="category">{book.category}</span>
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <p className="rating">
          {book.rating > 0
            ? `⭐ ${book.rating.toFixed(1)} (${book.ratings?.length || 0})`
            : "No ratings yet"}
        </p>
        <div className="price-section">
          {book.isForSale && <p className="price">₹{book.salePrice}</p>}
          {book.isForRent && <p className="rent">₹{book.rentPricePerDay}/day</p>}
        </div>
      </div>

      <button
        type="button"
        className={`wishlist-btn ${wishlisted ? "active" : ""}`}
        onClick={handleWishlist}
        disabled={loading}
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>
    </div>
  );
}