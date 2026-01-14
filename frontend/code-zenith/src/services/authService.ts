// Authentication service
// API calls to Express backend

import { User, UserRole } from '../context/AuthContext';
import { apiClient } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export const authService = {
  /**
   * Login user
   */
  login: async (credentials?: LoginCredentials, googleToken?: string, isAdminRequest?: boolean): Promise<{ user: User; token: string }> => {
    let endpoint = '/auth/login';
    let body: any = credentials;

    if (googleToken) {
      endpoint = '/auth/google';
      body = { token: googleToken, isAdminRequest };
    }

    const data: LoginResponse = await apiClient(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const user: User = {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      // Default placeholder fields if not returned by login
      employeeId: '',
      department: '',
    };

    return { user, token: data.token };
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    // Backend doesn't have a specific logout route (JWT is stateless)
    // We just clear localStorage in the context
    return;
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<User> => {
    const data = await apiClient('/auth/me');
    return {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      employeeId: data.employeeId || '',
      department: data.department || '',
    };
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient('/auth/forgotpassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password
   */
  resetPassword: async (password: string, token: string): Promise<void> => {
    await apiClient(`/auth/resetpassword/${token}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
  },

  /**
   * Verify email
   */
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient(`/auth/verifyemail/${token}`, {
      method: 'PUT',
    });
  },

  /**
   * Check if user has specific role
   */
  hasRole: (user: User | null, roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.role);
  },
};
