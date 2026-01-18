import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  LogIn,
  LogOut,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService, settingsService } from '../../services';
import { LoadingSpinner, Badge } from '../../components/common';
import { Shift } from '../../services/settingsService';
import { AttendanceRecord } from '../../services/attendanceService';

export const EmployeeMarkAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [userShift, setUserShift] = useState<Shift | null>(null);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      const [todayRec, shifts] = await Promise.all([
        attendanceService.getTodayAttendance(),
        settingsService.getShifts(),
      ]);

      setTodayRecord(todayRec);

      // Find user shift or use first shift as default
      const shift = shifts.length > 0 ? shifts[0] : null;
      setUserShift(shift);
    } catch (error: any) {
      console.error('Failed to load attendance data:', error);
      setMessage({ type: 'error', text: 'Failed to load attendance data: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (type: 'check-in' | 'check-out') => {
    setSubmitting(true);
    setMessage(null);
    try {
      let record;
      if (type === 'check-in') {
        record = await attendanceService.checkIn(undefined, notes);
        setMessage({ type: 'success', text: 'Successfully checked in!' });
      } else {
        record = await attendanceService.checkOut(undefined, notes);
        setMessage({ type: 'success', text: 'Successfully checked out!' });
      }
      setTodayRecord(record);
      setNotes('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || `Failed to ${type}` });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading attendance data..." />;
  }

  const isCheckedIn = todayRecord && todayRecord.status !== 'absent' && todayRecord.checkIn && !todayRecord.checkOut;
  const isCheckedOut = todayRecord && todayRecord.checkOut;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <div className="display-4 fw-bold text-primary mb-2">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-muted h5">
                  <Calendar size={20} className="me-2 mb-1" />
                  {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {message && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} d-flex align-items-center mb-4 text-start`}>
                  {message.type === 'success' ? <CheckCircle size={20} className="me-2" /> : <AlertCircle size={20} className="me-2" />}
                  {message.text}
                </div>
              )}

              <div className="bg-light rounded p-4 mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Current Shift:</span>
                  <span className="fw-semibold">{userShift?.name} ({userShift?.startTime} - {userShift?.endTime})</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Today's Status:</span>
                  <Badge variant={todayRecord ? (todayRecord.status === 'present' || todayRecord.status === 'late' ? 'success' : 'warning') : 'secondary'}>
                    {todayRecord ? todayRecord.status.toUpperCase() : 'NOT MARKED'}
                  </Badge>
                </div>
              </div>

              {isCheckedIn && todayRecord?.checkIn && (
                <div className="alert alert-info border-0 mb-4 py-2">
                  <Clock size={16} className="me-2" />
                  Working since {new Date(todayRecord.checkIn).toLocaleTimeString()}
                </div>
              )}

              <div className="mb-4">
                <label className="form-label text-start d-block small fw-bold text-muted text-uppercase">Notes (Optional)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Anything to note about today?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={!!submitting || !!isCheckedOut}
                ></textarea>
              </div>

              <div className="d-grid gap-3">
                {!isCheckedIn && !isCheckedOut ? (
                  <button
                    className="btn btn-primary btn-lg py-3 d-flex align-items-center justify-content-center"
                    onClick={() => handleAction('check-in')}
                    disabled={submitting}
                  >
                    {submitting ? <LoadingSpinner size="sm" /> : <LogIn size={24} className="me-2" />}
                    Punch In
                  </button>
                ) : isCheckedIn ? (
                  <button
                    className="btn btn-danger btn-lg py-3 d-flex align-items-center justify-content-center"
                    onClick={() => handleAction('check-out')}
                    disabled={submitting}
                  >
                    {submitting ? <LoadingSpinner size="sm" /> : <LogOut size={24} className="me-2" />}
                    Punch Out
                  </button>
                ) : (
                  <div className="alert alert-success border-0 py-3 mb-0">
                    <CheckCircle size={32} className="d-block mx-auto mb-2" />
                    <h5 className="mb-1">All done for today!</h5>
                    <p className="small mb-0">
                      Checked in: {todayRecord?.checkIn ? new Date(todayRecord.checkIn).toLocaleTimeString() : '--'} | 
                      Checked out: {todayRecord?.checkOut ? new Date(todayRecord.checkOut).toLocaleTimeString() : '--'}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-top text-muted small">
                <MapPin size={14} className="me-1" />
                Location tracking is enabled for attendance marking
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
