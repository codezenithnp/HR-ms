import LeaveRequest from '../models/LeaveRequest.js';
import LeaveType from '../models/LeaveType.js';
import Employee from '../models/Employee.js';
import { createAuditLog, getIpAddress } from '../utils/auditLog.js';

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

    // Check for overlapping leave requests
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    const overlapping = await LeaveRequest.findOne({
        employee: employeeRecord._id,
        status: { $in: ['pending', 'approved'] },
        $or: [
            { fromDate: { $lte: to }, toDate: { $gte: from } },
        ],
    });

    if (overlapping) {
        res.status(400);
        throw new Error('You already have a leave request for overlapping dates');
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
    const leave = await LeaveRequest.findById(req.params.id).populate('employee', 'fullName email employeeId');

    if (!leave) {
        res.status(404);
        throw new Error('Leave request not found');
    }

    // Prevent self-approval
    if (leave.employee.email === req.user.email) {
        res.status(403);
        throw new Error('You cannot approve/reject your own leave request');
    }

    const oldStatus = leave.status;
    leave.status = status || leave.status;
    leave.approvedBy = req.user.name;
    leave.approvedDate = new Date();

    const updatedLeave = await leave.save();

    // Create audit log
    await createAuditLog({
        user: req.user,
        action: status === 'approved' ? 'APPROVE_LEAVE' : 'REJECT_LEAVE',
        entity: 'LeaveRequest',
        entityId: leave._id,
        details: {
            employee: leave.employee.fullName,
            leaveType: leave.leaveType,
            dates: `${leave.fromDate} to ${leave.toDate}`,
            oldStatus,
            newStatus: status,
            remarks,
        },
        ipAddress: getIpAddress(req),
    });

    res.json(updatedLeave);
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

// @desc    Update leave type
// @route   PUT /api/leaves/types/:id
// @access  Private (Admin/HR)
export const updateLeaveType = async (req, res) => {
    const type = await LeaveType.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    
    if (!type) {
        res.status(404);
        throw new Error('Leave type not found');
    }
    
    res.json(type);
};

// @desc    Delete leave type
// @route   DELETE /api/leaves/types/:id
// @access  Private (Admin)
export const deleteLeaveType = async (req, res) => {
    const type = await LeaveType.findById(req.params.id);
    
    if (!type) {
        res.status(404);
        throw new Error('Leave type not found');
    }
    
    // Check if leave type is in use
    const inUse = await LeaveRequest.findOne({ leaveType: type.name });
    if (inUse) {
        res.status(400);
        throw new Error('Cannot delete leave type that is in use');
    }
    
    await type.deleteOne();
    res.json({ message: 'Leave type deleted' });
};

// @desc    Cancel leave request
// @route   DELETE /api/leaves/:id
// @access  Private
export const cancelLeave = async (req, res) => {
    const leave = await LeaveRequest.findById(req.params.id).populate('employee', 'email');
    
    if (!leave) {
        res.status(404);
        throw new Error('Leave request not found');
    }
    
    // Only the employee who requested can cancel, and only if pending
    if (leave.employee.email !== req.user.email) {
        res.status(403);
        throw new Error('You can only cancel your own leave requests');
    }
    
    if (leave.status !== 'pending') {
        res.status(400);
        throw new Error('Only pending leave requests can be cancelled');
    }
    
    await leave.deleteOne();
    res.json({ message: 'Leave request cancelled' });
};
