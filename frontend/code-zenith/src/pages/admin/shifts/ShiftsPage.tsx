import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common';
import { settingsService, Shift } from '../../../services/settingsService';

export const ShiftsPage: React.FC = () => {
  const [shifts, setShifts]         = useState<Shift[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '09:00',
    endTime: '18:00',
    gracePeriod: 15,
    description: '',
  });

  useEffect(() => { loadShifts(); }, []);

  const loadShifts = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getShifts();
      setShifts(data);
    } catch (error) {
      console.error('Failed to load shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (shift?: Shift) => {
    if (shift) {
      setEditingShift(shift);
      setFormData({ name: shift.name, startTime: shift.startTime, endTime: shift.endTime, gracePeriod: shift.gracePeriod || 0, description: shift.description || '' });
    } else {
      setEditingShift(null);
      setFormData({ name: '', startTime: '09:00', endTime: '18:00', gracePeriod: 15, description: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end   = new Date(`2000-01-01T${formData.endTime}`);
      if (end < start) end.setDate(end.getDate() + 1);
      const workingHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const payload = { ...formData, workingHours };
      if (editingShift) await settingsService.updateShift(editingShift.id, payload);
      else              await settingsService.createShift(payload);
      setShowModal(false);
      loadShifts();
    } catch {
      alert('Failed to save shift');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this shift? This may affect employee assignments.')) return;
    try {
      await settingsService.deleteShift(id);
      loadShifts();
    } catch {
      alert('Failed to delete shift');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">Shift Management</h1>
          <p className="page-subtitle">Define work timings and grace periods for your teams</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
          <Plus size={16} /> Create Shift
        </button>
      </div>

      <div className="row g-3">
        {loading ? (
          <div className="col-12"><LoadingSpinner text="Loading shifts…" /></div>
        ) : shifts.length > 0 ? (
          shifts.map((shift) => (
            <div className="col-md-6 col-lg-4" key={shift.id}>
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(70,72,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={22} color="var(--af-secondary)" />
                    </div>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(70,72,212,0.08)', color: 'var(--af-secondary)', border: 'none' }}
                        onClick={() => handleOpenModal(shift)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(189,0,26,0.08)', color: 'var(--af-primary)', border: 'none' }}
                        onClick={() => handleDelete(shift.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h5 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{shift.name}</h5>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', marginBottom: '1rem', minHeight: '2.5rem' }}>
                    {shift.description || 'Standard work shift.'}
                  </p>
                  <div style={{ borderTop: '1px solid var(--af-surface-container)', paddingTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="d-flex justify-content-between">
                      <span className="label-sm">Schedule</span>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{shift.startTime} – {shift.endTime}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="label-sm">Duration</span>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{shift.workingHours} hrs</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="label-sm">Grace Period</span>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{shift.gracePeriod} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="empty-state">
              <Clock size={48} />
              <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>No Shifts Defined</h6>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Create a shift to manage employee schedules.</p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(17,28,45,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', boxShadow: '0 20px 60px rgba(17,28,45,0.18)' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid var(--af-surface-container)', padding: '1.25rem 1.5rem' }}>
                <h5 className="modal-title" style={{ fontWeight: 700 }}>{editingShift ? 'Edit Shift' : 'New Shift'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ padding: '1.5rem' }}>
                  <div className="mb-3">
                    <label className="form-label">Shift Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Morning Shift" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Start Time</label>
                      <input type="time" className="form-control" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">End Time</label>
                      <input type="time" className="form-control" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Grace Period (Minutes)</label>
                    <input type="number" className="form-control" value={formData.gracePeriod} onChange={(e) => setFormData({ ...formData, gracePeriod: parseInt(e.target.value) })} min="0" />
                    <div className="form-text">Late check-in buffer before marking as "Late".</div>
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows={2} placeholder="Optional details…" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid var(--af-surface-container)', padding: '1rem 1.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingShift ? 'Save Changes' : 'Create Shift'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
