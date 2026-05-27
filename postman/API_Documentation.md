# HRMS API Documentation

**Project:** HR Management System (HRMS)  
**Version:** 1.0.0  
**Base URL:** `http://localhost:5000`  
**Authentication:** Bearer Token (JWT)

---

## Overview

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained via the `POST /api/auth/login` endpoint.

### Roles

| Role | Permissions |
|------|-------------|
| `admin` | Full access to all endpoints |
| `hr` | Employee management, leave approval, settings |
| `manager` | View employees, approve leaves, view attendance |
| `employee` | Own profile, own attendance, own leaves |

### Standard Response Format

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "message": "Error description" }
```

---

## 1. Health Check

### `GET /api/health`

Checks if the server is running.

**Authentication:** Not required

**Response `200 OK`:**
```json
{ "ok": true }
```

---

## 2. Authentication

### `POST /api/auth/login`

Authenticates a user and returns a JWT token.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "admin@codezenith.com",
  "password": "Admin@123"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "name": "Admin User",
  "email": "admin@codezenith.com"
}
```

**Error `401 Unauthorized`:**
```json
{ "success": false, "message": "Invalid credentials" }
```

---

### `POST /api/auth/register`

Registers a new admin user.

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@codezenith.com",
  "password": "Admin@123",
  "role": "admin"
}
```

**Response `201 Created`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "name": "New Admin",
  "email": "newadmin@codezenith.com"
}
```

---

### `GET /api/auth/me`

Returns the currently authenticated user's profile.

**Authentication:** Required

**Response `200 OK`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Admin User",
  "email": "admin@codezenith.com",
  "role": "admin"
}
```

---

### `PUT /api/auth/me`

Updates the authenticated user's name or email.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@codezenith.com"
}
```

**Response `200 OK`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Updated Name",
  "email": "updated@codezenith.com"
}
```

---

### `PUT /api/auth/password`

Changes the authenticated user's password.

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "Admin@123",
  "newPassword": "NewAdmin@456"
}
```

**Response `200 OK`:**
```json
{ "success": true, "message": "Password updated" }
```

**Error `401 Unauthorized`:** Current password incorrect.

---

### `POST /api/auth/forgotpassword`

Sends a password reset email.

**Authentication:** Not required

**Request Body:**
```json
{ "email": "admin@codezenith.com" }
```

**Response `200 OK`:**
```json
{ "success": true, "message": "Password reset email sent" }
```

---

### `PUT /api/auth/resetpassword/:resettoken`

Resets the password using the token from the reset email.

**Authentication:** Not required

**URL Params:** `resettoken` — token from the reset email

**Request Body:**
```json
{ "password": "NewAdmin@123" }
```

**Response `200 OK`:**
```json
{ "success": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

---

### `PUT /api/auth/verifyemail/:token`

Verifies a user's email address.

**Authentication:** Not required

**URL Params:** `token` — token from the verification email

**Response `200 OK`:**
```json
{ "success": true, "message": "Email verified" }
```

---

## 3. Employees

### `GET /api/employees`

Returns a paginated list of all employees.

**Authentication:** Required  
**Roles:** `admin`, `hr`, `manager`

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by name, employeeId, or email |
| `department` | string | Filter by department name |
| `role` | string | Filter by role |
| `status` | string | Filter by `active` / `inactive` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 10) |

**Response `200 OK`:**
```json
{
  "employees": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "employeeId": "CZ-ENG-001",
      "fullName": "Krish Dhakal",
      "email": "krish.dhakal@codezenith.com",
      "department": "Engineering",
      "position": "Software Engineer",
      "role": "employee",
      "status": "active",
      "joinDate": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 10,
  "page": 1,
  "pages": 1
}
```

---

### `POST /api/employees`

Creates a new employee account.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Request Body:**
```json
{
  "employeeId": "CZ-ENG-002",
  "fullName": "Jane Doe",
  "email": "jane.doe@codezenith.com",
  "phone": "9800000001",
  "department": "Engineering",
  "position": "Junior Engineer",
  "role": "employee",
  "joinDate": "2026-01-01",
  "address": "Kathmandu, Nepal",
  "dob": "1998-05-15",
  "status": "active"
}
```

> **Note:** A secure random password is auto-generated and sent to the employee's email.

**Response `201 Created`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
  "employeeId": "CZ-ENG-002",
  "fullName": "Jane Doe",
  "email": "jane.doe@codezenith.com"
}
```

---

### `GET /api/employees/:id`

Returns a single employee by MongoDB `_id` or string `employeeId` (e.g., `CZ-ENG-001`).

