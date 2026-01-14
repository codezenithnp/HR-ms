import React, { useState, useEffect } from 'react';
import { Download, BarChart3, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { LoadingSpinner, Badge, StatCard, Pagination } from '../../../components/common';
import { leaveService, LeaveRequest } from '../../../services/leaveService';

export const LeaveReportPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    department: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadReport();
  }, [filters]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getAll();
      let filtered = data;

      if (filters.status !== 'all') {
        filtered = filtered.filter(r => r.status === filters.status);
      }
      if (filters.department !== 'all') {
        filtered = filtered.filter(r => r.department === filters.department);
      }
      if (filters.type !== 'all') {
        filtered = filtered.filter(r => r.leaveType === filters.type);
      }

      setRequests(filtered);
    } catch (error) {
      console.error('Failed to load leave report:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const departments = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Design'];
  const leaveTypes = ['Sick Leave', 'Casual Leave', 'Vacation', 'Maternity Leave', 'Paternity Leave'];

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const currentRequests = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: requests.length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    pending: requests.filter(r => r.status === 'pending').length,
    totalDays: requests.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.days, 0)
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Leave Utilization Report</h1>
          <p className="text-muted mb-0">Track employee absence and leave balances across departments</p>
        </div>
        <button className="btn btn-outline-primary d-flex align-items-center" onClick={() => alert('Exporting...')}>
          <Download size={18} className="me-2" />
          Export XLSX
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard
            title="Total Requests"
            value={stats.total.toString()}
            icon={BarChart3}
            variant="primary"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Approved"
            value={stats.approved.toString()}
            icon={CheckCircle2}
            variant="success"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Pending Approval"
            value={stats.pending.toString()}
            icon={Clock}
            variant="warning"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Working Days Lost"
            value={stats.totalDays.toString()}
            icon={XCircle}
            variant="danger"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
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
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">All Leave Types</option>
                {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="all">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-light w-100" onClick={() => loadReport()}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5">
              <LoadingSpinner text="Computing leave data..." />
            </div>
          ) : currentRequests.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">Employee</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th className="px-4 text-end">Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="px-4">
                        <div className="fw-semibold">{req.employeeName}</div>
                        <small className="text-muted">{req.department}</small>
                      </td>
                      <td>{req.leaveType}</td>
                      <td>
                        <small className="d-block">{new Date(req.fromDate).toLocaleDateString()} -</small>
                        <small className="d-block">{new Date(req.toDate).toLocaleDateString()}</small>
                      </td>
                      <td className="fw-bold">{req.days}</td>
                      <td>{statusBadge(req.status)}</td>
                      <td className="px-4 text-end text-muted small">
                        {new Date(req.appliedDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">No records found for selected filters</div>
          )}
        </div>
        {!loading && requests.length > itemsPerPage && (
          <div className="card-footer bg-transparent border-0 p-4 pt-0">
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
