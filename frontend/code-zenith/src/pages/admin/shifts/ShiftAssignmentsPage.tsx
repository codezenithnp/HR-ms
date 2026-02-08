import React, { useState, useEffect } from 'react';
import { Search, Clock } from 'lucide-react';
import { LoadingSpinner, Badge, Pagination } from '../../../components/common';
import { employeeService, Employee } from '../../../services/employeeService';
import { settingsService, Shift } from '../../../services/settingsService';

export const ShiftAssignmentsPage: React.FC = () => {
  const [employees, setEmployees]   = useState<Employee[]>([]);
  const [shifts, setShifts]         = useState<Shift[]>([]);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const itemsPerPage = 8;

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [empData, shiftData] = await Promise.all([
        employeeService.getEmployees({ limit: 100 }),
        settingsService.getShifts(),
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
      setEmployees((prev) => prev.map((emp) => emp.id === employeeId ? { ...emp, shiftId } : emp));
    } catch {
      alert('Failed to assign shift');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept   = deptFilter === 'all' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const departments   = Array.from(new Set(employees.map((e) => e.department)));
  const totalPages    = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Shift Assignments</h1>
        <p className="page-subtitle">Assign and manage work shifts for your employees</p>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="row g-2 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-transparent"><Search size={15} style={{ color: 'var(--af-on-surface-variant)' }} /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search employees…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                <option value="all">All Departments</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-secondary w-100" onClick={() => { setSearchQuery(''); setDeptFilter('all'); }}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading employees…" />
      ) : (
        <>
          <div className="row g-3">
            {currentEmployees.map((emp) => {
              const currentShift = shifts.find((s) => s.id === emp.shiftId);
              return (
                <div className="col-md-6 col-xl-4" key={emp.id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="avatar avatar-md avatar-red">{(emp.fullName || 'E').charAt(0).toUpperCase()}</div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)' }}>{emp.position} · {emp.department}</div>
                        </div>
                      </div>

                      <div style={{ background: 'var(--af-surface-container)', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '0.875rem' }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="label-sm">Current Shift</span>
                          {currentShift
                            ? <Badge variant="info">{currentShift.name}</Badge>
                            : <Badge variant="secondary">Unassigned</Badge>}
                        </div>
                        {currentShift && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={11} /> {currentShift.startTime} – {currentShift.endTime}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="label-sm mb-2">Assign Shift</label>
                        <div className="d-flex gap-2 align-items-center">
                          <select
                            className="form-select form-select-sm"
                            value={emp.shiftId || ''}
                            onChange={(e) => handleAssignShift(emp.id, e.target.value)}
                            disabled={updatingId === emp.id}
                          >
                            <option value="" disabled>Select a shift…</option>
                            {shifts.map((s) => (
                              <option key={s.id} value={s.id}>{s.name} ({s.startTime}–{s.endTime})</option>
                            ))}
                          </select>
                          {updatingId === emp.id && (
                            <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--af-secondary)', borderTopColor: 'transparent', animation: 'af-spin 0.75s linear infinite', display: 'inline-block', flexShrink: 0 }} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEmployees.length > itemsPerPage && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showingFrom={(currentPage - 1) * itemsPerPage + 1}
                showingTo={Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
                totalItems={filteredEmployees.length}
              />
            </div>
          )}
        </>
      )}
      <style>{`@keyframes af-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
