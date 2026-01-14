import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Layouts
import { AuthLayout } from '../components/layouts/AuthLayout';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { EmployeeLayout } from '../components/layouts/EmployeeLayout';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ChangePasswordPage } from '../pages/auth/ChangePasswordPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { AdminRegisterPage } from '../pages/auth/AdminRegisterPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { EmployeeListPage } from '../pages/admin/employees/EmployeeListPage';
import { EmployeeCreatePage } from '../pages/admin/employees/EmployeeCreatePage';
import { EmployeeDetailPage } from '../pages/admin/employees/EmployeeDetailPage';
import { EmployeeEditPage } from '../pages/admin/employees/EmployeeEditPage';
import { AdminAttendancePage } from '../pages/admin/attendance/AdminAttendancePage';
import { AdminEmployeeAttendancePage } from '../pages/admin/attendance/AdminEmployeeAttendancePage';
import { AdminLeavesPage } from '../pages/admin/leaves/AdminLeavesPage';
import { LeaveTypesPage } from '../pages/admin/leaves/LeaveTypesPage';
import { LeaveSettingsPage } from '../pages/admin/leaves/LeaveSettingsPage';
import { ShiftsPage } from '../pages/admin/shifts/ShiftsPage';
import { ShiftAssignmentsPage } from '../pages/admin/shifts/ShiftAssignmentsPage';
import { AttendanceReportPage } from '../pages/admin/reports/AttendanceReportPage';
import { LeaveReportPage } from '../pages/admin/reports/LeaveReportPage';
import { SettingsPage } from '../pages/admin/settings/SettingsPage';

// Employee Pages
import { EmployeeDashboardPage } from '../pages/employee/EmployeeDashboardPage';
import { EmployeeProfilePage } from '../pages/employee/EmployeeProfilePage';
import { EmployeeAttendanceHistoryPage } from '../pages/employee/EmployeeAttendanceHistoryPage';
import { EmployeeMarkAttendancePage } from '../pages/employee/EmployeeMarkAttendancePage';
import { EmployeeLeavesPage } from '../pages/employee/EmployeeLeavesPage';
import { EmployeeLeaveRequestPage } from '../pages/employee/EmployeeLeaveRequestPage';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'employee' ? '/employee/dashboard' : '/admin/dashboard'} replace />
          ) : (
            <LoginPage />
          )
        } />
        <Route path="/admin/register" element={<AdminRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin', 'hr', 'manager']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />

        {/* Employee Management */}
        <Route path="employees" element={<EmployeeListPage />} />
        <Route path="employees/new" element={<EmployeeCreatePage />} />
        <Route path="employees/:id" element={<EmployeeDetailPage />} />
        <Route path="employees/:id/edit" element={<EmployeeEditPage />} />

        {/* Attendance */}
        <Route path="attendance" element={<AdminAttendancePage />} />
        <Route path="attendance/:employeeId" element={<AdminEmployeeAttendancePage />} />

        {/* Leaves */}
        <Route path="leaves" element={<AdminLeavesPage />} />
        <Route path="leaves/types" element={<LeaveTypesPage />} />
        <Route path="leaves/settings" element={<LeaveSettingsPage />} />

        {/* Shifts */}
        <Route path="shifts" element={<ShiftsPage />} />
        <Route path="shifts/assignments" element={<ShiftAssignmentsPage />} />

        {/* Reports */}
        <Route path="reports/attendance" element={<AttendanceReportPage />} />
        <Route path="reports/leaves" element={<LeaveReportPage />} />

        {/* Settings */}
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Employee Routes */}
      <Route path="/employee" element={
        <ProtectedRoute allowedRoles={['employee', 'manager', 'admin', 'hr']}>
          <EmployeeLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboardPage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />
        <Route path="attendance" element={<EmployeeAttendanceHistoryPage />} />
        <Route path="attendance/mark" element={<EmployeeMarkAttendancePage />} />
        <Route path="leaves" element={<EmployeeLeavesPage />} />
        <Route path="leaves/new" element={<EmployeeLeaveRequestPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to={user?.role === 'employee' ? '/employee/dashboard' : '/admin/dashboard'} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/* 404 */}
      <Route path="*" element={
        <div className="container mt-5">
          <div className="text-center">
            <h1 className="display-1">404</h1>
            <p className="lead">Page not found</p>
          </div>
        </div>
      } />
    </Routes>
  );
};
