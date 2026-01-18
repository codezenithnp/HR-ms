import { apiClient } from './apiClient';

export interface AttendanceRecord {
  id: string;
  employee?: any;
  employeeId?: string; // Legacy
  employeeName?: string; // Legacy
  department?: string; // Legacy
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours?: number | null;
  status: 'present' | 'absent' | 'late' | 'on-leave' | 'half-day' | 'holiday' | 'leave';
  notes?: string;
}

export const attendanceService = {
  /**
   * Get all attendance records
   */
  getAll: async (filters: any = {}): Promise<AttendanceRecord[]> => {
    const params = new URLSearchParams();
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const data = await apiClient(`/attendance${queryString ? `?${queryString}` : ''}`);

    return data.map((record: any) => ({
      ...record,
      id: record._id,
      employeeId: record.employee?.employeeId,
      employeeName: record.employee?.fullName,
      department: record.employee?.department,
    }));
  },

  /**
   * Get attendance for current user
   */
  getMyAttendance: async (): Promise<AttendanceRecord[]> => {
    const data = await apiClient('/attendance/me');
    return data.map((record: any) => ({
      ...record,
      id: record._id,
      employeeId: record.employee?.employeeId,
      employeeName: record.employee?.fullName,
      department: record.employee?.department,
    }));
  },

  /**
   * Check in
   */
  checkIn: async (employeeId?: string, notes?: string): Promise<AttendanceRecord> => {
    const data = await apiClient('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ employeeId, notes }),
    });
    return {
      ...data,
      id: data._id,
    };
  },

  /**
   * Check out
   */
  checkOut: async (employeeId?: string, notes?: string): Promise<AttendanceRecord> => {
    const data = await apiClient('/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify({ employeeId, notes }),
    });
    return {
      ...data,
      id: data._id,
    };
  },

  /**
   * Get today's stats
   */
  getTodayStats: async () => {
    return await apiClient('/attendance/today-stats');
  },

  /**
   * Get today's attendance for current user
   */
  getTodayAttendance: async (): Promise<AttendanceRecord | null> => {
    const data = await apiClient('/attendance/today');
    if (!data) return null;
    return {
      ...data,
      id: data._id,
    };
  },

  /**
   * Update attendance record (Admin correction)
   */
  updateAttendance: async (id: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord> => {
    const response = await apiClient(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return {
      ...response,
      id: response._id,
    };
  },
};
