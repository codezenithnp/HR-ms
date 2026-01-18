import express from 'express';
import {
    requestLeave,
    getLeaves,
    getMyLeaves,
    updateLeaveStatus,
    getLeaveBalance,
    getLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType,
    cancelLeave,
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
router.delete('/:id', protect, cancelLeave);

// Leave Types
router.route('/types')
    .get(protect, getLeaveTypes)
    .post(protect, authorize('admin', 'hr'), createLeaveType);

router.route('/types/:id')
    .put(protect, authorize('admin', 'hr'), updateLeaveType)
    .delete(protect, authorize('admin'), deleteLeaveType);

export default router;
