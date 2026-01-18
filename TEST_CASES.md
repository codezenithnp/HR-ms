# CodeZenith HRMS - Manual Test Cases

## Test Environment Setup
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- Database seeded with sample data

---

## 1. Authentication Tests

### TC-AUTH-001: Successful Login (Admin)
**Steps:**
1. Navigate to login page
2. Enter email: `admin@codezenith.com`
3. Enter password: `password123`
4. Click "Login"

**Expected Result:**
- Redirected to Admin Dashboard
- User info displayed in header

---

### TC-AUTH-002: Failed Login (Invalid Credentials)
**Steps:**
1. Navigate to login page
2. Enter email: `invalid@example.com`
3. Enter password: `wrongpass`
4. Click "Login"

**Expected Result:**
- Error message displayed: "Invalid credentials"
- Remains on login page

---

### TC-AUTH-003: Forgot Password
**Steps:**
1. Click "Forgot Password" on login page
2. Enter valid email
3. Click "Send Reset Link"

**Expected Result:**
- Success message displayed
- Reset email sent (check console/email)

---

### TC-AUTH-004: Change Password
**Steps:**
1. Login as any user
2. Navigate to Change Password
3. Enter current password
4. Enter new password (twice)
5. Submit

**Expected Result:**
- Password changed successfully
- Can login with new password

---

### TC-AUTH-005: Logout
**Steps:**
1. Login as any user
2. Click logout button

**Expected Result:**
- Redirected to login page
- Token removed from localStorage
- Cannot access protected routes

---

## 2. Employee Management Tests (Admin/HR)

### TC-EMP-001: View Employee List
**Steps:**
1. Login as admin/HR
2. Navigate to Employees page

**Expected Result:**
- Employee list displayed with pagination
- Shows employee ID, name, department, role, status

---

### TC-EMP-002: Search Employees
**Steps:**
1. On Employees page
2. Enter search term in search box
3. Press Enter or click Search

**Expected Result:**
- Filtered results displayed
- Only matching employees shown

---

### TC-EMP-003: Filter by Department
**Steps:**
1. On Employees page
2. Select department from dropdown
3. Click Apply Filter

**Expected Result:**
- Only employees from selected department displayed

---

### TC-EMP-004: Create New Employee
**Steps:**
1. Click "Add Employee" button
2. Fill all required fields:
   - Employee ID: EMP999
   - Full Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - Department: Engineering
   - Position: Developer
   - Role: employee
   - Status: active
   - Join Date: 2024-01-18
   - Date of Birth: 1990-01-01
   - Address: 123 Test St
3. Submit form

**Expected Result:**
- Success message displayed
- New employee appears in list
- Invitation email sent

---

### TC-EMP-005: Edit Employee
**Steps:**
1. Click on employee name to view details
2. Click "Edit" button
3. Modify phone number
4. Save changes

**Expected Result:**
- Employee updated successfully
- Changes reflected in list and detail view

---

### TC-EMP-006: Delete Employee (Admin Only)
**Steps:**
1. Login as admin
2. View employee detail
3. Click "Delete" button
4. Confirm deletion

**Expected Result:**
- Employee removed from list
- Audit log created

---

### TC-EMP-007: View Employee Detail Tabs
**Steps:**
1. Click on employee to view details
2. Click through tabs: Profile, Attendance, Leaves

**Expected Result:**
- Each tab displays relevant data
- Data loads correctly

---

## 3. Attendance Tests

### TC-ATT-001: Employee Check-In (First Time Today)
**Steps:**
1. Login as employee
2. Navigate to Mark Attendance
3. Click "Check In" button

**Expected Result:**
- Success message: "Successfully checked in!"
- Check-in time recorded
- Status shows "Present" or "Late" based on shift time

---

### TC-ATT-002: Cannot Check-In Twice
**Steps:**
1. Check in successfully
2. Try to check in again

**Expected Result:**
- Error: "Already checked in for today"
- Check-out button enabled

---

### TC-ATT-003: Employee Check-Out
**Steps:**
1. After checking in
2. Click "Check Out" button

**Expected Result:**
- Success message
- Check-out time recorded
- Hours worked calculated

---

### TC-ATT-004: Cannot Check-Out Before Check-In
**Steps:**
1. Navigate to Mark Attendance (no check-in yet)
2. Try to click Check Out

