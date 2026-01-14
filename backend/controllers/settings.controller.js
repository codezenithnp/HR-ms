import Shift from '../models/Shift.js';
import Holiday from '../models/Holiday.js';
import Department from '../models/Department.js';
import Setting from '../models/Setting.js';

// --- Shifts ---
export const getShifts = async (req, res) => {
    const shifts = await Shift.find({});
    res.json(shifts);
};

export const createShift = async (req, res) => {
    const shift = await Shift.create(req.body);
    res.status(201).json(shift);
};

export const updateShift = async (req, res) => {
    const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(shift);
};

export const deleteShift = async (req, res) => {
    await Shift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shift deleted' });
};

// --- Holidays ---
export const getHolidays = async (req, res) => {
    const holidays = await Holiday.find({}).sort({ date: 1 });
    res.json(holidays);
};

export const createHoliday = async (req, res) => {
    const holiday = await Holiday.create(req.body);
    res.status(201).json(holiday);
};

export const updateHoliday = async (req, res) => {
    const holiday = await Holiday.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(holiday);
};

export const deleteHoliday = async (req, res) => {
    await Holiday.findByIdAndDelete(req.params.id);
    res.json({ message: 'Holiday deleted' });
};

// --- Departments ---
export const getDepartments = async (req, res) => {
    const departments = await Department.find({}).populate('head', 'fullName employeeId');
    res.json(departments);
};

export const createDepartment = async (req, res) => {
    const department = await Department.create(req.body);
    res.status(201).json(department);
};

export const updateDepartment = async (req, res) => {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(department);
};

export const deleteDepartment = async (req, res) => {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted' });
};

// --- General Settings (Working Days etc) ---
export const getSettings = async (req, res) => {
    const { key } = req.params;
    const setting = await Setting.findOne({ key });
    res.json(setting ? setting.value : null);
};

export const updateSettings = async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await Setting.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
    );

    res.json(setting.value);
};
