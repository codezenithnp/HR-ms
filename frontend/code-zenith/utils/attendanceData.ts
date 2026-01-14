import { AttendanceRecord, Employee } from '../App';

// Mock employees
export const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'CZ001',
    name: 'John Doe',
    email: 'john.doe@codezenith.com',
    department: 'Engineering',
    role: 'employee',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    employeeId: 'CZ002',
    name: 'Sarah Admin',
    email: 'admin@codezenith.com',
    department: 'HR',
    role: 'admin',
    joinDate: '2022-06-01',
  },
  {
    id: '3',
    employeeId: 'CZ003',
    name: 'Alice Johnson',
    email: 'alice.johnson@codezenith.com',
    department: 'Marketing',
    role: 'employee',
    joinDate: '2023-03-20',
  },
  {
    id: '4',
    employeeId: 'CZ004',
    name: 'Bob Smith',
    email: 'bob.smith@codezenith.com',
    department: 'Engineering',
    role: 'employee',
    joinDate: '2023-02-10',
  },
  {
    id: '5',
    employeeId: 'CZ005',
    name: 'Emma Wilson',
    email: 'emma.wilson@codezenith.com',
    department: 'Design',
    role: 'employee',
    joinDate: '2023-04-05',
  },
];

// Generate mock attendance data
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const employees = mockEmployees;
  const today = new Date();
  
  // Generate last 30 days of attendance
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    employees.forEach((emp) => {
      // Random attendance pattern
      const random = Math.random();
      let status: 'present' | 'absent' | 'half-day' | 'checked-in' = 'present';
      let checkIn: string | null = null;
      let checkOut: string | null = null;
      let workHours: number | null = null;
      
      if (i === 0 && random > 0.3) {
        // Today - some checked in, some haven't
        if (random > 0.5) {
          status = 'checked-in';
          checkIn = `${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`;
          checkOut = null;
          workHours = null;
        }
      } else if (random > 0.15) {
        // Present
        status = 'present';
        const checkInHour = 8 + Math.floor(Math.random() * 2);
        const checkInMin = Math.floor(Math.random() * 60);
        const checkOutHour = 17 + Math.floor(Math.random() * 2);
        const checkOutMin = Math.floor(Math.random() * 60);
        
        checkIn = `${checkInHour}:${String(checkInMin).padStart(2, '0')} AM`;
        checkOut = `${checkOutHour > 12 ? checkOutHour - 12 : checkOutHour}:${String(checkOutMin).padStart(2, '0')} PM`;
        
        workHours = (checkOutHour - checkInHour) + (checkOutMin - checkInMin) / 60;
        
        if (workHours < 6) {
          status = 'half-day';
        }
      } else if (random > 0.1) {
        // Half day
        status = 'half-day';
        checkIn = `${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`;
        checkOut = `${12 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} PM`;
        workHours = 4 + Math.random() * 2;
      } else {
        // Absent
        status = 'absent';
      }
      
      records.push({
        id: `${emp.employeeId}-${dateStr}`,
        employeeId: emp.employeeId,
        employeeName: emp.name,
        date: dateStr,
        checkIn,
        checkOut,
        status,
        workHours,
      });
    });
  }
  
  return records;
};

// Store attendance in memory (in a real app, this would be in a database)
let attendanceData: AttendanceRecord[] = generateMockAttendance();

export const getAttendanceData = (): AttendanceRecord[] => {
  return attendanceData;
};

export const checkIn = (employeeId: string, employeeName: string) => {
  const today = new Date().toISOString().split('T')[0];
  const existingIndex = attendanceData.findIndex(
    (r) => r.employeeId === employeeId && r.date === today
  );
  
  const now = new Date();
  const checkInTime = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
  
  const record: AttendanceRecord = {
    id: `${employeeId}-${today}`,
    employeeId,
    employeeName,
    date: today,
    checkIn: checkInTime,
    checkOut: null,
    status: 'checked-in',
    workHours: null,
  };
  
  if (existingIndex >= 0) {
    attendanceData[existingIndex] = record;
  } else {
    attendanceData.push(record);
  }
};

export const checkOut = (employeeId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const recordIndex = attendanceData.findIndex(
    (r) => r.employeeId === employeeId && r.date === today
  );
  
  if (recordIndex >= 0) {
    const record = attendanceData[recordIndex];
    const now = new Date();
    const checkOutTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
    
    // Calculate work hours (simplified)
    const workHours = 8 + Math.random() * 2; // Mock calculation
    
    attendanceData[recordIndex] = {
      ...record,
      checkOut: checkOutTime,
      workHours,
      status: workHours < 6 ? 'half-day' : 'present',
    };
  }
};

export const getEmployeeStats = (employeeId: string) => {
  const records = attendanceData.filter((r) => r.employeeId === employeeId);
  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const halfDay = records.filter((r) => r.status === 'half-day').length;
  const totalDays = records.length;
  
  return { present, absent, halfDay, totalDays };
};

export const getTodayStats = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceData.filter((r) => r.date === today);
  
  const present = todayRecords.filter(
    (r) => r.status === 'present' || r.status === 'checked-in'
  ).length;
  const absent = todayRecords.filter((r) => r.status === 'absent').length;
  const onTime = todayRecords.filter((r) => {
    if (!r.checkIn) return false;
    const time = r.checkIn.split(':')[0];
    return parseInt(time) <= 9;
  }).length;
  
  return { present, absent, onTime, total: mockEmployees.length };
};

export const getMonthlyStats = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthRecords = attendanceData.filter((r) => {
    const date = new Date(r.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  const totalPresent = monthRecords.filter(
    (r) => r.status === 'present' || r.status === 'checked-in'
  ).length;
  const totalAbsent = monthRecords.filter((r) => r.status === 'absent').length;
  const avgAttendance = monthRecords.length > 0 
    ? ((totalPresent / monthRecords.length) * 100).toFixed(1)
    : 0;
  
  return { totalPresent, totalAbsent, avgAttendance };
};
