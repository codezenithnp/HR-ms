import React, { useState, useEffect } from 'react';
import {
  Filter,
  Download,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services';
import { AttendanceRecord } from '../../services/attendanceService';
import { LoadingSpinner, Badge, Pagination } from '../../components/common';
import { unparse } from 'papaparse';

export const EmployeeAttendanceHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user) {
      loadAttendance();
    }
  }, [user, filters, page]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getMyAttendance();

      // Since getMyAttendance might not support server-side filtering/paging yet (mocked)
      // We apply client-side filtering for now
      let filtered = data;
      if (filters.startDate) {
        filtered = filtered.filter(a => a.date >= filters.startDate);
      }
      if (filters.endDate) {
        filtered = filtered.filter(a => a.date <= filters.endDate);
      }
      if (filters.status) {
        filtered = filtered.filter(a => a.status === filters.status);
      }

      setAttendance(filtered);
      setTotalPages(Math.ceil(filtered.length / 10));
    } catch (error) {
      console.error('Failed to load attendance history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleExport = () => {
    const csvData = attendance.map(record => ({
      'Date': new Date(record.date).toLocaleDateString(),
      'Check In': record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      'Check Out': record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      'Total Hours': record.totalHours?.toFixed(2) || 'N/A',
      'Status': record.status,
      'Shift': record.shiftName || 'N/A'
    }));

    const csv = unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-attendance-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    present: attendance.filter(a => a.status === 'present').length,
    late: attendance.filter(a => a.status === 'late').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    total: attendance.length,
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Attendance History</h1>
          <p className="text-muted mb-0">Track your daily presence and timing</p>
        </div>
        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleExport}>
          <Download size={18} className="me-2" />
          Export CSV
        </button>
      </div>

      {/* Stats Summary */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 bg-success bg-opacity-10 text-success text-center py-3">
            <h3 className="mb-0 fw-bold">{stats.present}</h3>
            <small className="text-uppercase fw-semibold">Present</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 bg-warning bg-opacity-10 text-warning text-center py-3">
            <h3 className="mb-0 fw-bold">{stats.late}</h3>
            <small className="text-uppercase fw-semibold">Late</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 bg-danger bg-opacity-10 text-danger text-center py-3">
            <h3 className="mb-0 fw-bold">{stats.absent}</h3>
            <small className="text-uppercase fw-semibold">Absent</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 bg-primary bg-opacity-10 text-primary text-center py-3">
            <h3 className="mb-0 fw-bold">{stats.total}</h3>
            <small className="text-uppercase fw-semibold">Total Days</small>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-bold">From Date</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <CalendarIcon size={16} className="text-muted" />
                </span>
                <input
                  type="date"
                  name="startDate"
                  className="form-control border-start-0 ps-0"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">To Date</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <CalendarIcon size={16} className="text-muted" />
                </span>
                <input
                  type="date"
                  name="endDate"
                  className="form-control border-start-0 ps-0"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Status</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <Filter size={16} className="text-muted" />
                </span>
                <select
                  name="status"
                  className="form-select border-start-0 ps-0"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                  <option value="half-day">Half Day</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4">Date</th>
                  <th>Day</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : attendance.length > 0 ? (
                  attendance.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 fw-medium">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="text-muted">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'short' })}</td>
                      <td>{record.checkIn || '--:--'}</td>
                      <td>{record.checkOut || '--:--'}</td>
                      <td>{record.totalHours?.toFixed(1) || '--'}</td>
                      <td>
                        <Badge variant={
                          record.status === 'present' ? 'success' :
                            record.status === 'late' ? 'warning' :
                              record.status === 'absent' ? 'danger' : 'info'
                        }>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="small text-muted text-truncate" style={{ maxWidth: '150px' }}>
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">No attendance records found for the selected period</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-transparent border-0 px-4 py-3">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            showingFrom={(page - 1) * 10 + 1}
            showingTo={Math.min(page * 10, attendance.length)}
            totalItems={attendance.length}
          />
        </div>
      </div>
    </div>
  );
};
