import React, { useState } from 'react';
import { Save, Info, AlertTriangle } from 'lucide-react';
import { Badge } from '../../../components/common';

export const LeaveSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    defaultAnnualAllowance: 20,
    maxCarryForwardDays: 5,
    probationPeriodMonths: 3,
    enableAutoApproval: false,
    requireReason: true,
    noticePeriodDays: 7,
  });

  const handleSave = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">Leave Settings</h1>
          <p className="page-subtitle">Define organization-wide leave policies and automation rules</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSave} disabled={loading}>
          {loading ? (
            <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'af-spin 0.75s linear infinite', display: 'inline-block' }} />
          ) : <Save size={16} />}
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header"><h5 className="mb-0">General Policy</h5></div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Default Annual Allowance (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.defaultAnnualAllowance}
                    onChange={(e) => setSettings({ ...settings, defaultAnnualAllowance: parseInt(e.target.value) })}
                  />
                  <div className="form-text">Default days given to new employees per year.</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Max Carry Forward (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.maxCarryForwardDays}
                    onChange={(e) => setSettings({ ...settings, maxCarryForwardDays: parseInt(e.target.value) })}
                  />
                  <div className="form-text">Maximum days that can be carried to the next year.</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Probation Period (Months)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.probationPeriodMonths}
                    onChange={(e) => setSettings({ ...settings, probationPeriodMonths: parseInt(e.target.value) })}
                  />
                  <div className="form-text">Months before new employees can apply for paid leave.</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Notice Period (Days)</label>
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

          <div className="card">
            <div className="card-header"><h5 className="mb-0">Workflow &amp; Automation</h5></div>
            <div className="card-body">
              <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--af-surface-container)' }}>
                <div className="form-check form-switch mb-1">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="requireReason"
                    checked={settings.requireReason}
                    onChange={(e) => setSettings({ ...settings, requireReason: e.target.checked })}
                  />
                  <label className="form-check-label" style={{ fontWeight: 600 }} htmlFor="requireReason">
                    Require Reason for Leave
                  </label>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', marginBottom: 0, paddingLeft: '2rem' }}>
                  Employees must provide a justification when applying for any leave type.
                </p>
              </div>

              <div>
                <div className="form-check form-switch mb-1">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoApproval"
                    checked={settings.enableAutoApproval}
                    onChange={(e) => setSettings({ ...settings, enableAutoApproval: e.target.checked })}
                  />
                  <label className="form-check-label d-flex align-items-center gap-2" style={{ fontWeight: 600 }} htmlFor="autoApproval">
                    Enable Auto-Approval
                    <Badge variant="warning">Experimental</Badge>
                  </label>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', marginBottom: 0, paddingLeft: '2rem' }}>
                  Automatically approve leave requests that match predefined criteria (e.g. Sick Leave &lt; 2 days).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card mb-3" style={{ background: 'rgba(70,72,212,0.06)', border: '1px solid rgba(70,72,212,0.15)' }}>
            <div className="card-body" style={{ padding: '1.25rem' }}>
              <div className="d-flex align-items-center gap-3 mb-2">
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--af-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Info size={18} color="white" />
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Note on Policies</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
                These settings apply organization-wide. You can override specific allowances for individual employees in their profile.
              </p>
            </div>
          </div>

          <div className="card" style={{ border: '1px solid rgba(234,179,8,0.3)', borderLeft: '3px solid #eab308' }}>
            <div className="card-body" style={{ padding: '1.25rem' }}>
              <div className="d-flex align-items-center gap-2 mb-2" style={{ color: '#b45309' }}>
                <AlertTriangle size={16} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Carry Forward Deadline</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
                The annual leave reset occurs on <strong>January 1st</strong>. All carry-forward calculations will be finalized on this date.
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes af-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
