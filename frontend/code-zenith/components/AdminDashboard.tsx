import { useState, useEffect } from 'react';
import { 
  LogOut, 
  Users, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  History
} from 'lucide-react';
import { User, AttendanceRecord } from '../App';
import { 
  getAttendanceData, 
  mockEmployees, 
  getTodayStats,
  getMonthlyStats
} from '../utils/attendanceData';

type AdminDashboardProps = {
  user: User;
  onLogout: () => void;
  onNavigateToHistory: () => void;
};

export function AdminDashboard({ user, onLogout, onNavigateToHistory }: AdminDashboardProps) {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [todayStats, setTodayStats] = useState({ present: 0, absent: 0, onTime: 0, total: 0 });
  const [monthlyStats, setMonthlyStats] = useState({ totalPresent: 0, totalAbsent: 0, avgAttendance: '0' });
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = () => {
    const allAttendance = getAttendanceData();
    setAttendanceData(allAttendance);
    setTodayStats(getTodayStats());
    setMonthlyStats(getMonthlyStats());
  };

  const departments = ['all', ...Array.from(new Set(mockEmployees.map(e => e.department)))];

  const filteredAttendance = attendanceData
    .filter(record => record.date === selectedDate)
    .filter(record => {
      if (selectedDepartment === 'all') return true;
      const employee = mockEmployees.find(e => e.employeeId === record.employeeId);
      return employee?.department === selectedDepartment;
    })
    .filter(record => {
      if (!searchQuery) return true;
      return record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-50';
      case 'absent': return 'text-red-600 bg-red-50';
      case 'half-day': return 'text-yellow-600 bg-yellow-50';
      case 'checked-in': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const attendancePercentage = todayStats.total > 0
    ? ((todayStats.present / todayStats.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CodeZenith HR</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Employees</p>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{todayStats.total}</p>
            <p className="text-sm text-gray-500 mt-1">Active workforce</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Present Today</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">{todayStats.present}</p>
            <p className="text-sm text-gray-500 mt-1">{attendancePercentage}% attendance</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Absent Today</p>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">{todayStats.absent}</p>
            <p className="text-sm text-gray-500 mt-1">Need follow-up</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">On Time</p>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{todayStats.onTime}</p>
            <p className="text-sm text-gray-500 mt-1">Before 9:00 AM</p>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-indigo-100 mb-1">Monthly Overview</p>
              <p className="text-2xl font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-indigo-300" />
          </div>
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div>
              <p className="text-indigo-100 text-sm mb-1">Total Present</p>
              <p className="text-2xl font-bold">{monthlyStats.totalPresent}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm mb-1">Total Absent</p>
              <p className="text-2xl font-bold">{monthlyStats.totalAbsent}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm mb-1">Avg Attendance</p>
              <p className="text-2xl font-bold">{monthlyStats.avgAttendance}%</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={onNavigateToHistory}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <History className="w-5 h-5" />
              Full History
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Attendance Records - {new Date(selectedDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{filteredAttendance.length} records found</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Employee ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Check In</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Check Out</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Work Hours</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAttendance.map((record) => {
                  const employee = mockEmployees.find(e => e.employeeId === record.employeeId);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {record.employeeId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.employeeName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee?.department || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.checkIn || '--'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.checkOut || '--'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.workHours !== null ? `${record.workHours.toFixed(2)}h` : '--'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAttendance.length === 0 && (
            <div className="py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No attendance records found for the selected filters.</p>
            </div>
          )}
        </div>

        {/* Employee List */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Employees</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Employee ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Join Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockEmployees
                  .filter(emp => selectedDepartment === 'all' || emp.department === selectedDepartment)
                  .map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {employee.employeeId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(employee.joinDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          employee.role === 'admin' ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50'
                        }`}>
                          {employee.role}
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
