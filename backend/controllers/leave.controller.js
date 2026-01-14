import LeaveRequest from '../models/LeaveRequest.js';
import LeaveType from '../models/LeaveType.js';
import Employee from '../models/Employee.js';

// @desc    Request leave
// @route   POST /api/leaves
// @access  Private
export const requestLeave = async (req, res) => {
    const { leaveType, fromDate, toDate, days, reason } = req.body;

    const employeeRecord = await Employee.findOne({ email: req.user.email });

    if (!employeeRecord) {
        res.status(404);
        throw new Error('Employee record not found');
    }

    const leave = await LeaveRequest.create({
        employee: employeeRecord._id,
        leaveType,
        fromDate,
        toDate,
        days,
        reason,
    });

    res.status(201).json(leave);
};

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private (Admin/HR/Manager)
export const getLeaves = async (req, res) => {
    const { employeeId, status, leaveType } = req.query;

    const query = {};
    if (employeeId) query.employee = employeeId;
    if (status && status !== 'all') query.status = status;
    if (leaveType && leaveType !== 'all') query.leaveType = leaveType;

    const leaves = await LeaveRequest.find(query)
        .populate('employee', 'fullName employeeId department')
        .sort({ createdAt: -1 });

    res.json(leaves);
};

// @desc    Get my leave requests
// @route   GET /api/leaves/me
// @access  Private
export const getMyLeaves = async (req, res) => {
    const employeeRecord = await Employee.findOne({ email: req.user.email });

    if (!employeeRecord) {
        res.status(404);
        throw new Error('Employee record not found');
    }

    const leaves = await LeaveRequest.find({ employee: employeeRecord._id }).sort({
        createdAt: -1,
    });

    res.json(leaves);
};

// @desc    Update leave request status (Approve/Reject)
// @route   PUT /api/leaves/:id
// @access  Private (Admin/HR/Manager)
export const updateLeaveStatus = async (req, res) => {
    const { status, remarks } = req.body;
    const leave = await LeaveRequest.findById(req.params.id);

    if (leave) {
        leave.status = status || leave.status;
        leave.approvedBy = req.user.name;
        leave.approvedDate = new Date();

        // Additional remarks could be added to model if needed, 
        // for now we'll just update status

        const updatedLeave = await leave.save();
        res.json(updatedLeave);
    } else {
        res.status(404);
        throw new Error('Leave request not found');
    }
};

// @desc    Get leave balance
// @route   GET /api/leaves/balance/:employeeId
// @access  Private
export const getLeaveBalance = async (req, res) => {
    const { employeeId } = req.params;

    const leaveTypes = await LeaveType.find({});

    const balance = await Promise.all(
        leaveTypes.map(async (type) => {
            const approvedLeaves = await LeaveRequest.find({
                employee: employeeId,
                leaveType: type.name,
                status: 'approved',
            });

            const used = approvedLeaves.reduce((sum, l) => sum + l.days, 0);

            return {
                leaveType: type.name,
                total: type.daysAllowed,
                used,
                remaining: type.daysAllowed - used,
                color: type.color,
            };
        })
    );

    res.json(balance);
};

// @desc    Get leave types
// @route   GET /api/leave-types
// @access  Private
export const getLeaveTypes = async (req, res) => {
    const types = await LeaveType.find({});
    res.json(types);
};

// @desc    Create leave type
// @route   POST /api/leave-types
// @access  Private (Admin/HR)
export const createLeaveType = async (req, res) => {
    const { name, daysAllowed, carryForward, description, color } = req.body;
    const type = await LeaveType.create({
        name,
        daysAllowed,
        carryForward,
        description,
        color,
    });
    res.status(201).json(type);
};
