import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle, Calendar, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { leaveService } from '../../services';
import { LeaveType } from '../../services/leaveService';
import { LoadingSpinner, FormField } from '../../components/common';

export const EmployeeLeaveRequestPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [error, setError]           = useState<string | null>(null);
  const [formData, setFormData]     = useState({ leaveType: '', fromDate: '', toDate: '', reason: '' });

  useEffect(() => { loadLeaveTypes(); }, []);

  const loadLeaveTypes = async () => {
    try {
      const data = await leaveService.getLeaveTypes();
      setLeaveTypes(data);
      if (data.length > 0) setFormData((prev) => ({ ...prev, leaveType: data[0].name }));
    } catch (error) {
      console.error('Failed to load leave types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDays = () => {
    if (!formData.fromDate || !formData.toDate) return 0;
    const diff = Math.ceil(Math.abs(new Date(formData.toDate).getTime() - new Date(formData.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const days = calculateDays();
    if (days <= 0) { setError('To Date must be on or after From Date'); return; }
    setSubmitting(true);
    try {
      await leaveService.create({
        ...formData,
        employeeId:   user?.id,
        employeeName: user?.name,
        department:   user?.department,
        days,
        status:       'pending',
        appliedDate:  new Date().toISOString().split('T')[0],
      });
      navigate('/employee/leaves');
    } catch (error: any) {
      setError(error.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading leave types…" />;

  const selectedType = leaveTypes.find((t) => t.name === formData.leaveType);
  const days         = calculateDays();

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
          <h1 className="page-title">Request Leave</h1>
          <p className="page-subtitle">Submit a new leave application</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body" style={{ padding: '2rem' }}>
              {error && (
                <div className="d-flex align-items-center gap-2 mb-4" style={{ background: 'rgba(189,0,26,0.08)', color: 'var(--af-primary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">Leave Type</label>
                    <select name="leaveType" className="form-select" value={formData.leaveType} onChange={handleChange} required>
                      {leaveTypes.map((type) => (
                        <option key={type.id} value={type.name}>{type.name}</option>
                      ))}
                    </select>
                    {selectedType && (
                      <div className="d-flex align-items-center gap-1 mt-1" style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)' }}>
                        <Info size={13} />
                        {selectedType.description} (Max {selectedType.daysAllowed} days)
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <FormField label="From Date" name="fromDate" type="date" value={formData.fromDate} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <FormField label="To Date" name="toDate" type="date" value={formData.toDate} onChange={handleChange} required />
                  </div>

                  {formData.fromDate && formData.toDate && days > 0 && (
                    <div className="col-12">
                      <div className="d-flex align-items-center justify-content-between" style={{ background: 'rgba(70,72,212,0.07)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1.125rem' }}>
                        <div className="d-flex align-items-center gap-2" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          <Calendar size={16} color="var(--af-secondary)" /> Total Duration
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--af-secondary)' }}>{days} {days === 1 ? 'Day' : 'Days'}</span>
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <label className="form-label">Reason for Leave <span style={{ color: 'var(--af-primary)' }}>*</span></label>
                    <textarea
                      name="reason"
                      className="form-control"
                      rows={4}
                      placeholder="Briefly describe the reason for your leave request…"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={submitting}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={submitting}>
                      {submitting ? (
                        <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'af-spin 0.75s linear infinite', display: 'inline-block' }} />
                      ) : <Send size={15} />}
                      {submitting ? 'Submitting…' : 'Submit Request'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes af-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
