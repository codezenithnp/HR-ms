# CodeZenith HR System - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn installed
- Basic understanding of React and TypeScript

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
The app will automatically open at `http://localhost:3000`

4. **Login**
Use these demo credentials:
- **Admin:** admin@codezenith.com / password123
- **HR:** hr@codezenith.com / password123
- **Manager:** manager@codezenith.com / password123
- **Employee:** john.doe@codezenith.com / password123

## Project Structure Overview

```
├── App.tsx                     # Main app component with router
├── index.html                  # HTML entry point
├── src/
│   ├── main.tsx               # React entry point
│   ├── context/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── routes/
│   │   ├── index.tsx          # Route configuration
│   │   └── ProtectedRoute.tsx # Route guard component
│   ├── components/
│   │   ├── common/            # Reusable components
│   │   └── layouts/           # Layout components
│   ├── pages/
│   │   ├── auth/              # Login, forgot password, etc.
│   │   ├── admin/             # Admin pages
│   │   └── employee/          # Employee pages
│   ├── services/              # API service modules
│   │   ├── mockData.ts        # Mock data
│   │   ├── authService.ts
│   │   ├── employeeService.ts
│   │   ├── attendanceService.ts
│   │   ├── leaveService.ts
│   │   └── settingsService.ts
│   └── styles/
│       └── globals.css        # Global styles
```

## Features Implemented

### ✅ Core Features
- **Authentication System**
  - Login/Logout
  - Forgot Password
  - Change Password
  - Role-based access control (Admin, HR, Manager, Employee)

- **Admin Dashboard**
  - Statistics overview
  - Recent anomalies
  - Quick actions

- **Employee Management** (COMPLETE)
  - List employees with filters
  - Create new employee
  - View employee details (with tabs)
  - Edit employee information
  - Delete employee

- **Routing & Navigation**
  - Protected routes
  - Role-based redirects
  - Admin sidebar navigation
  - Employee top navigation

- **Reusable Components**
  - StatCard, LoadingSpinner, FormField, Badge, Modal, Pagination

### 🚧 Stub Pages (To Be Implemented)
The following pages show "under construction" message and need implementation:

**Admin:**
- Attendance Management
- Leave Management
- Shift Management
- Reports
- Settings

**Employee:**
- Dashboard
- Profile
- Attendance History
- Mark Attendance
- Leave Requests

## Implementation Guide

### Adding a New Page

1. **Create the page component:**
```typescript
// src/pages/admin/MyNewPage.tsx
import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../components/common';
import { myService } from '../../services';

export const MyNewPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await myService.getAll();
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
      <h1>My New Page</h1>
      {/* Your content */}
    </div>
  );
};
```

2. **Add route in `/src/routes/index.tsx`:**
```typescript
import { MyNewPage } from '../pages/admin/MyNewPage';

// Inside the admin routes:
<Route path="my-page" element={<MyNewPage />} />
```

### Implementing Attendance Calendar

For attendance pages, you'll want to create a calendar component:

```typescript
// src/components/common/AttendanceCalendar.tsx
import React from 'react';

interface CalendarDay {
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave' | 'holiday';
}

export const AttendanceCalendar: React.FC<{ days: CalendarDay[] }> = ({ days }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      present: 'bg-success',
      absent: 'bg-danger',
      late: 'bg-warning',
      leave: 'bg-info',
      holiday: 'bg-secondary'
    };
    return colors[status] || 'bg-light';
  };

  return (
    <div className="calendar-grid">
      {days.map(day => (
        <div key={day.date} className={`calendar-day ${getStatusColor(day.status)}`}>
          {new Date(day.date).getDate()}
        </div>
      ))}
    </div>
  );
};
```

### Connecting to Backend API

When your Express backend is ready:

1. **Install Axios:**
```bash
npm install axios
```

2. **Create API client:**
```typescript
// src/config/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

3. **Update services:**
```typescript
// src/services/employeeService.ts
import api from '../config/api';

export const employeeService = {
  getAll: async (filters) => {
    const { data } = await api.get('/employees', { params: filters });
    return data;
  },
  
  create: async (employeeData) => {
    const { data } = await api.post('/employees', employeeData);
    return data;
  },
  
  // ... other methods
};
```

4. **Add environment variables:**
Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## Component Patterns

### Page with Table
```typescript
<div>
  <h1>Title</h1>
  
  {/* Filters */}
  <div className="card mb-4">
    <div className="card-body">
      <input type="text" placeholder="Search..." />
      <select>{/* filters */}</select>
    </div>
  </div>

  {/* Table */}
  <div className="card">
    <table className="table">
      <thead>...</thead>
      <tbody>...</tbody>
    </table>
    <Pagination {...paginationProps} />
  </div>
</div>
```

### Page with Form
```typescript
<form onSubmit={handleSubmit}>
  <div className="card">
    <div className="card-header">
      <h5>Section Title</h5>
    </div>
    <div className="card-body">
      <FormField label="Name" name="name" value={data.name} onChange={handleChange} required />
      <FormField label="Email" type="email" name="email" value={data.email} onChange={handleChange} />
    </div>
  </div>
  
  <button type="submit" className="btn btn-primary">Save</button>
</form>
```

## Customization

### Change Theme Colors
Edit `/src/styles/globals.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

### Add New Route
1. Create page component
2. Add to `/src/routes/index.tsx`
3. Add navigation link in layout component

### Add New Service
1. Create service file in `/src/services/`
2. Export from `/src/services/index.ts`
3. Use in components

## Building for Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

The build will be in the `dist` folder.

## Common Issues

### Port Already in Use
Change port in `vite.config.ts`:
```typescript
server: {
  port: 3001
}
```

### Bootstrap JavaScript Not Working
Make sure you have:
```typescript
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```
in your `App.tsx`

### Routes Not Working
Ensure `BrowserRouter` wraps your app in `App.tsx`

## Next Steps

1. **Implement remaining pages** following the patterns in completed pages
2. **Add form validation** using react-hook-form
3. **Add charts** for reports using recharts
4. **Add notifications** using react-toastify
5. **Connect to backend** API
6. **Add tests** using Jest and React Testing Library
7. **Add error boundaries**
8. **Optimize performance** with React.memo, useMemo, useCallback

## Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Bootstrap Documentation](https://getbootstrap.com)
- [Lucide Icons](https://lucide.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Support

For issues or questions:
1. Check the README-MERN-Frontend.md for detailed documentation
2. Review existing implemented pages for patterns
3. Follow the established code structure

---

Happy Coding! 🚀
