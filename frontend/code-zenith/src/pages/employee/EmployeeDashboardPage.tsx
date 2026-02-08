import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, FileText, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService, leaveService, settingsService } from '../../services';
import { AttendanceRecord } from '../../services/attendanceService';
import { LeaveRequest } from '../../services/leaveService';
import { Holiday } from '../../services/settingsService';
import { StatCard, LoadingSpinner, Badge } from '../../components/common';

export const EmployeeDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading]     = useState(true);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves]       = useState<LeaveRequest[]>([]);
  const [holidays, setHolidays]   = useState<Holiday[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<any>(null);

  useEffect(() => { if (user) loadDashboardData(); }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [attendanceData, leaveData, holidayData] = await Promise.all([
        attendanceService.getMyAttendance(),
        leaveService.getAll().catch(() => []),
        settingsService.getHolidays(),
      ]);
      setAttendance(attendanceData.slice(0, 5));
      setLeaves(leaveData.slice(0, 5));
      setHolidays(holidayData.filter((h) => new Date(h.date) >= new Date()).slice(0, 3));
      const types = await leaveService.getLeaveTypes().catch(() => []);
      const totalAllowed = types.reduce((sum, t) => sum + t.daysAllowed, 0);
      const totalUsed = leaveData.filter((l: LeaveRequest) => l.status === 'approved').reduce((sum: number, l: LeaveRequest) => sum + l.days, 0);
      setLeaveBalance({ totalRemaining: totalAllowed - totalUsed, totalAllowed, totalUsed });
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard…" />;

  const todayStatus = attendance.find((a) => new Date(a.date).toDateString() === new Date().toDateString());

  const statusBadge = (s: string) => ({
    present:    <Badge variant="success">Present</Badge>,
    late:       <Badge variant="warning">Late</Badge>,
    absent:     <Badge variant="danger">Absent</Badge>,
    'on-leave': <Badge variant="info">On Leave</Badge>,
  } as any)[s] || <Badge variant="secondary">{s}</Badge>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="page-subtitle">{user?.employeeId} · {user?.department}</p>
        </div>
        <Link to="/employee/attendance/mark" className="btn btn-primary d-flex align-items-center gap-2">
          <Clock size={16} /> Mark Attendance
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Today's Status"
            value={todayStatus ? todayStatus.status.charAt(0).toUpperCase() + todayStatus.status.slice(1) : 'Not Marked'}
            icon={CheckCircle}
            variant={todayStatus ? 'green' : 'amber'}
            subtitle={todayStatus?.checkIn ? `In at ${new Date(todayStatus.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No entry for today'}
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard title="Leave Balance" value={leaveBalance?.totalRemaining ?? 0} icon={Calendar} variant="blue" subtitle="Days remaining" />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard title="Monthly Attendance" value="95%" icon={TrendingUp} variant="green" subtitle="On track this month" />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard title="Pending Leaves" value={leaves.filter((l) => l.status === 'pending').length} icon={AlertCircle} variant="amber" subtitle="Awaiting approval" />
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Attendance */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Attendance</h5>
              <Link to="/employee/attendance" className="btn btn-sm d-flex align-items-center gap-1" style={{ background: 'rgba(70,72,212,0.07)', color: 'var(--af-secondary)', border: 'none', fontSize: '0.8rem' }}>
                View All <ArrowRight size={13} />
              </Link>
            </div>
            <div className="card-body p-0">
              {attendance.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th style={{ paddingLeft: '1.25rem' }}>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Hours</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((record) => (
                        <tr key={record.id}>
                          <td style={{ paddingLeft: '1.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
                            {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--af-tertiary)', fontSize: '0.875rem' }}>
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>
                          <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>
                          <td style={{ fontSize: '0.875rem' }}>
                            {record.checkIn && record.checkOut
                              ? `${((new Date(record.checkOut).getTime() - new Date(record.checkIn).getTime()) / 3600000).toFixed(1)} hrs`
                              : '—'}
                          </td>
                          <td>{statusBadge(record.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '2.5rem' }}>
                  <Clock size={36} style={{ color: 'var(--af-on-surface-variant)' }} />
                  <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0' }}>No attendance records yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="col-lg-4">
          {/* Upcoming Holidays */}
          <div className="card mb-3">
            <div className="card-header"><h5 className="mb-0">Upcoming Holidays</h5></div>
            <div className="card-body" style={{ padding: '0.75rem 1.25rem' }}>
              {holidays.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {holidays.map((holiday) => (
                    <div key={holiday.id} className="d-flex justify-content-between align-items-center" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--af-surface-container)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{holiday.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)' }}>
                          {new Date(holiday.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <Badge variant={holiday.type === 'public' ? 'info' : 'secondary'}>{holiday.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', textAlign: 'center', margin: '1rem 0' }}>No upcoming holidays.</p>
              )}
            </div>
          </div>

          {/* Recent Leaves */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Leaves</h5>
              <Link to="/employee/leaves" className="btn btn-sm d-flex align-items-center gap-1" style={{ background: 'rgba(70,72,212,0.07)', color: 'var(--af-secondary)', border: 'none', fontSize: '0.8rem' }}>
                All <ArrowRight size={13} />
              </Link>
            </div>
            <div className="card-body" style={{ padding: '0.75rem 1.25rem' }}>
              {leaves.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {leaves.map((leave) => (
                    <div key={leave.id} className="d-flex justify-content-between align-items-start" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--af-surface-container)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{leave.leaveType}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)' }}>
                          {new Date(leave.fromDate).toLocaleDateString()} — {new Date(leave.toDate).toLocaleDateString()} · {leave.days}d
                        </div>
                      </div>
                      <Badge variant={leave.status === 'approved' ? 'success' : leave.status === 'pending' ? 'warning' : 'danger'}>{leave.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', textAlign: 'center', margin: '1rem 0' }}>No leave requests yet.</p>
              )}
            </div>
            <div className="card-footer" style={{ padding: '0.75rem 1.25rem' }}>
              <Link to="/employee/leaves/new" className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
                <FileText size={14} /> Request Leave
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
