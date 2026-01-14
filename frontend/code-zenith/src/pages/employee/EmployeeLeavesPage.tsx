import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import { leaveService } from '../../services';
import { LeaveRequest, LeaveType } from '../../services/leaveService';
import { LoadingSpinner, Badge } from '../../components/common';

export const EmployeeLeavesPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [balance, setBalance] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadLeaveData();
    }
  }, [user]);

  const loadLeaveData = async () => {
    setLoading(true);
    try {
      const [leaveData, typeData, balanceData] = await Promise.all([
        leaveService.getAll({ employeeId: user?.id }),
        leaveService.getLeaveTypes(),
        leaveService.getLeaveBalance(user?.employeeId || ''),
      ]);

      setLeaves(leaveData);
      setLeaveTypes(typeData);
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to load leave data:', error);
    } finally {
      setLoading(false);
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
      <div className="row g-4 mb-4">
        {leaveTypes.map((type) => {
          const typeBalance = balance?.balances?.find((b: any) => b.leaveType === type.name);
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
                  <h3 className="mb-0 fw-bold">{typeBalance?.remaining ?? type.daysAllowed} <small className="h6 text-muted fw-normal">days left</small></h3>
                  <div className="mt-3 small">
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${((typeBalance?.used ?? 0) / type.daysAllowed) * 100}%`,
                          backgroundColor: type.color
                        }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mt-1 text-muted">
                      <span>Used: {typeBalance?.used ?? 0}</span>
                      <span>{Math.round(((typeBalance?.used ?? 0) / type.daysAllowed) * 100)}%</span>
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
                <input type="text" className="form-control border-start-0" placeholder="Search requests..." />
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
                    {leaves.length > 0 ? (
                      leaves.map((leave) => (
                        <tr key={leave.id}>
                          <td className="px-4">
                            <div className="fw-medium">{leave.leaveType}</div>
                            <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                              {leave.reason}
                            </small>
                          </td>
                          <td>
                            <div className="small">
                              {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
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
                            {new Date(leave.appliedDate).toLocaleDateString()}
                          </td>
                          <td className="text-end px-4">
                            <button className="btn btn-sm btn-light">
                              <Info size={16} />
                            </button>
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
