import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Globe, Building2, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { LoadingSpinner, Badge } from '../../../components/common';
import { settingsService, Department, Holiday } from '../../../services/settingsService';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);

  // Data State
  const [depts, setDepts] = useState<Department[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [workingDays, setWorkingDays] = useState<Record<string, boolean>>({});

  // Form State for new items
  const [newDept, setNewDept] = useState({ name: '' });
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'public' as const });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [deptsData, holidaysData, workingDaysData] = await Promise.all([
        settingsService.getDepartments(),
        settingsService.getHolidays(),
        settingsService.getWorkingDays()
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
    try {
      await settingsService.updateWorkingDays(updated);
    } catch (error) {
      console.error('Failed to update working days:', error);
    }
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name) return;
    try {
      await settingsService.createDepartment(newDept);
      setNewDept({ name: '' });
      loadSettings();
    } catch (error) {
      alert('Failed to add department');
    }
  };

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoliday.name || !newHoliday.date) return;
    try {
      await settingsService.createHoliday(newHoliday);
      setNewHoliday({ name: '', date: '', type: 'public' });
      loadSettings();
    } catch (error) {
      alert('Failed to add holiday');
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    if (window.confirm('Delete this holiday?')) {
      await settingsService.deleteHoliday(id);
      loadSettings();
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (window.confirm('Delete this department?')) {
      await settingsService.deleteDepartment(id);
      loadSettings();
    }
  };

  if (loading) return <LoadingSpinner text="Loading system configurations..." />;

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h1 className="h3 mb-1">System Settings</h1>
        <p className="text-muted">Configure organization preferences and infrastructure</p>
      </div>

      <div className="row g-4">
        {/* Navigation Sidebar */}
        <div className="col-md-3">
          <div className="list-group border-0 shadow-sm">
            <button
              className={`list-group-item list-group-item-action py-3 px-4 border-0 d-flex align-items-center ${activeTab === 'general' ? 'active rounded' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <Building2 size={18} className="me-3" />
              Organizational Info
            </button>
            <button
              className={`list-group-item list-group-item-action py-3 px-4 border-0 d-flex align-items-center ${activeTab === 'departments' ? 'active rounded' : ''}`}
              onClick={() => setActiveTab('departments')}
            >
              <Globe size={18} className="me-3" />
              Departments
            </button>
            <button
              className={`list-group-item list-group-item-action py-3 px-4 border-0 d-flex align-items-center ${activeTab === 'holidays' ? 'active rounded' : ''}`}
              onClick={() => setActiveTab('holidays')}
            >
              <Calendar size={18} className="me-3" />
              Holiday Calendar
            </button>
            <button
              className={`list-group-item list-group-item-action py-3 px-4 border-0 d-flex align-items-center ${activeTab === 'working' ? 'active rounded' : ''}`}
              onClick={() => setActiveTab('working')}
            >
              <Clock size={18} className="me-3" />
              Working Days
            </button>
            <button
              className={`list-group-item list-group-item-action py-3 px-4 border-0 d-flex align-items-center ${activeTab === 'security' ? 'active rounded' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <ShieldCheck size={18} className="me-3" />
              Security & Access
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-md-9">
          <div className="card border-0 shadow-sm min-vh-50">
            <div className="card-body p-4">

              {/* General Tab */}
              {activeTab === 'general' && (
                <div>
                  <h5 className="fw-bold mb-4">Organizational Profile</h5>
                  <div className="row g-3">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Organization Name</label>
                      <input type="text" className="form-control" defaultValue="CodeZenith Technologies" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Primary Domain</label>
                      <input type="text" className="form-control" defaultValue="codezenith.com" />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label small fw-bold">Headquarters Address</label>
                      <textarea className="form-control" rows={3}>123 Innovation Drive, Silicon Valley, CA 94043</textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Timezone</label>
                      <select className="form-select">
                        <option>UTC (Coordinated Universal Time)</option>
                        <option>PST (Pacific Standard Time)</option>
                        <option>EST (Eastern Standard Time)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-top">
                    <button className="btn btn-primary px-4">Save Profile</button>
                  </div>
                </div>
              )}

              {/* Departments Tab */}
              {activeTab === 'departments' && (
                <div>
                  <h5 className="fw-bold mb-4">Manage Departments</h5>
                  <form onSubmit={handleAddDept} className="d-flex gap-2 mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="New department name..."
                      value={newDept.name}
                      onChange={(e) => setNewDept({ name: e.target.value })}
                    />
                    <button type="submit" className="btn btn-primary d-flex align-items-center">
                      <Plus size={18} className="me-1" /> Add
                    </button>
                  </form>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Department Name</th>
                          <th>Employees</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {depts.map(d => (
                          <tr key={d.id}>
                            <td className="fw-medium">{d.name}</td>
                            <td>{d.employeeCount} Members</td>
                            <td className="text-end">
                              <button className="btn btn-link text-danger p-0" onClick={() => handleDeleteDept(d.id)}>
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Holidays Tab */}
              {activeTab === 'holidays' && (
                <div>
                  <h5 className="fw-bold mb-4">Holiday Calendar 2026</h5>
                  <form onSubmit={handleAddHoliday} className="row g-2 mb-4">
                    <div className="col-md-5">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Holiday name"
                        value={newHoliday.name}
                        onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="date"
                        className="form-control"
                        value={newHoliday.date}
                        onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                      />
                    </div>
                    <div className="col-md-2">
                      <select
                        className="form-select"
                        value={newHoliday.type}
                        onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value as any })}
                      >
                        <option value="public">Public</option>
                        <option value="optional">Optional</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <button type="submit" className="btn btn-primary w-100">Add</button>
                    </div>
                  </form>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Holiday</th>
                          <th>Date</th>
                          <th>Type</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holidays.map(h => (
                          <tr key={h.id}>
                            <td className="fw-medium">{h.name}</td>
                            <td>{new Date(h.date).toLocaleDateString()}</td>
                            <td>
                              <Badge variant={h.type === 'public' ? 'danger' : 'success'}>{h.type}</Badge>
                            </td>
                            <td className="text-end">
                              <button className="btn btn-link text-danger p-0" onClick={() => handleDeleteHoliday(h.id)}>
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Working Days Tab */}
              {activeTab === 'working' && (
                <div>
                  <h5 className="fw-bold mb-4">Standard Working Week</h5>
                  <p className="text-muted small mb-4">Select the days that are considered working days for the organization.</p>

                  <div className="list-group list-group-flush border rounded overflow-hidden">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <div className="list-group-item d-flex justify-content-between align-items-center py-3" key={day}>
                        <div className="fw-bold">{day}</div>
                        <div className="form-check form-switch">
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

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="text-center py-5">
                  <ShieldCheck size={48} className="text-primary opacity-25 mb-3" />
                  <h5>Access Control</h5>
                  <p className="text-muted small">Configure IP restrictions, password policies, and MFA settings.</p>
                  <button className="btn btn-outline-primary mt-3 px-4">Initialize Security Audit</button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
