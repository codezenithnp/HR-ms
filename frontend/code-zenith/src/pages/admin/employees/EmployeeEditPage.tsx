import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { FormField, LoadingSpinner } from '../../../components/common';
import { employeeService } from '../../../services/employeeService';

export const EmployeeEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    role: 'employee' as const,
    status: 'active' as const,
    joinDate: '',
    dateOfBirth: '',
    address: '',
  });

  useEffect(() => {
    if (id) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      const data = await employeeService.getEmployeeById(id!);
      setFormData({
        employeeId: data.employeeId,
        fullName: data.fullName || data.name || '',
        email: data.email,
        phone: data.phone,
        department: data.department,
        position: data.position,
        role: data.role as any,
        status: data.status as any,
        joinDate: data.joinDate,
        dateOfBirth: data.dateOfBirth || data.dob || '',
        address: data.address || '',
      });
    } catch (error) {
      console.error('Failed to load employee:', error);
      alert('Failed to load employee data');
      navigate('/admin/employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await employeeService.updateEmployee(id!, formData);
      navigate(`/admin/employees/${id}`);
    } catch (error) {
      console.error('Failed to update employee:', error);
      alert('Failed to update employee');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <LoadingSpinner text="Loading employee data..." />;

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link p-0 me-3 text-dark" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="h3 mb-1">Edit Employee</h1>
          <p className="text-muted mb-0">Update profile for {formData.fullName}</p>
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
                      value={formData.employeeId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Full Name"
                      name="fullName"
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
                      label="Status"
                      type="select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                        { value: 'on-leave', label: 'On Leave' },
                        { value: 'terminated', label: 'Terminated' },
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
                  <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                    {saving ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save size={18} className="me-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => navigate(-1)}
                    disabled={saving}
                  >
                    <X size={18} className="me-2" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