**Authentication:** Required  
**Roles:** `admin`, `hr`, `manager`

**Response `200 OK`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "employeeId": "CZ-ENG-001",
  "fullName": "Krish Dhakal",
  "email": "krish.dhakal@codezenith.com",
  "department": "Engineering",
  "position": "Software Engineer",
  "role": "employee",
  "status": "active",
  "phone": "9800000000",
  "address": "Kathmandu",
  "joinDate": "2025-01-01T00:00:00.000Z"
}
```

**Error `404 Not Found`:** Employee not found.

---

### `PUT /api/employees/:id`

Updates an employee's details.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Request Body** (all fields optional):
```json
{
  "fullName": "Krish Dhakal",
  "phone": "9800000001",
  "department": "Engineering",
  "position": "Senior Engineer",
  "role": "employee",
  "status": "active",
  "address": "Lalitpur, Nepal",
  "dob": "1998-05-15"
}
```

**Response `200 OK`:** Updated employee object.

---

### `DELETE /api/employees/:id`

Deletes an employee record.

**Authentication:** Required  
**Roles:** `admin`

**Response `200 OK`:**
```json
{ "success": true, "message": "Employee deleted" }
```

---

### `GET /api/employees/profile/me`

Returns the authenticated employee's own profile.

**Authentication:** Required (any role)

**Response `200 OK`:** Employee profile object.

---

### `PUT /api/employees/profile/me`

Updates the authenticated employee's own profile.

**Authentication:** Required (any role)

**Request Body** (all fields optional):
```json
{
  "phone": "9800000002",
  "address": "Bhaktapur, Nepal"
}
```

**Response `200 OK`:** Updated profile object.

---

## 4. Attendance

### `POST /api/attendance/check-in`

Records an employee's check-in for today.

**Authentication:** Required

**Request Body:**
```json
{}
```

> Admin/HR can provide `employeeId` to check in on behalf of another employee.

**Response `200 OK` / `201 Created`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
  "employee": "64f1a2b3c4d5e6f7a8b9c0d1",
  "date": "2026-05-27T00:00:00.000Z",
  "checkIn": "2026-05-27T09:00:00.000Z",
  "status": "present"
}
```

**Error `400`:** Already checked in today.

---

### `POST /api/attendance/check-out`

Records an employee's check-out for today.

**Authentication:** Required

**Request Body:**
```json
{}
```

**Response `200 OK`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
  "checkIn": "2026-05-27T09:00:00.000Z",
  "checkOut": "2026-05-27T17:00:00.000Z",
  "status": "present"
}
```

---

### `GET /api/attendance`

Returns all attendance records.

**Authentication:** Required  
**Roles:** `admin`, `hr`, `manager`

**Response `200 OK`:** Array of attendance records.

---

### `GET /api/attendance/me`

Returns the authenticated employee's own attendance history.

**Authentication:** Required

**Response `200 OK`:** Array of attendance records.

---

### `GET /api/attendance/today`

Returns today's attendance record for the authenticated employee.

**Authentication:** Required

**Response `200 OK`:** Single attendance object.

---

### `GET /api/attendance/today-stats`

Returns today's summary statistics across all employees.

**Authentication:** Required  
**Roles:** `admin`, `hr`, `manager`

**Response `200 OK`:**
```json
{
  "present": 8,
  "absent": 2,
  "late": 1,
  "onLeave": 1,
  "total": 12
}
```

---

### `PUT /api/attendance/:id`

Updates an attendance record (e.g., correct check-in/check-out time).

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Request Body:**
```json
{
  "checkIn": "2026-05-27T08:45:00.000Z",
  "checkOut": "2026-05-27T17:15:00.000Z",
  "status": "present",
  "notes": "Corrected by admin"
}
```

**Response `200 OK`:** Updated attendance object.

---

## 5. Leaves

### `POST /api/leaves`

Submits a leave request.

**Authentication:** Required

**Request Body:**
```json
{
  "leaveType": "64f1a2b3c4d5e6f7a8b9c0d4",
  "fromDate": "2026-06-10",
  "toDate": "2026-06-10",
  "days": 1,
  "reason": "Personal work"
}
```

**Response `201 Created`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
  "employee": "64f1a2b3c4d5e6f7a8b9c0d1",
  "leaveType": "64f1a2b3c4d5e6f7a8b9c0d4",
  "fromDate": "2026-06-10T00:00:00.000Z",
  "toDate": "2026-06-10T00:00:00.000Z",
  "days": 1,
  "reason": "Personal work",
  "status": "pending"
}
```

---

