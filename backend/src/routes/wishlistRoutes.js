import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controller/wishlistController.js";

import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
const auth = verifyFirebaseToken;
const router = express.Router();

router.post("/", auth, addToWishlist);          
router.get("/", auth, getWishlist);            
router.delete("/:bookId", auth, removeFromWishlist); 

export default router;