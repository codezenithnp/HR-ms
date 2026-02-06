import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  Info,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { leaveService, employeeService } from '../../services';
import { LeaveRequest, LeaveType, LeaveBalance } from '../../services/leaveService';
import { LoadingSpinner, Badge } from '../../components/common';

export const EmployeeLeavesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [balance, setBalance] = useState<LeaveBalance[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaveData();
  }, []);

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
    } catch (error) {
      console.error('Failed to load leave data:', error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} className="text-success me-1" />;
      case 'rejected': return <XCircle size={16} className="text-danger me-1" />;
      case 'pending': return <Clock size={16} className="text-warning me-1" />;
      default: return null;
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return '--';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '--' : date.toLocaleDateString();
  };

  const filteredLeaves = useMemo(() => {
    if (!search.trim()) return leaves;
    const query = search.toLowerCase();
    return leaves.filter(leave =>
      (leave.leaveType || '').toLowerCase().includes(query) ||
      (leave.reason || '').toLowerCase().includes(query)
    );
  }, [leaves, search]);

  if (loading) {
    return <LoadingSpinner text="Loading leave data..." />;
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">My Leaves</h1>
          <p className="text-muted mb-0">Manage your leave requests and check balances</p>
        </div>
        <Link to="/employee/leaves/new" className="btn btn-primary d-flex align-items-center">
          <Plus size={18} className="me-2" />
          Request Leave
        </Link>
      </div>

      {/* Leave Balance Cards */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <Info size={18} className="me-2" />
          {error}
        </div>
      )}

      <div className="row g-4 mb-4">
        {leaveTypes.map((type) => {
          const typeBalance = balance.find((b: any) => b.leaveType === type.name);
          const total = type.daysAllowed || 0;
          const used = typeBalance?.used ?? 0;
          const remaining = typeBalance?.remaining ?? type.daysAllowed;
          const percentage = total ? Math.round((used / total) * 100) : 0;
          return (
            <div key={type.id} className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm overflow-hidden">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px', backgroundColor: `${type.color}20`, color: type.color }}
                    >
                      <Calendar size={20} />
                    </div>
                    <Badge variant="light" className="text-muted">Annual: {type.daysAllowed}</Badge>
                  </div>
                  <h6 className="text-muted mb-1">{type.name}</h6>
                  <h3 className="mb-0 fw-bold">{remaining} <small className="h6 text-muted fw-normal">days left</small></h3>
                  <div className="mt-3 small">
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: type.color
                        }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mt-1 text-muted">
                      <span>Used: {used}</span>
                      <span>{percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Leave History</h5>
              <div className="input-group" style={{ width: '250px' }}>
                <span className="input-group-text bg-transparent border-end-0">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search requests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4">Leave Type</th>
                      <th>Duration</th>
                      <th>Days</th>
                      <th>Status</th>
                      <th>Applied On</th>
                      <th className="text-end px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.length > 0 ? (
                      filteredLeaves.map((leave) => (
                        <tr key={leave.id}>
                          <td className="px-4">
                            <div className="fw-medium">{leave.leaveType || 'Leave'}</div>
                            <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                              {leave.reason || 'No reason provided'}
                            </small>
                          </td>
                          <td>
                            <div className="small">
                              {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                            </div>
                          </td>
                          <td>{leave.days}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              {getStatusIcon(leave.status)}
                              <Badge variant={
                                leave.status === 'approved' ? 'success' :
                                  leave.status === 'pending' ? 'warning' : 'danger'
                              }>
                                {leave.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="text-muted small">
                            {formatDate(leave.appliedDate)}
                          </td>
                          <td className="text-end px-4">
                            <div className="d-inline-flex gap-2">
                              <button
                                className="btn btn-sm btn-light"
                                title={leave.reason}
                              >
                                <Info size={16} />
                              </button>
                              {leave.status === 'pending' && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleCancel(leave.id)}
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-5 text-muted">
                          You haven't requested any leaves yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
