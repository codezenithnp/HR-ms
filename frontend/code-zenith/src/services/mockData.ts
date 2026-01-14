import { Employee } from './employeeService';
import { AttendanceRecord } from './attendanceService';
import { LeaveRequest, LeaveType } from './leaveService';
import { Shift, Holiday, Department } from './settingsService';

// Mock data for the HR system
export const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'CZ001',
    name: 'John Doe',
    email: 'john.doe@codezenith.com',
    phone: '+1234567890',
    department: 'Engineering',
    role: 'employee',
    position: 'Senior Developer',
    joinDate: '2023-01-15',
    status: 'active',
    dateOfBirth: '1990-05-20',
    address: '123 Main St, City, State',
    shiftId: '1',
  },
  {
    id: '2',
    employeeId: 'CZ002',
    name: 'Sarah Admin',
    email: 'admin@codezenith.com',
    phone: '+1234567891',
    department: 'HR',
    role: 'admin',
    position: 'HR Manager',
    joinDate: '2022-06-01',
    status: 'active',
    dateOfBirth: '1988-03-15',
    address: '456 Oak Ave, City, State',
    shiftId: '1',
  },
  {
    id: '3',
    employeeId: 'CZ003',
    name: 'Alice Johnson',
    email: 'alice.johnson@codezenith.com',
    phone: '+1234567892',
    department: 'Marketing',
    role: 'employee',
    position: 'Marketing Specialist',
    joinDate: '2023-03-20',
    status: 'active',
    dateOfBirth: '1992-08-10',
    address: '789 Pine Rd, City, State',
    shiftId: '1',
  },
  {
    id: '4',
    employeeId: 'CZ004',
    name: 'Bob Smith',
    email: 'bob.smith@codezenith.com',
    phone: '+1234567893',
    department: 'Engineering',
    role: 'manager',
    position: 'Engineering Manager',
    joinDate: '2022-02-10',
    status: 'active',
    dateOfBirth: '1985-11-25',
    address: '321 Elm St, City, State',
    shiftId: '1',
  },
  {
    id: '5',
    employeeId: 'CZ005',
    name: 'Emma Wilson',
    email: 'emma.wilson@codezenith.com',
    phone: '+1234567894',
    department: 'Design',
    role: 'employee',
    position: 'UI/UX Designer',
    joinDate: '2023-04-05',
    status: 'active',
    dateOfBirth: '1993-01-30',
    address: '654 Maple Dr, City, State',
    shiftId: '2',
  },
  {
    id: '6',
    employeeId: 'CZ006',
    name: 'Michael Brown',
    email: 'michael.brown@codezenith.com',
    phone: '+1234567895',
    department: 'Sales',
    role: 'employee',
    position: 'Sales Executive',
    joinDate: '2023-05-12',
    status: 'active',
    dateOfBirth: '1991-07-18',
    address: '987 Cedar Ln, City, State',
    shiftId: '1',
  },
  {
    id: '7',
    employeeId: 'CZ007',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@codezenith.com',
    phone: '+1234567896',
    department: 'Finance',
    role: 'employee',
    position: 'Financial Analyst',
    joinDate: '2022-08-20',
    status: 'on-leave',
    dateOfBirth: '1989-04-22',
    address: '147 Birch Ave, City, State',
    shiftId: '1',
  },
  {
    id: '8',
    employeeId: 'CZ008',
    name: 'David Lee',
    email: 'david.lee@codezenith.com',
    phone: '+1234567897',
    department: 'Engineering',
    role: 'employee',
    position: 'Junior Developer',
    joinDate: '2023-06-15',
    status: 'active',
    dateOfBirth: '1995-09-05',
    address: '258 Willow St, City, State',
    shiftId: '1',
  },
];

// Generate mock attendance for last 30 days
const generateAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    mockEmployees.forEach((emp) => {
      const random = Math.random();
      let status: AttendanceRecord['status'] = 'present';
      let checkIn: string | null = null;
      let checkOut: string | null = null;
      let totalHours: number | null = null;

      if (random > 0.9) {
        status = 'absent';
      } else if (random > 0.85) {
        status = 'on-leave';
      } else if (random > 0.8) {
        status = 'half-day';
        checkIn = '09:00';
        checkOut = '13:30';
        totalHours = 4.5;
      } else {
        const checkInHour = 8 + Math.floor(Math.random() * 2);
        const checkInMin = Math.floor(Math.random() * 60);
        const checkOutHour = 17 + Math.floor(Math.random() * 2);
        const checkOutMin = Math.floor(Math.random() * 60);

        checkIn = `${String(checkInHour).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`;
        checkOut = `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMin).padStart(2, '0')}`;
        totalHours = (checkOutHour - checkInHour) + (checkOutMin - checkInMin) / 60;

        if (checkInHour > 9 || (checkInHour === 9 && checkInMin > 15)) {
          status = 'late';
        }
      }

      records.push({
        id: `${emp.id}-${dateStr}`,
        employeeId: emp.employeeId,
        employeeName: emp.name,
        date: dateStr,
        checkIn,
        checkOut,
        totalHours,
        status,
        department: emp.department,
      });
    });
  }

  return records;
};

