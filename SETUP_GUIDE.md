# CodeZenith HRMS - Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/codezenith-hrms.git
cd codezenith-hrms
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 3. Configure Environment Variables

Create `backend/.env` file with the following:

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/codezenith-hrms
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/codezenith-hrms?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
FROM_EMAIL=noreply@codezenith.com
FROM_NAME=CodeZenith HRMS

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin Bootstrap (Set to 'true' for first-time setup only)
ALLOW_ADMIN_BOOTSTRAP=true
```

### 4. Seed Database (Optional but Recommended)

```bash
npm run seed
```

This will create:
- Default admin user (admin@codezenith.com / password123)
- Sample employees
- Leave types
- Shifts
- Holidays
- Departments

### 5. Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

---

### 6. Frontend Setup

```bash
cd frontend/code-zenith

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 7. Configure Frontend Environment

Create `frontend/code-zenith/.env` file:

```env
VITE_API_URL=http://localhost:5000
```

### 8. Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 🔐 Default Login Credentials

After running the seed script, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@codezenith.com | password123 |
| HR | hr@codezenith.com | password123 |
| Manager | manager@codezenith.com | password123 |
| Employee | john.doe@codezenith.com | password123 |

**⚠️ IMPORTANT:** Change these passwords immediately in production!

---

## 🏗️ Project Structure

```
codezenith-hrms/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Route controllers
│   │   ├── auth.controller.js
│   │   ├── employee.controller.js
│   │   ├── attendance.controller.js
│   │   ├── leave.controller.js
│   │   └── settings.controller.js
│   ├── middleware/               # Express middleware
│   │   ├── auth.js               # JWT verification
│   │   ├── error.js              # Error handling
│   │   └── roles.js              # Role-based access
│   ├── models/                   # Mongoose models
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Attendance.js
│   │   ├── LeaveRequest.js
│   │   ├── LeaveType.js
│   │   ├── Shift.js
│   │   ├── Holiday.js
│   │   ├── Department.js
│   │   ├── Setting.js
│   │   └── AuditLog.js
│   ├── routes/                   # API routes
│   ├── scripts/
│   │   └── seed.js               # Database seeding
│   ├── utils/
│   │   ├── sendEmail.js          # Email utility
│   │   └── auditLog.js           # Audit logging
│   ├── server.js                 # Entry point
│   ├── package.json
│   └── .env
│
├── frontend/code-zenith/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Reusable UI components
│   │   │   └── layouts/          # Layout components
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Auth state management
│   │   ├── pages/
│   │   │   ├── auth/             # Login, forgot password
│   │   │   ├── admin/            # Admin dashboard & pages
│   │   │   └── employee/         # Employee portal pages
│   │   ├── routes/               # React Router config
│   │   ├── services/             # API service layer
│   │   │   ├── apiClient.ts
│   │   │   ├── authService.ts
│   │   │   ├── employeeService.ts
│   │   │   ├── attendanceService.ts
│   │   │   ├── leaveService.ts
│   │   │   └── settingsService.ts
│   │   └── main.tsx
│   ├── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
│
└── render.yaml                   # Render deployment config
```

---

## 🌐 Deployment to Render

### 1. Prepare for Deployment

#### Backend
- Ensure `render.yaml` is properly configured
- Set `NODE_ENV=production` in Render dashboard

#### Frontend
- Build command: `npm install && npm run build`
- Publish directory: `dist`

### 2. Environment Variables in Render

Go to your Render dashboard and add these environment variables:

**Backend Service:**
```
NODE_ENV=production
PORT=10000
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRE=30d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@codezenith.com
FROM_NAME=CodeZenith HRMS
FRONTEND_URL=https://your-frontend-url.onrender.com
ALLOW_ADMIN_BOOTSTRAP=false
```

**Frontend Service:**
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 3. Deploy

```bash
# Push to GitHub
git add .
git commit -m "Deploy to Render"
git push origin master

# Render will automatically deploy when you push
```

### 4. Run Seed Script (First Time Only)

After backend is deployed, run the seed script once:

```bash
# SSH into Render or use Render shell
npm run seed
```

---

## 📝 API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

**Base URL:** `http://localhost:5000/api` (development)

Key endpoint groups:
- `/api/auth` - Authentication
- `/api/employees` - Employee management
- `/api/attendance` - Attendance tracking
- `/api/leaves` - Leave management
- `/api/settings` - Shifts, holidays, departments

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Forgot password flow
- [ ] Change password while logged in
- [ ] Logout

#### Employee Management (Admin/HR)
- [ ] View employee list with pagination
- [ ] Search employees by name/ID
- [ ] Filter by department/role/status
- [ ] Create new employee
- [ ] Edit employee details
- [ ] Delete employee
- [ ] View employee profile

