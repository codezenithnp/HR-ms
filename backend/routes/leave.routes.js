import express from 'express';
import {
    requestLeave,
    getLeaves,
    getMyLeaves,
    updateLeaveStatus,
    getLeaveBalance,
    getLeaveTypes,
    createLeaveType,
} from '../controllers/leave.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router
    .route('/')
    .post(protect, requestLeave)
    .get(protect, authorize('admin', 'hr', 'manager'), getLeaves);

router.get('/me', protect, getMyLeaves);
router.get('/balance/:employeeId', protect, getLeaveBalance);
router.put('/:id', protect, authorize('admin', 'hr', 'manager'), updateLeaveStatus);

// Leave Types
router.get('/types', protect, getLeaveTypes);
router.post('/types', protect, authorize('admin', 'hr'), createLeaveType);

export default router;
