import express from "express";

import {
  addBook,
  getAllBooks,
  getMyBooks,
  deleteBook,
  handleBookAction,
  getNearbyBooks,
  rateBook
} from "../controller/bookController.js";

import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/nearby", verifyFirebaseToken,getNearbyBooks);
router.get("/",verifyFirebaseToken, getAllBooks);
router.get("/my", verifyFirebaseToken, getMyBooks);
router.post("/", verifyFirebaseToken, addBook);
router.post("/:id/action", verifyFirebaseToken, handleBookAction);
router.delete("/:id", verifyFirebaseToken, deleteBook);
router.post("/:id/rate", verifyFirebaseToken, rateBook);

export default router;