#### Attendance
**Employee:**
- [ ] Check in at start of day
- [ ] Cannot check in twice
- [ ] Check out at end of day
- [ ] Cannot check out before check in
- [ ] View attendance history

**Admin:**
- [ ] View all attendance records
- [ ] Filter by date/department
- [ ] View today's stats
- [ ] Correct attendance record
- [ ] View employee-specific attendance

#### Leave Management
**Employee:**
- [ ] Request new leave
- [ ] Cannot request overlapping dates
- [ ] View leave history
- [ ] Cancel pending leave
- [ ] View leave balance

**Admin/Manager:**
- [ ] View all leave requests
- [ ] Filter by status (pending/approved/rejected)
- [ ] Approve leave request
- [ ] Reject leave request
- [ ] Cannot approve own leave
- [ ] View leave balance for employees

#### Settings (Admin/HR)
- [ ] Create/Edit/Delete shifts
- [ ] Create/Edit/Delete holidays
- [ ] Create/Edit/Delete departments
- [ ] Create/Edit/Delete leave types

#### Reports (Admin/HR)
- [ ] Generate attendance report
- [ ] Export attendance to CSV
- [ ] Generate leave report
- [ ] Export leave to CSV
- [ ] Filter reports by date range/department

#### Role-Based Access Control
- [ ] Employee cannot access admin pages
- [ ] Manager can access admin but limited functions
- [ ] HR can manage employees but not delete
- [ ] Only Admin can delete employees
- [ ] Only Admin can access sensitive settings

---

## 🔒 Security Best Practices

### Production Checklist

1. **Environment Variables**
   - [ ] Change all default passwords
   - [ ] Use strong JWT_SECRET (min 32 characters)
   - [ ] Set ALLOW_ADMIN_BOOTSTRAP=false after first user
   - [ ] Use app-specific passwords for SMTP
   - [ ] Never commit .env files

2. **MongoDB**
   - [ ] Use MongoDB Atlas with IP whitelist
   - [ ] Enable authentication
   - [ ] Use strong database password
   - [ ] Regular backups

3. **HTTPS**
   - [ ] Enable HTTPS in production
   - [ ] Use Render's automatic SSL

4. **Rate Limiting**
   - Consider adding express-rate-limit for auth endpoints

5. **Input Validation**
   - Basic validation exists
   - Consider adding express-validator for stricter validation

6. **CORS**
   - Update CORS settings to allow only your frontend domain in production

---

## 🐛 Troubleshooting

### Backend Issues

**Cannot connect to MongoDB**
- Check MONGO_URI is correct
- Ensure MongoDB is running (local) or accessible (Atlas)
- Check IP whitelist in Atlas

**JWT errors**
- Verify JWT_SECRET is set
- Check token hasn't expired (default 30 days)

**Email not sending**
- Verify SMTP credentials
- Use app-specific password for Gmail
- Check SMTP_HOST and SMTP_PORT

### Frontend Issues

**API calls failing**
- Check VITE_API_URL is correct
- Verify backend is running
- Check browser console for CORS errors
- Verify JWT token in localStorage

**Build errors**
- Delete node_modules and package-lock.json
- Run `npm install` again
- Check Node.js version (18+)

---

## 📊 Database Schema

### Key Collections

**users** - Authentication
- email, password (hashed), role, tokens

**employees** - Employee records
- employeeId, fullName, email, phone, department, position, role, status, joinDate, dob, address, shift

**attendance** - Daily attendance
- employee, date, checkIn, checkOut, status, notes

**leaverequests** - Leave applications
- employee, leaveType, fromDate, toDate, days, reason, status, approvedBy

**leavetypes** - Leave categories
- name, daysAllowed, carryForward, description, color

**shifts** - Work shifts
- name, startTime, endTime, gracePeriod, workingHours

**holidays** - Holiday calendar
- name, date, type, description

**departments** - Organizational units
- name, head, employeeCount

**auditlogs** - Action tracking
- user, action, entity, entityId, details, ipAddress

---

## 🎯 Features Implemented

### ✅ Complete
- Authentication (JWT, Google OAuth)
- Role-based access control
- Employee CRUD operations
- Attendance check-in/check-out
- Attendance history and reports
- Leave request and approval workflow
- Leave types management
- Shift management
- Holiday calendar
- Department management
- Employee dashboard
- Admin dashboard with stats
- Audit logging for sensitive operations
- Email notifications
- Profile management

### 🚧 Future Enhancements
- Payroll integration
- Performance reviews
- Document management
- Mobile app
- Biometric integration
- Advanced analytics
- Notification system
- Chat/messaging

---

## 📞 Support

For issues or questions:
- Check documentation
- Review error logs
- Contact: support@codezenith.com

---

## 📄 License

Proprietary - CodeZenith © 2026