### `GET /api/leaves`

Returns all leave requests.

**Authentication:** Required  
**Roles:** `admin`, `hr`, `manager`

**Response `200 OK`:** Array of leave request objects.

---

### `GET /api/leaves/me`

Returns the authenticated employee's own leave history.

**Authentication:** Required

**Response `200 OK`:** Array of leave request objects.

---

### `GET /api/leaves/balance/:employeeId`

Returns the leave balance for an employee.

**Authentication:** Required

**URL Params:** `employeeId` — the employee's ID or email

**Response `200 OK`:**
```json
[
  {
    "leaveType": "Annual Leave",
    "allowed": 14,
    "used": 3,
    "remaining": 11
  }
]
```

---

### `PUT /api/leaves/:id`

Updates (approves/rejects) a leave request.

**Authentication:** Required  
**Roles:** `admin`, `hr`, `manager`

**Request Body:**
```json
{
  "status": "approved",
  "remarks": "Approved"
}
```

> `status` can be: `approved`, `rejected`, `pending`

**Response `200 OK`:** Updated leave request object.

---

### `DELETE /api/leaves/:id`

Cancels / deletes a leave request.

**Authentication:** Required

**Response `200 OK`:**
```json
{ "success": true, "message": "Leave cancelled" }
```

---

### `GET /api/leaves/types`

Returns all available leave types.

**Authentication:** Required

**Response `200 OK`:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "name": "Annual Leave",
    "daysAllowed": 14,
    "carryForward": true,
    "description": "Yearly paid leave",
    "color": "#4CAF50"
  }
]
```

---

### `POST /api/leaves/types`

Creates a new leave type.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Request Body:**
```json
{
  "name": "Sick Leave",
  "daysAllowed": 10,
  "carryForward": false,
  "description": "Medical leave",
  "color": "#FF5733"
}
```

**Response `201 Created`:** Created leave type object.

---

### `PUT /api/leaves/types/:id`

Updates a leave type.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Request Body:**
```json
{
  "name": "Sick Leave Updated",
  "daysAllowed": 12
}
```

**Response `200 OK`:** Updated leave type object.

---

### `DELETE /api/leaves/types/:id`

Deletes a leave type.

**Authentication:** Required  
**Roles:** `admin`

**Response `200 OK`:**
```json
{ "success": true, "message": "Leave type deleted" }
```

---

## 6. Settings

### `GET /api/settings/shifts`

Returns all shift configurations.

**Authentication:** Required

**Response `200 OK`:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
    "name": "Morning Shift",
    "startTime": "09:00",
    "endTime": "17:00",
    "workingDays": ["Monday","Tuesday","Wednesday","Thursday","Friday"]
  }
]
```

---

### `POST /api/settings/shifts`

Creates a new shift.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Request Body:**
```json
{
  "name": "Night Shift",
  "startTime": "22:00",
  "endTime": "06:00",
  "workingDays": ["Monday","Tuesday","Wednesday","Thursday","Friday"]
}
```

**Response `201 Created`:** Created shift object.

---

### `PUT /api/settings/shifts/:id`

Updates a shift.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Response `200 OK`:** Updated shift object.

---

### `DELETE /api/settings/shifts/:id`

Deletes a shift.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Response `200 OK`:**
```json
{ "success": true }
```

---

### `GET /api/settings/departments`

Returns all departments.

**Authentication:** Required

**Response `200 OK`:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d7",
    "name": "Engineering",
    "description": "Software development team"
  }
]
```

---

### `POST /api/settings/departments`

Creates a new department.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Request Body:**
```json
{
  "name": "Marketing",
  "description": "Marketing and outreach team"
}
```

**Response `201 Created`:** Created department object.

---

### `PUT /api/settings/departments/:id`

Updates a department.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Response `200 OK`:** Updated department object.

---

### `DELETE /api/settings/departments/:id`

Deletes a department.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Response `200 OK`:**
```json
{ "success": true }
```

---

### `GET /api/settings/holidays`

Returns all public holidays.

**Authentication:** Required

**Response `200 OK`:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d8",
    "name": "New Year",
    "date": "2026-01-01T00:00:00.000Z",
    "description": "New Year's Day"
  }
]
```

---

### `POST /api/settings/holidays`

Creates a new holiday entry.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Request Body:**
```json
{
  "name": "Dashain",
  "date": "2026-10-15",
  "description": "Dashain festival holiday"
}
```

**Response `201 Created`:** Created holiday object.

---

### `PUT /api/settings/holidays/:id`

Updates a holiday.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Response `200 OK`:** Updated holiday object.

