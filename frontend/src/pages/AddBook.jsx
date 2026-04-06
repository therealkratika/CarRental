import { useState } from "react";
import { AppSDK } from "../Api/appSdk";
import "./AddBookModal.css";
import { BookSDK } from "../Api/bookSDK";

export default function AddBook() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    type: "sell",
    city: "",
    area: "",
    coordinates: { lat: null, lng: null },
    image: "",
    sellerName: "",
    sellerPhone: "",
    sellerEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Get current location (FIXED)
  const handleUseCurrentLocation = async () => {
    try {
      setGettingLocation(true);

      const loc = await AppSDK.getCurrentLocation();
      console.log("LOCATION:", loc);

      setFormData((prev) => ({
        ...prev,
        coordinates: {
          lat: Number(loc.lat),
          lng: Number(loc.lng),
        },
      }));

      alert("Location captured successfully 📍");

    } catch (err) {
      console.error(err);
      alert(err?.message || "Location error");
    } finally {
      setGettingLocation(false);
    }
  };

  // ✅ Upload image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const url = await AppSDK.uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        image: url,
      }));

    } catch (err) {
      alert(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Submit form (FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation (FIXED)
    if (
      !formData.title ||
      !formData.author ||
      !formData.price ||
      !formData.sellerName ||
      !formData.sellerPhone
    ) {
      return alert("Please fill all required fields");
    }

    // ✅ Ensure location exists
    if (!formData.coordinates?.lat || !formData.coordinates?.lng) {
      return alert("Please use current location 📍");
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        author: formData.author,

        isForSale: formData.type === "sell",
        isForRent: formData.type === "rent",

        salePrice:
          formData.type === "sell"
            ? Number(formData.price)
            : undefined,

        rentPricePerDay:
          formData.type === "rent"
            ? Number(formData.price)
            : undefined,

        image: formData.image,

        // ✅ location
        city: formData.city,
        area: formData.area,
        coordinates: {
          lat: Number(formData.coordinates.lat),
          lng: Number(formData.coordinates.lng),
        },

        // ✅ contact
        name: formData.sellerName,
        phone: formData.sellerPhone,
        email: formData.sellerEmail,
      };

      await BookSDK.create(payload);

      alert("Book added successfully 🎉");

      // ✅ Reset form
      setFormData({
        title: "",
        author: "",
        price: "",
        type: "sell",
        city: "",
        area: "",
        coordinates: { lat: null, lng: null },
        image: "",
        sellerName: "",
        sellerPhone: "",
        sellerEmail: "",
      });

    } catch (err) {
      console.error(err);
      alert(err?.message || "Error adding book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addbook-container">
      <h2>Add Book</h2>

      <form onSubmit={handleSubmit} className="form">

        <label>Book Title</label>
        <input
          name="title"
          placeholder="Enter book title"
          value={formData.title}
          onChange={handleChange}
        />

        <label>Author</label>
        <input
          name="author"
          placeholder="Enter author name"
          value={formData.author}
          onChange={handleChange}
        />

        <label>Price</label>
        <input
          name="price"
          type="number"
          placeholder="Enter price (₹)"
          value={formData.price}
          onChange={handleChange}
        />

        <label>Type</label>
        <div className="toggle">
          <button
            type="button"
            className={formData.type === "rent" ? "active" : ""}
            onClick={() => setFormData({ ...formData, type: "rent" })}
          >
            For Rent
          </button>

          <button
            type="button"
            className={formData.type === "sell" ? "active" : ""}
            onClick={() => setFormData({ ...formData, type: "sell" })}
          >
            For Sale
          </button>
        </div>

        <div className="row">
          <div>
            <label>City (optional)</label>
            <input
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Area (optional)</label>
            <input
              name="area"
              placeholder="Enter area"
              value={formData.area}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="button"
          className="location-btn"
          onClick={handleUseCurrentLocation}
        >
          {gettingLocation ? "Getting..." : "📍 Use Current Location"}
        </button>

        <label>Your Name</label>
        <input
          name="sellerName"
          placeholder="Enter your name"
          value={formData.sellerName}
          onChange={handleChange}
        />

        <label>Phone</label>
        <input
          name="sellerPhone"
          placeholder="Enter phone number"
          value={formData.sellerPhone}
          onChange={handleChange}
        />

        <label>Email (optional)</label>
        <input
          name="sellerEmail"
          placeholder="Enter email"
          value={formData.sellerEmail}
          onChange={handleChange}
        />

        <label>Upload Image (optional)</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {uploading && <p>Uploading...</p>}

        {formData.image && (
          <img src={formData.image} alt="preview" className="preview" />
        )}

        <button type="submit" className="submit-btn">
          {loading ? "Adding..." : "Add Book"}
        </button>

      </form>
    </div>
  );
}