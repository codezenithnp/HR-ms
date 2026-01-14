import React, { useState, useEffect } from 'react';
import { Search, User, Clock, Check, ChevronRight, Filter } from 'lucide-react';
import { LoadingSpinner, Badge, Pagination } from '../../../components/common';
import { employeeService, Employee } from '../../../services/employeeService';
import { settingsService, Shift } from '../../../services/settingsService';

export const ShiftAssignmentsPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [empData, shiftData] = await Promise.all([
        employeeService.getEmployees({ limit: 100 }), // Get many for local filtering
        settingsService.getShifts()
      ]);
      setEmployees(empData.employees);
      setShifts(shiftData);
    } catch (error) {
      console.error('Failed to load assignment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignShift = async (employeeId: string, shiftId: string) => {
    setUpdatingId(employeeId);
    try {
      await employeeService.updateEmployee(employeeId, { shiftId });
      // Update local state
      setEmployees(prev => prev.map(emp =>
        emp.id === employeeId ? { ...emp, shiftId } : emp
      ));
    } catch (error) {
      console.error('Failed to assign shift:', error);
      alert('Failed to assign shift');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const departments = Array.from(new Set(employees.map(e => e.department)));

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h1 className="h3 mb-1">Shift Assignments</h1>
        <p className="text-muted">Assign and manage work shifts for your employees</p>
      </div>

      <div className="row g-4">
        {/* Filters */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="row g-3 align-items-center">
                <div className="col-md-5">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <Search size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-light w-100 d-flex align-items-center justify-content-center" onClick={() => { setSearchQuery(''); setDeptFilter('all'); }}>
                    <Filter size={18} className="me-2" />
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee List with Shift Assignment */}
        <div className="col-12">
          {loading ? (
            <div className="py-5 text-center">
              <LoadingSpinner text="Loading employees..." />
            </div>
          ) : (
            <div className="row g-3">
              {currentEmployees.map(emp => {
                const currentShift = shifts.find(s => s.id === emp.shiftId);
                return (
                  <div className="col-md-6 col-xl-4" key={emp.id}>
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: '48px', height: '48px' }}
                          >
                            <User size={24} />
                          </div>
                          <div className="overflow-hidden">
                            <h6 className="mb-0 text-truncate fw-bold">{emp.fullName}</h6>
                            <small className="text-muted d-block text-truncate">{emp.position} • {emp.department}</small>
                          </div>
                        </div>

                        <div className="bg-light rounded p-3 mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="small text-muted">Current Shift:</span>
                            {currentShift ? (
                              <Badge variant="primary">{currentShift.name}</Badge>
                            ) : (
                              <Badge variant="secondary">Unassigned</Badge>
                            )}
                          </div>
                          {currentShift && (
                            <div className="small text-muted d-flex align-items-center">
                              <Clock size={12} className="me-1" />
                              {currentShift.startTime} - {currentShift.endTime}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="form-label small fw-bold text-uppercase mb-2">Assign New Shift</label>
                          <div className="d-flex gap-2">
                            <select
                              className="form-select form-select-sm"
                              value={emp.shiftId || ''}
                              onChange={(e) => handleAssignShift(emp.id, e.target.value)}
                              disabled={updatingId === emp.id}
                            >
                              <option value="" disabled>Select a shift...</option>
                              {shifts.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.startTime}-{s.endTime})</option>
                              ))}
                            </select>
                            {updatingId === emp.id && (
                              <div className="spinner-border spinner-border-sm text-primary mt-1" role="status"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="col-12 mt-4">
          {!loading && filteredEmployees.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showingFrom={(currentPage - 1) * itemsPerPage + 1}
              showingTo={Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
              totalItems={filteredEmployees.length}
            />
          )}
        </div>
      </div>
    </div>
  );
};
