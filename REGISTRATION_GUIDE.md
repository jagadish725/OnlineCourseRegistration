# Student Registration Guide

## ✅ Registration Feature Implemented!

The student registration functionality has been successfully added to the Online Course Registration System.

---

## 🎯 Features Added

1. **Registration Form** with all required fields:
   - Student Number (unique identifier)
   - First Name & Last Name
   - Email (unique, must be valid)
   - Password (minimum 6 characters, bcrypt encrypted)
   - Phone Number (optional)
   - Date of Birth (optional)
   - Gender (optional)
   - Department (required, dropdown loaded from database)
   - Enrollment Year (required)
   - Address (optional, textarea)

2. **Form Validation**:
   - Client-side validation for required fields
   - Email format validation
   - Password minimum length (6 characters)
   - Department selection required
   - Duplicate email/student number detection

3. **User Experience**:
   - Toggle between Login and Registration forms
   - Department dropdown auto-populated from database
   - Success/error messages
   - Auto-redirect to login after successful registration
   - Email pre-filled in login form after registration

4. **Security**:
   - Passwords hashed with bcrypt (10 rounds)
   - Server-side validation
   - SQL injection prevention (parameterized queries)

---

## 📝 How to Use

### Access Registration Form

1. Open http://localhost:3000
2. Make sure you're on the **Student** tab
3. Click the "**Register here**" link below the login form
4. Fill in the registration form
5. Click "**Register**" button

### Registration Steps

**Required Fields (marked with *):**
- Student Number: Use format like `STU2025006`
- First Name: Your first name
- Last Name: Your last name
- Email: Must be unique, use format `name@student.edu`
- Password: Minimum 6 characters
- Department: Select from dropdown
- Enrollment Year: Enter year like `2025`

**Optional Fields:**
- Phone: Format like `555-1234`
- Date of Birth: Pick from calendar
- Gender: Select from dropdown
- Address: Enter full address

### After Registration

1. You'll see a success message: "Registration successful! Please login with your credentials."
2. Form will automatically switch to login
3. Your email will be pre-filled
4. Enter your password and click Login

---

## 🧪 Testing Registration

### Test Case 1: Successful Registration
```
Student Number: STU2025100
First Name: John
Last Name: Smith
Email: john.smith@student.edu
Password: password123
Phone: 555-9999
Date of Birth: 2005-05-15
Gender: Male
Department: Computer Science (select from dropdown)
Enrollment Year: 2025
Address: 123 Test Street, City
```

**Expected Result:** Success message, redirected to login

---

### Test Case 2: Duplicate Email
```
Try registering with: alice.anderson@student.edu
```

**Expected Result:** Error message "Email or student number already registered"

---

### Test Case 3: Duplicate Student Number
```
Try registering with: STU2023001
```

**Expected Result:** Error message "Email or student number already registered"

---

### Test Case 4: Missing Required Fields
```
Leave Department empty
```

**Expected Result:** Validation error "Please select a department"

---

### Test Case 5: Short Password
```
Password: 12345 (only 5 characters)
```

**Expected Result:** Browser validation error "Minimum 6 characters"

---

## 🔧 Technical Implementation

### Backend Route
- **Endpoint:** `POST /api/auth/student/register`
- **Location:** `routes/auth.js`
- **Features:**
  - Email/Student Number uniqueness check
  - Bcrypt password hashing
  - SQL parameterized queries
  - Auto-set status to 'ACTIVE'
  - Returns student ID on success

### Frontend Files Modified
- **HTML:** `public/index.html`
  - Added registration form
  - Added form toggle functions
  - Added department loading
  - Added registration submit handler

- **CSS:** `public/css/style.css`
  - Added `.form-row` for two-column layout
  - Added scrollable form container
  - Made responsive for mobile

### Database Integration
- Uses existing `students` table from schema
- Department dropdown fetched from `departments` table
- Password stored as `password_hash` with bcrypt