**Expected Result:**
- Check-out button disabled
- Message: "Please check in first"

---

### TC-ATT-005: View Attendance History
**Steps:**
1. Login as employee
2. Navigate to Attendance History
3. Select month from dropdown

**Expected Result:**
- Attendance records for selected month displayed
- Shows date, check-in, check-out, hours, status

---

### TC-ATT-006: Admin View All Attendance
**Steps:**
1. Login as admin
2. Navigate to Admin > Attendance
3. Select today's date

**Expected Result:**
- All employee attendance for today displayed
- Can filter by department/status

---

### TC-ATT-007: Admin View Employee Attendance
**Steps:**
1. From attendance list
2. Click on employee name
3. View monthly attendance

**Expected Result:**
- Employee's full month attendance displayed
- Shows daily records with status

---

### TC-ATT-008: Admin Correct Attendance
**Steps:**
1. View employee attendance detail
2. Click "Edit" on a record
3. Modify check-in time
4. Enter reason for correction
5. Save

**Expected Result:**
- Attendance updated
- Audit log created with reason

---

### TC-ATT-009: Today's Stats Dashboard
**Steps:**
1. Login as admin
2. View dashboard

**Expected Result:**
- Shows: Total employees, Present, Late, On Leave, Absent
- Numbers are accurate

---

## 4. Leave Management Tests

### TC-LEV-001: Request Leave
**Steps:**
1. Login as employee
2. Navigate to Request Leave
3. Select leave type
4. Select from date: 2024-02-01
5. Select to date: 2024-02-03
6. Enter reason
7. Submit

**Expected Result:**
- Leave request created
- Status: Pending
- Days calculated: 3

---

### TC-LEV-002: Cannot Request Overlapping Dates
**Steps:**
1. Create leave request for Feb 1-3
2. Try to create another for Feb 2-5

**Expected Result:**
- Error: "You already have a leave request for overlapping dates"
- Second request not created

---

### TC-LEV-003: View My Leaves
**Steps:**
1. Navigate to My Leaves

**Expected Result:**
- All leave requests displayed
- Shows status, dates, type, days

---

### TC-LEV-004: Cancel Pending Leave
**Steps:**
1. View my leaves
2. Find pending leave
3. Click "Cancel"
4. Confirm

**Expected Result:**
- Leave request deleted
- No longer appears in list

---

### TC-LEV-005: Cannot Cancel Approved Leave
**Steps:**
1. Try to cancel approved leave

**Expected Result:**
- Cancel button disabled or error shown

---

### TC-LEV-006: Admin View All Leaves
**Steps:**
1. Login as admin/manager
2. Navigate to Leave Management
3. View Pending tab

**Expected Result:**
- All pending leaves displayed
- Shows employee, dates, type, reason

---

### TC-LEV-007: Approve Leave Request
**Steps:**
1. View pending leave
2. Click "Approve" button
3. Add comment (optional)
4. Confirm

**Expected Result:**
- Leave status changed to "Approved"
- Moved to Approved tab
- Audit log created
- Employee notified (if email enabled)

---

### TC-LEV-008: Reject Leave Request
**Steps:**
1. View pending leave
2. Click "Reject" button
3. Add reason
4. Confirm

**Expected Result:**
- Leave status changed to "Rejected"
- Moved to Rejected tab
- Audit log created

---

### TC-LEV-009: Cannot Approve Own Leave
**Steps:**
1. Login as manager
2. Request leave as employee
3. Try to approve own leave as manager

**Expected Result:**
- Error: "You cannot approve/reject your own leave request"
- Status remains pending

---

### TC-LEV-010: View Leave Balance
**Steps:**
1. Login as employee
2. View dashboard or leave page

**Expected Result:**
- Leave balance displayed for each type
- Shows: Total, Used, Remaining

---

## 5. Leave Types Management (Admin/HR)

### TC-LT-001: View Leave Types
**Steps:**
1. Login as admin/HR
2. Navigate to Settings > Leave Types

**Expected Result:**
- All leave types displayed
- Shows name, days allowed, carry forward status

---

### TC-LT-002: Create Leave Type
**Steps:**
1. Click "Add Leave Type"
2. Fill form:
   - Name: Personal Leave
   - Days Allowed: 5
   - Carry Forward: No
   - Description: Personal reasons
   - Color: #FF5722
