import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { FormField, LoadingSpinner } from '../../../components/common';
import { employeeService } from '../../../services/employeeService';

export const EmployeeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    position: '',
    role: 'employee' as const,
    status: 'active' as const,
    joinDate: new Date().toISOString().split('T')[0],
    dateOfBirth: '',
    address: '',
    shiftId: '1',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await employeeService.createEmployee(formData);
      navigate('/admin/employees');
    } catch (error) {
      console.error('Failed to create employee:', error);
      alert('Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link p-0 me-3 text-dark" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="h3 mb-1">Add New Employee</h1>
          <p className="text-muted mb-0">Create a new record in the organization</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-bottom py-3">
                <h5 className="mb-0">Personal Information</h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormField
                      label="Employee ID"
                      name="employeeId"
                      placeholder="e.g. CZ-001"
                      value={formData.employeeId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Full Name"
                      name="fullName"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Email Address"
                      type="email"
                      name="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Date of Birth"
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-bold small">Residential Address *</label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows={3}
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-bottom py-3">
                <h5 className="mb-0">Professional Information</h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormField
                      label="Department"
                      type="select"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      options={[
                        { value: 'Engineering', label: 'Engineering' },
                        { value: 'HR', label: 'HR' },
                        { value: 'Marketing', label: 'Marketing' },
                        { value: 'Design', label: 'Design' },
                        { value: 'Sales', label: 'Sales' },
                        { value: 'Finance', label: 'Finance' },
                      ]}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Current Position"
                      name="position"
                      placeholder="e.g. Senior Developer"
                      value={formData.position}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="User Role"
                      type="select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      options={[
                        { value: 'employee', label: 'Employee' },
                        { value: 'manager', label: 'Manager' },
                        { value: 'hr', label: 'HR' },
                        { value: 'admin', label: 'Admin' },
                      ]}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Joining Date"
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '2rem' }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Actions</h6>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save size={18} className="me-2" />
                        Save Employee
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    <X size={18} className="me-2" />
                    Cancel
                  </button>
                </div>
                <hr className="my-4" />
                <div className="small text-muted">
                  <p className="mb-2"><strong>Notes:</strong></p>
                  <ul className="ps-3 mb-0">
                    <li>An invitation email will be sent to the employee.</li>
                    <li>The employee will be required to set their password on first login.</li>
                    <li>Default status is set to Active.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
