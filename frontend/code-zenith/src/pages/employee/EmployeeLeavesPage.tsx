import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, Info, Clock, CheckCircle, XCircle } from 'lucide-react';
import { leaveService, employeeService } from '../../services';
import { LeaveRequest, LeaveType, LeaveBalance } from '../../services/leaveService';
import { LoadingSpinner, Badge } from '../../components/common';

export const EmployeeLeavesPage: React.FC = () => {
  const [loading, setLoading]       = useState(true);
  const [leaves, setLeaves]         = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [balance, setBalance]       = useState<LeaveBalance[]>([]);
  const [search, setSearch]         = useState('');
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => { loadLeaveData(); }, []);

  const loadLeaveData = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await employeeService.getMyProfile();
      const [leaveData, typeData, balanceData] = await Promise.all([
        leaveService.getMyLeaves(),
        leaveService.getLeaveTypes(),
        leaveService.getLeaveBalance(profile.id),
      ]);
      setLeaves(leaveData);
      setLeaveTypes(typeData);
      setBalance(Array.isArray(balanceData) ? balanceData : (balanceData?.balances || []));
    } catch (err) {
      console.error('Failed to load leave data:', err);
      setError('Failed to load leave data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (leaveId: string) => {
    if (!confirm('Cancel this leave request?')) return;
    try {
      await leaveService.delete(leaveId);
      await loadLeaveData();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel leave request');
    }
  };

  const fmt = (v?: string) => {
    if (!v) return '—';
    const d = new Date(v);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
  };

  const filteredLeaves = useMemo(() => {
    if (!search.trim()) return leaves;
    const q = search.toLowerCase();
    return leaves.filter((l) => (l.leaveType || '').toLowerCase().includes(q) || (l.reason || '').toLowerCase().includes(q));
  }, [leaves, search]);

  if (loading) return <LoadingSpinner text="Loading leave data…" />;

  const statusBadge = (s: string) => ({
    approved: <Badge variant="success">Approved</Badge>,
    rejected: <Badge variant="danger">Rejected</Badge>,
    pending:  <Badge variant="warning">Pending</Badge>,
  } as any)[s] || <Badge variant="secondary">{s}</Badge>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">My Leaves</h1>
          <p className="page-subtitle">Manage your leave requests and check balances</p>
        </div>
        <Link to="/employee/leaves/new" className="btn btn-primary d-flex align-items-center gap-2">
          <Plus size={16} /> Request Leave
        </Link>
      </div>

      {error && (
        <div className="d-flex align-items-center gap-2 mb-4" style={{ background: 'rgba(189,0,26,0.08)', color: 'var(--af-primary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
          <Info size={15} /> {error}
        </div>
      )}

      {/* Leave balance cards */}
      <div className="row g-3 mb-4">
        {leaveTypes.map((type) => {
          const typeBalance = balance.find((b: any) => b.leaveType === type.name);
          const total       = type.daysAllowed || 0;
          const used        = typeBalance?.used ?? 0;
          const remaining   = typeBalance?.remaining ?? type.daysAllowed;
          const pct         = total ? Math.round((used / total) * 100) : 0;
          return (
            <div key={type.id} className="col-md-6 col-lg-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${type.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={18} color={type.color} />
                    </div>
                    <Badge variant="secondary">Allotted: {type.daysAllowed}</Badge>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', marginBottom: '0.25rem', fontFamily: 'var(--font-label)', fontWeight: 600 }}>{type.name}</div>
                  <div style={{ fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {remaining} <span style={{ fontWeight: 400, fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>days left</span>
                  </div>
                  <div style={{ marginTop: '0.875rem' }}>
                    <div className="progress" style={{ height: 5, borderRadius: 10, background: 'var(--af-surface-container)' }}>
                      <div className="progress-bar" style={{ width: `${pct}%`, background: type.color, borderRadius: 10 }} />
                    </div>
                    <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)' }}>
                      <span>Used: {used}</span>
                      <span>{pct}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leave history table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Leave History</h5>
          <div className="input-group" style={{ width: 240 }}>
            <span className="input-group-text bg-transparent"><Search size={14} style={{ color: 'var(--af-on-surface-variant)' }} /></span>
            <input type="text" className="form-control border-start-0" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="card-body p-0">
          {filteredLeaves.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '1.25rem' }}>Leave Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Applied On</th>
                    <th className="text-end" style={{ paddingRight: '1.25rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td style={{ paddingLeft: '1.25rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{leave.leaveType || 'Leave'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {leave.reason || 'No reason provided'}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)' }}>{fmt(leave.fromDate)} — {fmt(leave.toDate)}</td>
                      <td style={{ fontWeight: 700, fontSize: '0.875rem' }}>{leave.days}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          {leave.status === 'approved' && <CheckCircle size={13} color="var(--af-tertiary)" />}
                          {leave.status === 'rejected' && <XCircle size={13} color="var(--af-primary)" />}
                          {leave.status === 'pending'  && <Clock size={13} color="#b45309" />}
                          {statusBadge(leave.status)}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)' }}>{fmt(leave.appliedDate)}</td>
                      <td className="text-end" style={{ paddingRight: '1.25rem' }}>
                        <div className="d-inline-flex gap-1">
                          <button className="btn btn-sm" style={{ background: 'rgba(70,72,212,0.07)', color: 'var(--af-secondary)', border: 'none' }} title={leave.reason}>
                            <Info size={14} />
                          </button>
                          {leave.status === 'pending' && (
                            <button className="btn btn-sm" style={{ background: 'rgba(189,0,26,0.08)', color: 'var(--af-primary)', border: 'none', fontSize: '0.8125rem' }} onClick={() => handleCancel(leave.id)}>
                              Cancel
                            </button>
                          )}
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
              <p style={{ fontSize: '0.875rem', margin: 0 }}>You haven't requested any leaves yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
