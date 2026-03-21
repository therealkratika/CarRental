import express from 'express';
import { verifyFirebaseToken } from '../middleware/authmiddleware';
const router = express.Router();
router.use(verifyFirebaseToken);