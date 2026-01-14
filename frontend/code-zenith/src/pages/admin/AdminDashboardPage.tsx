import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, Clock, Calendar, Plus, Eye, FileCheck } from 'lucide-react';
import { StatCard, LoadingSpinner } from '../../components/common';
import { attendanceService, employeeService, leaveService } from '../../services';
import { AttendanceRecord } from '../../services/attendanceService';

export const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeaveToday: 0,
    lateArrivals: 0,
  });
  const [recentAnomalies, setRecentAnomalies] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [employeesRes, todayStats, todayAttendance, leaves] = await Promise.all([
        employeeService.getEmployees(),
        attendanceService.getTodayStats(),
        attendanceService.getAll({ startDate: new Date().toISOString().split('T')[0] }),
        leaveService.getAll({ status: 'approved' }),
      ]);

      const employees = employeesRes.employees;

      const today = new Date().toISOString().split('T')[0];
      const onLeaveToday = leaves.filter(
        (l) => l.fromDate <= today && l.toDate >= today
      ).length;

      setStats({
        totalEmployees: employees.length,
        presentToday: (todayStats as any).present || 0,
        onLeaveToday,
        lateArrivals: (todayStats as any).late || 0,
      });

      // Get anomalies (late and absent)
      const anomalies = todayAttendance.filter(
        (a) => a.status === 'late' || a.status === 'absent'
      ).slice(0, 5);
      setRecentAnomalies(anomalies);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Dashboard</h1>
          <p className="text-muted mb-0">Welcome to CodeZenith HR Management System</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/employees/new" className="btn btn-primary">
            <Plus size={18} className="me-2" />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            iconBgColor="bg-primary bg-opacity-10"
            iconColor="text-primary"
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={CheckCircle}
            iconBgColor="bg-success bg-opacity-10"
            iconColor="text-success"
            subtitle={`${((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}% attendance`}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            title="On Leave"
            value={stats.onLeaveToday}
            icon={Calendar}
            iconBgColor="bg-info bg-opacity-10"
            iconColor="text-info"
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            title="Late Arrivals"
            value={stats.lateArrivals}
            icon={Clock}
            iconBgColor="bg-warning bg-opacity-10"
            iconColor="text-warning"
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Anomalies */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Anomalies</h5>
              <Link to="/admin/attendance" className="btn btn-sm btn-outline-primary">
                <Eye size={16} className="me-1" />
                View All
              </Link>
            </div>
            <div className="card-body p-0">
              {recentAnomalies.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Check In</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAnomalies.map((record) => (
                        <tr key={record.id}>
                          <td>
                            <div className="fw-semibold">{record.employeeName}</div>
                            <small className="text-muted">{record.employeeId}</small>
                          </td>
                          <td>{record.department}</td>
                          <td>
                            <span
                              className={`badge ${record.status === 'late'
                                ? 'bg-warning'
                                : 'bg-danger'
                                }`}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td>{record.checkIn || '--'}</td>
                          <td>
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <CheckCircle size={48} className="mb-3 opacity-50" />
                  <p>No anomalies today! Everyone is on time.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link
                  to="/admin/employees/new"
                  className="btn btn-outline-primary text-start d-flex align-items-center"
                >
                  <Plus size={18} className="me-2" />
                  Add New Employee
                </Link>
                <Link
                  to="/admin/attendance"
                  className="btn btn-outline-primary text-start d-flex align-items-center"
                >
                  <Eye size={18} className="me-2" />
                  View Attendance
                </Link>
                <Link
                  to="/admin/leaves"
                  className="btn btn-outline-primary text-start d-flex align-items-center"
                >
                  <FileCheck size={18} className="me-2" />
                  Approve Leaves
                </Link>
                <Link
                  to="/admin/reports/attendance"
                  className="btn btn-outline-primary text-start d-flex align-items-center"
                >
                  <Calendar size={18} className="me-2" />
                  Generate Report
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="card mt-3">
            <div className="card-header">
              <h5 className="mb-0">Upcoming Holidays</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">New Year</div>
                      <small className="text-muted">Jan 1, 2025</small>
                    </div>
                    <span className="badge bg-primary">Public</span>
                  </div>
                </div>
                <div className="list-group-item px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">Company Anniversary</div>
                      <small className="text-muted">Mar 15, 2025</small>
                    </div>
                    <span className="badge bg-secondary">Optional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
