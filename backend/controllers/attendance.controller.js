import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

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

    attendance = await Attendance.create({
        employee: employeeRecord._id,
        date: today,
        checkIn: new Date(),
        status: 'present',
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
