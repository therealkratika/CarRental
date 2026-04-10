import express from "express";
import { getProfile } from "../controller/profileController.js";
import {verifyFirebaseToken} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyFirebaseToken, getProfile);

export default router;