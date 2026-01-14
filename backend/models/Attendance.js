import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.ObjectId,
            ref: 'Employee',
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: () => new Date().setHours(0, 0, 0, 0),
        },
        checkIn: {
            type: Date,
        },
        checkOut: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'leave'],
            default: 'present',
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate attendance for same employee and same date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
