import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        head: {
            type: mongoose.Schema.ObjectId,
            ref: 'Employee',
        },
        employeeCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Department = mongoose.model('Department', departmentSchema);

export default Department;
