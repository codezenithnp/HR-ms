import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  AlertCircle,
  Calendar,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { leaveService } from '../../services';
import { LeaveType } from '../../services/leaveService';
import { LoadingSpinner, FormField } from '../../components/common';

export const EmployeeLeaveRequestPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const loadLeaveTypes = async () => {
    try {
      const data = await leaveService.getLeaveTypes();
      setLeaveTypes(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, leaveType: data[0].name }));
      }
    } catch (error) {
      console.error('Failed to load leave types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDays = () => {
    if (!formData.fromDate || !formData.toDate) return 0;
    const start = new Date(formData.fromDate);
    const end = new Date(formData.toDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const days = calculateDays();
    if (days <= 0) {
      setError('To Date must be after or same as From Date');
      return;
    }

    setSubmitting(true);
    try {
      await leaveService.create({
        ...formData,
        employeeId: user?.id,
        employeeName: user?.name,
        department: user?.department,
        days,
        status: 'pending',
        appliedDate: new Date().toISOString().split('T')[0],
      });
      navigate('/employee/leaves');
    } catch (error: any) {
      setError(error.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading leave types..." />;
  }

  const selectedType = leaveTypes.find(t => t.name === formData.leaveType);

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-4">
            <button className="btn btn-link p-0 me-3 text-dark" onClick={() => navigate(-1)}>
              <ArrowLeft size={24} />
            </button>
            <h1 className="h3 mb-0">Request New Leave</h1>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4">
                  <AlertCircle size={20} className="me-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label fw-bold small">Leave Type</label>
                    <select
                      name="leaveType"
                      className="form-select form-select-lg"
                      value={formData.leaveType}
                      onChange={handleChange}
                      required
                    >
                      {leaveTypes.map(type => (
                        <option key={type.id} value={type.name}>{type.name}</option>
                      ))}
                    </select>
                    {selectedType && (
                      <div className="mt-2 small text-muted d-flex align-items-center">
                        <Info size={14} className="me-1" />
                        {selectedType.description} (Max {selectedType.daysAllowed} days allowed)
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="From Date"
                      name="fromDate"
                      type="date"
                      value={formData.fromDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="To Date"
                      name="toDate"
                      type="date"
                      value={formData.toDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {formData.fromDate && formData.toDate && (
                    <div className="col-12">
                      <div className="bg-light rounded p-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <Calendar size={20} className="text-primary me-2" />
                          <span className="fw-medium">Total Duration</span>
                        </div>
                        <span className="badge bg-primary fs-6">{calculateDays()} Days</span>
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <label className="form-label fw-bold small">Reason for Leave</label>
                    <textarea
                      name="reason"
                      className="form-control"
                      rows={4}
                      placeholder="Please provide a brief reason for your leave request..."
                      value={formData.reason}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 pt-3">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button
                        type="button"
                        className="btn btn-light btn-lg px-4"
                        onClick={() => navigate(-1)}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg px-5 d-flex align-items-center justify-content-center"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Send size={18} className="me-2" />
                        )}
                        Submit Request
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
