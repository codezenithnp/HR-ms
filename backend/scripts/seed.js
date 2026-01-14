import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import LeaveType from '../models/LeaveType.js';
import Shift from '../models/Shift.js';
import Department from '../models/Department.js';
import Holiday from '../models/Holiday.js';

dotenv.config();

const users = [
    { name: 'Admin User', email: 'admin@codezenith.com', password: 'Admin@123', role: 'admin' },
    { name: 'HR Manager', email: 'hr@codezenith.com', password: 'Hr@123', role: 'hr' },
    { name: 'Project Manager', email: 'manager@codezenith.com', password: 'Manager@123', role: 'manager' },
    { name: 'John Doe', email: 'john.doe@codezenith.com', password: 'Employee@123', role: 'employee' },
];

const employees = [
    {
        employeeId: 'CZ-001',
        fullName: 'John Doe',
        email: 'john.doe@codezenith.com',
        phone: '1234567890',
        department: 'Engineering',
        position: 'Software Engineer',
        role: 'employee',
        status: 'active',
        joinDate: new Date('2023-01-15'),
        address: '123 Tech Lane, Silicon Valley',
        dob: new Date('1995-05-20'),
    },
];

const leaveTypes = [
    { name: 'Annual Leave', daysAllowed: 20, color: '#3b82f6' },
    { name: 'Sick Leave', daysAllowed: 10, color: '#ef4444' },
    { name: 'Casual Leave', daysAllowed: 5, color: '#10b981' },
];

const shifts = [
    { name: 'General Shift', startTime: '09:00', endTime: '18:00', gracePeriod: 15, workingHours: 8 },
    { name: 'Night Shift', startTime: '21:00', endTime: '06:00', gracePeriod: 15, workingHours: 8 },
];

const departments = [
    { name: 'Engineering' },
    { name: 'HR' },
    { name: 'Marketing' },
    { name: 'Sales' },
];

const holidays = [
    { name: 'New Year Day', date: new Date('2026-01-01'), type: 'public' },
    { name: 'Christmas', date: new Date('2026-12-25'), type: 'public' },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Clear existing data
        await User.deleteMany();
        await Employee.deleteMany();
        await LeaveType.deleteMany();
        await Shift.deleteMany();
        await Department.deleteMany();
        await Holiday.deleteMany();

        // Create users
        const createdUsers = await User.create(users);
        console.log('Users seeded!');

        // Link John Doe user to Employee record
        const johnUser = createdUsers.find((u) => u.email === 'john.doe@codezenith.com');
        if (johnUser) {
            employees[0].user = johnUser._id;
        }

        const createdEmployees = await Employee.create(employees);
        console.log('Employees seeded!');

        await LeaveType.create(leaveTypes);
        console.log('Leave Types seeded!');

        await Shift.create(shifts);
        console.log('Shifts seeded!');

        // Set head of Engineering
        departments[0].head = createdEmployees[0]._id;
        await Department.create(departments);
        console.log('Departments seeded!');

        await Holiday.create(holidays);
        console.log('Holidays seeded!');

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
