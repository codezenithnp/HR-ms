import React, { useState, useEffect } from 'react';
import { Download, Search, FileText, PieChart, TrendingUp, Users } from 'lucide-react';
import { LoadingSpinner, Badge, StatCard, Pagination } from '../../../components/common';
import { attendanceService, AttendanceRecord } from '../../../services/attendanceService';
import { unparse } from 'papaparse';

export const AttendanceReportPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filters, setFilters] = useState({
    startDate:  new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate:    new Date().toISOString().split('T')[0],
    department: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { loadReport(); }, [filters]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getAll({ startDate: filters.startDate, endDate: filters.endDate });
      let filtered = filters.department !== 'all' ? data.filter((r) => r.department === filters.department) : data;
      setRecords(filtered);
    } catch (error) {
      console.error('Failed to load attendance report:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (s: string) => ({
    present:    <Badge variant="success">Present</Badge>,
    late:       <Badge variant="warning">Late</Badge>,
    absent:     <Badge variant="danger">Absent</Badge>,
    'half-day': <Badge variant="info">Half Day</Badge>,
    'on-leave': <Badge variant="secondary">On Leave</Badge>,
  } as any)[s] || <Badge variant="secondary">{s}</Badge>;

  const handleExport = () => {
    const csvData = records.map((r) => ({
      'Employee ID':   r.employeeId,
      'Employee Name': r.employeeName,
      'Department':    r.department,
      'Date':          new Date(r.date).toLocaleDateString(),
      'Check In':      r.checkIn  ? new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      'Check Out':     r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      'Total Hours':   r.totalHours?.toFixed(2) || 'N/A',
      'Status':        r.status,
    }));
    const blob = new Blob([unparse(csvData)], { type: 'text/csv;charset=utf-8;' });
    const url  = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href  = url;
    link.download = `attendance-report-${filters.startDate}-to-${filters.endDate}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const departments  = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Design', 'Quality Assurance'];
  const totalPages   = Math.ceil(records.length / itemsPerPage);
  const currentRecords = records.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    presentRate: records.length ? ((records.filter((r) => r.status === 'present' || r.status === 'late').length / records.length) * 100).toFixed(1) : '0',
    lateTotal:   records.filter((r) => r.status === 'late').length,
    avgHours:    records.length ? (records.reduce((a, c) => a + (c.totalHours || 0), 0) / (records.filter((r) => r.totalHours).length || 1)).toFixed(1) : '0',
    totalDays:   records.length,
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">Attendance Report</h1>
          <p className="page-subtitle">Aggregate performance and attendance trends</p>
        </div>
        <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={handleExport}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3"><StatCard title="Avg. Attendance" value={`${stats.presentRate}%`} icon={PieChart} variant="green" /></div>
        <div className="col-md-3"><StatCard title="Late Cases" value={stats.lateTotal.toString()} icon={TrendingUp} variant="amber" /></div>
        <div className="col-md-3"><StatCard title="Avg. Work Hours" value={stats.avgHours} icon={FileText} variant="blue" /></div>
        <div className="col-md-3"><StatCard title="Data Points" value={stats.totalDays.toString()} icon={Users} variant="purple" /></div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label">From Date</label>
              <input type="date" className="form-control" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">To Date</label>
              <input type="date" className="form-control" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Department</label>
              <select className="form-select" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
                <option value="all">All Departments</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => loadReport()}>
                <Search size={15} /> Reload
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <LoadingSpinner text="Generating report…" />
          ) : currentRecords.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '1.25rem' }}>Employee</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th style={{ paddingRight: '1.25rem' }}>Dept</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record) => (
                    <tr key={record.id}>
                      <td style={{ paddingLeft: '1.25rem', fontWeight: 600, fontSize: '0.875rem' }}>{record.employeeName}</td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>{new Date(record.date).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600, color: 'var(--af-tertiary)', fontSize: '0.875rem' }}>
                        {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--af-on-surface-variant)', fontSize: '0.875rem' }}>
                        {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td style={{ fontSize: '0.875rem' }}>{record.totalHours ? `${record.totalHours.toFixed(1)} hrs` : '—'}</td>
                      <td>{statusBadge(record.status)}</td>
                      <td style={{ paddingRight: '1.25rem', fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>{record.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FileText size={48} />
              <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>No Data</h6>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>No attendance data available for the selected range.</p>
            </div>
          )}
        </div>
        {!loading && records.length > itemsPerPage && (
          <div className="card-footer" style={{ padding: '0.875rem 1.25rem' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showingFrom={(currentPage - 1) * itemsPerPage + 1}
              showingTo={Math.min(currentPage * itemsPerPage, records.length)}
              totalItems={records.length}
            />
          </div>
        )}
      </div>
    </div>
  );
};
