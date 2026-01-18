import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Filter, Download, User, CheckCircle, Clock as ClockIcon, XCircle, AlertCircle } from 'lucide-react';
import { LoadingSpinner, Badge, StatCard, Pagination } from '../../../components/common';
import { attendanceService, AttendanceRecord } from '../../../services/attendanceService';
import { unparse } from 'papaparse';

export const AdminAttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    late: 0,
    absent: 0,
    onLeave: 0,
    total: 1 // Avoid division by zero
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, [dateFilter, statusFilter, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, statsData] = await Promise.all([
        attendanceService.getAll({
          startDate: dateFilter,
          endDate: dateFilter
        }),
        attendanceService.getTodayStats()
      ]);

      let filtered = recordsData;
      if (statusFilter !== 'all') {
        filtered = filtered.filter(r => r.status === statusFilter);
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(r =>
          r.employeeName?.toLowerCase().includes(query) ||
          r.employeeId?.toLowerCase().includes(query)
        );
      }

      setRecords(filtered);
      setStats({
        present: statsData?.present || 0,
        late: statsData?.late || 0,
        absent: statsData?.absent || 0,
        onLeave: statsData?.onLeave || 0,
        total: statsData?.total || 1
      });
    } catch (error) {
      console.error('Failed to load attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvData = records.map(record => ({
      'Employee ID': record.employeeId,
      'Employee Name': record.employeeName,
      'Department': record.department,
      'Date': new Date(record.date).toLocaleDateString(),
      'Check In': record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      'Check Out': record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      'Total Hours': record.totalHours?.toFixed(2) || 'N/A',
      'Status': record.status,
      'Shift': record.shiftName || 'N/A'
    }));

    const csv = unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-${dateFilter}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present': return <Badge variant="success">Present</Badge>;
      case 'late': return <Badge variant="warning">Late</Badge>;
      case 'absent': return <Badge variant="danger">Absent</Badge>;
      case 'on-leave': return <Badge variant="info">On Leave</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPages = Math.ceil(records.length / itemsPerPage);
  const currentRecords = records.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Attendance Management</h1>
          <p className="text-muted mb-0">Monitor and manage employee daily attendance</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleExport}>
            <Download size={18} className="me-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard
            title="Present Today"
            value={stats.present}
            icon={CheckCircle}
            variant="success"
            subtitle={`${((stats.present / stats.total) * 100).toFixed(0)}% of total`}
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Late Arrival"
            value={stats.late}
            icon={ClockIcon}
            variant="warning"
            subtitle={`${stats.late} employees arrived late`}
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Absent"
            value={stats.absent}
            icon={XCircle}
            variant="danger"
            subtitle={`${stats.absent} employees missing`}
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="On Leave"
            value={stats.onLeave}
            icon={AlertCircle}
            variant="info"
            subtitle="Approved leave requests"
          />
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
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <Calendar size={18} className="text-muted" />
                </span>
                <input
                  type="date"
                  className="form-control border-start-0"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-light w-100 d-flex align-items-center justify-content-center"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDateFilter(new Date().toISOString().split('T')[0]);
                }}
              >
                <Filter size={18} className="me-2" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5">
              <LoadingSpinner text="Loading attendance records..." />
            </div>
          ) : records.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">Employee</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th className="text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: '40px', height: '40px' }}
                          >
                            <User size={20} />
                          </div>
                          <div>
                            <div className="fw-semibold">{record.employeeName}</div>
                            <small className="text-muted">{record.employeeId}</small>
                          </div>
                        </div>
                      </td>
                      <td>{record.department}</td>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td className="fw-medium text-success">
                        {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td className="fw-medium text-danger">
                        {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td>{getStatusBadge(record.status)}</td>
                      <td className="px-4 text-end">
                        <Link to={`/admin/attendance/${record.employeeId}`} className="btn btn-sm btn-light">
                          View History
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="opacity-25 mb-3">
                <ClockIcon size={48} />
              </div>
              <h5 className="text-muted">No attendance records found</h5>
              <p className="text-muted small">Try changing the date or filters</p>
            </div>
          )}
        </div>
        {!loading && records.length > itemsPerPage && (
          <div className="card-footer bg-transparent border-0 p-4 pt-0">
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