3. Submit

**Expected Result:**
- Leave type created
- Appears in list

---

### TC-LT-003: Edit Leave Type
**Steps:**
1. Click edit on leave type
2. Change days allowed
3. Save

**Expected Result:**
- Leave type updated

---

### TC-LT-004: Cannot Delete Leave Type in Use
**Steps:**
1. Try to delete leave type that has requests

**Expected Result:**
- Error: "Cannot delete leave type that is in use"

---

## 6. Shift Management (Admin/HR)

### TC-SHF-001: View Shifts
**Steps:**
1. Navigate to Settings > Shifts

**Expected Result:**
- All shifts displayed
- Shows name, times, grace period

---

### TC-SHF-002: Create Shift
**Steps:**
1. Click "Add Shift"
2. Fill form:
   - Name: Evening Shift
   - Start Time: 14:00
   - End Time: 22:00
   - Grace Period: 15 min
   - Working Hours: 8
3. Submit

**Expected Result:**
- Shift created

---

### TC-SHF-003: Edit/Delete Shift
**Steps:**
1. Edit shift details
2. Delete shift

**Expected Result:**
- Operations successful

---

## 7. Holiday Management (Admin/HR)

### TC-HOL-001: View Holidays
**Steps:**
1. Navigate to Settings > Holidays

**Expected Result:**
- All holidays displayed in chronological order

---

### TC-HOL-002: Create Holiday
**Steps:**
1. Click "Add Holiday"
2. Fill form:
   - Name: Independence Day
   - Date: 2024-07-04
   - Type: Public
3. Submit

**Expected Result:**
- Holiday created
- Appears in employee dashboard

---

## 8. Reports (Admin/HR)

### TC-REP-001: Generate Attendance Report
**Steps:**
1. Navigate to Reports > Attendance
2. Select date range
3. Select department (optional)
4. Click "Generate"

**Expected Result:**
- Report displayed with:
  - Total present, late, absent
  - Average hours
  - Employee-wise breakdown

---

### TC-REP-002: Export Attendance CSV
**Steps:**
1. Generate report
2. Click "Export CSV"

**Expected Result:**
- CSV file downloaded
- Contains all report data

---

### TC-REP-003: Generate Leave Report
**Steps:**
1. Navigate to Reports > Leave
2. Select date range
3. Click "Generate"

**Expected Result:**
- Leave report displayed
- Shows all leaves in period

---

## 9. Employee Portal Tests

### TC-EP-001: Employee Dashboard
**Steps:**
1. Login as employee
2. View dashboard

**Expected Result:**
- Shows today's status
- Leave balance
- Upcoming holidays
- Recent attendance

---

### TC-EP-002: View/Edit Profile
**Steps:**
1. Navigate to Profile
2. Click Edit
3. Change phone/address
4. Save

**Expected Result:**
- Profile updated
- Limited fields editable

---

## 10. Role-Based Access Control

### TC-RBAC-001: Employee Cannot Access Admin Pages
**Steps:**
1. Login as employee
2. Try to access `/admin/employees` URL directly

**Expected Result:**
- Redirected to unauthorized page or dashboard

---

### TC-RBAC-002: Manager Has Limited Admin Access
**Steps:**
1. Login as manager
2. Try to delete employee

**Expected Result:**
- Delete button not visible or disabled

---

### TC-RBAC-003: Only Admin Can Delete
**Steps:**
1. Login as HR
2. Try to delete employee

**Expected Result:**
- Not authorized

---

## Test Summary Template

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-AUTH-001 | ✅ Pass | |
| TC-AUTH-002 | ✅ Pass | |
| TC-EMP-001 | ✅ Pass | |
| ... | | |

---

## Bug Report Template

**Bug ID:** BUG-001  
**Title:** [Brief description]  
**Severity:** Critical / High / Medium / Low  
**Steps to Reproduce:**
1. Step 1
2. Step 2

**Expected Result:** [What should happen]  
**Actual Result:** [What actually happened]  
**Screenshots:** [If applicable]  
**Environment:** Browser, OS, Backend version

---

## Notes

- Test in order listed for best results
- Run seed script before testing
- Clear browser cache if experiencing issues
- Check browser console for errors
- Check backend logs for API errors
