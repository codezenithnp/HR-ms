import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { FormField } from '../../../components/common';
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
    salary: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center mb-4 gap-3">
        <button
          className="btn btn-sm d-flex align-items-center gap-1"
          onClick={() => navigate(-1)}
          style={{ background: 'rgba(17,28,45,0.06)', border: 'none', color: 'var(--af-on-surface-variant)', borderRadius: 'var(--radius-md)' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="page-header mb-0">
          <h1 className="page-title">Add New Employee</h1>
          <p className="page-subtitle">Create a new record in the organization</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Main Form */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Personal Information</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormField label="Employee ID" name="employeeId" placeholder="e.g. CZ-011" value={formData.employeeId} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <FormField label="Full Name" name="fullName" placeholder="Enter full name" value={formData.fullName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <FormField label="Email Address" type="email" name="email" placeholder="name@codezenith.com" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <FormField label="Phone Number" type="tel" name="phone" placeholder="+977 98XXXXXXXX" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <FormField label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <FormField label="Joining Date" type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Residential Address <span style={{ color: 'var(--af-primary)' }}>*</span></label>
                    <textarea name="address" className="form-control" rows={2} placeholder="Enter full address" value={formData.address} onChange={handleChange} required />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Professional Information</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormField
                      label="Department"
                      type="select"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      options={[
                        { value: 'Engineering',       label: 'Engineering' },
                        { value: 'HR',                label: 'Human Resources' },
                        { value: 'Marketing',         label: 'Marketing' },
                        { value: 'Design',            label: 'Design' },
                        { value: 'Sales',             label: 'Sales' },
                        { value: 'Finance',           label: 'Finance' },
                        { value: 'Quality Assurance', label: 'Quality Assurance' },
                      ]}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField label="Position / Title" name="position" placeholder="e.g. Full Stack Engineer" value={formData.position} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Role"
                      type="select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      options={[
                        { value: 'employee', label: 'Employee' },
                        { value: 'manager',  label: 'Manager' },
                        { value: 'hr',       label: 'HR' },
                        { value: 'admin',    label: 'Admin' },
                      ]}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Status"
                      type="select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      options={[
                        { value: 'active',     label: 'Active' },
                        { value: 'inactive',   label: 'Inactive' },
                        { value: 'on-leave',   label: 'On Leave' },
                        { value: 'terminated', label: 'Terminated' },
                      ]}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField label="Monthly Salary (NPR)" type="number" name="salary" placeholder="e.g. 50000" value={formData.salary} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card" style={{ position: 'sticky', top: '1.5rem' }}>
              <div className="card-header">
                <h5 className="mb-0">Submit</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2 mb-4">
                  <button type="submit" className="btn btn-primary d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                    {loading ? (
                      <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'af-spin 0.75s linear infinite', display: 'inline-block' }} />
                    ) : <Save size={16} />}
                    {loading ? 'Saving…' : 'Save Employee'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={loading}>
                    Cancel
                  </button>
                </div>
                <div
                  style={{
                    padding: '0.875rem',
                    background: 'rgba(70,72,212,0.05)',
                    border: '1px solid rgba(70,72,212,0.1)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                    color: 'var(--af-on-surface-variant)',
                    lineHeight: 1.6,
                  }}
                >
                  <p className="mb-1" style={{ fontWeight: 600, color: 'var(--af-on-surface)' }}>Notes</p>
                  <ul style={{ paddingLeft: '1.125rem', margin: 0 }}>
                    <li>An invitation email will be sent to the employee.</li>
                    <li>They'll set their password on first login.</li>
                    <li>Default status is Active.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <style>{`@keyframes af-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
