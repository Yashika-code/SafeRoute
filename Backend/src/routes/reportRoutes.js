import express from 'express';
import { createReport, getReports, updateReportStatus, voteReports } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post("/", protect, createReport);
router.get("/get", getReports);
router.patch("/:id/vote", protect, voteReports);
// router.patch("/:id/status",protect,updateReportStatus);

export default router;