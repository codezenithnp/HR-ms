import express from 'express';
import {
    getShifts, createShift, updateShift, deleteShift,
    getHolidays, createHoliday, updateHoliday, deleteHoliday,
    getDepartments, createDepartment, updateDepartment, deleteDepartment,
    getSettings, updateSettings
} from '../controllers/settings.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

// Shfits
router.route('/shifts')
    .get(protect, getShifts)
    .post(protect, authorize('admin', 'hr'), createShift);
router.route('/shifts/:id')
    .put(protect, authorize('admin', 'hr'), updateShift)
    .delete(protect, authorize('admin', 'hr'), deleteShift);

// Holidays
router.route('/holidays')
    .get(protect, getHolidays)
    .post(protect, authorize('admin', 'hr'), createHoliday);
router.route('/holidays/:id')
    .put(protect, authorize('admin', 'hr'), updateHoliday)
    .delete(protect, authorize('admin', 'hr'), deleteHoliday);

// Departments
router.route('/departments')
    .get(protect, getDepartments)
    .post(protect, authorize('admin', 'hr'), createDepartment);
router.route('/departments/:id')
    .put(protect, authorize('admin', 'hr'), updateDepartment)
    .delete(protect, authorize('admin', 'hr'), deleteDepartment);

// General Settings
router.route('/:key')
    .get(protect, getSettings)
    .put(protect, authorize('admin', 'hr'), updateSettings);

export default router;
