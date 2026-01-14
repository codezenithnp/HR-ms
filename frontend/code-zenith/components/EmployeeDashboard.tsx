import { useState, useEffect } from 'react';
import { 
  LogOut, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  History,
  Timer,
  TrendingUp
} from 'lucide-react';
import { User, AttendanceRecord } from '../App';
import { getAttendanceData, checkIn, checkOut, getEmployeeStats } from '../utils/attendanceData';

type EmployeeDashboardProps = {
  user: User;
  onLogout: () => void;
  onNavigateToHistory: () => void;
};

export function EmployeeDashboard({ user, onLogout, onNavigateToHistory }: EmployeeDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, halfDay: 0, totalDays: 0 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAttendanceData();
  }, [user.employeeId]);

  const loadAttendanceData = () => {
    const allAttendance = getAttendanceData();
    const userAttendance = allAttendance.filter(a => a.employeeId === user.employeeId);
    
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = userAttendance.find(a => a.date === today);
    setTodayAttendance(todayRecord || null);

    const recent = userAttendance
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setRecentAttendance(recent);

    const employeeStats = getEmployeeStats(user.employeeId);
    setStats(employeeStats);
  };

  const handleCheckIn = () => {
    checkIn(user.employeeId, user.name);
    loadAttendanceData();
  };

  const handleCheckOut = () => {
    checkOut(user.employeeId);
    loadAttendanceData();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-50';
      case 'absent': return 'text-red-600 bg-red-50';
      case 'half-day': return 'text-yellow-600 bg-yellow-50';
      case 'checked-in': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const attendancePercentage = stats.totalDays > 0 
    ? ((stats.present / stats.totalDays) * 100).toFixed(1) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CodeZenith HR</h1>
                <p className="text-sm text-gray-600">Employee Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.employeeId} • {user.department}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Time & Date */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 mb-2">Current Time</p>
              <p className="text-5xl font-bold mb-2">{formatTime(currentTime)}</p>
              <p className="text-indigo-100">{formatDate(currentTime)}</p>
            </div>
            <Clock className="w-24 h-24 text-indigo-300 opacity-50" />
          </div>
        </div>

        {/* Check In/Out Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Attendance</h2>
          
          {todayAttendance ? (
            <div className="space-y-4">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check In</p>
                    <p className="text-xl font-bold text-gray-900">
                      {todayAttendance.checkIn || '--:--'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check Out</p>
                    <p className="text-xl font-bold text-gray-900">
                      {todayAttendance.checkOut || '--:--'}
                    </p>
                  </div>
                </div>

                {todayAttendance.workHours !== null && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Timer className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Work Hours</p>
                      <p className="text-xl font-bold text-gray-900">
                        {todayAttendance.workHours.toFixed(2)}h
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {!todayAttendance.checkOut && (
                <button
                  onClick={handleCheckOut}
                  className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Check Out
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-6">You haven't checked in today</p>
              <button
                onClick={handleCheckIn}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Check In Now
              </button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Days</p>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalDays}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Present</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.present}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Absent</p>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Attendance</p>
              <TrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-3xl font-bold text-indigo-600">{attendancePercentage}%</p>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Attendance</h2>
            <button
              onClick={onNavigateToHistory}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <History className="w-5 h-5" />
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Check In</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Check Out</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Work Hours</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {record.checkIn || '--'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {record.checkOut || '--'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {record.workHours !== null ? `${record.workHours.toFixed(2)}h` : '--'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
