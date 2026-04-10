import express from "express";
import { getOrders } from "../controller/orderController.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
const auth = verifyFirebaseToken;
const router = express.Router();
router.get("/", auth, getOrders);

export default router;