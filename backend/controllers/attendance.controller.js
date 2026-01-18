import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import Shift from '../models/Shift.js';
import { createAuditLog, getIpAddress } from '../utils/auditLog.js';

// @desc    Check-in
// @route   POST /api/attendance/check-in
// @access  Private
export const checkIn = async (req, res) => {
    const { employeeId } = req.body; // Can be provided by admin/hr or taken from req.user if employee

    let employeeRecord;
    if (req.user.role === 'employee') {
        employeeRecord = await Employee.findOne({ email: req.user.email });
    } else if (employeeId) {
        employeeRecord = await Employee.findById(employeeId);
    }

    if (!employeeRecord) {
        res.status(404);
        throw new Error('Employee record not found');
    }

    const today = new Date().setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
        employee: employeeRecord._id,
        date: today,
    });

    if (attendance) {
        res.status(400);
        throw new Error('Already checked in for today');
    }

    const checkInTime = new Date();
    
    // Calculate if late based on shift
    let status = 'present';
    const shift = await Shift.findById(employeeRecord.shift);
    if (shift) {
        const [shiftHour, shiftMin] = shift.startTime.split(':').map(Number);
        const shiftStart = new Date(today);
        shiftStart.setHours(shiftHour, shiftMin, 0, 0);
        const lateThreshold = new Date(shiftStart.getTime() + (shift.gracePeriod || 0) * 60000);
        
        if (checkInTime > lateThreshold) {
            status = 'late';
        }
    }

    attendance = await Attendance.create({
        employee: employeeRecord._id,
        date: today,
        checkIn: checkInTime,
        status,
    });

    res.status(201).json(attendance);
};

// @desc    Check-out
// @route   POST /api/attendance/check-out
// @access  Private
export const checkOut = async (req, res) => {
    const { employeeId } = req.body;

    let employeeRecord;
    if (req.user.role === 'employee') {
        employeeRecord = await Employee.findOne({ email: req.user.email });
    } else if (employeeId) {
        employeeRecord = await Employee.findById(employeeId);
    }

    if (!employeeRecord) {
        res.status(404);
        throw new Error('Employee record not found');
    }

    const today = new Date().setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
        employee: employeeRecord._id,
        date: today,
    });

    if (!attendance) {
        res.status(400);
        throw new Error('No check-in record found for today');
    }

    if (attendance.checkOut) {
        res.status(400);
        throw new Error('Already checked out for today');
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.json(attendance);
};

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private (Admin/HR/Manager)
export const getAttendance = async (req, res) => {
    const { employeeId, startDate, endDate } = req.query;

    const query = {};

    if (employeeId) query.employee = employeeId;

    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
        .populate('employee', 'fullName employeeId department')
        .sort({ date: -1 });

    res.json(attendance);
};

// @desc    Get my attendance
// @route   GET /api/attendance/me
// @access  Private
export const getMyAttendance = async (req, res) => {
    const employeeRecord = await Employee.findOne({ email: req.user.email });

    if (!employeeRecord) {
        res.status(404);
        throw new Error('Employee record not found');
    }

    const attendance = await Attendance.find({ employee: employeeRecord._id }).sort({
        date: -1,
    });

    res.json(attendance);
};

// @desc    Get today's stats
// @route   GET /api/attendance/today-stats
// @access  Private (Admin/HR/Manager)
export const getTodayStats = async (req, res) => {
    const today = new Date().setHours(0, 0, 0, 0);

    const stats = await Attendance.aggregate([
        { $match: { date: new Date(today) } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    const totalEmployees = await Employee.countDocuments({ status: 'active' });
    const present = stats.find((s) => s._id === 'present')?.count || 0;
    const late = stats.find((s) => s._id === 'late')?.count || 0;
    const leave = stats.find((s) => s._id === 'leave')?.count || 0;
    const absent = totalEmployees - (present + late + leave);

    res.json({
        totalEmployees,
        present,
        late,
        leave,
        absent: absent > 0 ? absent : 0,
    });
};

// @desc    Get today's attendance for specific employee
// @route   GET /api/attendance/today
// @access  Private
export const getTodayAttendance = async (req, res) => {
    const employeeRecord = await Employee.findOne({ email: req.user.email });

    if (!employeeRecord) {
        res.status(404);
        throw new Error('Employee record not found');
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const attendance = await Attendance.findOne({
        employee: employeeRecord._id,
        date: today,
    });

    res.json(attendance || null);
};

// @desc    Update attendance record (Admin correction)
// @route   PUT /api/attendance/:id
// @access  Private (Admin/HR)
export const updateAttendance = async (req, res) => {
    const { checkIn, checkOut, status, notes } = req.body;
    
    const attendance = await Attendance.findById(req.params.id).populate('employee', 'fullName employeeId');

    if (!attendance) {
        res.status(404);
        throw new Error('Attendance record not found');
    }

    const oldData = {
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        status: attendance.status,
    };

    if (checkIn) attendance.checkIn = new Date(checkIn);
    if (checkOut) attendance.checkOut = new Date(checkOut);
    if (status) attendance.status = status;
    if (notes) attendance.notes = notes;

    await attendance.save();

    // Create audit log
    await createAuditLog({
        user: req.user,
        action: 'UPDATE',
        entity: 'Attendance',
        entityId: attendance._id,
        details: {
            employee: attendance.employee.fullName,
            date: attendance.date,
            oldData,
            newData: { checkIn: attendance.checkIn, checkOut: attendance.checkOut, status: attendance.status },
            reason: notes,
        },
        ipAddress: getIpAddress(req),
    });

    res.json(attendance);
};