---

### `DELETE /api/settings/holidays/:id`

Deletes a holiday.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Response `200 OK`:**
```json
{ "success": true }
```

---

### `GET /api/settings/:key`

Returns an application setting by key (e.g., `company`, `attendance`).

**Authentication:** Required

**Response `200 OK`:**
```json
{
  "key": "company",
  "value": {
    "name": "CodeZenith HR",
    "address": "Kathmandu, Nepal"
  }
}
```

---

### `PUT /api/settings/:key`

Updates an application setting.

**Authentication:** Required  
**Roles:** `admin`, `hr`

**Request Body:**
```json
{
  "value": {
    "name": "CodeZenith HR",
    "address": "Kathmandu, Nepal",
    "phone": "01-4000000"
  }
}
```

**Response `200 OK`:** Updated setting object.

---

## Endpoint Summary

| # | Method | Endpoint | Auth | Roles |
|---|--------|----------|------|-------|
| 1 | GET | `/api/health` | No | — |
| 2 | POST | `/api/auth/login` | No | — |
| 3 | POST | `/api/auth/register` | Yes | admin |
| 4 | GET | `/api/auth/me` | Yes | all |
| 5 | PUT | `/api/auth/me` | Yes | all |
| 6 | PUT | `/api/auth/password` | Yes | all |
| 7 | POST | `/api/auth/forgotpassword` | No | — |
| 8 | PUT | `/api/auth/resetpassword/:token` | No | — |
| 9 | PUT | `/api/auth/verifyemail/:token` | No | — |
| 10 | GET | `/api/employees` | Yes | admin, hr, manager |
| 11 | POST | `/api/employees` | Yes | admin, hr |
| 12 | GET | `/api/employees/profile/me` | Yes | all |
| 13 | PUT | `/api/employees/profile/me` | Yes | all |
| 14 | GET | `/api/employees/:id` | Yes | admin, hr, manager |
| 15 | PUT | `/api/employees/:id` | Yes | admin, hr |
| 16 | DELETE | `/api/employees/:id` | Yes | admin |
| 17 | POST | `/api/attendance/check-in` | Yes | all |
| 18 | POST | `/api/attendance/check-out` | Yes | all |
| 19 | GET | `/api/attendance` | Yes | admin, hr, manager |
| 20 | GET | `/api/attendance/me` | Yes | all |
| 21 | GET | `/api/attendance/today` | Yes | all |
| 22 | GET | `/api/attendance/today-stats` | Yes | admin, hr, manager |
| 23 | PUT | `/api/attendance/:id` | Yes | admin, hr |
| 24 | POST | `/api/leaves` | Yes | all |
| 25 | GET | `/api/leaves` | Yes | admin, hr, manager |
| 26 | GET | `/api/leaves/me` | Yes | all |
| 27 | GET | `/api/leaves/balance/:employeeId` | Yes | all |
| 28 | PUT | `/api/leaves/:id` | Yes | admin, hr, manager |
| 29 | DELETE | `/api/leaves/:id` | Yes | all |
| 30 | GET | `/api/leaves/types` | Yes | all |
| 31 | POST | `/api/leaves/types` | Yes | admin, hr |
| 32 | PUT | `/api/leaves/types/:id` | Yes | admin, hr |
| 33 | DELETE | `/api/leaves/types/:id` | Yes | admin |
| 34 | GET | `/api/settings/shifts` | Yes | all |
| 35 | POST | `/api/settings/shifts` | Yes | admin, hr |
| 36 | PUT | `/api/settings/shifts/:id` | Yes | admin, hr |
| 37 | DELETE | `/api/settings/shifts/:id` | Yes | admin, hr |
| 38 | GET | `/api/settings/departments` | Yes | all |
| 39 | POST | `/api/settings/departments` | Yes | admin, hr |
| 40 | PUT | `/api/settings/departments/:id` | Yes | admin, hr |
| 41 | DELETE | `/api/settings/departments/:id` | Yes | admin, hr |
| 42 | GET | `/api/settings/holidays` | Yes | all |
| 43 | POST | `/api/settings/holidays` | Yes | admin, hr |
| 44 | PUT | `/api/settings/holidays/:id` | Yes | admin, hr |
| 45 | DELETE | `/api/settings/holidays/:id` | Yes | admin, hr |
| 46 | GET | `/api/settings/:key` | Yes | all |
| 47 | PUT | `/api/settings/:key` | Yes | admin, hr |

**Total: 47 endpoints across 6 modules**

---

*Generated for: HR Management System — Final Year Project*  
*Author: Krish Dhakal*
