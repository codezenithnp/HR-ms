import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Search } from 'lucide-react';
import { LoadingSpinner, Badge, Pagination } from '../../../components/common';
import { attendanceService, AttendanceRecord } from '../../../services/attendanceService';
import { employeeService, Employee } from '../../../services/employeeService';

export const AdminEmployeeAttendancePage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [records, setRecords]     = useState<AttendanceRecord[]>([]);
  const [employee, setEmployee]   = useState<Employee | null>(null);
  const [loading, setLoading]     = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { if (employeeId) loadData(); }, [employeeId, startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, employeeData] = await Promise.all([
        attendanceService.getAll({ employeeId, startDate: startDate || undefined, endDate: endDate || undefined }),
        employeeService.getEmployeeById(employeeId!),
      ]);
      setRecords(recordsData);
      setEmployee(employeeData);
    } catch (error) {
      console.error('Failed to load employee attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (s: string) => ({
    present:  <Badge variant="success">Present</Badge>,
    late:     <Badge variant="warning">Late</Badge>,
    absent:   <Badge variant="danger">Absent</Badge>,
    'on-leave': <Badge variant="info">On Leave</Badge>,
  } as any)[s] || <Badge variant="secondary">{s}</Badge>;

  const totalPages    = Math.ceil(records.length / itemsPerPage);
  const currentRecords = records.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const name = employee?.fullName || employee?.name || 'Employee';

  if (loading && !employee) return <LoadingSpinner text="Loading history…" />;

  return (
    <div>
      <div className="d-flex align-items-center mb-4 gap-3">
        <button
          className="btn btn-sm d-flex align-items-center gap-1"
          onClick={() => navigate(-1)}
          style={{ background: 'rgba(17,28,45,0.06)', border: 'none', color: 'var(--af-on-surface-variant)', borderRadius: 'var(--radius-md)' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="page-header mb-0">
          <h1 className="page-title">Attendance History</h1>
          <p className="page-subtitle">Detailed log for {name}</p>
        </div>
      </div>

      {employee && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center gap-4 flex-wrap">
              <div className="avatar avatar-lg avatar-red" style={{ fontSize: '1.5rem' }}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow-1">
                <h5 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{name}</h5>
                <div className="d-flex flex-wrap gap-3" style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)' }}>
                  <span>{employee.employeeId}</span>
                  <span>{employee.email}</span>
                  <Badge variant="info">{employee.department}</Badge>
                </div>
              </div>
              <Link to={`/admin/employees/${employee.id}`} className="btn btn-sm btn-outline-primary">
                View Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label">From Date</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent"><Calendar size={15} style={{ color: 'var(--af-on-surface-variant)' }} /></span>
                <input type="date" className="form-control border-start-0" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">To Date</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent"><Calendar size={15} style={{ color: 'var(--af-on-surface-variant)' }} /></span>
                <input type="date" className="form-control border-start-0" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <button className="btn btn-secondary w-100" onClick={() => { setStartDate(''); setEndDate(''); }}>
                Clear Dates
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <LoadingSpinner text="Loading records…" />
          ) : records.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '1.25rem' }}>Date</th>
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
                      <td style={{ paddingLeft: '1.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
                        {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--af-tertiary)', fontSize: '0.875rem' }}>
                        {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--af-on-surface-variant)', fontSize: '0.875rem' }}>
                        {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>
                        {record.totalHours ? `${record.totalHours.toFixed(1)} hrs` : '—'}
                      </td>
                      <td>{statusBadge(record.status)}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', maxWidth: 200 }}>
                        {record.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Search size={48} />
              <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>No Records</h6>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>No attendance records found for the selected date range.</p>
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
