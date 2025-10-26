# Quick Start Guide
## Online Course Registration System

---

## 🚀 Quick Setup (5 Minutes)

Follow these steps to get the system running quickly:

### Prerequisites Check

✅ Node.js installed (check: `node --version`)  
✅ MySQL installed (check: `mysql --version`)  
✅ npm installed (check: `npm --version`)

---

## Step-by-Step Installation

### 1. Install Dependencies (1 minute)

Open PowerShell in the project directory:

```powershell
npm install
```

Wait for all packages to install...

---

### 2. Setup Database (2 minutes)

**Option A: Using MySQL Workbench (Recommended)**

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click **File → Open SQL Script**
4. Navigate to `database/schema.sql` and open it
5. Click the **Execute** (⚡) button
6. Repeat for `database/sample_data.sql`

**Option B: Using Command Line**

```powershell
# Login to MySQL
mysql -u root -p

# Enter your MySQL password when prompted

# Inside MySQL, run:
source database/schema.sql
source database/sample_data.sql

# Or use this one-liner:
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql
```

**Verify Database Creation:**
```sql
USE course_registration_db;
SHOW TABLES;
-- You should see 9 tables listed
```

---

### 3. Configure Environment (1 minute)

1. Copy `.env.example` to `.env`:
   ```powershell
   copy .env.example .env
   ```

2. Open `.env` in a text editor and update:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
   DB_NAME=course_registration_db
   DB_PORT=3306
   PORT=3000
   SESSION_SECRET=change_this_to_random_string
   ```

3. **Important:** Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password

---

### 4. Start the Server (30 seconds)

```powershell
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Server running on http://localhost:3000
📚 Online Course Registration System
📝 Environment: development
```

---

### 5. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

---

## 🎮 Test the System

### Login as Student

1. Click **Student** tab
2. Use credentials:
   - Email: `alice.anderson@student.edu`
   - Password: `student123`
3. Explore:
   - Browse available courses
   - Enroll in a course
   - View your enrollments
   - Check your profile

### Login as Admin

1. Logout from student account
2. Click **Admin** tab
3. Use credentials:
   - Email: `admin@university.edu`
   - Password: `admin123`
4. Explore:
   - View dashboard statistics
   - Manage students
   - Add courses
   - Create course offerings
   - View reports

---

## 🔧 Troubleshooting

### Problem: Can't connect to database

**Error Message:** "Access denied for user 'root'@'localhost'"

**Solution:**
1. Check MySQL is running (Windows Services or Task Manager)
2. Verify password in `.env` file is correct
3. Try connecting with MySQL Workbench first

---

### Problem: Port 3000 already in use

**Error Message:** "Port 3000 is already in use"

**Solution 1:** Change port in `.env` file
```env
PORT=3001
```

**Solution 2:** Kill process using port 3000
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

### Problem: Database doesn't exist

**Error Message:** "Unknown database 'course_registration_db'"

**Solution:** Run the schema.sql file again
```powershell
mysql -u root -p < database/schema.sql
```

---

### Problem: Module not found

**Error Message:** "Cannot find module 'express'"

**Solution:** Install dependencies again
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

---

## 📱 Testing Features

### Test Student Enrollment Flow

1. Login as student
2. Go to "Browse Courses"
3. Search for "CS101"
4. Click "View Details" on a course
5. Click "Enroll Now"
6. Check "My Enrollments" tab
7. Try dropping the course

### Test Admin Operations

1. Login as admin
2. Go to "Students" tab
3. View all students
4. Go to "Courses" tab
5. Click "Add Course"
6. Fill in course details
7. Go to "Reports" tab
8. View "Popular Courses" report

---

## 📊 Sample Data Overview

The system comes pre-loaded with:

- **8 Departments**: CS, Math, English, Physics, Chemistry, Biology, Economics, History
- **20 Courses**: From CS101 to ECON102
- **8 Instructors**: Faculty across different departments
- **10 Students**: With various enrollments
- **4 Semesters**: Including current Fall 2025-2026
- **20 Course Offerings**: For current semester
- **30+ Enrollments**: Sample student registrations
- **2 Admin Accounts**: For testing

---

## 🔐 Default Credentials

### Students (Password: `student123`)
- `alice.anderson@student.edu` - CS Senior, 3.75 GPA
- `bob.baker@student.edu` - CS Senior, 3.50 GPA
- `carol.chen@student.edu` - CS Junior, 3.85 GPA
- `david.davis@student.edu` - Math Junior, 3.60 GPA
- `emma.evans@student.edu` - English Junior, 3.90 GPA
- `frank.foster@student.edu` - CS Freshman
- `grace.green@student.edu` - CS Freshman
- `henry.harris@student.edu` - Math Freshman
- `iris.irving@student.edu` - Physics Freshman
- `jack.jackson@student.edu` - Economics Freshman

### Admins (Password: `admin123`)
- `admin@university.edu` - Super Admin
- `staff1@university.edu` - Admin

---

## 📝 Common Tasks

### Add a New Student (Admin)

1. Login as admin
2. Students tab → View list
3. Note: Currently add via SQL:
   ```sql
   INSERT INTO students (student_number, first_name, last_name, email, password_hash, department_id, enrollment_year, status)
   VALUES ('STU2025006', 'John', 'Doe', 'john.doe@student.edu', 
           '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', 
           1, 2025, 'ACTIVE');
   ```

### Add a New Course (Admin)

1. Login as admin
2. Courses tab → "Add Course" button
3. Fill in:
   - Course Code: CS303
   - Course Name: Web Technologies
   - Credits: 3
   - Department: Computer Science
   - Description: Modern web development
4. Click "Add Course"

### Create Course Offering (Admin)

1. Login as admin
2. Course Offerings tab → "Add Offering"
3. Select:
   - Course: CS101
   - Semester: Fall 2025-2026
   - Instructor: John Smith
   - Section: C
   - Capacity: 30
   - Schedule: Tue/Thu 14:00-15:30
   - Classroom: Tech-105
4. Click "Add Offering"

### Enroll in Course (Student)

1. Login as student
2. Browse Courses tab
3. Find desired course
4. Click "View Details"
5. Click "Enroll Now"
6. Confirm enrollment
7. Check "My Enrollments" tab

### Generate Report (Admin)

1. Login as admin
2. Reports tab
3. Click any report button:
   - Enrollment Statistics
   - Popular Courses
   - Department Stats
   - Instructor Workload
   - etc.
4. View results in table format

---

## 🎯 Testing Checklist

Use this checklist to verify everything works:

### Student Features
- [ ] Student login successful
- [ ] View available courses
- [ ] Search courses by keyword
- [ ] Filter courses by department
- [ ] View course details
- [ ] Enroll in a course
- [ ] View current enrollments
- [ ] Drop a course
- [ ] View academic summary (GPA, credits)
- [ ] View profile information
- [ ] Logout

### Admin Features
- [ ] Admin login successful
- [ ] View dashboard statistics
- [ ] View all students
- [ ] View all courses
- [ ] Add new course
- [ ] View course offerings
- [ ] Create new offering
- [ ] View instructors
- [ ] Add new instructor
- [ ] View semesters
- [ ] Generate enrollment report
- [ ] Generate popular courses report
- [ ] Generate department statistics
- [ ] Logout

### System Validation
- [ ] Prevents duplicate enrollments
- [ ] Checks course capacity before enrollment
- [ ] Validates prerequisites
- [ ] Detects schedule conflicts
- [ ] Updates enrollment counts automatically
- [ ] Closes courses when full
- [ ] Reopens courses when seats available

---

## 🔄 Resetting the Database

If you want to start fresh:

```powershell
# Method 1: Re-run setup scripts
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql

