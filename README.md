# CodeZenith HRMS 🏢

A complete, production-ready MERN stack HR Management System with attendance tracking, leave management, and comprehensive admin controls.

![Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-proprietary-blue)

---

## 🎯 Overview

CodeZenith HRMS is an enterprise-grade Human Resource Management System designed for small to medium organizations (10-50 employees). Built with modern technologies and best practices, it provides comprehensive tools for employee management, attendance tracking, leave management, and administrative controls.

---

## ✨ Key Features

### 👥 Employee Management
- Complete CRUD operations for employee records
- Role-based access (Admin, HR, Manager, Employee)
- Employee profiles with personal and job information
- Department and position management
- Automatic user account creation with email invitations

### ⏰ Attendance Tracking
- Digital check-in/check-out system
- Shift-based attendance with late detection
- Real-time attendance dashboard
- Historical attendance records
- Admin corrections with audit trail
- Monthly attendance reports

### 📅 Leave Management
- Multiple leave types (Annual, Sick, Personal, etc.)
- Leave request and approval workflow
- Overlap detection and prevention
- Leave balance tracking
- Self-approval prevention
- Email notifications

### ⚙️ Settings & Configuration
- Shift management (multiple shifts support)
- Holiday calendar
- Department management
- Leave type customization
- Role-based permissions

### 🔐 Security & Compliance
- JWT-based authentication
- Role-based authorization (RBAC)
- Audit logging for sensitive operations
- Password reset functionality
- Google OAuth integration
- Secure password hashing

### 📊 Dashboard & Reports
- Real-time statistics
- Today's attendance overview
- Leave summary
- Upcoming holidays
- Custom date range reports
- CSV export functionality

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 5.x
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT + bcrypt
- **Email:** Nodemailer
- **OAuth:** Google OAuth 2.0

### Frontend
- **Framework:** React 18.2
- **Language:** TypeScript 5.2
- **Build Tool:** Vite 5.0
- **Styling:** Bootstrap 5.3
- **Icons:** Lucide React
- **Routing:** React Router 6.21
- **State Management:** Context API

### DevOps
- **Deployment:** Render (configured)
- **Version Control:** Git
- **Package Manager:** npm

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/codezenith-hrms.git
cd codezenith-hrms
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed     # Create sample data
npm run dev      # Start development server
```

3. **Setup Frontend**
```bash
cd frontend/code-zenith
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev      # Start development server
```

4. **Access the Application**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

### Default Credentials

After running the seed script:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@codezenith.com | password123 |
| HR | hr@codezenith.com | password123 |
| Manager | manager@codezenith.com | password123 |
| Employee | john.doe@codezenith.com | password123 |

⚠️ **Change these passwords immediately in production!**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Setup Guide](./SETUP_GUIDE.md) | Complete installation and deployment guide |
| [API Documentation](./API_DOCUMENTATION.md) | REST API reference with examples |
| [Test Cases](./TEST_CASES.md) | Manual testing procedures |
| [Project Summary](./PROJECT_COMPLETION_SUMMARY.md) | Development summary and status |

---

## 🏗️ Project Structure

```
codezenith-hrms/
├── backend/                    # Node.js/Express backend
│   ├── config/                 # Configuration files
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Express middleware
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API routes
│   ├── scripts/                # Utility scripts
│   ├── utils/                  # Helper functions
│   └── server.js               # Entry point
│
├── frontend/code-zenith/       # React/TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React Context
│   │   ├── pages/              # Page components
│   │   ├── routes/             # Routing configuration
│   │   ├── services/           # API service layer
│   │   └── main.tsx            # Entry point
│   └── App.tsx
│
└── docs/                       # Documentation
```

---

## 🔑 Key Features in Detail

### Attendance System
- **Check-in/Check-out:** Employees mark attendance daily
- **Late Detection:** Automatic late marking based on shift times
- **Validation:** Prevents double check-ins and invalid check-outs
- **History:** Complete attendance history with filtering
- **Corrections:** Admins can correct attendance with audit trail

### Leave Management
- **Request Flow:** Employee → Manager/HR → Approval/Rejection
- **Validations:** 
  - No overlapping dates
  - Self-approval prevention
  - Balance verification
- **Leave Types:** Configurable types with different quotas
- **Balance Tracking:** Real-time leave balance calculation

### Security Features
- **Authentication:** JWT with refresh token support
- **Authorization:** Role-based access control at route and API level
- **Audit Logging:** Track all sensitive operations
- **Password Security:** Bcrypt hashing with salt rounds
- **Token Management:** Auto-logout on expiration

---

## 🎨 User Roles & Permissions

| Feature | Employee | Manager | HR | Admin |
|---------|----------|---------|-----|-------|
| Mark Attendance | ✅ | ✅ | ✅ | ✅ |
| View Own Data | ✅ | ✅ | ✅ | ✅ |
| Request Leave | ✅ | ✅ | ✅ | ✅ |
| Approve Leaves | ❌ | ✅ | ✅ | ✅ |
| View All Employees | ❌ | ✅ | ✅ | ✅ |
| Add/Edit Employees | ❌ | ❌ | ✅ | ✅ |
| Delete Employees | ❌ | ❌ | ❌ | ✅ |
| Manage Settings | ❌ | ❌ | ✅ | ✅ |
| View Reports | ❌ | ✅ | ✅ | ✅ |

---

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:token` - Reset password