---

## 🚀 API Endpoint Details

### Register Student

**Request:**
```javascript
POST /api/auth/student/register
Content-Type: application/json

{
  "studentNumber": "STU2025100",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@student.edu",
  "password": "password123",
  "phone": "555-9999",
  "dateOfBirth": "2005-05-15",
  "gender": "Male",
  "address": "123 Test Street",
  "departmentId": 1,
  "enrollmentYear": 2025
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "studentId": 11
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email or student number already registered"
}
```

---

## ✅ Validation Rules

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| studentNumber | string | Yes | Must be unique |
| firstName | string | Yes | - |
| lastName | string | Yes | - |
| email | string | Yes | Must be valid email format, unique |
| password | string | Yes | Minimum 6 characters |
| phone | string | No | - |
| dateOfBirth | date | No | Valid date |
| gender | enum | No | Male, Female, Other |
| address | text | No | - |
| departmentId | integer | Yes | Must exist in departments table |
| enrollmentYear | integer | Yes | Year between 2020-2030 |

---

## 🎨 UI/UX Features

1. **Form Toggle:**
   - Smooth transition between login and registration
   - "Register here" link on login form
   - "Login here" link on registration form

2. **Department Loading:**
   - Departments auto-loaded when form is shown
   - Dropdown populated with all departments
   - Handles loading errors gracefully

3. **Success Flow:**
   - Shows success alert for 2 seconds
   - Auto-switches to login form
   - Pre-fills email in login form
   - User just needs to enter password

4. **Error Handling:**
   - Clear error messages
   - Duplicate detection
   - Network error handling
   - Form validation

5. **Responsive Design:**
   - Two-column layout on desktop
   - Single column on mobile
   - Scrollable form container
   - Touch-friendly inputs

---

## 📱 Mobile Support

The registration form is fully responsive:
- Two-column fields (First/Last Name, DOB/Gender) stack on mobile
- Form is scrollable on small screens
- Touch-friendly input fields
- Optimized for phone screens

---

## 🔐 Security Features

1. **Password Security:**
   - Bcrypt hashing with 10 rounds
   - Never stored in plain text
   - Secure comparison during login

2. **SQL Injection Prevention:**
   - Parameterized queries
   - mysql2 prepared statements
   - Input sanitization

3. **Validation:**
   - Client-side validation
   - Server-side validation
   - Database constraints

4. **Duplicate Prevention:**
   - Email uniqueness check
   - Student number uniqueness check
   - Before insertion validation

---

## 🐛 Troubleshooting

### Issue: "Department dropdown is empty"
**Solution:** Make sure the server is running and database has departments

### Issue: "Registration failed" error
**Solution:** Check console for details, verify all required fields are filled

### Issue: "Email already registered"
**Solution:** Use a different email address that hasn't been registered

### Issue: Form validation not working
**Solution:** Make sure JavaScript is enabled in your browser

---

## 📊 Sample Registration Data

Use these for testing (make sure they don't already exist):

```
Student Number: STU2025100
Email: test.student@student.edu
Password: student123

Student Number: STU2025101
Email: jane.doe@student.edu
Password: password123

Student Number: STU2025102
Email: mark.jones@student.edu
Password: mypassword
```

---

## 🎓 After Registration

Once registered successfully, students can:

1. ✅ Login with their credentials
2. ✅ Browse available courses
3. ✅ Enroll in courses
4. ✅ View their schedule
5. ✅ Track academic progress
6. ✅ Update their profile
7. ✅ View enrollment history

---

## 🚀 Quick Test

1. Start the server: `npm start`
2. Open: http://localhost:3000
3. Click "Register here"
4. Fill the form with test data
5. Click "Register"
6. Login with the same credentials
7. You should see the student dashboard!

---

**Registration feature is now fully functional!** 🎉

Students can now self-register and immediately start using the system without admin intervention.
