import { apiClient } from './apiClient';

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  gracePeriod: number;
  workingHours: number;
  description?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'public' | 'optional' | 'company';
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  head?: any;
  headId?: string; // Legacy
  employee?: any;
  employeeCount: number;
}

export const settingsService = {
  // Shifts
  getShifts: async (): Promise<Shift[]> => {
    const data = await apiClient('/settings/shifts');
    return data.map((s: any) => ({ ...s, id: s._id }));
  },

  createShift: async (data: Partial<Shift>): Promise<Shift> => {
    const res = await apiClient('/settings/shifts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { ...res, id: res._id };
  },

  updateShift: async (id: string, data: Partial<Shift>): Promise<Shift> => {
    const res = await apiClient(`/settings/shifts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return { ...res, id: res._id };
  },

  deleteShift: async (id: string): Promise<void> => {
    await apiClient(`/settings/shifts/${id}`, {
      method: 'DELETE',
    });
  },

  // Holidays
  getHolidays: async (): Promise<Holiday[]> => {
    const data = await apiClient('/settings/holidays');
    return data.map((h: any) => ({ ...h, id: h._id }));
  },

  createHoliday: async (data: Partial<Holiday>): Promise<Holiday> => {
    const res = await apiClient('/settings/holidays', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { ...res, id: res._id };
  },

  updateHoliday: async (id: string, data: Partial<Holiday>): Promise<Holiday> => {
    const res = await apiClient(`/settings/holidays/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return { ...res, id: res._id };
  },

  deleteHoliday: async (id: string): Promise<void> => {
    await apiClient(`/settings/holidays/${id}`, {
      method: 'DELETE',
    });
  },

  // Departments
  getDepartments: async (): Promise<Department[]> => {
    const data = await apiClient('/settings/departments');
    return data.map((d: any) => ({
      ...d,
      id: d._id,
      headId: d.head?.employeeId // Legacy support
    }));
  },

  createDepartment: async (data: Partial<Department>): Promise<Department> => {
    const res = await apiClient('/settings/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { ...res, id: res._id };
  },

  updateDepartment: async (id: string, data: Partial<Department>): Promise<Department> => {
    const res = await apiClient(`/settings/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return { ...res, id: res._id };
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await apiClient(`/settings/departments/${id}`, {
      method: 'DELETE',
    });
  },

  // Working Days
  getWorkingDays: async () => {
    return await apiClient('/settings/working-days');
  },

  updateWorkingDays: async (data: Record<string, boolean>) => {
    return await apiClient('/settings/working-days', {
      method: 'PUT',
      body: JSON.stringify({ value: data }),
    });
  },
};
