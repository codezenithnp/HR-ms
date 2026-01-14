import { apiClient } from './apiClient';

export interface LeaveType {
  id: string;
  name: string;
  daysAllowed: number;
  carryForward: boolean;
  description?: string;
  color: string;
}

export interface LeaveRequest {
  id: string;
  employee?: any;
  employeeId?: string; // Legacy
  employeeName?: string; // Legacy
  department?: string; // Legacy
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

export const leaveService = {
  /**
   * Get all leave requests
   */
  getAll: async (filters: any = {}): Promise<LeaveRequest[]> => {
    const params = new URLSearchParams();
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.status) params.append('status', filters.status);
    if (filters.leaveType) params.append('leaveType', filters.leaveType);

    const queryString = params.toString();
    const data = await apiClient(`/leaves${queryString ? `?${queryString}` : ''}`);

    return data.map((record: any) => ({
      ...record,
      id: record._id,
      employeeId: record.employee?.employeeId,
      employeeName: record.employee?.fullName,
      department: record.employee?.department,
    }));
  },

  /**
   * Get leave request by ID
   */
  getById: async (id: string): Promise<LeaveRequest> => {
    const data = await apiClient(`/leaves/${id}`);
    return {
      ...data,
      id: data._id,
    };
  },

  /**
   * Create leave request
   */
  create: async (data: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    const response = await apiClient('/leaves', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      ...response,
      id: response._id,
    };
  },

  /**
   * Update leave request (approve/reject)
   */
  update: async (id: string, data: any): Promise<LeaveRequest> => {
    const response = await apiClient(`/leaves/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return {
      ...response,
      id: response._id,
    };
  },

  /**
   * Approve leave request
   */
  approve: async (id: string): Promise<LeaveRequest> => {
    return await leaveService.update(id, { status: 'approved' });
  },

  /**
   * Reject leave request
   */
  reject: async (id: string): Promise<LeaveRequest> => {
    return await leaveService.update(id, { status: 'rejected' });
  },

  /**
   * Delete leave request
   */
  delete: async (id: string): Promise<void> => {
    await apiClient(`/leaves/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get all leave types
   */
  getLeaveTypes: async (): Promise<LeaveType[]> => {
    const data = await apiClient('/leaves/types');
    return data.map((type: any) => ({
      ...type,
      id: type._id,
    }));
  },

  /**
   * Create leave type
   */
  createLeaveType: async (data: Partial<LeaveType>): Promise<LeaveType> => {
    const response = await apiClient('/leaves/types', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      ...response,
      id: response._id,
    };
  },

  /**
   * Update leave type
   */
  updateLeaveType: async (id: string, data: Partial<LeaveType>): Promise<LeaveType> => {
    const response = await apiClient(`/leaves/types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return {
      ...response,
      id: response._id,
    };
  },

  /**
   * Delete leave type
   */
  deleteLeaveType: async (id: string): Promise<void> => {
    await apiClient(`/leaves/types/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get leave balance for employee
   */
  getLeaveBalance: async (employeeId: string) => {
    return await apiClient(`/leaves/balance/${employeeId}`);
  },
};
