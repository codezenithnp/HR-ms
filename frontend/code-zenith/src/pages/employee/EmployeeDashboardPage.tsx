import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService, leaveService, settingsService } from '../../services';
import { AttendanceRecord } from '../../services/attendanceService';
import { LeaveRequest } from '../../services/leaveService';
import { Holiday } from '../../services/settingsService';
import { StatCard, LoadingSpinner, Badge } from '../../components/common';

export const EmployeeDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [attendanceData, leaveData, holidayData, balanceData] = await Promise.all([
        attendanceService.getMyAttendance(),
        leaveService.getAll({ employeeId: user?.id }), // Filters work on employeeId
        settingsService.getHolidays(),
        leaveService.getLeaveBalance(user?.employeeId || ''),
      ]);

      setAttendance(attendanceData.slice(0, 5));
      setLeaves(leaveData.slice(0, 5));
      setHolidays(holidayData.filter(h => new Date(h.date) >= new Date()).slice(0, 3));
      setLeaveBalance(balanceData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const todayStatus = attendance.find(a => a.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Welcome back, {user?.name}!</h1>
          <p className="text-muted mb-0">{user?.employeeId} | {user?.department}</p>
        </div>
        <Link to="/employee/attendance/mark" className="btn btn-primary d-flex align-items-center">
          <Clock size={18} className="me-2" />
          Mark Attendance
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Today's Status"
            value={todayStatus ? todayStatus.status.charAt(0).toUpperCase() + todayStatus.status.slice(1) : 'Not Marked'}
            icon={CheckCircle}
            iconBgColor={todayStatus ? 'bg-success bg-opacity-10' : 'bg-warning bg-opacity-10'}
            iconColor={todayStatus ? 'text-success' : 'text-warning'}
            subtitle={todayStatus?.checkIn ? `Checked in at ${todayStatus.checkIn}` : 'No entry for today'}
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Leave Balance"
            value={leaveBalance?.totalRemaining || 0}
            icon={Calendar}
            iconBgColor="bg-primary bg-opacity-10"
            iconColor="text-primary"
            subtitle="Days remaining"
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Attendance (Monthly)"
            value="95%"
            icon={TrendingUp}
            iconBgColor="bg-info bg-opacity-10"
            iconColor="text-info"
            subtitle="On track this month"
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Pending Leaves"
            value={leaves.filter(l => l.status === 'pending').length}
            icon={AlertCircle}
            iconBgColor="bg-danger bg-opacity-10"
            iconColor="text-danger"
            subtitle="Awaiting approval"
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Attendance */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Attendance</h5>
              <Link to="/employee/attendance" className="btn btn-sm btn-link p-0 d-flex align-items-center">
                View All <ArrowRight size={16} className="ms-1" />
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Total Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.length > 0 ? (
                      attendance.map((record) => (
                        <tr key={record.id}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>{record.checkIn || '--:--'}</td>
                          <td>{record.checkOut || '--:--'}</td>
                          <td>{record.totalHours?.toFixed(1) || '--'}</td>
                          <td>
                            <Badge
                              variant={
                                record.status === 'present' ? 'success' :
                                  record.status === 'late' ? 'warning' : 'danger'
                              }
                            >
                              {record.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">No attendance records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel: Holidays and Leaves */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">Upcoming Holidays</h5>
            </div>
            <div className="card-body">
              {holidays.length > 0 ? (
                <div className="list-group list-group-flush">
                  {holidays.map((holiday) => (
                    <div key={holiday.id} className="list-group-item px-0 border-0 mb-2">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <p className="mb-0 fw-semibold">{holiday.name}</p>
                          <small className="text-muted">{new Date(holiday.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</small>
                        </div>
                        <Badge variant={holiday.type === 'public' ? 'info' : 'secondary'}>{holiday.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-3 mb-0">No upcoming holidays</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Leaves</h5>
              <Link to="/employee/leaves" className="btn btn-sm btn-link p-0 d-flex align-items-center">
                My Leaves <ArrowRight size={16} className="ms-1" />
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush text-sm">
                {leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <div key={leave.id} className="list-group-item px-3 py-2 border-0 mb-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-medium">{leave.leaveType}</span>
                        <Badge variant={leave.status === 'approved' ? 'success' : leave.status === 'pending' ? 'warning' : 'danger'}>
                          {leave.status}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between text-muted small">
                        <span>{new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}</span>
                        <span>{leave.days} days</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center py-3 mb-0">No leave requests found</p>
                )}
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 pt-0 pb-3">
              <Link to="/employee/leaves/new" className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center">
                <FileText size={16} className="me-2" />
                Request New Leave
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
