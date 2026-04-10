import Wishlist from "../model/wishlist.js";
import Book from "../model/book.js";

/* ================= ADD ================= */
export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID required" });
    }

    // check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // prevent duplicate
    const exists = await Wishlist.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const item = await Wishlist.create({
      user: req.user._id,
      book: bookId,
    });

    res.status(201).json(item);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ================= */
export const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id })
      .populate("book")
      .sort({ createdAt: -1 });

    // return only books
    const books = items.map((i) => i.book);

    res.json(books);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REMOVE ================= */
export const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    const item = await Wishlist.findOneAndDelete({
      user: req.user._id,
      book: bookId,
    });

    if (!item) {
      return res.status(404).json({ message: "Not found in wishlist" });
    }

    res.json({ message: "Removed from wishlist" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};