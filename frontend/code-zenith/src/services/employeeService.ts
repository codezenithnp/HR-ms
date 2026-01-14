import { apiClient } from './apiClient';

export interface Employee {
  id: string;
  employeeId: string;
  fullName?: string;
  name?: string; // Alias for fullName (legacy)
  email: string;
  phone: string;
  department: string;
  position: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  status: 'active' | 'inactive' | 'on-leave' | 'terminated';
  joinDate: string;
  address: string;
  dob?: string;
  dateOfBirth?: string; // Legacy alias
  shiftId?: string; // Legacy alias
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface EmployeesResponse {
  employees: Employee[];
  page: number;
  pages: number;
  total: number;
}

export const employeeService = {
  /**
   * Get all employees with filtering and pagination
   */
  getEmployees: async (filters: EmployeeFilters = {}): Promise<EmployeesResponse> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.department) params.append('department', filters.department);
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const data = await apiClient(`/employees${queryString ? `?${queryString}` : ''}`);

    // Map backend _id to frontend id and handle name/dob aliases
    const employees = data.employees.map((emp: any) => ({
      ...emp,
      id: emp._id,
      name: emp.fullName, // Legacy support
      dateOfBirth: emp.dob, // Legacy support
    }));

    return {
      ...data,
      employees,
    };
  },

  /**
   * Get employee by ID
   */
  getEmployeeById: async (id: string): Promise<Employee> => {
    const emp = await apiClient(`/employees/${id}`);
    return {
      ...emp,
      id: emp._id,
      name: emp.fullName, // Legacy support
      dateOfBirth: emp.dob, // Legacy support
    };
  },

  /**
   * Create new employee
   */
  createEmployee: async (employeeData: Omit<Employee, 'id'>): Promise<Employee> => {
    // Map frontend fields to backend expected fields
    const payload = {
      ...employeeData,
      fullName: employeeData.fullName || employeeData.name,
      dob: employeeData.dateOfBirth || employeeData.dob, // Ensure dateOfBirth maps to dob
    };

    const emp = await apiClient('/employees', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return {
      ...emp,
      id: emp._id,
    };
  },

  /**
   * Update employee
   */
  updateEmployee: async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    // Map frontend fields to backend expected fields
    const payload = {
      ...employeeData,
      fullName: employeeData.fullName || employeeData.name,
      dob: employeeData.dateOfBirth || employeeData.dob,
    };

    const emp = await apiClient(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return {
      ...emp,
      id: emp._id,
    };
  },

  /**
   * Delete employee
   */
  deleteEmployee: async (id: string): Promise<void> => {
    await apiClient(`/employees/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get departments
   */
  getDepartments: async (): Promise<string[]> => {
    // For now, listing departments from a static list or could be unique from employees
    return ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Operations'];
  },
};
