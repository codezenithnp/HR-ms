# CodeZenith HRMS - API Documentation

## Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://your-domain.com/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

**Access:** Private (Admin only, or first user bootstrap)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login
**POST** `/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "admin@codezenith.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Admin User",
  "email": "admin@codezenith.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Google OAuth Login
**POST** `/auth/google`

**Request Body:**
```json
{
  "token": "google-oauth-token",
  "isAdminRequest": false
}
```

---

### Get Current User
**GET** `/auth/me`

**Access:** Private

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee"
}
```

---

### Change Password
**PUT** `/auth/password`

**Access:** Private

**Request Body:**
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

---

### Forgot Password
**POST** `/auth/forgotpassword`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

---

### Reset Password
**PUT** `/auth/resetpassword/:resettoken`

**Access:** Public

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

---

## Employee Endpoints

### Get All Employees
**GET** `/employees?search=&department=&role=&status=&page=1&limit=10`

**Access:** Private (Admin/HR/Manager)

**Response:** `200 OK`
```json
{
  "employees": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "employeeId": "EMP001",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "department": "Engineering",
      "position": "Software Engineer",
      "role": "employee",
      "status": "active",
      "joinDate": "2024-01-15T00:00:00.000Z",
      "address": "123 Main St",
      "dob": "1990-01-01T00:00:00.000Z",
      "shift": "507f1f77bcf86cd799439012"
    }
  ],
  "page": 1,
  "pages": 1,
  "total": 1
}
```

---

### Get Employee By ID
**GET** `/employees/:id`

**Access:** Private (Admin/HR/Manager)

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "employeeId": "EMP001",
  "fullName": "John Doe",
  ...
}
```

---

### Create Employee
**POST** `/employees`

**Access:** Private (Admin/HR)

**Request Body:**
```json
{
  "employeeId": "EMP001",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "department": "Engineering",
  "position": "Software Engineer",
  "role": "employee",
  "status": "active",
  "joinDate": "2024-01-15",
  "address": "123 Main St",
  "dob": "1990-01-01"
}
```

**Response:** `201 Created`

---

### Update Employee
**PUT** `/employees/:id`

**Access:** Private (Admin/HR)

**Request Body:** (Same as Create, all fields optional)

**Response:** `200 OK`

---

### Delete Employee
**DELETE** `/employees/:id`

**Access:** Private (Admin only)

**Response:** `200 OK`
```json
{
  "message": "Employee removed"
}
```

---

### Get My Profile
**GET** `/employees/profile/me`

**Access:** Private

**Response:** `200 OK` (Same structure as Get Employee)

---

### Update My Profile
**PUT** `/employees/profile/me`

**Access:** Private

**Request Body:**
```json
{
  "phone": "+1234567890",
  "address": "456 New Street"
}
```

**Response:** `200 OK`

---

## Attendance Endpoints

### Check In
**POST** `/attendance/check-in`

**Access:** Private

**Request Body:**
```json
{
  "employeeId": "optional-for-admin",
  "notes": "optional notes"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "employee": "507f1f77bcf86cd799439012",
  "date": "2024-01-18T00:00:00.000Z",
  "checkIn": "2024-01-18T09:00:00.000Z",
  "checkOut": null,
  "status": "present",
  "notes": ""
}
```

---

### Check Out
**POST** `/attendance/check-out`

**Access:** Private

**Request Body:**
```json
{
  "employeeId": "optional-for-admin",
  "notes": "optional notes"
}
```

**Response:** `200 OK`

---

### Get All Attendance
**GET** `/attendance?employeeId=&startDate=&endDate=`

**Access:** Private (Admin/HR/Manager)

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "employee": {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "John Doe",
      "employeeId": "EMP001",
      "department": "Engineering"
    },
    "date": "2024-01-18T00:00:00.000Z",
    "checkIn": "2024-01-18T09:00:00.000Z",
    "checkOut": "2024-01-18T17:00:00.000Z",
    "status": "present"
  }
]
```

---

### Get My Attendance
**GET** `/attendance/me`

**Access:** Private

**Response:** `200 OK` (Array of attendance records)

---

### Get Today's Attendance
**GET** `/attendance/today`

**Access:** Private

**Response:** `200 OK` (Single attendance record or null)

---

### Get Today's Stats
**GET** `/attendance/today-stats`

**Access:** Private (Admin/HR/Manager)

**Response:** `200 OK`
```json
{
  "totalEmployees": 50,
  "present": 45,
  "late": 3,
  "leave": 2,
  "absent": 0
}
```

---

### Update Attendance (Admin Correction)
**PUT** `/attendance/:id`

**Access:** Private (Admin/HR)

**Request Body:**
```json
{
  "checkIn": "2024-01-18T09:00:00.000Z",
  "checkOut": "2024-01-18T17:00:00.000Z",
  "status": "present",
  "notes": "Manual correction by admin"
}
```

**Response:** `200 OK`

---

## Leave Endpoints

### Request Leave
**POST** `/leaves`

**Access:** Private

**Request Body:**
```json
{
  "leaveType": "Sick Leave",
  "fromDate": "2024-01-20",
  "toDate": "2024-01-22",
  "days": 3,
  "reason": "Medical appointment"
}
```

**Response:** `201 Created`

---

### Get All Leave Requests
**GET** `/leaves?employeeId=&status=&leaveType=`

