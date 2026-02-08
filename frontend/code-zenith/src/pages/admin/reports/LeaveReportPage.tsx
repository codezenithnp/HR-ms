import React, { useState, useEffect } from 'react';
import { Download, BarChart3, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { LoadingSpinner, Badge, StatCard, Pagination } from '../../../components/common';
import { leaveService, LeaveRequest } from '../../../services/leaveService';
import { unparse } from 'papaparse';

export const LeaveReportPage: React.FC = () => {
  const [loading, setLoading]   = useState(true);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filters, setFilters]   = useState({ status: 'all', type: 'all', department: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { loadReport(); }, [filters]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getAll();
      let filtered = data;
      if (filters.status !== 'all')     filtered = filtered.filter((r) => r.status === filters.status);
      if (filters.department !== 'all') filtered = filtered.filter((r) => r.department === filters.department);
      if (filters.type !== 'all')       filtered = filtered.filter((r) => r.leaveType === filters.type);
      setRequests(filtered);
    } catch (error) {
      console.error('Failed to load leave report:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (s: string) => ({
    approved: <Badge variant="success">Approved</Badge>,
    rejected: <Badge variant="danger">Rejected</Badge>,
    pending:  <Badge variant="warning">Pending</Badge>,
  } as any)[s] || <Badge variant="secondary">{s}</Badge>;

  const handleExport = () => {
    const csvData = requests.map((req) => ({
      'Employee ID':   req.employeeId,
      'Employee Name': req.employeeName,
      'Department':    req.department || 'N/A',
      'Leave Type':    req.leaveType,
      'From Date':     new Date(req.fromDate).toLocaleDateString(),
      'To Date':       new Date(req.toDate).toLocaleDateString(),
      'Days':          req.days,
      'Status':        req.status,
      'Applied On':    new Date(req.appliedDate).toLocaleDateString(),
      'Reason':        req.reason || '',
    }));
    const blob = new Blob([unparse(csvData)], { type: 'text/csv;charset=utf-8;' });
    const url  = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href  = url;
    link.download = `leave-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const departments = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Design', 'Quality Assurance'];
  const leaveTypes  = ['Sick Leave', 'Casual Leave', 'Vacation', 'Maternity Leave', 'Paternity Leave'];
  const totalPages  = Math.ceil(requests.length / itemsPerPage);
  const currentRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total:     requests.length,
    approved:  requests.filter((r) => r.status === 'approved').length,
    pending:   requests.filter((r) => r.status === 'pending').length,
    totalDays: requests.filter((r) => r.status === 'approved').reduce((a, c) => a + c.days, 0),
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">Leave Report</h1>
          <p className="page-subtitle">Track employee absence and leave balances across departments</p>
        </div>
        <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={handleExport}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3"><StatCard title="Total Requests" value={stats.total.toString()} icon={BarChart3} variant="blue" /></div>
        <div className="col-md-3"><StatCard title="Approved" value={stats.approved.toString()} icon={CheckCircle2} variant="green" /></div>
        <div className="col-md-3"><StatCard title="Pending" value={stats.pending.toString()} icon={Clock} variant="amber" /></div>
        <div className="col-md-3"><StatCard title="Days Lost" value={stats.totalDays.toString()} icon={XCircle} variant="red" /></div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="row g-2 align-items-center">
            <div className="col-md col-6">
              <select className="form-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="col-md col-6">
              <select className="form-select" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                <option value="all">All Leave Types</option>
                {leaveTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-md col-6">
              <select className="form-select" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
                <option value="all">All Departments</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-md-auto">
              <button className="btn btn-secondary" onClick={() => setFilters({ status: 'all', type: 'all', department: 'all' })}>Reset</button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <LoadingSpinner text="Computing leave data…" />
          ) : currentRequests.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '1.25rem' }}>Employee</th>
                    <th>Leave Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th className="text-end" style={{ paddingRight: '1.25rem' }}>Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((req) => (
                    <tr key={req.id}>
                      <td style={{ paddingLeft: '1.25rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{req.employeeName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)' }}>{req.department}</div>
                      </td>
                      <td style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-label)', fontWeight: 600, color: 'var(--af-secondary)' }}>{req.leaveType}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)' }}>
                        {new Date(req.fromDate).toLocaleDateString()} — {new Date(req.toDate).toLocaleDateString()}
                      </td>
                      <td style={{ fontWeight: 700, fontSize: '0.875rem' }}>{req.days}</td>
                      <td>{statusBadge(req.status)}</td>
                      <td className="text-end" style={{ paddingRight: '1.25rem', fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)' }}>
                        {new Date(req.appliedDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <BarChart3 size={48} />
              <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>No Records</h6>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>No leave records match the selected filters.</p>
            </div>
          )}
        </div>
        {!loading && requests.length > itemsPerPage && (
          <div className="card-footer" style={{ padding: '0.875rem 1.25rem' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showingFrom={(currentPage - 1) * itemsPerPage + 1}
              showingTo={Math.min(currentPage * itemsPerPage, requests.length)}
              totalItems={requests.length}
            />
          </div>
        )}
      </div>
    </div>
  );
};