### Employees
- `GET /api/employees` - List employees (with filters)
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/profile/me` - Get own profile
- `PUT /api/employees/profile/me` - Update own profile

### Attendance
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance` - Get all attendance
- `GET /api/attendance/me` - Get my attendance
- `GET /api/attendance/today` - Get today's attendance
- `PUT /api/attendance/:id` - Update attendance (admin)

### Leaves
- `POST /api/leaves` - Request leave
- `GET /api/leaves` - Get all leaves
- `GET /api/leaves/me` - Get my leaves
- `PUT /api/leaves/:id` - Approve/reject leave
- `DELETE /api/leaves/:id` - Cancel leave
- `GET /api/leaves/types` - Get leave types

### Settings
- `GET/POST/PUT/DELETE /api/settings/shifts` - Shift management
- `GET/POST/PUT/DELETE /api/settings/holidays` - Holiday management
- `GET/POST/PUT/DELETE /api/settings/departments` - Department management

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests (when available)
cd backend
npm test

# Frontend tests (when available)
cd frontend/code-zenith
npm test
```

### Manual Testing
Follow the test cases in [TEST_CASES.md](./TEST_CASES.md)

---

## 🌐 Deployment

### Deploy to Render

1. **Configure render.yaml** (already included)

2. **Set Environment Variables** in Render Dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `SMTP_*` (email settings)
   - `FRONTEND_URL`

3. **Deploy:**
```bash
git push origin master
```

Render will automatically deploy both frontend and backend.

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

---

## 📊 Database Models

- **User** - Authentication and authorization
- **Employee** - Employee records
- **Attendance** - Daily attendance tracking
- **LeaveRequest** - Leave applications
- **LeaveType** - Leave categories
- **Shift** - Work shifts
- **Holiday** - Holiday calendar
- **Department** - Organizational units
- **Setting** - System configuration
- **AuditLog** - Action tracking

---

## 🤝 Contributing

This is a proprietary project. For internal contributions:

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request
5. Wait for code review

---

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/codezenith-hrms
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-password
FROM_EMAIL=noreply@codezenith.com
FROM_NAME=CodeZenith HRMS
FRONTEND_URL=http://localhost:3000
ALLOW_ADMIN_BOOTSTRAP=true
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify MongoDB is running
- Check MONGO_URI in .env
- Verify network connectivity

**JWT Token Invalid**
- Token may have expired (default 30 days)
- Clear localStorage and login again

**CORS Errors**
- Ensure VITE_API_URL matches backend URL
- Check CORS settings in backend

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting tips.

---

## 📈 Roadmap

### Phase 1 (Current) ✅
- Employee management
- Attendance tracking
- Leave management
- Basic reporting

### Phase 2 (Planned)
- Advanced reports and analytics
- Bulk import/export
- Email notifications
- Mobile responsiveness improvements

### Phase 3 (Future)
- Payroll integration
- Performance reviews
- Document management
- Mobile app

---

## 📄 License

Proprietary - CodeZenith © 2026. All rights reserved.

---

## 👥 Team

**Developed by:** CodeZenith Development Team  
**Lead Developer:** Claude AI Assistant  
**Year:** 2026

---

## 📞 Support

For support, email: support@codezenith.com  
Documentation: See `docs/` folder  
Issues: Contact your system administrator

---

## 🙏 Acknowledgments

- Bootstrap team for the excellent CSS framework
- Lucide for beautiful icons
- MongoDB team for the robust database
- React team for the amazing frontend library
- Open source community

---

**Made with ❤️ by CodeZenith**
