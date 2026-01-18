import React, { useState, useEffect } from 'react';
import { Download, Search, FileText, PieChart, TrendingUp, Users } from 'lucide-react';
import { LoadingSpinner, Badge, StatCard, Pagination } from '../../../components/common';
import { attendanceService, AttendanceRecord } from '../../../services/attendanceService';
import { unparse } from 'papaparse';

export const AttendanceReportPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
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
      const data = await attendanceService.getAll({
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      let filtered = data;
      if (filters.department !== 'all') {
        filtered = filtered.filter(r => r.department === filters.department);
      }
      setRecords(filtered);
    } catch (error) {
      console.error('Failed to load attendance report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present': return <Badge variant="success">Present</Badge>;
      case 'late': return <Badge variant="warning">Late</Badge>;
      case 'absent': return <Badge variant="danger">Absent</Badge>;
      case 'half-day': return <Badge variant="info">Half Day</Badge>;
      case 'on-leave': return <Badge variant="secondary">On Leave</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
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
    link.download = `attendance-report-${filters.startDate}-to-${filters.endDate}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const departments = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Operations'];

  const totalPages = Math.ceil(records.length / itemsPerPage);
  const currentRecords = records.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Simple stats for the report
  const stats = {
    totalDays: records.length,
    presentRate: records.length ? (records.filter(r => r.status === 'present' || r.status === 'late').length / records.length * 100).toFixed(1) : 0,
    lateTotal: records.filter(r => r.status === 'late').length,
    avgHours: records.length ? (records.reduce((acc, curr) => acc + (curr.totalHours || 0), 0) / records.filter(r => r.totalHours).length || 0).toFixed(1) : 0
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Attendance Analysis</h1>
          <p className="text-muted mb-0">Aggregate performance and attendance trends</p>
        </div>
        <button className="btn btn-outline-primary d-flex align-items-center" onClick={handleExport}>
          <Download size={18} className="me-2" />
          Export CSV
        </button>
      </div>

      {/* Report Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard
            title="Avg. Attendance"
            value={`${stats.presentRate}%`}
            icon={PieChart}
            variant="success"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Total Late Cases"
            value={stats.lateTotal.toString()}
            icon={TrendingUp}
            variant="warning"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Avg. Work Hours"
            value={stats.avgHours.toString()}
            icon={FileText}
            variant="primary"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Data Points"
            value={stats.totalDays.toString()}
            icon={Users}
            variant="info"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-bold">From Date</label>
              <input
                type="date"
                className="form-control"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">To Date</label>
              <input
                type="date"
                className="form-control"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">Department</label>
              <select
                className="form-select"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="all">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-light w-100" onClick={() => loadReport()}>
                <Search size={18} className="me-2" />
                Reload Data
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
              <LoadingSpinner text="Generating report..." />
            </div>
          ) : currentRecords.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">Employee</th>
                    <th>Date</th>
                    <th>In / Out</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th className="px-4">Dept</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 fw-semibold">{record.employeeName}</td>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>
                        <small className="text-muted d-block">In: {record.checkIn || '-'}</small>
                        <small className="text-muted d-block">Out: {record.checkOut || '-'}</small>
                      </td>
                      <td>{record.totalHours ? `${record.totalHours.toFixed(1)} hrs` : '-'}</td>
                      <td>{getStatusBadge(record.status)}</td>
                      <td className="px-4">{record.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">No data available for this range</div>
          )}
        </div>
        {!loading && records.length > itemsPerPage && (
          <div className="card-footer bg-transparent border-0 p-4">
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
