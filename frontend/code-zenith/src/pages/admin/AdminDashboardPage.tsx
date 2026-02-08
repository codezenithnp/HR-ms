import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, Clock, Calendar, Plus, Eye, FileCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatCard, LoadingSpinner, Badge } from '../../components/common';
import { attendanceService, employeeService, leaveService } from '../../services';
import { AttendanceRecord } from '../../services/attendanceService';

export const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState({ totalEmployees: 0, presentToday: 0, onLeaveToday: 0, lateArrivals: 0 });
  const [recentAnomalies, setRecentAnomalies] = useState<AttendanceRecord[]>([]);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    try {
      const [employeesRes, todayStats, todayAttendance, leaves] = await Promise.all([
        employeeService.getEmployees(),
        attendanceService.getTodayStats(),
        attendanceService.getAll({ startDate: new Date().toISOString().split('T')[0] }),
        leaveService.getAll({ status: 'approved' }),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const onLeaveToday = leaves.filter((l) => l.fromDate <= today && l.toDate >= today).length;

      setStats({
        totalEmployees: employeesRes.employees.length,
        presentToday:   (todayStats as any).present || 0,
        onLeaveToday,
        lateArrivals:   (todayStats as any).late || 0,
      });

      setRecentAnomalies(
        todayAttendance.filter((a) => a.status === 'late' || a.status === 'absent').slice(0, 5)
      );
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard…" />;

  const attendancePct = stats.totalEmployees > 0
    ? ((stats.presentToday / stats.totalEmployees) * 100).toFixed(0)
    : '0';

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/admin/employees/new" className="btn btn-primary d-flex align-items-center gap-2">
          <Plus size={16} />
          Add Employee
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-3">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            variant="blue"
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={CheckCircle}
            variant="green"
            subtitle={`${attendancePct}% attendance rate`}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            title="On Leave"
            value={stats.onLeaveToday}
            icon={Calendar}
            variant="purple"
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            title="Late Arrivals"
            value={stats.lateArrivals}
            icon={Clock}
            variant="amber"
          />
        </div>
      </div>

      <div className="row g-3">
        {/* Anomalies Table */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <AlertTriangle size={18} style={{ color: 'var(--af-primary)' }} />
                <h5 className="mb-0">Today's Anomalies</h5>
              </div>
              <Link to="/admin/attendance" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1">
                <Eye size={14} /> View All
              </Link>
            </div>
            <div className="card-body p-0">
              {recentAnomalies.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
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
                            <div
                              style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--af-on-surface)' }}
                            >
                              {record.employeeName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)' }}>
                              {record.employeeId}
                            </div>
                          </td>
                          <td style={{ color: 'var(--af-on-surface-variant)', fontSize: '0.875rem' }}>
                            {record.department}
                          </td>
                          <td>
                            <Badge variant={record.status === 'late' ? 'warning' : 'danger'}>
                              {record.status}
                            </Badge>
                          </td>
                          <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>
                          <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <CheckCircle size={48} style={{ color: 'var(--af-tertiary)' }} />
                  <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>
                    All Clear!
                  </h6>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>No anomalies today — everyone is on time.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          {/* Quick Actions */}
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body" style={{ padding: '1rem' }}>
              <div className="d-grid gap-2">
                {[
                  { to: '/admin/employees/new',          icon: Plus,      label: 'Add New Employee' },
                  { to: '/admin/attendance',             icon: Eye,       label: 'View Attendance' },
                  { to: '/admin/leaves',                 icon: FileCheck, label: 'Manage Leaves' },
                  { to: '/admin/reports/attendance',     icon: TrendingUp, label: 'Generate Report' },
                ].map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="btn btn-outline-primary text-start d-flex align-items-center gap-2"
                    style={{ fontSize: '0.875rem', fontWeight: 500 }}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Attendance Rate */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Today's Overview</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-label)', color: 'var(--af-on-surface-variant)', fontWeight: 600 }}>
                    Attendance Rate
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--af-on-surface)' }}>
                    {attendancePct}%
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(70,72,212,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${attendancePct}%`,
                      background: 'linear-gradient(90deg, var(--af-tertiary), #00b87d)',
                      borderRadius: 999,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                {[
                  { label: 'Present',    value: stats.presentToday,  color: 'var(--af-tertiary)' },
                  { label: 'On Leave',   value: stats.onLeaveToday,  color: 'var(--af-secondary)' },
                  { label: 'Late',       value: stats.lateArrivals,  color: '#b48200' },
                  { label: 'Absent',     value: Math.max(0, stats.totalEmployees - stats.presentToday - stats.onLeaveToday), color: 'var(--af-primary)' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                      <span style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--af-on-surface)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
