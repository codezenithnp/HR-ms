import React, { useState, useEffect } from 'react';
import { Search, Check, X, Calendar, MessageSquare } from 'lucide-react';
import { LoadingSpinner, Badge, Pagination } from '../../../components/common';
import { leaveService, LeaveRequest, LeaveType } from '../../../services/leaveService';

export const AdminLeavesPage: React.FC = () => {
  const [requests, setRequests]       = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes]   = useState<LeaveType[]>([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [typeFilter, setTypeFilter]   = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { loadData(); }, [statusFilter, typeFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [requestsData, typesData] = await Promise.all([
        leaveService.getAll({
          status:    statusFilter === 'all' ? undefined : statusFilter,
          leaveType: typeFilter   === 'all' ? undefined : typeFilter,
        }),
        leaveService.getLeaveTypes(),
      ]);
      setRequests(requestsData);
      setLeaveTypes(typesData);
    } catch (error) {
      console.error('Failed to load leave data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!window.confirm(`${action === 'approve' ? 'Approve' : 'Reject'} this leave request?`)) return;
    try {
      if (action === 'approve') await leaveService.approve(id);
      else                       await leaveService.reject(id);
      loadData();
    } catch {
      alert(`Failed to ${action} leave request`);
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadge = (s: string) => ({
    approved: <Badge variant="success">Approved</Badge>,
    rejected: <Badge variant="danger">Rejected</Badge>,
    pending:  <Badge variant="warning">Pending</Badge>,
  } as any)[s] || <Badge variant="secondary">{s}</Badge>;

  const totalPages     = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Leave Management</h1>
        <p className="page-subtitle">Review and approve employee leave applications</p>
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
              <select className="form-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="col-md col-6">
              <select className="form-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Leave Types</option>
                {leaveTypes.map((t) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-auto">
              <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setStatusFilter('pending'); setTypeFilter('all'); setCurrentPage(1); }}>
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
            <LoadingSpinner text="Loading leave requests…" />
          ) : filteredRequests.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '1.25rem' }}>Employee</th>
                    <th>Leave Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Applied On</th>
                    <th className="text-end" style={{ paddingRight: '1.25rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((req) => (
                    <tr key={req.id}>
                      <td style={{ paddingLeft: '1.25rem' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar avatar-sm avatar-red">
                            {(req.employeeName || 'E').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{req.employeeName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)' }}>{req.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-label)', fontWeight: 600, color: 'var(--af-secondary)' }}>
                          {req.leaveType}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)' }}>
                        {new Date(req.fromDate).toLocaleDateString()} — {new Date(req.toDate).toLocaleDateString()}
                      </td>
                      <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{req.days}</td>
                      <td>{statusBadge(req.status)}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)' }}>
                        {new Date(req.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="text-end" style={{ paddingRight: '1.25rem' }}>
                        <div className="d-flex justify-content-end gap-1">
                          {req.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm d-flex align-items-center gap-1"
                                style={{ background: 'rgba(0,106,72,0.08)', color: 'var(--af-tertiary)', border: 'none', fontSize: '0.8125rem' }}
                                onClick={() => handleAction(req.id, 'approve')}
                              >
                                <Check size={14} /> Approve
                              </button>
                              <button
                                className="btn btn-sm d-flex align-items-center gap-1"
                                style={{ background: 'rgba(189,0,26,0.08)', color: 'var(--af-primary)', border: 'none', fontSize: '0.8125rem' }}
                                onClick={() => handleAction(req.id, 'reject')}
                              >
                                <X size={14} /> Reject
                              </button>
                            </>
                          )}
                          <button className="btn btn-sm" title="View Reason" style={{ background: 'rgba(70,72,212,0.07)', color: 'var(--af-secondary)', border: 'none' }}>
                            <MessageSquare size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Calendar size={48} />
              <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>No Leave Requests</h6>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>No leave requests match the selected filters.</p>
            </div>
          )}
        </div>
        {!loading && filteredRequests.length > itemsPerPage && (
          <div className="card-footer" style={{ padding: '0.875rem 1.25rem' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showingFrom={(currentPage - 1) * itemsPerPage + 1}
              showingTo={Math.min(currentPage * itemsPerPage, filteredRequests.length)}
              totalItems={filteredRequests.length}
            />
          </div>
        )}
      </div>
    </div>
  );
};
