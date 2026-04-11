import { useState } from "react";
import { BookSDK } from "../Api/bookSDK";
import "./BookDetailsModal.css";

export default function BookDetailModal({ book, onClose, onActionSuccess }) {
  const [rating, setRating] = useState(book?.userRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [, setLoading] = useState(false);

  if (!book) return null;

  const handleRating = async (value) => {
  try {
    setLoading(true);

    setRating(value);

    const res = await BookSDK.rateBook(book._id, value);
    console.log("RES:", res);

    if (res?.rating !== undefined) {
      book.rating = res.rating;
    }

    book.userRating = value;

    if (onActionSuccess) onActionSuccess();

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

          {/* CONTACT */}
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

          {/* ⭐ RATING WITH HOVER */}
          <div className="rating-section">
            <p>
              Rate this book
              {rating > 0 && (
                <span className="your-rating">
                  {" "} (You rated: {rating} ⭐)
                </span>
              )}
            </p>

            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  star <= (hoverRating || rating) ? "active" : ""
                }`}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* ⭐ AVERAGE */}
          <p className="avg-rating">
            ⭐ {book.rating?.toFixed(1) || "0.0"}
          </p>

        </div>
      </div>
    </div>
  );
}