import mongoose from 'mongoose';

const leaveTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        daysAllowed: {
            type: Number,
            required: true,
        },
        carryForward: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
        },
        color: {
            type: String,
            default: '#3b82f6',
        },
    },
    {
        timestamps: true,
    }
);

const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);

export default LeaveType;
