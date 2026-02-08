import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Download, CheckCircle, Clock as ClockIcon, XCircle, AlertCircle } from 'lucide-react';
import { LoadingSpinner, Badge, StatCard, Pagination } from '../../../components/common';
import { attendanceService, AttendanceRecord } from '../../../services/attendanceService';
import { unparse } from 'papaparse';

export const AdminAttendancePage: React.FC = () => {
  const [records, setRecords]         = useState<AttendanceRecord[]>([]);
  const [loading, setLoading]         = useState(true);
  const [stats, setStats]             = useState({ present: 0, late: 0, absent: 0, onLeave: 0, total: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter]   = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { loadData(); }, [dateFilter, statusFilter, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, statsData] = await Promise.all([
        attendanceService.getAll({ startDate: dateFilter, endDate: dateFilter }),
        attendanceService.getTodayStats(),
      ]);

      let filtered = recordsData;
      if (statusFilter !== 'all') filtered = filtered.filter(r => r.status === statusFilter);
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(r => r.employeeName?.toLowerCase().includes(q) || r.employeeId?.toLowerCase().includes(q));
      }

      setRecords(filtered);
      setStats({
        present: statsData?.present || 0,
        late:    statsData?.late    || 0,
        absent:  statsData?.absent  || 0,
        onLeave: statsData?.onLeave || 0,
        total:   statsData?.total   || 1,
      });
    } catch (error) {
      console.error('Failed to load attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvData = records.map(r => ({
      'Employee ID':    r.employeeId,
      'Employee Name':  r.employeeName,
      'Department':     r.department,
      'Date':           new Date(r.date).toLocaleDateString(),
      'Check In':       r.checkIn  ? new Date(r.checkIn).toLocaleTimeString([],  { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      'Check Out':      r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      'Total Hours':    r.totalHours?.toFixed(2) || 'N/A',
      'Status':         r.status,
    }));
    const blob = new Blob([unparse(csvData)], { type: 'text/csv;charset=utf-8;' });
    const url  = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href  = url;
    link.download = `attendance-${dateFilter}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const statusBadge = (s: string) => ({
    present:  <Badge variant="success">Present</Badge>,
    late:     <Badge variant="warning">Late</Badge>,
    absent:   <Badge variant="danger">Absent</Badge>,
    'on-leave': <Badge variant="info">On Leave</Badge>,
  } as any)[s] || <Badge variant="secondary">{s}</Badge>;

  const totalPages    = Math.ceil(records.length / itemsPerPage);
  const currentRecords = records.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Monitor daily employee attendance</p>
        </div>
        <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={handleExport}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard title="Present Today" value={stats.present} icon={CheckCircle} variant="green"
            subtitle={`${((stats.present / stats.total) * 100).toFixed(0)}% of total`} />
        </div>
        <div className="col-md-3">
          <StatCard title="Late Arrivals" value={stats.late} icon={ClockIcon} variant="amber" />
        </div>
        <div className="col-md-3">
          <StatCard title="Absent" value={stats.absent} icon={XCircle} variant="red" />
        </div>
        <div className="col-md-3">
          <StatCard title="On Leave" value={stats.onLeave} icon={AlertCircle} variant="blue" />
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-transparent"><Search size={15} style={{ color: 'var(--af-on-surface-variant)' }} /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search employee…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <div className="col-md col-6">
              <div className="input-group">
                <span className="input-group-text bg-transparent"><Calendar size={15} style={{ color: 'var(--af-on-surface-variant)' }} /></span>
                <input type="date" className="form-control border-start-0" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </div>
            </div>
            <div className="col-md col-6">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
            <div className="col-md-auto">
              <button className="btn btn-secondary w-100" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setDateFilter(new Date().toISOString().split('T')[0]); }}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <LoadingSpinner text="Loading attendance records…" />
          ) : currentRecords.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '1.25rem' }}>Employee</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th className="text-end" style={{ paddingRight: '1.25rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record) => (
                    <tr key={record.id}>
                      <td style={{ paddingLeft: '1.25rem' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar avatar-sm avatar-red">
                            {(record.employeeName || 'E').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{record.employeeName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)' }}>{record.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>{record.department}</td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>{new Date(record.date).toLocaleDateString()}</td>
                      <td style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--af-tertiary)' }}>
                        {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--af-on-surface-variant)' }}>
                        {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td>{statusBadge(record.status)}</td>
                      <td className="text-end" style={{ paddingRight: '1.25rem' }}>
                        <Link
                          to={`/admin/attendance/${record.employeeId}`}
                          className="btn btn-sm"
                          style={{ background: 'rgba(70,72,212,0.07)', color: 'var(--af-secondary)', border: 'none', fontSize: '0.8125rem' }}
                        >
                          History
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <ClockIcon size={48} />
              <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>No Records</h6>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>No attendance records found for the selected date/filters.</p>
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