export const mockAttendance: AttendanceRecord[] = generateAttendance();

// Mock Leave Requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employee: mockEmployees[0],
    employeeId: 'CZ001',
    employeeName: 'John Doe',
    leaveType: 'Sick Leave',
    fromDate: '2025-01-20',
    toDate: '2025-01-22',
    days: 3,
    reason: 'Medical appointment and recovery',
    status: 'approved',
    appliedDate: '2025-01-15',
    approvedBy: 'Sarah Admin',
    approvedDate: '2025-01-16',
    department: 'Engineering',
  },
  {
    id: '2',
    employee: mockEmployees[2],
    employeeId: 'CZ003',
    employeeName: 'Alice Johnson',
    leaveType: 'Vacation',
    fromDate: '2025-02-01',
    toDate: '2025-02-05',
    days: 5,
    reason: 'Family vacation',
    status: 'pending',
    appliedDate: '2025-01-10',
    department: 'Marketing',
  },
  {
    id: '3',
    employee: mockEmployees[6],
    employeeId: 'CZ007',
    employeeName: 'Lisa Anderson',
    leaveType: 'Maternity Leave',
    fromDate: '2025-01-05',
    toDate: '2025-04-05',
    days: 90,
    reason: 'Maternity leave',
    status: 'approved',
    appliedDate: '2024-12-20',
    approvedBy: 'Sarah Admin',
    approvedDate: '2024-12-21',
    department: 'Finance',
  },
  {
    id: '4',
    employee: mockEmployees[4],
    employeeId: 'CZ005',
    employeeName: 'Emma Wilson',
    leaveType: 'Casual Leave',
    fromDate: '2025-01-18',
    toDate: '2025-01-18',
    days: 1,
    reason: 'Personal work',
    status: 'rejected',
    appliedDate: '2025-01-17',
    approvedBy: 'Bob Smith',
    approvedDate: '2025-01-17',
    department: 'Design',
  },
];

// Mock Leave Types
export const mockLeaveTypes: LeaveType[] = [
  {
    id: '1',
    name: 'Sick Leave',
    daysAllowed: 12,
    carryForward: false,
    description: 'For medical emergencies and health issues',
    color: '#ef4444',
  },
  {
    id: '2',
    name: 'Casual Leave',
    daysAllowed: 10,
    carryForward: true,
    description: 'For personal and urgent matters',
    color: '#3b82f6',
  },
  {
    id: '3',
    name: 'Vacation',
    daysAllowed: 15,
    carryForward: true,
    description: 'Annual vacation leave',
    color: '#10b981',
  },
  {
    id: '4',
    name: 'Maternity Leave',
    daysAllowed: 90,
    carryForward: false,
    description: 'Maternity leave for female employees',
    color: '#f59e0b',
  },
  {
    id: '5',
    name: 'Paternity Leave',
    daysAllowed: 15,
    carryForward: false,
    description: 'Paternity leave for male employees',
    color: '#8b5cf6',
  },
];

// Mock Shifts
export const mockShifts: Shift[] = [
  {
    id: '1',
    name: 'General Shift',
    startTime: '09:00',
    endTime: '18:00',
    gracePeriod: 15,
    workingHours: 9,
    description: 'Standard office hours',
  },
  {
    id: '2',
    name: 'Early Shift',
    startTime: '07:00',
    endTime: '16:00',
    gracePeriod: 10,
    workingHours: 9,
    description: 'Early morning shift',
  },
  {
    id: '3',
    name: 'Night Shift',
    startTime: '22:00',
    endTime: '07:00',
    gracePeriod: 15,
    workingHours: 9,
    description: 'Night shift for 24/7 operations',
  },
];

// Mock Holidays
export const mockHolidays: Holiday[] = [
  {
    id: '1',
    name: 'New Year',
    date: '2025-01-01',
    type: 'public',
    description: 'New Year celebration',
  },
  {
    id: '2',
    name: 'Independence Day',
    date: '2025-07-04',
    type: 'public',
    description: 'Independence Day',
  },
  {
    id: '3',
    name: 'Christmas',
    date: '2025-12-25',
    type: 'public',
    description: 'Christmas Day',
  },
  {
    id: '4',
    name: 'Company Foundation Day',
    date: '2025-03-15',
    type: 'optional',
    description: 'Anniversary of company founding',
  },
];

// Mock Departments
export const mockDepartments: Department[] = [
  { id: '1', name: 'Engineering', headId: '4', employeeCount: 3 },
  { id: '2', name: 'HR', headId: '2', employeeCount: 1 },
  { id: '3', name: 'Marketing', headId: undefined, employeeCount: 1 },
  { id: '4', name: 'Design', headId: undefined, employeeCount: 1 },
  { id: '5', name: 'Sales', headId: undefined, employeeCount: 1 },
  { id: '6', name: 'Finance', headId: undefined, employeeCount: 1 },
];
