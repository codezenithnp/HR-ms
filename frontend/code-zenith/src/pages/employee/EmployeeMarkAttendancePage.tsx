import React, { useState, useEffect } from 'react';
import { Clock, MapPin, AlertCircle, CheckCircle, LogIn, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService, settingsService } from '../../services';
import { LoadingSpinner, Badge } from '../../components/common';
import { Shift } from '../../services/settingsService';
import { AttendanceRecord } from '../../services/attendanceService';

export const EmployeeMarkAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [userShift, setUserShift]     = useState<Shift | null>(null);
  const [notes, setNotes]             = useState('');
  const [message, setMessage]         = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { if (user) loadInitialData(); }, [user]);

  const loadInitialData = async () => {
    try {
      const [todayRec, shifts] = await Promise.all([
        attendanceService.getTodayAttendance(),
        settingsService.getShifts(),
      ]);
      setTodayRecord(todayRec);
      setUserShift(shifts.length > 0 ? shifts[0] : null);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to load attendance data: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (type: 'check-in' | 'check-out') => {
    setSubmitting(true);
    setMessage(null);
    try {
      const record = type === 'check-in'
        ? await attendanceService.checkIn(undefined, notes)
        : await attendanceService.checkOut(undefined, notes);
      setTodayRecord(record);
      setMessage({ type: 'success', text: type === 'check-in' ? 'Successfully checked in!' : 'Successfully checked out!' });
      setNotes('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || `Failed to ${type}` });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading attendance data…" />;

  const isCheckedIn  = todayRecord && todayRecord.checkIn && !todayRecord.checkOut;
  const isCheckedOut = todayRecord?.checkOut;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mark Attendance</h1>
        <p className="page-subtitle">Record your check-in and check-out for today</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body text-center" style={{ padding: '2.5rem 2rem' }}>
              {/* Live clock */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: '3rem', letterSpacing: '-0.03em', color: 'var(--af-on-surface)', lineHeight: 1 }}>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--af-on-surface-variant)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Calendar size={15} />
                  {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {message && (
                <div
                  className={`d-flex align-items-center gap-2 mb-4`}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    background: message.type === 'success' ? 'rgba(0,106,72,0.08)' : 'rgba(189,0,26,0.08)',
                    color: message.type === 'success' ? 'var(--af-tertiary)' : 'var(--af-primary)',
                  }}
                >
                  {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {message.text}
                </div>
              )}

              {/* Shift info */}
              <div style={{ background: 'var(--af-surface-container)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="label-sm">Current Shift</span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {userShift ? `${userShift.name} (${userShift.startTime} – ${userShift.endTime})` : 'Unassigned'}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="label-sm">Today's Status</span>
                  {todayRecord ? (
                    ({
                      present:    <Badge variant="success">Present</Badge>,
                      late:       <Badge variant="warning">Late</Badge>,
                      absent:     <Badge variant="danger">Absent</Badge>,
                      'on-leave': <Badge variant="info">On Leave</Badge>,
                    } as any)[todayRecord.status] || <Badge variant="secondary">{todayRecord.status}</Badge>
                  ) : (
                    <Badge variant="secondary">Not Marked</Badge>
                  )}
                </div>
              </div>

              {isCheckedIn && todayRecord?.checkIn && (
                <div style={{ background: 'rgba(70,72,212,0.07)', borderRadius: 'var(--radius-md)', padding: '0.625rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: 'var(--af-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={15} />
                  Working since {new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}

              {/* Notes */}
              <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Anything to note about today?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={!!submitting || !!isCheckedOut}
                />
              </div>

              {/* Action buttons */}
              <div className="d-grid gap-2">
                {!isCheckedIn && !isCheckedOut ? (
                  <button
                    className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2"
                    style={{ padding: '0.875rem' }}
                    onClick={() => handleAction('check-in')}
                    disabled={submitting}
                  >
                    {submitting ? <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'af-spin 0.75s linear infinite', display: 'inline-block' }} /> : <LogIn size={20} />}
                    Punch In
                  </button>
                ) : isCheckedIn ? (
                  <button
                    className="btn btn-lg d-flex align-items-center justify-content-center gap-2"
                    style={{ padding: '0.875rem', background: 'var(--af-primary)', color: 'white', border: 'none' }}
                    onClick={() => handleAction('check-out')}
                    disabled={submitting}
                  >
                    {submitting ? <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'af-spin 0.75s linear infinite', display: 'inline-block' }} /> : <LogOut size={20} />}
                    Punch Out
                  </button>
                ) : (
                  <div style={{ background: 'rgba(0,106,72,0.08)', borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'center' }}>
                    <CheckCircle size={32} color="var(--af-tertiary)" style={{ marginBottom: '0.5rem' }} />
                    <h5 style={{ fontWeight: 700, color: 'var(--af-tertiary)', marginBottom: '0.25rem' }}>All done for today!</h5>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', margin: 0 }}>
                      In: {todayRecord?.checkIn ? new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'} &nbsp;·&nbsp;
                      Out: {todayRecord?.checkOut ? new Date(todayRecord.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--af-on-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <MapPin size={13} /> Location tracking is enabled for attendance marking
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes af-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
