import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import LeaveType from '../models/LeaveType.js';
import Shift from '../models/Shift.js';
import Department from '../models/Department.js';
import Holiday from '../models/Holiday.js';
import Attendance from '../models/Attendance.js';
import LeaveRequest from '../models/LeaveRequest.js';

dotenv.config();

// ============================================================
// USERS (Authentication accounts)
// ============================================================
const users = [
    // Admin / Management
    { name: 'Admin User',          email: 'admin@codezenith.com',          password: 'Admin@123',    role: 'admin' },
    { name: 'Rizan Shrestha',      email: 'rizan.shrestha@codezenith.com', password: 'Hr@123',       role: 'hr' },
    { name: 'Project Manager',     email: 'manager@codezenith.com',        password: 'Manager@123',  role: 'manager' },

    // Engineers
    { name: 'Krish Dhakal',        email: 'krish.dhakal@codezenith.com',   password: 'Employee@123', role: 'employee' },
    { name: 'Seema Poudel',        email: 'seema.poudel@codezenith.com',   password: 'Employee@123', role: 'employee' },
    { name: 'Nischay Poudel',      email: 'nischay.poudel@codezenith.com', password: 'Employee@123', role: 'employee' },
    { name: 'Jonathan Poudel',     email: 'jonathan.poudel@codezenith.com',password: 'Employee@123', role: 'employee' },

    // QA
    { name: 'Prabesh Marasini',    email: 'prabesh.marasini@codezenith.com',password: 'Employee@123', role: 'employee' },

    // Additional employees
    { name: 'Anjali Sharma',       email: 'anjali.sharma@codezenith.com',  password: 'Employee@123', role: 'employee' },
    { name: 'Bikash Thapa',        email: 'bikash.thapa@codezenith.com',   password: 'Employee@123', role: 'employee' },
    { name: 'Sanjay Karki',        email: 'sanjay.karki@codezenith.com',   password: 'Employee@123', role: 'employee' },
    { name: 'Priya Adhikari',      email: 'priya.adhikari@codezenith.com', password: 'Employee@123', role: 'employee' },
];

// ============================================================
// DEPARTMENTS
// ============================================================
const departments = [
    { name: 'Engineering' },
    { name: 'Human Resources' },
    { name: 'Marketing' },
    { name: 'Sales' },
    { name: 'Finance' },
    { name: 'Quality Assurance' },
    { name: 'Design' },
];

// ============================================================
// SHIFTS
// ============================================================
const shifts = [
    { name: 'Day Shift',     startTime: '09:00', endTime: '18:00', gracePeriod: 15, workingHours: 8 },
    { name: 'Evening Shift', startTime: '14:00', endTime: '23:00', gracePeriod: 15, workingHours: 8 },
    { name: 'Night Shift',   startTime: '21:00', endTime: '06:00', gracePeriod: 15, workingHours: 8 },
];

// ============================================================
// LEAVE TYPES
// ============================================================
const leaveTypes = [
    { name: 'Annual Leave',    daysAllowed: 18, color: '#4648d4' },
    { name: 'Sick Leave',      daysAllowed: 12, color: '#bd001a' },
    { name: 'Casual Leave',    daysAllowed:  6, color: '#006a48' },
    { name: 'Maternity Leave', daysAllowed: 90, color: '#b48200' },
    { name: 'Paternity Leave', daysAllowed: 15, color: '#5a00b0' },
];

// ============================================================
// HOLIDAYS (Nepal + Company)
// ============================================================
const holidays = [
    { name: 'New Year Day',          date: new Date('2026-01-01'), type: 'public' },
    { name: 'Maha Shivaratri',       date: new Date('2026-02-26'), type: 'public' },
    { name: 'Holi',                  date: new Date('2026-03-16'), type: 'public' },
    { name: 'Buddha Jayanti',        date: new Date('2026-05-12'), type: 'public' },
    { name: 'Dashain (Fulpati)',     date: new Date('2026-10-10'), type: 'public' },
    { name: 'Dashain (Vijaya Dashami)', date: new Date('2026-10-12'), type: 'public' },
    { name: 'Tihar (Laxmi Puja)',   date: new Date('2026-10-28'), type: 'public' },
    { name: 'Christmas',             date: new Date('2026-12-25'), type: 'public' },
    { name: 'Company Anniversary',   date: new Date('2026-03-15'), type: 'optional' },
    { name: 'Founders Day',          date: new Date('2026-08-01'), type: 'optional' },
];

