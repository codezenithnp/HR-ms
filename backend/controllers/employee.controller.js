import Employee from '../models/Employee.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import { createAuditLog, getIpAddress } from '../utils/auditLog.js';

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Admin/HR/Manager)
export const getEmployees = async (req, res) => {
    const { search, department, role, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { employeeId: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    if (department) query.department = department;
    if (role) query.role = role;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const employees = await Employee.find(query)
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ createdAt: -1 });

    const total = await Employee.countDocuments(query);

    res.json({
        employees,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
    });
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private (Admin/HR/Manager)
export const getEmployeeById = async (req, res) => {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
        res.json(employee);
    } else {
        res.status(404);
        throw new Error('Employee not found');
    }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private (Admin/HR)
export const createEmployee = async (req, res) => {
    const {
        employeeId,
        fullName,
        email,
        phone,
        department,
        position,
        role,
        status,
        joinDate,
        address,
        dob,
    } = req.body;

    const employeeExists = await Employee.findOne({ employeeId });

    if (employeeExists) {
        res.status(400);
        throw new Error('Employee ID already exists');
    }

    const employee = await Employee.create({
        employeeId,
        fullName,
        email,
        phone,
        department,
        position,
        role,
        status,
        joinDate,
        address,
        dob,
    });

    // Create or Link corresponding User account
    // Generate a secure random password for initial setup
    const tempPassword = crypto.randomBytes(10).toString('hex');

    let user = await User.findOne({ email });
    let isNewUser = false;

    try {
        if (!user) {
            user = await User.create({
                name: fullName,
                email,
                password: tempPassword,
                role: role || 'employee',
            });
            isNewUser = true;
        }

        // Link user to employee
        employee.user = user._id;
        await employee.save();

        // Only send invitation email to NEW users
        if (isNewUser) {
            // Get reset token to allow them to set their own password immediately
            const resetToken = user.getResetPasswordToken();
            await user.save({ validateBeforeSave: false });

            // Create setup url
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const setupUrl = `${frontendUrl}/reset-password/${resetToken}`;

            const message = `You have been invited to join CodeZenith HRMS as an employee.\n\nTo accept this invitation and complete your registration, please click the link below to set your password:\n\n${setupUrl}\n\nYour username/email is: ${email}`;

            await sendEmail({
                email: user.email,
                subject: 'Invitation to Join CodeZenith',
                message,
            });
        }

    } catch (error) {
        console.error('Error handling user account for employee:', error);
        // We don't roll back employee creation, but we should probably alert the admin
    }

    res.status(201).json(employee);
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin/HR)
export const updateEmployee = async (req, res) => {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
        employee.fullName = req.body.fullName || employee.fullName;
        employee.email = req.body.email || employee.email;
        employee.phone = req.body.phone || employee.phone;
        employee.department = req.body.department || employee.department;
        employee.position = req.body.position || employee.position;
        employee.role = req.body.role || employee.role;
        employee.status = req.body.status || employee.status;
        employee.joinDate = req.body.joinDate || employee.joinDate;
        employee.address = req.body.address || employee.address;
        employee.dob = req.body.dob || employee.dob;

        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } else {
        res.status(404);
        throw new Error('Employee not found');
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
export const deleteEmployee = async (req, res) => {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
        // Create audit log before deletion
        await createAuditLog({
            user: req.user,
            action: 'DELETE',
            entity: 'Employee',
            entityId: employee._id,
            details: {
                employeeId: employee.employeeId,
                fullName: employee.fullName,
                email: employee.email,
                department: employee.department,
            },
            ipAddress: getIpAddress(req),
        });

        await employee.deleteOne();
        res.json({ message: 'Employee removed' });
    } else {
        res.status(404);
        throw new Error('Employee not found');
    }
};

// @desc    Get employee profile (for employees to view their own profile)
// @route   GET /api/employees/profile/me
// @access  Private
export const getMyProfile = async (req, res) => {
    const employee = await Employee.findOne({ email: req.user.email });

    if (!employee) {
        res.status(404);
        throw new Error('Employee profile not found');
    }

    res.json(employee);
};

// @desc    Update employee profile (limited fields for self-update)
// @route   PUT /api/employees/profile/me
// @access  Private
export const updateMyProfile = async (req, res) => {
    const employee = await Employee.findOne({ email: req.user.email });

    if (!employee) {
        res.status(404);
        throw new Error('Employee profile not found');
    }

    // Only allow updating certain fields
    const allowedUpdates = ['phone', 'address'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    Object.assign(employee, updates);
    const updatedEmployee = await employee.save();

    res.json(updatedEmployee);
};
