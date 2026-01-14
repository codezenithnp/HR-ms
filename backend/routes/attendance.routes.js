import express from 'express';
import {
    checkIn,
    checkOut,
    getAttendance,
    getMyAttendance,
    getTodayStats,
} from '../controllers/attendance.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.get('/', protect, authorize('admin', 'hr', 'manager'), getAttendance);
router.get('/me', protect, getMyAttendance);
router.get(
    '/today-stats',
    protect,
    authorize('admin', 'hr', 'manager'),
    getTodayStats
);

export default router;
