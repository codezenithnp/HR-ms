# CodeZenith HR Management System - React Frontend

## Overview

This is a complete React + TypeScript frontend for an HR Management and Attendance System built following MERN stack best practices with Bootstrap 5 for styling.

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── StatCard.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── index.ts
│   │   ├── layouts/         # Layout components
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   └── EmployeeLayout.tsx
│   │   ├── admin/           # Admin-specific widgets (to be created)
│   │   └── employee/        # Employee-specific widgets (to be created)
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── ChangePasswordPage.tsx
│   │   │   └── UnauthorizedPage.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   ├── employees/
│   │   │   │   ├── EmployeeListPage.tsx
│   │   │   │   ├── EmployeeCreatePage.tsx (to be created)
│   │   │   │   ├── EmployeeDetailPage.tsx (to be created)
│   │   │   │   └── EmployeeEditPage.tsx (to be created)
│   │   │   ├── attendance/
│   │   │   │   ├── AdminAttendancePage.tsx (to be created)
│   │   │   │   └── AdminEmployeeAttendancePage.tsx (to be created)
│   │   │   ├── leaves/
│   │   │   │   ├── AdminLeavesPage.tsx (to be created)
│   │   │   │   ├── LeaveTypesPage.tsx (to be created)
│   │   │   │   └── LeaveSettingsPage.tsx (to be created)
│   │   │   ├── shifts/
│   │   │   │   ├── ShiftsPage.tsx (to be created)
│   │   │   │   └── ShiftAssignmentsPage.tsx (to be created)
│   │   │   ├── reports/
│   │   │   │   ├── AttendanceReportPage.tsx (to be created)
│   │   │   │   └── LeaveReportPage.tsx (to be created)
│   │   │   └── settings/
│   │   │       └── SettingsPage.tsx (to be created)
│   │   └── employee/
│   │       ├── EmployeeDashboardPage.tsx (to be created)
│   │       ├── EmployeeProfilePage.tsx (to be created)
│   │       ├── EmployeeAttendanceHistoryPage.tsx (to be created)
│   │       ├── EmployeeMarkAttendancePage.tsx (to be created)
│   │       ├── EmployeeLeavesPage.tsx (to be created)
│   │       └── EmployeeLeaveRequestPage.tsx (to be created)
│   ├── routes/
│   │   ├── ProtectedRoute.tsx
│   │   └── index.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   ├── mockData.ts
│   │   ├── authService.ts
│   │   ├── employeeService.ts
│   │   ├── attendanceService.ts
│   │   ├── leaveService.ts
│   │   ├── settingsService.ts
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── App.tsx
└── package.json
```

## 🚀 Features Implemented

### ✅ Completed

1. **Authentication & Authorization**
   - AuthContext for global auth state
   - Protected routes with role-based access control
   - Login, Forgot Password, Change Password pages
   - JWT token management (mock)

2. **Routing**
   - React Router v6+ setup
   - Layout-based routing (Admin, Employee, Auth)
   - Protected routes with automatic redirects
   - Role-based route guards

3. **Layouts**
   - AuthLayout: Centered layout for auth pages
   - AdminLayout: Sidebar navigation for admin panel
   - EmployeeLayout: Top navbar for employee portal

4. **Common Components**
   - StatCard: Reusable stat display cards
   - LoadingSpinner: Loading state component
   - FormField: Generic form input component
   - Badge: Status badge component
   - Modal: Modal dialog component
   - Pagination: Table pagination component

5. **Services Layer**
   - All services return Promises for easy API integration
   - Mock data for development
   - Ready to swap with Axios calls
   - Service modules: auth, employee, attendance, leave, settings

6. **Admin Pages**
   - Dashboard with stats and quick actions
   - Employee list with filters and pagination

### 📝 To Be Created

The following pages need to be implemented following the same patterns:

**Employee Management:**
- EmployeeCreatePage.tsx
- EmployeeDetailPage.tsx (with tabs)
- EmployeeEditPage.tsx

**Attendance:**
- AdminAttendancePage.tsx (table with filters)
- AdminEmployeeAttendancePage.tsx (calendar view)
- EmployeeAttendanceHistoryPage.tsx
- EmployeeMarkAttendancePage.tsx

**Leave Management:**
- AdminLeavesPage.tsx (with approve/reject)
- LeaveTypesPage.tsx
- LeaveSettingsPage.tsx
- EmployeeLeavesPage.tsx
- EmployeeLeaveRequestPage.tsx

**Other:**
- ShiftsPage.tsx
- ShiftAssignmentsPage.tsx
- AttendanceReportPage.tsx
- LeaveReportPage.tsx
- SettingsPage.tsx
- EmployeeDashboardPage.tsx
- EmployeeProfilePage.tsx

## 🔧 Installation & Setup

```bash
# Install dependencies
npm install

