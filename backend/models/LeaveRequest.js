import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.ObjectId,
            ref: 'Employee',
            required: true,
        },
        leaveType: {
            type: String,
            required: true,
        },
        fromDate: {
            type: Date,
            required: true,
        },
        toDate: {
            type: Date,
            required: true,
        },
        days: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        appliedDate: {
            type: Date,
            default: Date.now,
        },
        approvedBy: {
            type: String,
        },
        approvedDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

export default LeaveRequest;
