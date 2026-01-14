import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Eye, Trash2 } from 'lucide-react';
import { LoadingSpinner, Pagination, Badge } from '../../../components/common';
import { employeeService, Employee } from '../../../services/employeeService';

export const EmployeeListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    loadEmployees();
  }, [searchQuery, departmentFilter, roleFilter, statusFilter, currentPage]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getEmployees({
        search: searchQuery === '' ? undefined : searchQuery,
        department: departmentFilter === 'all' ? undefined : departmentFilter,
        role: roleFilter === 'all' ? undefined : roleFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: currentPage,
        limit: itemsPerPage
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
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        loadEmployees();
      } catch (error) {
        console.error('Failed to delete employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'secondary' | 'warning' | 'danger'> = {
      active: 'success',
      inactive: 'secondary',
      'on-leave': 'warning',
      terminated: 'danger'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'danger' | 'primary' | 'info' | 'secondary'> = {
      admin: 'danger',
      hr: 'primary',
      manager: 'info',
      employee: 'secondary',
    };
    return <Badge variant={variants[role] || 'secondary'}>{role}</Badge>;
  };

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Employees</h1>
          <p className="text-muted mb-0">Manage your organization's employees</p>
        </div>
        <Link to="/admin/employees/new" className="btn btn-primary d-flex align-items-center">
          <Plus size={18} className="me-2" />
          Add Employee
        </Link>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2 text-sm">
              <select
                className="form-select"
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="col-md-2 text-sm">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="hr">HR</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="col-md-3 text-sm">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
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

      {/* Employee Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5">
              <LoadingSpinner text="Loading employees..." />
            </div>
          ) : employees.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">Employee</th>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: '40px', height: '40px' }}
                          >
                            {(employee.fullName || employee.name || 'E').charAt(0)}
                          </div>
                          <div>
                            <div className="fw-semibold">{employee.fullName || employee.name}</div>
                            <small className="text-muted d-block">{employee.email}</small>
                          </div>
                        </div>
                      </td>
                      <td className="fw-medium">{employee.employeeId}</td>
                      <td>{employee.department}</td>
                      <td>{employee.position}</td>
                      <td>{getRoleBadge(employee.role)}</td>
                      <td>{getStatusBadge(employee.status)}</td>
                      <td className="px-4 text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Link
                            to={`/admin/employees/${employee.id}`}
                            className="btn btn-sm btn-light"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={`/admin/employees/${employee.id}/edit`}
                            className="btn btn-sm btn-light"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            className="btn btn-sm btn-light text-danger"
                            onClick={() => handleDelete(employee.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
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
              <Search size={48} className="text-muted mb-3 opacity-25" />
              <h5 className="text-muted">No employees found</h5>
              <p className="text-muted small">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
        {!loading && employees.length > 0 && (
          <div className="card-footer bg-transparent border-0 p-4 pt-0">
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
