import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Globe, Building2, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { LoadingSpinner, Badge } from '../../../components/common';
import { settingsService, Department, Holiday } from '../../../services/settingsService';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading]     = useState(true);
  const [depts, setDepts]         = useState<Department[]>([]);
  const [holidays, setHolidays]   = useState<Holiday[]>([]);
  const [workingDays, setWorkingDays] = useState<Record<string, boolean>>({});
  const [newDept, setNewDept]     = useState({ name: '' });
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'public' as const });

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [deptsData, holidaysData, workingDaysData] = await Promise.all([
        settingsService.getDepartments(),
        settingsService.getHolidays(),
        settingsService.getWorkingDays(),
      ]);
      setDepts(deptsData);
      setHolidays(holidaysData);
      setWorkingDays(workingDaysData.value || {});
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = async (day: string) => {
    const updated = { ...workingDays, [day]: !workingDays[day] };
    setWorkingDays(updated);
    try { await settingsService.updateWorkingDays(updated); } catch { /* silent */ }
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name) return;
    try {
      await settingsService.createDepartment(newDept);
      setNewDept({ name: '' });
      loadSettings();
    } catch { alert('Failed to add department'); }
  };

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoliday.name || !newHoliday.date) return;
    try {
      await settingsService.createHoliday(newHoliday);
      setNewHoliday({ name: '', date: '', type: 'public' });
      loadSettings();
    } catch { alert('Failed to add holiday'); }
  };

  const handleDeleteHoliday = async (id: string) => {
    if (window.confirm('Delete this holiday?')) { await settingsService.deleteHoliday(id); loadSettings(); }
  };

  const handleDeleteDept = async (id: string) => {
    if (window.confirm('Delete this department?')) { await settingsService.deleteDepartment(id); loadSettings(); }
  };

  if (loading) return <LoadingSpinner text="Loading system configurations…" />;

  const navItems = [
    { key: 'general',     icon: Building2,   label: 'Organization' },
    { key: 'departments', icon: Globe,        label: 'Departments' },
    { key: 'holidays',    icon: Calendar,     label: 'Holiday Calendar' },
    { key: 'working',     icon: Clock,        label: 'Working Days' },
    { key: 'security',    icon: ShieldCheck,  label: 'Security & Access' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
        <p className="page-subtitle">Configure organization preferences and infrastructure</p>
      </div>

      <div className="row g-4">
        {/* Nav sidebar */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-body p-2">
              <nav className="d-flex flex-column gap-1">
                {navItems.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className="btn d-flex align-items-center gap-2 text-start"
                    style={{
                      padding: '0.625rem 0.875rem',
                      fontWeight: activeTab === key ? 700 : 500,
                      fontSize: '0.875rem',
                      background: activeTab === key ? 'rgba(189,0,26,0.07)' : 'transparent',
                      color: activeTab === key ? 'var(--af-primary)' : 'var(--af-on-surface-variant)',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col-md-9">
          <div className="card">
            <div className="card-body" style={{ padding: '1.5rem' }}>

              {activeTab === 'general' && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Organizational Profile</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Organization Name</label>
                      <input type="text" className="form-control" defaultValue="CodeZenith Technologies" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Primary Domain</label>
                      <input type="text" className="form-control" defaultValue="codezenith.com" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Headquarters Address</label>
                      <textarea className="form-control" rows={3} defaultValue="Hattisar, New Baneshwor, Kathmandu, Nepal" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Timezone</label>
                      <select className="form-select">
                        <option>NPT (Nepal Standard Time, UTC+5:45)</option>
                        <option>UTC (Coordinated Universal Time)</option>
                        <option>IST (India Standard Time, UTC+5:30)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4" style={{ paddingTop: '1rem', borderTop: '1px solid var(--af-surface-container)' }}>
                    <button className="btn btn-primary px-4">Save Profile</button>
                  </div>
                </div>
              )}

              {activeTab === 'departments' && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Manage Departments</h5>
                  <form onSubmit={handleAddDept} className="d-flex gap-2 mb-4">
                    <input type="text" className="form-control" placeholder="New department name…" value={newDept.name} onChange={(e) => setNewDept({ name: e.target.value })} />
                    <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 flex-shrink-0">
                      <Plus size={15} /> Add
                    </button>
                  </form>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th style={{ paddingLeft: '1.25rem' }}>Department Name</th>
                          <th>Employees</th>
                          <th className="text-end" style={{ paddingRight: '1.25rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {depts.map((d) => (
                          <tr key={d.id}>
                            <td style={{ paddingLeft: '1.25rem', fontWeight: 600 }}>{d.name}</td>
                            <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>{d.employeeCount} Members</td>
                            <td className="text-end" style={{ paddingRight: '1.25rem' }}>
                              <button className="btn btn-sm" style={{ background: 'rgba(189,0,26,0.08)', color: 'var(--af-primary)', border: 'none' }} onClick={() => handleDeleteDept(d.id)}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'holidays' && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Holiday Calendar 2026</h5>
                  <form onSubmit={handleAddHoliday} className="row g-2 mb-4">
                    <div className="col-md-5">
                      <input type="text" className="form-control" placeholder="Holiday name" value={newHoliday.name} onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <input type="date" className="form-control" value={newHoliday.date} onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                      <select className="form-select" value={newHoliday.type} onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value as any })}>
                        <option value="public">Public</option>
                        <option value="optional">Optional</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <button type="submit" className="btn btn-primary w-100">Add</button>
                    </div>
                  </form>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th style={{ paddingLeft: '1.25rem' }}>Holiday</th>
                          <th>Date</th>
                          <th>Type</th>
                          <th className="text-end" style={{ paddingRight: '1.25rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holidays.map((h) => (
                          <tr key={h.id}>
                            <td style={{ paddingLeft: '1.25rem', fontWeight: 600 }}>{h.name}</td>
                            <td style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)' }}>{new Date(h.date).toLocaleDateString()}</td>
                            <td><Badge variant={h.type === 'public' ? 'danger' : 'success'}>{h.type}</Badge></td>
                            <td className="text-end" style={{ paddingRight: '1.25rem' }}>
                              <button className="btn btn-sm" style={{ background: 'rgba(189,0,26,0.08)', color: 'var(--af-primary)', border: 'none' }} onClick={() => handleDeleteHoliday(h.id)}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'working' && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Standard Working Week</h5>
                  <p style={{ fontSize: '0.875rem', color: 'var(--af-on-surface-variant)', marginBottom: '1.25rem' }}>
                    Select days considered working days for the organization.
                  </p>
                  <div style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--af-surface-container)', overflow: 'hidden' }}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i, arr) => (
                      <div
                        key={day}
                        className="d-flex justify-content-between align-items-center"
                        style={{ padding: '0.875rem 1.25rem', borderBottom: i < arr.length - 1 ? '1px solid var(--af-surface-container)' : 'none' }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{day}</span>
                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={workingDays[day.toLowerCase()] || false}
                            onChange={() => handleDayToggle(day.toLowerCase())}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="empty-state">
                  <ShieldCheck size={48} />
                  <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>Access Control</h6>
                  <p style={{ fontSize: '0.875rem', margin: '0 0 1rem' }}>Configure IP restrictions, password policies, and MFA settings.</p>
                  <button className="btn btn-outline-primary">Initialize Security Audit</button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
