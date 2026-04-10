import { useState } from "react";
import { BookSDK } from "../Api/bookSDK";
import "./BookDetailsModal.css";

export default function BookDetailModal({ book, onClose }) {
  const [rating, setRating] = useState(0);
  const [, setLoading] = useState(false);

  if (!book) return null;

  const handleRating = async (value) => {
    try {
      setLoading(true);
      setRating(value);

      await BookSDK.rateBook(book._id, value);

      alert("Thanks for rating ⭐");
    } catch (err) {
      console.error(err);
      alert("Rating failed");
    } finally {
      setLoading(false);
    }
  };

  const phone = book.contact?.phone || "";
  const whatsappLink = `https://wa.me/91${phone}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {/* IMAGE */}
        <img
          src={
            book.image ||
            "https://dummyimage.com/200x250/cccccc/000000&text=No+Image"
          }
          alt={book.title}
          className="modal-image"
        />

        {/* DETAILS */}
        <div className="modal-body">
          <h2>{book.title}</h2>
          <p className="author">{book.author}</p>

          <p className="category">{book.category}</p>

          <p className="condition">
            Condition: {book.condition || "N/A"}
          </p>

          {/* PRICE */}
          <div className="price">
            {book.isForSale && <p>Buy: ₹{book.salePrice}</p>}
            {book.isForRent && (
              <p>Rent: ₹{book.rentPricePerDay}/day</p>
            )}
          </div>

          {/* LOCATION */}
          <p className="location">
            📍 {book.location?.city || "Unknown"},{" "}
            {book.location?.area || ""}
          </p>

          {/* CONTACT SELLER */}
          <div className="contact">
            <h4>Contact Seller</h4>

            <p>Name: {book.contact?.name || "N/A"}</p>
            <p>Phone: {phone || "N/A"}</p>

            <div className="contact-buttons">
              {phone && (
                <>
                  <a href={`tel:${phone}`} className="call-btn">
                    📞 Call
                  </a>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-btn"
                  >
                    💬 WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>

          {/* RATING */}
          <div className="rating-section">
            <p>Rate this book:</p>

            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRating(star)}
                className={`star ${
                  star <= rating ? "active" : ""
                }`}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* SHOW AVG RATING */}
          <p className="avg-rating">
            ⭐ {book.rating?.toFixed(1) || 0}
          </p>
        </div>
      </div>
    </div>
  );
}