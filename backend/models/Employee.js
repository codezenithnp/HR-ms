import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: [true, 'Please add an employee ID'],
            unique: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: [true, 'Please add full name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
        },
        department: {
            type: String,
            required: [true, 'Please add a department'],
        },
        position: {
            type: String,
            required: [true, 'Please add a position'],
        },
        role: {
            type: String,
            enum: ['admin', 'hr', 'manager', 'employee'],
            default: 'employee',
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'on-leave', 'terminated'],
            default: 'active',
        },
        joinDate: {
            type: Date,
            required: [true, 'Please add a join date'],
        },
        address: {
            type: String,
            required: [true, 'Please add an address'],
        },
        dob: {
            type: Date,
            required: [true, 'Please add a date of birth'],
        },
        shift: {
            type: mongoose.Schema.ObjectId,
            ref: 'Shift',
            required: false,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: false, // Optional link to User model for auth
        },
    },
    {
        timestamps: true,
    }
);

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