// ============================================================
// SEED FUNCTION
// ============================================================
const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // ---- Clear all collections ----
        await Promise.all([
            User.deleteMany(),
            Employee.deleteMany(),
            LeaveType.deleteMany(),
            Shift.deleteMany(),
            Department.deleteMany(),
            Holiday.deleteMany(),
            Attendance.deleteMany().catch(() => {}),
            LeaveRequest.deleteMany().catch(() => {}),
        ]);
        console.log('🗑  Cleared existing data');

        // ---- Departments ----
        const createdDepts = await Department.create(departments);
        const deptMap = Object.fromEntries(createdDepts.map(d => [d.name, d._id]));
        console.log('🏢  Departments seeded');

        // ---- Shifts ----
        const createdShifts = await Shift.create(shifts);
        const dayShift = createdShifts[0];
        console.log('⏰  Shifts seeded');

        // ---- Leave Types ----
        await LeaveType.create(leaveTypes);
        console.log('📋  Leave types seeded');

        // ---- Holidays ----
        await Holiday.create(holidays);
        console.log('🎉  Holidays seeded');

        // ---- Users ----
        const createdUsers = await User.create(users);
        const userMap = Object.fromEntries(createdUsers.map(u => [u.email, u._id]));
        console.log('👤  Users seeded');

        // ---- Employees ----
        const employeeRecords = [
            // ── Required seed employees ──────────────────────────────────────
            {
                employeeId: 'CZ-HR-001',
                fullName:   'Rizan Shrestha',
                email:      'rizan.shrestha@codezenith.com',
                phone:      '9841001001',
                department: 'Human Resources',
                position:   'HR Manager',
                role:       'hr',
                status:     'active',
                joinDate:   new Date('2022-03-01'),
                dob:        new Date('1990-07-15'),
                address:    'Lalitpur, Nepal',
                salary:     120000,
                employmentType: 'full-time',
                user:       userMap['rizan.shrestha@codezenith.com'],
            },
            {
                employeeId: 'CZ-ENG-001',
                fullName:   'Krish Dhakal',
                email:      'krish.dhakal@codezenith.com',
                phone:      '9841002001',
                department: 'Engineering',
                position:   'Full Stack Intern',
                role:       'employee',
                status:     'active',
                joinDate:   new Date('2025-01-06'),
                dob:        new Date('2002-05-18'),
                address:    'Kathmandu, Nepal',
                salary:     25000,
                employmentType: 'intern',
                user:       userMap['krish.dhakal@codezenith.com'],
            },
            {
                employeeId: 'CZ-ENG-002',
                fullName:   'Seema Poudel',
                email:      'seema.poudel@codezenith.com',
                phone:      '9841003001',
                department: 'Engineering',
                position:   'Full Stack Intern',
                role:       'employee',
                status:     'active',
                joinDate:   new Date('2025-01-06'),
                dob:        new Date('2001-11-22'),
                address:    'Bhaktapur, Nepal',
                salary:     25000,
                employmentType: 'intern',
                user:       userMap['seema.poudel@codezenith.com'],
            },
            {
                employeeId: 'CZ-ENG-003',
                fullName:   'Nischay Poudel',
                email:      'nischay.poudel@codezenith.com',
                phone:      '9841004001',
                department: 'Engineering',
                position:   'Full Stack Intern',
                role:       'employee',
                status:     'active',
                joinDate:   new Date('2025-01-06'),
                dob:        new Date('2002-03-10'),
                address:    'Kathmandu, Nepal',
                salary:     25000,
                employmentType: 'intern',
                user:       userMap['nischay.poudel@codezenith.com'],
            },
            {
                employeeId: 'CZ-ENG-004',
                fullName:   'Jonathan Poudel',
                email:      'jonathan.poudel@codezenith.com',
                phone:      '9841005001',
                department: 'Engineering',
                position:   'Frontend Intern',
                role:       'employee',
                status:     'active',
                joinDate:   new Date('2025-01-06'),
                dob:        new Date('2001-08-30'),
                address:    'Lalitpur, Nepal',
                salary:     22000,
                employmentType: 'intern',
                user:       userMap['jonathan.poudel@codezenith.com'],
            },
            {
                employeeId: 'CZ-QA-001',
                fullName:   'Prabesh Marasini',
                email:      'prabesh.marasini@codezenith.com',
                phone:      '9841006001',
                department: 'Quality Assurance',
                position:   'QA Intern',
                role:       'employee',
                status:     'active',
                joinDate:   new Date('2025-01-13'),
                dob:        new Date('2001-12-05'),
                address:    'Pokhara, Nepal',
                salary:     22000,
                employmentType: 'intern',
                user:       userMap['prabesh.marasini@codezenith.com'],
            },

            // ── 4 Additional realistic Nepali employees ───────────────────────
            {
                employeeId: 'CZ-FIN-001',
                fullName:   'Anjali Sharma',
                email:      'anjali.sharma@codezenith.com',
                phone:      '9841007001',
                department: 'Finance',
                position:   'Finance Analyst',
                role:       'employee',
                status:     'active',
                joinDate:   new Date('2023-04-10'),
                dob:        new Date('1995-02-20'),
                address:    'New Baneshwor, Kathmandu',
                salary:     75000,
                employmentType: 'full-time',
                user:       userMap['anjali.sharma@codezenith.com'],
            },
            {
                employeeId: 'CZ-MKT-001',
                fullName:   'Bikash Thapa',
                email:      'bikash.thapa@codezenith.com',
                phone:      '9841008001',
                department: 'Marketing',
                position:   'Digital Marketing Manager',
                role:       'employee',
                status:     'active',
                joinDate:   new Date('2022-09-01'),
                dob:        new Date('1992-06-14'),
                address:    'Thamel, Kathmandu',
                salary:     85000,
                employmentType: 'full-time',
                user:       userMap['bikash.thapa@codezenith.com'],
            },
            {
                employeeId: 'CZ-ENG-005',
                fullName:   'Sanjay Karki',
                email:      'sanjay.karki@codezenith.com',
                phone:      '9841009001',
                department: 'Engineering',
                position:   'Senior Backend Engineer',
                role:       'employee',
                status:     'active',
                joinDate:   new Date('2021-07-15'),
                dob:        new Date('1989-09-25'),
                address:    'Pulchowk, Lalitpur',
                salary:     150000,
                employmentType: 'full-time',
                user:       userMap['sanjay.karki@codezenith.com'],
            },
            {
                employeeId: 'CZ-DES-001',
                fullName:   'Priya Adhikari',
                email:      'priya.adhikari@codezenith.com',
                phone:      '9841010001',
                department: 'Design',
                position:   'UI/UX Designer',
                role:       'employee',
                status:     'active',
                joinDate:   new Date('2023-01-02'),
                dob:        new Date('1997-04-08'),
                address:    'Durbar Marg, Kathmandu',
                salary:     90000,
                employmentType: 'full-time',
                user:       userMap['priya.adhikari@codezenith.com'],
            },
        ];

        // Attach shift to all employees
        const employeesWithShift = employeeRecords.map(emp => ({ ...emp, shift: dayShift._id }));
        const createdEmployees   = await Employee.create(employeesWithShift);
        const empMap             = Object.fromEntries(createdEmployees.map(e => [e.email, e]));
        console.log(`👥  Employees seeded (${createdEmployees.length} records)`);

        // ---- Set department heads ----
        const rizanEmp  = empMap['rizan.shrestha@codezenith.com'];
        const sanjayEmp = empMap['sanjay.karki@codezenith.com'];
        const anjaliEmp = empMap['anjali.sharma@codezenith.com'];
        const bikashEmp = empMap['bikash.thapa@codezenith.com'];
        const priyaEmp  = empMap['priya.adhikari@codezenith.com'];
        const prabeshEmp = empMap['prabesh.marasini@codezenith.com'];

        await Promise.all([
            Department.findByIdAndUpdate(deptMap['Human Resources'],   { head: rizanEmp?._id }),
            Department.findByIdAndUpdate(deptMap['Engineering'],        { head: sanjayEmp?._id }),
            Department.findByIdAndUpdate(deptMap['Finance'],            { head: anjaliEmp?._id }),
            Department.findByIdAndUpdate(deptMap['Marketing'],          { head: bikashEmp?._id }),
            Department.findByIdAndUpdate(deptMap['Design'],             { head: priyaEmp?._id }),
            Department.findByIdAndUpdate(deptMap['Quality Assurance'],  { head: prabeshEmp?._id }),
        ]);
        console.log('🏢  Department heads assigned');

        // ---- Mock Attendance (last 30 days for all employees) ----
        const attendanceRecords = [];
        const today             = new Date();

        for (const emp of createdEmployees) {
            for (let i = 1; i <= 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);

                // Skip weekends
                const day = date.getDay();
                if (day === 0 || day === 6) continue;

                // Random attendance pattern (90% present, 5% late, 5% absent)
                const rand = Math.random();
                let status, checkIn, checkOut;

                if (rand < 0.05) {
                    status = 'absent';
                } else if (rand < 0.10) {
                    status = 'late';
                    const lateMinutes = Math.floor(Math.random() * 45) + 20;
                    checkIn = new Date(date);
                    checkIn.setHours(9, lateMinutes, 0, 0);
                    checkOut = new Date(date);
                    checkOut.setHours(18, Math.floor(Math.random() * 30), 0, 0);
                } else {
                    status = 'present';
                    const earlyMinutes = Math.floor(Math.random() * 15);
                    checkIn = new Date(date);
                    checkIn.setHours(8, 45 + earlyMinutes, 0, 0);
                    checkOut = new Date(date);
                    checkOut.setHours(17, 45 + Math.floor(Math.random() * 30), 0, 0);
                }

                attendanceRecords.push({
                    employee:   emp._id,
                    employeeId: emp.employeeId,
                    date:       date,
                    status,
                    checkIn:    checkIn || null,
                    checkOut:   checkOut || null,
                    shift:      dayShift._id,
                });
            }
        }

        if (attendanceRecords.length > 0) {
            await Attendance.insertMany(attendanceRecords);
            console.log(`📅  Attendance records seeded (${attendanceRecords.length} records)`);
        }

        // ---- Mock Leave Requests ----
        const leaveTypesDocs = await LeaveType.find();
        const annualLeave    = leaveTypesDocs.find(lt => lt.name === 'Annual Leave');
        const sickLeave      = leaveTypesDocs.find(lt => lt.name === 'Sick Leave');

        if (annualLeave && sickLeave) {
            const leaveRequests = [
                {
                    employee:  empMap['krish.dhakal@codezenith.com']?._id,
                    leaveType: annualLeave._id,
                    fromDate:  new Date('2026-02-10'),
                    toDate:    new Date('2026-02-12'),
                    days:      3,
                    reason:    'Family function in hometown',
                    status:    'approved',
                },
                {
                    employee:  empMap['seema.poudel@codezenith.com']?._id,
                    leaveType: sickLeave._id,
                    fromDate:  new Date('2026-01-20'),
                    toDate:    new Date('2026-01-21'),
                    days:      2,
                    reason:    'Fever and flu',
                    status:    'approved',
                },
                {
                    employee:  empMap['nischay.poudel@codezenith.com']?._id,
                    leaveType: annualLeave._id,
                    fromDate:  new Date('2026-03-15'),
                    toDate:    new Date('2026-03-17'),
                    days:      3,
                    reason:    'Personal travel',
                    status:    'pending',
                },
                {
                    employee:  empMap['sanjay.karki@codezenith.com']?._id,
                    leaveType: annualLeave._id,
                    fromDate:  new Date('2026-02-20'),
                    toDate:    new Date('2026-02-22'),
                    days:      3,
                    reason:    'Wedding ceremony',
                    status:    'approved',
                },
                {
                    employee:  empMap['priya.adhikari@codezenith.com']?._id,
                    leaveType: sickLeave._id,
                    fromDate:  new Date('2026-01-28'),
                    toDate:    new Date('2026-01-29'),
                    days:      2,
                    reason:    'Medical appointment',
                    status:    'approved',
                },
                {
                    employee:  empMap['jonathan.poudel@codezenith.com']?._id,
                    leaveType: annualLeave._id,
                    fromDate:  new Date('2026-04-01'),
                    toDate:    new Date('2026-04-02'),
                    days:      2,
                    reason:    'Family function',
                    status:    'pending',
                },
            ].filter(lr => lr.employee); // remove any null employees

            await LeaveRequest.insertMany(leaveRequests);
            console.log(`🏖  Leave requests seeded (${leaveRequests.length} records)`);
        }

        console.log('\n✅ All data seeded successfully!');
        console.log('\n📧 Login Credentials:');
        console.log('  Admin:    admin@codezenith.com   /  Admin@123');
        console.log('  HR:       rizan.shrestha@codezenith.com  /  Hr@123');
        console.log('  Manager:  manager@codezenith.com /  Manager@123');
        console.log('  Employee: krish.dhakal@codezenith.com  /  Employee@123');
        process.exit(0);
    } catch (error) {
        console.error(`❌ Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
