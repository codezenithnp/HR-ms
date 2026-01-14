import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Filter, User, Search, MapPin, Mail, Phone } from 'lucide-react';
import { LoadingSpinner, Badge, Pagination } from '../../../components/common';
import { attendanceService, AttendanceRecord } from '../../../services/attendanceService';
import { employeeService, Employee } from '../../../services/employeeService';

export const AdminEmployeeAttendancePage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (employeeId) {
      loadData();
    }
  }, [employeeId, startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, employeeData] = await Promise.all([
        attendanceService.getAll({
          employeeId,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        }),
        employeeService.getEmployeeById(employeeId!)
      ]);

      setRecords(recordsData);
      setEmployee(employeeData);
    } catch (error) {
      console.error('Failed to load employee attendance data:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading && !employee) return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <LoadingSpinner text="Loading history..." />
    </div>
  );

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link p-0 me-3 text-dark" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="h3 mb-1">Attendance History</h1>
          <p className="text-muted mb-0">Detailed attendance log for {employee?.fullName || 'Employee'}</p>
        </div>
      </div>

      {employee && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-auto">
                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}
                >
                  {(employee.fullName || employee.name || 'E').charAt(0)}
                </div>
              </div>
              <div className="col">
                <h4 className="mb-1">{employee.fullName || employee.name}</h4>
                <div className="d-flex flex-wrap gap-3 text-muted small">
                  <span className="d-flex align-items-center">
                    <User size={14} className="me-1" /> {employee.employeeId}
                  </span>
                  <span className="d-flex align-items-center">
                    <Mail size={14} className="me-1" /> {employee.email}
                  </span>
                  <span className="d-flex align-items-center">
                    <Badge variant="primary" className="py-0 px-2 small">{employee.department}</Badge>
                  </span>
                </div>
              </div>
              <div className="col-auto">
                <Link to={`/admin/employees/${employee.id}`} className="btn btn-light btn-sm">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label small fw-bold">From Date</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <Calendar size={16} />
                </span>
                <input
                  type="date"
                  className="form-control border-start-0"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">To Date</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <Calendar size={16} />
                </span>
                <input
                  type="date"
                  className="form-control border-start-0"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-light w-100"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5">
              <LoadingSpinner text="Refreshing records..." />
            </div>
          ) : records.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Work Hours</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4">
                        <div className="fw-medium">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      </td>
                      <td className="text-success fw-medium">
                        {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td className="text-danger fw-medium">
                        {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td>
                        {record.totalHours ? `${record.totalHours.toFixed(1)} hrs` : '-'}
                      </td>
                      <td>{getStatusBadge(record.status)}</td>
                      <td>
                        <small className="text-muted text-wrap d-block" style={{ maxWidth: '200px' }}>
                          {record.notes || '-'}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="opacity-25 mb-3">
                <Search size={48} />
              </div>
              <h5 className="text-muted">No records found</h5>
              <p className="text-muted small">Try adjusting the date range</p>
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
