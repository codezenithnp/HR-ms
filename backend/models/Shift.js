import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        gracePeriod: {
            type: Number,
            default: 0,
        },
        workingHours: {
            type: Number,
            default: 8,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift;