# Method 2: Drop and recreate
mysql -u root -p
```

```sql
DROP DATABASE IF EXISTS course_registration_db;
SOURCE database/schema.sql;
SOURCE database/sample_data.sql;
```

---

## 📞 Getting Help

If you encounter issues:

1. **Check Logs**: Look at terminal output for error messages
2. **Verify Database**: Ensure MySQL is running and database exists
3. **Check Credentials**: Verify `.env` file has correct settings
4. **Port Conflicts**: Try different port if 3000 is busy
5. **Reinstall**: Delete `node_modules` and run `npm install` again

---

## ✅ Success Indicators

You know everything is working when:

1. ✅ Server starts without errors
2. ✅ Database connection message appears
3. ✅ Login page loads at localhost:3000
4. ✅ Can login as both student and admin
5. ✅ Can browse and enroll in courses
6. ✅ Admin can view reports
7. ✅ No console errors in browser

---

## 🎉 You're Ready!

Your Online Course Registration System is now fully operational!

**Next Steps:**
- Explore all features
- Test different scenarios
- Review the code structure
- Check out the database documentation
- Customize for your needs

**Happy Learning! 📚**

---

## 📚 Additional Resources

- [README.md](../README.md) - Complete documentation
- [DATABASE_DESIGN.md](DATABASE_DESIGN.md) - ER diagram and schema details
- [NORMALIZATION.md](NORMALIZATION.md) - Database normalization explanation
- Sample SQL queries in `database/sample_queries.sql`

---

Need more help? Check the main README or review the inline code comments!
