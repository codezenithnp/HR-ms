import { useState } from 'react';
import { Building2, Lock, Mail } from 'lucide-react';
import { User } from '../App';

type LoginPageProps = {
  onLogin: (user: User) => void;
};

// Mock employee data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@codezenith.com',
    role: 'employee',
    department: 'Engineering',
    employeeId: 'CZ001',
  },
  {
    id: '2',
    name: 'Sarah Admin',
    email: 'admin@codezenith.com',
    role: 'admin',
    department: 'HR',
    employeeId: 'CZ002',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@codezenith.com',
    role: 'employee',
    department: 'Marketing',
    employeeId: 'CZ003',
  },
  {
    id: '4',
    name: 'Bob Smith',
    email: 'bob.smith@codezenith.com',
    role: 'employee',
    department: 'Engineering',
    employeeId: 'CZ004',
  },
  {
    id: '5',
    name: 'Emma Wilson',
    email: 'emma.wilson@codezenith.com',
    role: 'employee',
    department: 'Design',
    employeeId: 'CZ005',
  },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple mock authentication
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password123') {
      onLogin(user);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CodeZenith</h1>
            <p className="text-gray-600">HR Attendance System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@codezenith.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><span className="font-medium">Employee:</span> john.doe@codezenith.com</p>
              <p><span className="font-medium">Admin:</span> admin@codezenith.com</p>
              <p><span className="font-medium">Password:</span> password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
