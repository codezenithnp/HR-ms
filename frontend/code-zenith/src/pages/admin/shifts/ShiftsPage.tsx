import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, Calendar, Users, Briefcase } from 'lucide-react';
import { LoadingSpinner, Badge } from '../../../components/common';
import { settingsService, Shift } from '../../../services/settingsService';

export const ShiftsPage: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '09:00',
    endTime: '18:00',
    gracePeriod: 15,
    description: ''
  });

  useEffect(() => {
    loadShifts();
  }, []);

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
      setFormData({
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        gracePeriod: shift.gracePeriod || 0,
        description: shift.description || ''
      });
    } else {
      setEditingShift(null);
      setFormData({
        name: '',
        startTime: '09:00',
        endTime: '18:00',
        gracePeriod: 15,
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Calculate working hours roughly for display if not provided by backend
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (end < start) end.setDate(end.getDate() + 1);
      const workingHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      const payload = { ...formData, workingHours };

      if (editingShift) {
        await settingsService.updateShift(editingShift.id, payload);
      } else {
        await settingsService.createShift(payload);
      }
      setShowModal(false);
      loadShifts();
    } catch (error) {
      console.error('Failed to save shift:', error);
      alert('Failed to save shift');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this shift? This may affect employee assignments.')) {
      try {
        await settingsService.deleteShift(id);
        loadShifts();
      } catch (error) {
        console.error('Failed to delete shift:', error);
        alert('Failed to delete shift');
      }
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Shift Management</h1>
          <p className="text-muted mb-0">Define organizational work timings and grace periods</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center" onClick={() => handleOpenModal()}>
          <Plus size={18} className="me-2" />
          Create Shift
        </button>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 py-5 text-center">
            <LoadingSpinner text="Loading shifts..." />
          </div>
        ) : shifts.length > 0 ? (
          shifts.map((shift) => (
            <div className="col-md-6 col-lg-4" key={shift.id}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="bg-primary bg-opacity-10 text-primary p-3 rounded">
                      <Clock size={24} />
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-light" onClick={() => handleOpenModal(shift)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(shift.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h5 className="fw-bold mb-1">{shift.name}</h5>
                  <p className="text-muted small mb-3">{shift.description || 'Standard work shifts.'}</p>

                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Schedule</span>
                      <span className="fw-medium">{shift.startTime} - {shift.endTime}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Duration</span>
                      <span className="fw-medium">{shift.workingHours} Hours</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Grace Period</span>
                      <span className="fw-medium">{shift.gracePeriod} Minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="opacity-25 mb-3">
              <Clock size={48} />
            </div>
            <h5 className="text-muted">No shifts defined yet</h5>
            <p className="text-muted small">Create a shift to start managing employee schedules</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editingShift ? 'Edit Shift' : 'New Shift Definition'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase">Shift Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Morning Shift, Night Shift"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase">Start Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase">End Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase">Grace Period (Minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.gracePeriod}
                      onChange={(e) => setFormData({ ...formData, gracePeriod: parseInt(e.target.value) })}
                      min="0"
                    />
                    <div className="form-text small">Late check-in allowed before marking as 'Late'.</div>
                  </div>
                  <div className="mb-0">
                    <label className="form-label small fw-bold text-uppercase">Description</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Optional shift details..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">
                    {editingShift ? 'Save Changes' : 'Create Shift'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