**Access:** Private (Admin/HR/Manager)

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "employee": {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "John Doe",
      "employeeId": "EMP001",
      "department": "Engineering"
    },
    "leaveType": "Sick Leave",
    "fromDate": "2024-01-20T00:00:00.000Z",
    "toDate": "2024-01-22T00:00:00.000Z",
    "days": 3,
    "reason": "Medical appointment",
    "status": "pending",
    "appliedDate": "2024-01-18T00:00:00.000Z"
  }
]
```

---

### Get My Leave Requests
**GET** `/leaves/me`

**Access:** Private

**Response:** `200 OK` (Array of leave requests)

---

### Update Leave Status
**PUT** `/leaves/:id`

**Access:** Private (Admin/HR/Manager)

**Request Body:**
```json
{
  "status": "approved",
  "remarks": "Approved for sick leave"
}
```

**Response:** `200 OK`

---

### Cancel Leave Request
**DELETE** `/leaves/:id`

**Access:** Private (Only employee who requested)

**Response:** `200 OK`
```json
{
  "message": "Leave request cancelled"
}
```

---

### Get Leave Balance
**GET** `/leaves/balance/:employeeId`

**Access:** Private

**Response:** `200 OK`
```json
[
  {
    "leaveType": "Annual Leave",
    "total": 20,
    "used": 5,
    "remaining": 15,
    "color": "#4CAF50"
  }
]
```

---

### Get Leave Types
**GET** `/leaves/types`

**Access:** Private

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Annual Leave",
    "daysAllowed": 20,
    "carryForward": true,
    "description": "Annual vacation leave",
    "color": "#4CAF50"
  }
]
```

---

### Create Leave Type
**POST** `/leaves/types`

**Access:** Private (Admin/HR)

**Request Body:**
```json
{
  "name": "Annual Leave",
  "daysAllowed": 20,
  "carryForward": true,
  "description": "Annual vacation leave",
  "color": "#4CAF50"
}
```

**Response:** `201 Created`

---

### Update Leave Type
**PUT** `/leaves/types/:id`

**Access:** Private (Admin/HR)

**Request Body:** (Same as Create, all fields optional)

**Response:** `200 OK`

---

### Delete Leave Type
**DELETE** `/leaves/types/:id`

**Access:** Private (Admin)

**Response:** `200 OK`
```json
{
  "message": "Leave type deleted"
}
```

---

## Settings Endpoints

### Shifts

#### Get All Shifts
**GET** `/settings/shifts`

**Access:** Private

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Morning Shift",
    "startTime": "09:00",
    "endTime": "17:00",
    "gracePeriod": 15,
    "workingHours": 8,
    "description": "Standard morning shift"
  }
]
```

---

#### Create Shift
**POST** `/settings/shifts`

**Access:** Private (Admin/HR)

**Request Body:**
```json
{
  "name": "Morning Shift",
  "startTime": "09:00",
  "endTime": "17:00",
  "gracePeriod": 15,
  "workingHours": 8,
  "description": "Standard morning shift"
}
```

**Response:** `201 Created`

---

#### Update Shift
**PUT** `/settings/shifts/:id`

**Access:** Private (Admin/HR)

**Response:** `200 OK`

---

#### Delete Shift
**DELETE** `/settings/shifts/:id`

**Access:** Private (Admin/HR)

**Response:** `200 OK`

---

### Holidays

#### Get All Holidays
**GET** `/settings/holidays`

**Access:** Private

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "New Year's Day",
    "date": "2024-01-01T00:00:00.000Z",
    "type": "public",
    "description": "Public holiday"
  }
]
```

---

#### Create Holiday
**POST** `/settings/holidays`

**Access:** Private (Admin/HR)

**Request Body:**
```json
{
  "name": "New Year's Day",
  "date": "2024-01-01",
  "type": "public",
  "description": "Public holiday"
}
```

**Response:** `201 Created`

---

#### Update Holiday
**PUT** `/settings/holidays/:id`

**Access:** Private (Admin/HR)

**Response:** `200 OK`

---

#### Delete Holiday
**DELETE** `/settings/holidays/:id`

**Access:** Private (Admin/HR)

**Response:** `200 OK`

---

### Departments

#### Get All Departments
**GET** `/settings/departments`

**Access:** Private

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Engineering",
    "head": {
      "fullName": "Jane Smith",
      "employeeId": "EMP002"
    },
    "employeeCount": 25
  }
]
```

---

#### Create Department
**POST** `/settings/departments`

**Access:** Private (Admin/HR)

**Request Body:**
```json
{
  "name": "Engineering",
  "head": "507f1f77bcf86cd799439012",
  "employeeCount": 0
}
```

**Response:** `201 Created`

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, token failed"
}
```

### 403 Forbidden
```json
{
  "message": "You cannot approve/reject your own leave request"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error"
}
```

---

## Rate Limiting

No rate limiting implemented yet. Consider adding in production.

---

## Audit Logging

The following actions are automatically logged in the AuditLog collection:
- Employee deletion
- Leave approval/rejection  
- Attendance corrections
- Settings changes

Audit log structure:
```json
{
  "user": "507f1f77bcf86cd799439011",
  "action": "DELETE",
  "entity": "Employee",
  "entityId": "507f1f77bcf86cd799439012",
  "details": { ... },
  "ipAddress": "192.168.1.1",
  "createdAt": "2024-01-18T10:00:00.000Z"
}
```
