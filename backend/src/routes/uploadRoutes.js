import express from "express";
import upload from "../middleware/multer.js";
import { uploadImage } from "../controller/uplaodController.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", verifyFirebaseToken, upload.single("image"), uploadImage);

export default router;