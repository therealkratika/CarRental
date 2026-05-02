import Book from "../model/book.js";
import Order from "../model/order.js";
import Wishlist from "../model/wishlist.js";

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
        message: "Book must be for sale or rent",
      });
    }

    let location = null;

    if (coordinates?.lat && coordinates?.lng) {
      location = {
        type: "Point",
        coordinates: [Number(coordinates.lng), Number(coordinates.lat)],
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
        image ||
        "https://dummyimage.com/200x250/cccccc/000000&text=No+Image",

      location,

      contact: { name, phone, email },

      owner: req.user._id,

      status: "available",
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    // 1. Fetch all books
    const books = await Book.find().lean(); // .lean() makes them plain JS objects so we can add properties

    // 2. If no user is logged in, return books as is
    if (!req.user) {
      return res.json(books);
    }

    // 3. Find all wishlist entries for THIS specific user
    const userWishlist = await Wishlist.find({ user: req.user._id });
    
    // Create a Set of book IDs for fast lookup
    const wishlistedBookIds = new Set(userWishlist.map(item => item.book.toString()));

    // 4. Map through books and attach the true isWishlisted status
    const booksWithStatus = books.map(book => ({
      ...book,
      isWishlisted: wishlistedBookIds.has(book._id.toString())
    }));

    res.json(booksWithStatus);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user._id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
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
export const getNearbyBooks = async (req, res) => {
  try {
    const { lat, lng, distance = 5000 } = req.query;

    const books = await Book.find({
      status: "available",
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
    res.status(500).json({ message: err.message });
  }
};
export const handleBookAction = async (req, res) => {
  try {
    const { action, days } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.status !== "available") {
      return res.status(400).json({ message: "Not available" });
    }

    const order = await Order.create({
      user: req.user._id,
      book: book._id,
      type: action,

      amount:
        action === "buy"
          ? book.salePrice
          : book.rentPricePerDay * (days || 1),

      rentStartDate: action === "rent" ? new Date() : null,
      rentEndDate:
        action === "rent"
          ? new Date(Date.now() + (days || 1) * 86400000)
          : null,
    });

    book.status = action === "buy" ? "sold" : "rented";
    await book.save();

    res.json({ message: "Order created", order });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const rateBook = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating" });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existing = book.ratings.find(
      (r) => String(r.user) === String(req.user._id)
    );

    if (existing) {
      existing.value = rating; // update
    } else {
      book.ratings.push({
        user: req.user._id,
        value: rating,
      });
    }

    // ✅ FIXED CALCULATION
    const total = book.ratings.reduce((sum, r) => sum + r.value, 0);

    const avg = total / book.ratings.length;

    book.rating = Number(avg.toFixed(1)); // ✅ correct

    await book.save();

    res.json({
      message: "Book rated",
      rating: book.rating,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message || "Rating error",
    });
  }
};