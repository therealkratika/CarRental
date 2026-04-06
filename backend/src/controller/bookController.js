import Book from "../model/book.js";
import User from "../model/user.js";
export const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      category,
      condition,
      isForSale,
      isForRent,
      salePrice,
      rentPricePerDay,
      image,
      city,
      area,
      coordinates,
      name,
      phone,
      email,
    } = req.body;

    if (!isForSale && !isForRent) {
      return res.status(400).json({
        message: "Book must be for rent or sale",
      });
    }

    let locationData = null;

    if (coordinates?.lat && coordinates?.lng) {
      locationData = {
        type: "Point",
        coordinates: [
          Number(coordinates.lng), 
          Number(coordinates.lat),
        ],
        city,
        area,
      };
    }

    const book = await Book.create({
      title,
      author,
      description,
      category,
      condition,
      isForSale,
      isForRent,
      salePrice,
      rentPricePerDay,

      image:
        image || "https://dummyimage.com/200x250/cccccc/000000&text=No+Image",

      location: locationData,

      contact: { name, phone, email },

      owner: req.user._id,
    });

    res.status(201).json(book);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL ================= */
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ status: "available" }).populate(
      "owner",
      "name email phone"
    );

    res.json(books);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= MY BOOKS ================= */
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user._id });

    res.json(books);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await book.deleteOne();

    res.json({ message: "Book deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= BUY / RENT ================= */
export const handleBookAction = async (req, res) => {
  try {
    const { action, days } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.status !== "available") {
      return res.status(400).json({ message: "Book not available" });
    }

    if (action === "buy") {
      if (!book.isForSale) {
        return res.status(400).json({ message: "Not for sale" });
      }
      book.status = "sold";
    }

    if (action === "rent") {
      if (!book.isForRent) {
        return res.status(400).json({ message: "Not for rent" });
      }
      book.status = "rented";
      book.rentedForDays = days || 1;
    }

    await book.save();

    res.json({ message: "Success", book });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getNearbyBooks = async (req, res) => {
  try {
    const { lat, lng, distance = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude required",
      });
    }

    const books = await Book.find({
      status: "available",
      location: { $exists: true, $ne: null },
      "location.coordinates.0": { $exists: true },

      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: parseInt(distance),
        },
      },
    }).populate("owner", "name phone email");

    res.json(books);

  } catch (err) {
    console.error("NEARBY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};