import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Palette, CheckCircle, HelpCircle } from 'lucide-react';
import { LoadingSpinner, Badge } from '../../../components/common';
import { leaveService, LeaveType } from '../../../services/leaveService';

export const LeaveTypesPage: React.FC = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<LeaveType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    daysAllowed: 0,
    carryForward: false,
    description: '',
    color: '#0d6efd'
  });

  useEffect(() => {
    loadLeaveTypes();
  }, []);

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
      setFormData({
        name: type.name,
        daysAllowed: type.daysAllowed,
        carryForward: type.carryForward,
        description: type.description || '',
        color: type.color
      });
    } else {
      setEditingType(null);
      setFormData({
        name: '',
        daysAllowed: 10,
        carryForward: false,
        description: '',
        color: '#0d6efd'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingType) {
        await leaveService.updateLeaveType(editingType.id, formData);
      } else {
        await leaveService.createLeaveType(formData);
      }
      setShowModal(false);
      loadLeaveTypes();
    } catch (error) {
      console.error('Failed to save leave type:', error);
      alert('Failed to save leave type');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this leave type? This may affect existing leave records.')) {
      try {
        await leaveService.deleteLeaveType(id);
        loadLeaveTypes();
      } catch (error) {
        console.error('Failed to delete leave type:', error);
        alert('Failed to delete leave type');
      }
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Leave Types</h1>
          <p className="text-muted mb-0">Configure available leave categories and their policies</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center" onClick={() => handleOpenModal()}>
          <Plus size={18} className="me-2" />
          Add Leave Type
        </button>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 py-5 text-center">
            <LoadingSpinner text="Loading leave types..." />
          </div>
        ) : leaveTypes.length > 0 ? (
          leaveTypes.map((type) => (
            <div className="col-md-6 col-lg-4" key={type.id}>
              <div className="card h-100 border-0 shadow-sm overflow-hidden">
                <div
                  className="card-header border-0 py-3 d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: `${type.color}15`, color: type.color }}
                >
                  <h5 className="mb-0 fw-bold">{type.name}</h5>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-link p-0 text-primary"
                      onClick={() => handleOpenModal(type)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-link p-0 text-danger"
                      onClick={() => handleDelete(type.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <div className="text-muted small uppercase fw-bold">Allowance</div>
                    <div className="fw-bold">{type.daysAllowed} Days / Year</div>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <div className="text-muted small uppercase fw-bold">Carry Forward</div>
                    <div>
                      {type.carryForward ? (
                        <Badge variant="success" className="d-flex align-items-center gap-1">
                          <CheckCircle size={12} /> Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </div>
                  </div>
                  <div className="mb-0">
                    <div className="text-muted small uppercase fw-bold mb-1">Description</div>
                    <p className="small text-muted mb-0 line-clamp-2">
                      {type.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="opacity-25 mb-3">
              <HelpCircle size={48} />
            </div>
            <h5 className="text-muted">No leave types configured</h5>
            <p className="text-muted small">Click "Add Leave Type" to get started</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">{editingType ? 'Edit Leave Type' : 'Add New Leave Type'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sick Leave, Annual Leave"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Days Allowed</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.daysAllowed}
                        onChange={(e) => setFormData({ ...formData, daysAllowed: parseInt(e.target.value) })}
                        required
                        min="0"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Theme Color</label>
                      <div className="d-flex gap-2 align-items-center">
                        <input
                          type="color"
                          className="form-control form-control-color p-0"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                        <span className="small text-muted">{formData.color}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="carryForward"
                        checked={formData.carryForward}
                        onChange={(e) => setFormData({ ...formData, carryForward: e.target.checked })}
                      />
                      <label className="form-check-label fw-medium" htmlFor="carryForward">
                        Enable Carry Forward
                      </label>
                    </div>
                    <small className="text-muted">Allow unused days to be carried over to the next year</small>
                  </div>
                  <div className="mb-0">
                    <label className="form-label fw-bold">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Brief description of the leave policy..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">
                    {editingType ? 'Update Policy' : 'Create Policy'}
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
