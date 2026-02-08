import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, HelpCircle } from 'lucide-react';
import { LoadingSpinner, Badge } from '../../../components/common';
import { leaveService, LeaveType } from '../../../services/leaveService';

export const LeaveTypesPage: React.FC = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingType, setEditingType] = useState<LeaveType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    daysAllowed: 10,
    carryForward: false,
    description: '',
    color: '#4648d4',
  });

  useEffect(() => { loadLeaveTypes(); }, []);

  const loadLeaveTypes = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getLeaveTypes();
      setLeaveTypes(data);
    } catch (error) {
      console.error('Failed to load leave types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type?: LeaveType) => {
    if (type) {
      setEditingType(type);
      setFormData({ name: type.name, daysAllowed: type.daysAllowed, carryForward: type.carryForward, description: type.description || '', color: type.color });
    } else {
      setEditingType(null);
      setFormData({ name: '', daysAllowed: 10, carryForward: false, description: '', color: '#4648d4' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingType) await leaveService.updateLeaveType(editingType.id, formData);
      else             await leaveService.createLeaveType(formData);
      setShowModal(false);
      loadLeaveTypes();
    } catch {
      alert('Failed to save leave type');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this leave type? This may affect existing records.')) return;
    try {
      await leaveService.deleteLeaveType(id);
      loadLeaveTypes();
    } catch {
      alert('Failed to delete leave type');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">Leave Types</h1>
          <p className="page-subtitle">Configure available leave categories and their policies</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
          <Plus size={16} /> Add Leave Type
        </button>
      </div>

      <div className="row g-3">
        {loading ? (
          <div className="col-12"><LoadingSpinner text="Loading leave types…" /></div>
        ) : leaveTypes.length > 0 ? (
          leaveTypes.map((type) => (
            <div className="col-md-6 col-lg-4" key={type.id}>
              <div className="card h-100 overflow-hidden">
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{ background: `${type.color}18`, borderBottom: `2px solid ${type.color}30` }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: type.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: type.color }}>{type.name}</span>
                  </div>
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-sm"
                      style={{ background: 'rgba(70,72,212,0.08)', color: 'var(--af-secondary)', border: 'none' }}
                      onClick={() => handleOpenModal(type)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'rgba(189,0,26,0.08)', color: 'var(--af-primary)', border: 'none' }}
                      onClick={() => handleDelete(type.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="label-sm">Allowance</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{type.daysAllowed} days / yr</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="label-sm">Carry Forward</span>
                    {type.carryForward
                      ? <Badge variant="success"><CheckCircle size={11} style={{ marginRight: 3 }} />Yes</Badge>
                      : <Badge variant="secondary">No</Badge>}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', margin: 0, lineHeight: 1.5 }}>
                    {type.description || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="empty-state">
              <HelpCircle size={48} />
              <h6 style={{ fontWeight: 600, color: 'var(--af-on-surface)', marginBottom: '0.25rem' }}>No Leave Types</h6>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Click "Add Leave Type" to get started.</p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(17,28,45,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', boxShadow: '0 20px 60px rgba(17,28,45,0.18)' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid var(--af-surface-container)', padding: '1.25rem 1.5rem' }}>
                <h5 className="modal-title" style={{ fontWeight: 700 }}>{editingType ? 'Edit Leave Type' : 'Add Leave Type'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ padding: '1.5rem' }}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Sick Leave" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Days Allowed</label>
                      <input type="number" className="form-control" value={formData.daysAllowed} onChange={(e) => setFormData({ ...formData, daysAllowed: parseInt(e.target.value) })} min="0" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Theme Color</label>
                      <div className="d-flex gap-2 align-items-center">
                        <input type="color" className="form-control form-control-color" style={{ width: 44, padding: '0.25rem' }} value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                        <span style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', fontFamily: 'var(--font-label)' }}>{formData.color}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="carryForward" checked={formData.carryForward} onChange={(e) => setFormData({ ...formData, carryForward: e.target.checked })} />
                      <label className="form-check-label" htmlFor="carryForward">Enable Carry Forward</label>
                    </div>
                    <div className="form-text" style={{ fontSize: '0.75rem' }}>Allow unused days to carry over to the next year.</div>
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows={3} placeholder="Brief description of this leave policy…" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid var(--af-surface-container)', padding: '1rem 1.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingType ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
