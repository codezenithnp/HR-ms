import express from 'express';
import {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getMyProfile,
    updateMyProfile,
} from '../controllers/employee.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router
    .route('/')
    .get(protect, authorize('admin', 'hr', 'manager'), getEmployees)
    .post(protect, authorize('admin', 'hr'), createEmployee);

// Profile routes for employees
router.get('/profile/me', protect, getMyProfile);
router.put('/profile/me', protect, updateMyProfile);

router
    .route('/:id')
    .get(protect, authorize('admin', 'hr', 'manager'), getEmployeeById)
    .put(protect, authorize('admin', 'hr'), updateEmployee)
    .delete(protect, authorize('admin'), deleteEmployee);

export default router;
