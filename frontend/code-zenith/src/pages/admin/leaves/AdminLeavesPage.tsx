import React, { useState, useEffect } from 'react';
import { Search, Filter, Check, X, Eye, Calendar, Clock, User, MessageSquare } from 'lucide-react';
import { LoadingSpinner, Badge, Pagination } from '../../../components/common';
import { leaveService, LeaveRequest, LeaveType } from '../../../services/leaveService';

export const AdminLeavesPage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, [statusFilter, typeFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [requestsData, typesData] = await Promise.all([
        leaveService.getAll({
          status: statusFilter === 'all' ? undefined : statusFilter,
          leaveType: typeFilter === 'all' ? undefined : typeFilter
        }),
        leaveService.getLeaveTypes()
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
    if (window.confirm(`Are you sure you want to ${action} this leave request?`)) {
      try {
        if (action === 'approve') {
          await leaveService.approve(id);
        } else {
          await leaveService.reject(id);
        }
        loadData();
      } catch (error) {
        console.error(`Failed to ${action} leave request:`, error);
        alert(`Failed to ${action} leave request`);
      }
    }
  };

  const filteredRequests = requests.filter(req =>
    req.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Leave Management</h1>
          <p className="text-muted mb-0">Review and manage employee leave applications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by employee name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Leave Types</option>
                {leaveTypes.map(type => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-light w-100 d-flex align-items-center justify-content-center"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('pending');
                  setTypeFilter('all');
                }}
              >
                <Filter size={18} className="me-2" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5 text-center">
              <LoadingSpinner text="Loading leave requests..." />
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">Employee</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Applied On</th>
                    <th className="text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: '40px', height: '40px' }}
                          >
                            <User size={20} />
                          </div>
                          <div>
                            <div className="fw-semibold">{request.employeeName}</div>
                            <small className="text-muted">{request.employeeId}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">{request.leaveType}</span>
                      </td>
                      <td>
                        <div className="small">
                          {new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="fw-medium">{request.days}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td className="small text-muted">
                        {new Date(request.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 text-end">
                        <div className="d-flex justify-content-end gap-2">
                          {request.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm btn-success d-flex align-items-center"
                                onClick={() => handleAction(request.id, 'approve')}
                                title="Approve"
                              >
                                <Check size={16} className="me-1" /> Approve
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                onClick={() => handleAction(request.id, 'reject')}
                                title="Reject"
                              >
                                <X size={16} className="me-1" /> Reject
                              </button>
                            </>
                          )}
                          <button className="btn btn-sm btn-light" title="View Reason">
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="opacity-25 mb-3">
                <Calendar size={48} />
              </div>
              <h5 className="text-muted">No leave requests found</h5>
              <p className="text-muted small">Try changing the filters</p>
            </div>
          )}
        </div>
        {!loading && filteredRequests.length > itemsPerPage && (
          <div className="card-footer bg-transparent border-0 p-4 pt-0">
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
