import React, { useState } from 'react';
import { Save, Info, AlertTriangle, Calendar, Clock, Shield } from 'lucide-react';

export const LeaveSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    defaultAnnualAllowance: 20,
    maxCarryForwardDays: 5,
    probationPeriodMonths: 3,
    enableAutoApproval: false,
    requireReason: true,
    noticePeriodDays: 7
  });

  const handleSave = async () => {
    setLoading(true);
    // Simulate save
    setTimeout(() => {
      setLoading(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Leave Settings</h1>
          <p className="text-muted mb-0">Define organization-wide leave policies and automation rules</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center" onClick={handleSave} disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          ) : (
            <Save size={18} className="me-2" />
          )}
          Save Changes
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">General Policy</h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold small">Default Annual Allowance (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.defaultAnnualAllowance}
                    onChange={(e) => setSettings({ ...settings, defaultAnnualAllowance: parseInt(e.target.value) })}
                  />
                  <div className="form-text">Default days given to new employees per year.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold small">Max Carry Forward (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.maxCarryForwardDays}
                    onChange={(e) => setSettings({ ...settings, maxCarryForwardDays: parseInt(e.target.value) })}
                  />
                  <div className="form-text">Maximum days that can be carried to the next year.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold small">Probation Period (Months)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.probationPeriodMonths}
                    onChange={(e) => setSettings({ ...settings, probationPeriodMonths: parseInt(e.target.value) })}
                  />
                  <div className="form-text">Months before new employees can apply for paid leave.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold small">Notice Period (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.noticePeriodDays}
                    onChange={(e) => setSettings({ ...settings, noticePeriodDays: parseInt(e.target.value) })}
                  />
                  <div className="form-text">Minimum days in advance to apply for planned leave.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Workflow & Automation</h5>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="requireReason"
                    checked={settings.requireReason}
                    onChange={(e) => setSettings({ ...settings, requireReason: e.target.checked })}
                  />
                  <label className="form-check-label fw-bold" htmlFor="requireReason">
                    Require Reason for Leave
                  </label>
                </div>
                <p className="text-muted small ps-4 ms-2">Employees must provide a justification when applying for any leave type.</p>
              </div>

              <div className="mb-1">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoApproval"
                    checked={settings.enableAutoApproval}
                    onChange={(e) => setSettings({ ...settings, enableAutoApproval: e.target.checked })}
                  />
                  <label className="form-check-label fw-bold d-flex align-items-center" htmlFor="autoApproval">
                    Enable Auto-Approval
                    <Badge variant="warning" className="ms-2 py-0">Experimental</Badge>
                  </label>
                </div>
                <p className="text-muted small ps-4 ms-2">Automatically approve leave requests if they match predefined criteria (e.g. Sick Leave &lt; 2 days).</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm bg-primary bg-opacity-10 mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white p-2 rounded me-3">
                  <Info size={20} />
                </div>
                <h6 className="mb-0 fw-bold">Note on Policies</h6>
              </div>
              <p className="small mb-0">
                These settings apply organization-wide. You can override specific allowances for individual employees in their profile settings.
              </p>
            </div>
          </div>

          <div className="card border-0 shadow-sm border-start border-4 border-warning">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3 text-warning">
                <AlertTriangle size={20} className="me-2" />
                <h6 className="mb-0 fw-bold">Carry Forward Deadline</h6>
              </div>
              <p className="small text-muted mb-0">
                The annual leave reset occurs on <strong>January 1st</strong>. All carry-forward calculations will be finalized on this date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Badge component inside if needed, or import from common
const Badge = ({ children, variant = 'primary', className = '' }: any) => {
  const variants: any = {
    primary: 'bg-primary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-dark',
    secondary: 'bg-secondary text-white',
    info: 'bg-info text-dark',
    danger: 'bg-danger text-white',
  };
  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