# Required packages
npm install react-router-dom bootstrap lucide-react

# For TypeScript projects
npm install --save-dev @types/react-router-dom

# Run development server
npm run dev
```

## 📖 Usage Guide

### Authentication

```typescript
// Login credentials (mock)
Email: admin@codezenith.com / hr@codezenith.com / john.doe@codezenith.com
Password: password123
```

### Creating New Pages

1. Create the page component in appropriate directory
2. Follow existing patterns (use services, common components)
3. Add route in `/src/routes/index.tsx`
4. Use appropriate layout

Example:
```typescript
// New page
export const MyPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await myService.getData();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Your content */}
    </div>
  );
};
```

### Connecting to Backend

Replace mock services with Axios calls:

```typescript
// Before (Mock)
export const employeeService = {
  getAll: async () => {
    return Promise.resolve(mockEmployees);
  }
};

// After (Real API)
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const employeeService = {
  getAll: async (filters) => {
    const { data } = await axios.get(`${API_URL}/employees`, {
      params: filters,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  }
};
```

## 🎨 Styling

- Bootstrap 5 for components and layout
- Custom CSS in `src/styles/globals.css`
- CSS variables for theme colors
- Responsive design with Bootstrap grid

## 🔐 Role-Based Access

- **Admin**: Full access to all pages
- **HR**: Access to admin panel (employee, leave, attendance management)
- **Manager**: Access to admin panel + employee portal
- **Employee**: Access only to employee portal

## 📱 Responsive Design

- Mobile-friendly sidebar (collapsible)
- Responsive tables with horizontal scroll
- Bootstrap responsive grid system
- Mobile-optimized navigation

## 🔄 State Management

- React Context for global auth state
- Local state for component data
- No Redux required (can be added if needed)

## 🧪 Development Tips

1. **Mock Data**: All data is in `src/services/mockData.ts`
2. **Service Pattern**: Services return Promises for consistency
3. **Error Handling**: Add try/catch in components
4. **Loading States**: Use LoadingSpinner component
5. **Form Validation**: Add client-side validation in forms
6. **Accessibility**: Use semantic HTML and ARIA labels

## 📚 Next Steps

1. Complete remaining page implementations
2. Add form validation library (react-hook-form)
3. Add charts library for reports (recharts)
4. Implement calendar component for attendance
5. Add toast notifications (react-toastify)
6. Connect to Express backend API
7. Add error boundary components
8. Implement file upload for documents
9. Add PDF export for reports
10. Add unit tests (Jest + React Testing Library)

## 🤝 Integration with Backend

When your Express backend is ready:

1. Create `src/config/api.ts` with Axios instance
2. Update all service modules to use Axios
3. Add interceptors for token refresh
4. Handle API errors globally
5. Update mock data interfaces to match backend models

Example Axios setup:

```typescript
// src/config/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 📄 License

This project is part of the CodeZenith HR Management System.

---

**Note**: This frontend is designed to work seamlessly with a Node/Express backend. All services use mock data currently but are structured for easy integration with real APIs.
