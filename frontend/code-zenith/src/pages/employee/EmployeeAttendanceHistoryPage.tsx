import React, { useState, useEffect } from 'react';
import { Download, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services';
import { AttendanceRecord } from '../../services/attendanceService';
import { LoadingSpinner, Badge, Pagination, StatCard } from '../../components/common';
import { unparse } from 'papaparse';
import { CheckCircle, Clock, XCircle, BarChart3 } from 'lucide-react';

export const EmployeeAttendanceHistoryPage: React.FC = () => {
  const { user }         = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: '' });
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { if (user) loadAttendance(); }, [user, filters, page]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getMyAttendance();
      let filtered = data;
      if (filters.startDate) filtered = filtered.filter((a) => a.date >= filters.startDate);
      if (filters.endDate)   filtered = filtered.filter((a) => a.date <= filters.endDate);
      if (filters.status)    filtered = filtered.filter((a) => a.status === filters.status);
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
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleExport = () => {
    const csvData = attendance.map((r) => ({
      'Date':        new Date(r.date).toLocaleDateString(),
      'Check In':    r.checkIn  ? new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      'Check Out':   r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      'Total Hours': r.totalHours?.toFixed(2) || 'N/A',
      'Status':      r.status,
    }));
    const blob = new Blob([unparse(csvData)], { type: 'text/csv;charset=utf-8;' });
    const url  = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href  = url;
    link.download = `my-attendance-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    present: attendance.filter((a) => a.status === 'present').length,
    late:    attendance.filter((a) => a.status === 'late').length,
    absent:  attendance.filter((a) => a.status === 'absent').length,
    total:   attendance.length,
  };

  const statusBadge = (s: string) => ({
    present:    <Badge variant="success">Present</Badge>,
    late:       <Badge variant="warning">Late</Badge>,
    absent:     <Badge variant="danger">Absent</Badge>,
    'on-leave': <Badge variant="info">On Leave</Badge>,
    'half-day': <Badge variant="info">Half Day</Badge>,
  } as any)[s] || <Badge variant="secondary">{s}</Badge>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">Attendance History</h1>
          <p className="page-subtitle">Track your daily presence and timing</p>
        </div>
        <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={handleExport}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3"><StatCard title="Present" value={stats.present} icon={CheckCircle} variant="green" /></div>
        <div className="col-6 col-md-3"><StatCard title="Late" value={stats.late} icon={Clock} variant="amber" /></div>
        <div className="col-6 col-md-3"><StatCard title="Absent" value={stats.absent} icon={XCircle} variant="red" /></div>
        <div className="col-6 col-md-3"><StatCard title="Total Days" value={stats.total} icon={BarChart3} variant="blue" /></div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label">From Date</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent"><CalendarIcon size={15} style={{ color: 'var(--af-on-surface-variant)' }} /></span>
                <input type="date" name="startDate" className="form-control border-start-0" value={filters.startDate} onChange={handleFilterChange} />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">To Date</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent"><CalendarIcon size={15} style={{ color: 'var(--af-on-surface-variant)' }} /></span>
                <input type="date" name="endDate" className="form-control border-start-0" value={filters.endDate} onChange={handleFilterChange} />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent"><Filter size={15} style={{ color: 'var(--af-on-surface-variant)' }} /></span>
                <select name="status" className="form-select border-start-0" value={filters.status} onChange={handleFilterChange}>
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

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <LoadingSpinner text="Loading records…" />
          ) : attendance.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '1.25rem' }}>Date</th>
                    <th>Day</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td style={{ paddingLeft: '1.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
                        {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>
                        {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--af-tertiary)', fontSize: '0.875rem' }}>
                        {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--af-on-surface-variant)', fontSize: '0.875rem' }}>
                        {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td style={{ fontSize: '0.875rem' }}>{record.totalHours ? `${record.totalHours.toFixed(1)} hrs` : '—'}</td>
                      <td>{statusBadge(record.status)}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', maxWidth: 160 }}>{record.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Clock size={48} />
              <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>No Records</h6>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>No attendance records for the selected filters.</p>
            </div>
          )}
        </div>
        {!loading && attendance.length > 10 && (
          <div className="card-footer" style={{ padding: '0.875rem 1.25rem' }}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              showingFrom={(page - 1) * 10 + 1}
              showingTo={Math.min(page * 10, attendance.length)}
              totalItems={attendance.length}
            />
          </div>
        )}
      </div>
    </div>
  );
};
