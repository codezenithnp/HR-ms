import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { FormField, LoadingSpinner } from '../../../components/common';
import { employeeService } from '../../../services/employeeService';

export const EmployeeEditPage: React.FC = () => {
  const { id }      = useParams<{ id: string }>();
  const navigate    = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
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

  useEffect(() => { if (id) loadEmployee(); }, [id]);

  const loadEmployee = async () => {
    try {
      const data = await employeeService.getEmployeeById(id!);
      setFormData({
        employeeId:   data.employeeId,
        fullName:     data.fullName || data.name || '',
        email:        data.email,
        phone:        data.phone,
        department:   data.department,
        position:     data.position,
        role:         data.role as any,
        status:       data.status as any,
        joinDate:     data.joinDate,
        dateOfBirth:  data.dateOfBirth || (data as any).dob || '',
        address:      data.address || '',
      });
    } catch {
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
    } catch {
      alert('Failed to update employee');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <LoadingSpinner text="Loading employee data…" />;

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
          <h1 className="page-title">Edit Employee</h1>
          <p className="page-subtitle">Update profile for {formData.fullName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header"><h5 className="mb-0">Personal Information</h5></div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6"><FormField label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} required /></div>
                  <div className="col-md-6"><FormField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required /></div>
                  <div className="col-md-6"><FormField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                  <div className="col-md-6"><FormField label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} required /></div>
                  <div className="col-md-6"><FormField label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} /></div>
                  <div className="col-md-6"><FormField label="Joining Date" type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} required /></div>
                  <div className="col-12">
                    <label className="form-label">Residential Address</label>
                    <textarea name="address" className="form-control" rows={2} value={formData.address} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h5 className="mb-0">Professional Information</h5></div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormField label="Department" type="select" name="department" value={formData.department} onChange={handleChange}
                      options={[
                        { value: 'Engineering',       label: 'Engineering' },
                        { value: 'HR',                label: 'Human Resources' },
                        { value: 'Marketing',         label: 'Marketing' },
                        { value: 'Design',            label: 'Design' },
                        { value: 'Sales',             label: 'Sales' },
                        { value: 'Finance',           label: 'Finance' },
                        { value: 'Quality Assurance', label: 'Quality Assurance' },
                      ]} required />
                  </div>
                  <div className="col-md-6"><FormField label="Position" name="position" value={formData.position} onChange={handleChange} required /></div>
                  <div className="col-md-6">
                    <FormField label="Role" type="select" name="role" value={formData.role} onChange={handleChange}
                      options={[
                        { value: 'employee', label: 'Employee' },
                        { value: 'manager',  label: 'Manager' },
                        { value: 'hr',       label: 'HR' },
                        { value: 'admin',    label: 'Admin' },
                      ]} required />
                  </div>
                  <div className="col-md-6">
                    <FormField label="Status" type="select" name="status" value={formData.status} onChange={handleChange}
                      options={[
                        { value: 'active',     label: 'Active' },
                        { value: 'inactive',   label: 'Inactive' },
                        { value: 'on-leave',   label: 'On Leave' },
                        { value: 'terminated', label: 'Terminated' },
                      ]} required />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card" style={{ position: 'sticky', top: '1.5rem' }}>
              <div className="card-header"><h5 className="mb-0">Actions</h5></div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary d-flex align-items-center justify-content-center gap-2" disabled={saving}>
                    {saving ? (
                      <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'af-spin 0.75s linear infinite', display: 'inline-block' }} />
                    ) : <Save size={16} />}
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={saving}>
                    Cancel
                  </button>
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
