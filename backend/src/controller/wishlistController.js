import Wishlist from "../model/wishlist.js";
import Book from "../model/book.js";
import mongoose from "mongoose";

export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    if (!bookId || typeof bookId !== 'string' || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Valid Book ID required" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const exists = await Wishlist.findOne({
      user: req.user._id,
      book: String(bookId),
    });

    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const item = await Wishlist.create({
      user: req.user._id,
      book: String(bookId),
    });

    res.status(201).json(item);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id })
      .populate("book")
      .sort({ createdAt: -1 });
    const books = items.map((i) => i.book);

    res.json(books);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId || typeof bookId !== 'string' || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Valid Book ID required" });
    }

    const item = await Wishlist.findOneAndDelete({
      user: req.user._id,
      book: String(bookId),
    });

    if (!item) {
      return res.status(404).json({ message: "Not found in wishlist" });
    }

    res.json({ message: "Removed from wishlist" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};