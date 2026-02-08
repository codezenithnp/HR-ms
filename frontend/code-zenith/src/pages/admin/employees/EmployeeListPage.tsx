import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Eye, Trash2, Users } from 'lucide-react';
import { LoadingSpinner, Pagination, Badge } from '../../../components/common';
import { employeeService, Employee } from '../../../services/employeeService';

export const EmployeeListPage: React.FC = () => {
  const [employees, setEmployees]       = useState<Employee[]>([]);
  const [loading, setLoading]           = useState(true);
  const [searchQuery, setSearchQuery]   = useState('');
  const [departmentFilter, setDeptFilter]  = useState('all');
  const [roleFilter, setRoleFilter]     = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage]   = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalItems, setTotalItems]     = useState(0);
  const itemsPerPage = 10;

  useEffect(() => { loadEmployees(); }, [searchQuery, departmentFilter, roleFilter, statusFilter, currentPage]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getEmployees({
        search:     searchQuery   === '' ? undefined : searchQuery,
        department: departmentFilter === 'all' ? undefined : departmentFilter,
        role:       roleFilter    === 'all' ? undefined : roleFilter,
        status:     statusFilter  === 'all' ? undefined : statusFilter,
        page:       currentPage,
        limit:      itemsPerPage,
      });
      setEmployees(response.employees);
      setTotalPages(response.pages);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await employeeService.deleteEmployee(id);
      loadEmployees();
    } catch {
      alert('Failed to delete employee');
    }
  };

  const statusVariant = (s: string): 'success' | 'secondary' | 'warning' | 'danger' =>
    ({ active: 'success', inactive: 'secondary', 'on-leave': 'warning', terminated: 'danger' } as any)[s] || 'secondary';

  const roleVariant = (r: string): 'danger' | 'primary' | 'info' | 'secondary' =>
    ({ admin: 'danger', hr: 'primary', manager: 'info', employee: 'secondary' } as any)[r] || 'secondary';

  const avatarColors = ['red', 'blue', 'green', 'amber', 'purple'];
  const getAvatarColor = (name: string) =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

  const avatarBgMap: Record<string, string> = {
    red:    'rgba(189,0,26,0.1)',
    blue:   'rgba(70,72,212,0.1)',
    green:  'rgba(0,106,72,0.1)',
    amber:  'rgba(180,130,0,0.1)',
    purple: 'rgba(100,0,200,0.08)',
  };
  const avatarColorMap: Record<string, string> = {
    red:    'var(--af-primary)',
    blue:   'var(--af-secondary)',
    green:  'var(--af-tertiary)',
    amber:  '#8a6000',
    purple: '#5a00b0',
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">
            {totalItems} total employee{totalItems !== 1 ? 's' : ''} in your organization
          </p>
        </div>
        <Link to="/admin/employees/new" className="btn btn-primary d-flex align-items-center gap-2">
          <Plus size={16} /> Add Employee
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  <Search size={15} style={{ color: 'var(--af-on-surface-variant)' }} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, ID or email…"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{ borderLeft: 'none' }}
                />
              </div>
            </div>
            <div className="col-md col-6">
              <select className="form-select" value={departmentFilter} onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Quality Assurance">QA</option>
              </select>
            </div>
            <div className="col-md col-6">
              <select className="form-select" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="hr">HR</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="col-md col-6">
              <select className="form-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <LoadingSpinner text="Loading employees…" />
          ) : employees.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '1.25rem' }}>Employee</th>
                    <th>ID</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-end" style={{ paddingRight: '1.25rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const name     = emp.fullName || emp.name || 'Employee';
                    const acColor  = getAvatarColor(name);
                    return (
                      <tr key={emp.id}>
                        <td style={{ paddingLeft: '1.25rem' }}>
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="avatar avatar-md"
                              style={{ background: avatarBgMap[acColor], color: avatarColorMap[acColor], flexShrink: 0 }}
                            >
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--af-on-surface)' }}>{name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--af-on-surface-variant)' }}>{emp.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--af-on-surface-variant)' }}>
                            {emp.employeeId}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>{emp.department}</td>
                        <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>{emp.position}</td>
                        <td><Badge variant={roleVariant(emp.role)}>{emp.role}</Badge></td>
                        <td><Badge variant={statusVariant(emp.status)}>{emp.status}</Badge></td>
                        <td className="text-end" style={{ paddingRight: '1.25rem' }}>
                          <div className="d-flex justify-content-end gap-1">
                            <Link
                              to={`/admin/employees/${emp.id}`}
                              className="btn btn-sm"
                              title="View"
                              style={{ background: 'rgba(70,72,212,0.07)', color: 'var(--af-secondary)', border: 'none' }}
                            >
                              <Eye size={15} />
                            </Link>
                            <Link
                              to={`/admin/employees/${emp.id}/edit`}
                              className="btn btn-sm"
                              title="Edit"
                              style={{ background: 'rgba(0,106,72,0.07)', color: 'var(--af-tertiary)', border: 'none' }}
                            >
                              <Edit size={15} />
                            </Link>
                            <button
                              className="btn btn-sm"
                              title="Delete"
                              onClick={() => handleDelete(emp.id)}
                              style={{ background: 'rgba(189,0,26,0.07)', color: 'var(--af-primary)', border: 'none' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Users size={48} />
              <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>No Employees Found</h6>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        {!loading && employees.length > 0 && (
          <div className="card-footer" style={{ padding: '0.875rem 1.25rem' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showingFrom={(currentPage - 1) * itemsPerPage + 1}
              showingTo={Math.min(currentPage * itemsPerPage, totalItems)}
              totalItems={totalItems}
            />
          </div>
        )}
      </div>
    </div>
  );
};
