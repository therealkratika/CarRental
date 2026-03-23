import express from "express";

import {
  addBook,
  getAllBooks,
  getMyBooks,
  deleteBook,
  handleBookAction,
  getNearbyBooks,
} from "../controller/bookController.js";

import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();


// 📍 NEARBY (MUST BE BEFORE /:id)
router.get("/nearby", getNearbyBooks);


// 📚 GET ALL BOOKS
router.get("/", getAllBooks);


// 👤 GET MY BOOKS (protected)
router.get("/my", verifyFirebaseToken, getMyBooks);


// ➕ ADD BOOK (protected)
router.post("/", verifyFirebaseToken, addBook);


// 🛒 RENT / BUY (protected)
router.post("/:id/action", verifyFirebaseToken, handleBookAction);


// ❌ DELETE BOOK (protected)
router.delete("/:id", verifyFirebaseToken, deleteBook);


export default router;