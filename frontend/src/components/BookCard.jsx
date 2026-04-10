import { useState } from "react";
import { BookSDK } from "../Api/bookSDK";
import "./BookCard.css";

export default function BookCard({ book, onSelect }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleWishlist = async (e) => {
    e.stopPropagation();

    try {
      setLoading(true);

      if (wishlisted) {
        await BookSDK.removeFromWishlist(book._id);
        setWishlisted(false);
      } else {
        await BookSDK.addToWishlist(book._id);
        setWishlisted(true);
      }

    } catch (err) {
      console.error(err);
      alert("Wishlist error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  className="book-card"
  onClick={() => onSelect && onSelect(book)}
>
      <div className="image-container">
        <img
          src={
            book.image ||
            "https://dummyimage.com/200x250/cccccc/000000&text=No+Image"
          }
          alt={book.title}
        />

        <div className="tags">
          {book.isForRent && <span className="tag rent">For Rent</span>}
          {book.condition && (
            <span className="tag condition">{book.condition}</span>
          )}
        </div>

        <button
          className="wishlist-btn"
          onClick={handleWishlist}
          disabled={loading}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="card-body">
        <span className="category">{book.category}</span>

        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>

        <p className="rating">
          ⭐ {book.rating || 0} ({book.reviews || 0})
        </p>

        <div className="price-section">
          {book.isForSale && <p className="price">₹{book.salePrice}</p>}
          {book.isForRent && (
            <p className="rent">₹{book.rentPricePerDay}/day</p>
          )}
        </div>
      </div>
    </div>
  );
}