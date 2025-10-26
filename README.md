# 📚 Online Course Registration System

A comprehensive Database Management System (DBMS) project for managing course enrollment in educational institutions. Built with Node.js, Express, MySQL, and vanilla JavaScript.

## 🎯 Project Overview

This project automates and streamlines the course registration process by providing a structured database solution that maintains accurate records of students, courses, instructors, and enrollments. The system ensures data integrity through proper relationships and SQL operations.

## ✨ Features

### Student Features
- ✅ **Student Registration & Login** - Secure authentication system
- 📖 **Browse Courses** - View available courses with detailed information
- 🔍 **Search & Filter** - Find courses by keyword, department, credits, or schedule
- 📝 **Course Enrollment** - Enroll in available courses with validation
- ❌ **Drop Courses** - Withdraw from enrolled courses
- 📊 **Academic Dashboard** - View current enrollments, GPA, and credits
- 👤 **Profile Management** - View and update personal information
- ⚠️ **Prerequisite Checking** - Automatic validation of course prerequisites
- 🚫 **Conflict Detection** - Prevent enrollment in time-conflicting courses
- 📈 **Academic Summary** - Track completed courses and progress

### Admin Features
- 👥 **Student Management** - Add, view, update, and delete students
- 📚 **Course Management** - Manage course catalog and details
- 🏫 **Course Offerings** - Create and manage course sections per semester
- 👨‍🏫 **Instructor Management** - Manage faculty information
- 📅 **Semester Management** - Configure academic terms and registration periods
- 📊 **Comprehensive Reports**:
  - Enrollment statistics by semester
  - Popular courses analysis
  - Department-wise statistics
  - Instructor workload analysis
  - Capacity utilization reports
  - Student enrollment load
  - Revenue projections
- 📈 **Dashboard Analytics** - Real-time statistics and insights

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0+
- **Authentication**: Session-based with bcrypt password hashing
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API Architecture**: RESTful API

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v14.0 or higher) - [Download](https://nodejs.org/)
- **MySQL Server** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **npm** (comes with Node.js)
- A text editor or IDE (VS Code recommended)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd onlineregistration
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mysql2
- bcryptjs
- express-session
- dotenv
- body-parser
- cors

### Step 3: Database Setup

1. **Start MySQL Server**
   - Windows: Open MySQL Workbench or start via Services
   - Mac: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

2. **Create Database**
   
   Open MySQL command line or Workbench and run:

   ```bash
   mysql -u root -p
   ```

   Then execute the schema file:

   ```sql
   source database/schema.sql
   ```

   Or run it directly:

   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. **Insert Sample Data**

   ```sql
   source database/sample_data.sql
   ```

   Or:

   ```bash
   mysql -u root -p < database/sample_data.sql
   ```

### Step 4: Configure Environment Variables

1. Copy the example environment file:

   ```bash
   copy .env.example .env
   ```

   On Mac/Linux:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your MySQL credentials:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=course_registration_db
   DB_PORT=3306

   # Server Configuration
   PORT=3000
   SESSION_SECRET=your_secret_key_here_change_this

   # Admin Default Credentials
   ADMIN_EMAIL=admin@university.edu
   ADMIN_PASSWORD=admin123
   ```

### Step 5: Start the Server

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 🎮 Usage

### Accessing the Application

1. Open your browser and go to: `http://localhost:3000`

### Demo Credentials

#### Student Login
- **Email**: `alice.anderson@student.edu`
- **Password**: `student123`

Other student accounts (all use password `student123`):
- `bob.baker@student.edu`
- `carol.chen@student.edu`
- `david.davis@student.edu`
- `emma.evans@student.edu`

#### Admin Login
- **Email**: `admin@university.edu`
- **Password**: `admin123`

### Student Workflow

1. **Login** - Use student credentials to access the system
2. **Browse Courses** - View available courses for the current semester
3. **Search & Filter** - Find courses by department or keywords
4. **View Details** - Click on courses to see detailed information
5. **Enroll** - Click "Enroll Now" to register for courses
6. **My Enrollments** - View and manage your current enrollments
7. **Drop Course** - Drop courses if needed before deadlines
8. **Profile** - View your academic information and statistics

### Admin Workflow

1. **Login** - Use admin credentials
2. **Dashboard** - View overall system statistics
3. **Manage Students** - Add, view, or remove students
4. **Manage Courses** - Add new courses to the catalog
5. **Create Offerings** - Set up course sections for semesters
6. **Assign Instructors** - Assign faculty to course sections
7. **Manage Semesters** - Configure academic terms
8. **View Reports** - Access various analytics and reports

## 📁 Project Structure

```
onlineregistration/
├── config/
│   └── database.js          # Database connection configuration
├── database/
│   ├── schema.sql           # Database schema and table definitions
│   ├── sample_data.sql      # Sample data for testing
│   └── sample_queries.sql   # Useful SQL queries for reports
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── student.js           # Student-specific routes
│   ├── admin.js             # Admin management routes
│   ├── course.js            # Course browsing routes
│   ├── enrollment.js        # Enrollment operations
│   └── report.js            # Report generation routes
├── public/
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   ├── js/
│   │   └── admin.js         # Admin dashboard JavaScript
│   ├── index.html           # Login page
│   ├── student-dashboard.html  # Student interface
│   └── admin-dashboard.html    # Admin interface
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Example environment configuration
├── .gitignore               # Git ignore file
├── package.json             # Node.js dependencies
├── docs/
│   ├── DATABASE_DESIGN.md   # Complete database design documentation
│   ├── NORMALIZATION.md     # Database normalization analysis
│   ├── QUICK_START.md       # Quick setup guide
│   └── PROJECT_SUMMARY.md   # Project overview and summary
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Example environment configuration
├── .gitignore               # Git ignore file
├── package.json             # Node.js dependencies
├── server.js                # Main Express server
├── ER_DIAGRAM.md            # Entity-Relationship diagram (Mermaid & detailed)
├── ER_DIAGRAM_ASCII.txt     # ASCII art version of ER diagram
├── REGISTRATION_GUIDE.md    # Student registration feature guide
└── README.md                # This file
```

## 📚 Documentation

This project includes comprehensive documentation:

- **[ER_DIAGRAM.md](ER_DIAGRAM.md)** - Complete Entity-Relationship diagram with:
  - Visual Mermaid diagram
  - Detailed entity descriptions
  - Relationship cardinality
  - Functional dependencies
  - Constraints and triggers

- **[ER_DIAGRAM_ASCII.txt](ER_DIAGRAM_ASCII.txt)** - ASCII art version of the ER diagram for easy viewing in any text editor

- **[DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md)** - Full database design documentation including schema, entities, and relationships

- **[NORMALIZATION.md](docs/NORMALIZATION.md)** - Detailed normalization analysis proving 3NF compliance

- **[QUICK_START.md](docs/QUICK_START.md)** - Fast-track setup guide for quick deployment

- **[PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)** - Executive summary with features, metrics, and learning outcomes

- **[REGISTRATION_GUIDE.md](REGISTRATION_GUIDE.md)** - Complete guide for the student registration feature

## 🗄️ Database Schema

### Main Tables

1. **students** - Student information and credentials
2. **courses** - Course catalog with details
3. **instructors** - Faculty information
4. **departments** - Academic departments
5. **semesters** - Academic term definitions
6. **course_offerings** - Course sections per semester
7. **enrollments** - Student course registrations
8. **admins** - Administrator accounts
9. **waitlist** - Course waitlist management

### Key Relationships

- Students belong to Departments
- Courses belong to Departments
- Courses can have Prerequisites (self-referencing)
- Course Offerings link Courses, Semesters, and Instructors
- Enrollments link Students and Course Offerings
- Instructors belong to Departments

### Database Features

- ✅ Foreign Key Constraints
- ✅ Triggers for enrollment count management
- ✅ Views for common queries
- ✅ Indexes for performance
- ✅ Check constraints for data validation

## 🔐 Security Features

- Password hashing using bcrypt
- Session-based authentication
- Role-based access control (Student/Admin)
- SQL injection prevention via parameterized queries
- CORS protection
- Environment variable protection

## 📊 Sample Queries

The project includes comprehensive SQL queries in `database/sample_queries.sql`:

- Enrollment statistics and trends
- Course popularity analysis
- Department performance metrics
- Instructor workload reports
- Capacity utilization
- Student transcripts
- Revenue projections
- Prerequisite compliance checks
- Grade distribution

## 🐛 Troubleshooting

### Database Connection Issues

**Error**: "Access denied for user"
- **Solution**: Check MySQL username and password in `.env` file
- Verify MySQL server is running

**Error**: "Unknown database"
- **Solution**: Run the schema.sql file to create the database

### Port Already in Use

**Error**: "Port 3000 is already in use"
- **Solution**: Change PORT in `.env` file or kill the process using port 3000
- Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
- Mac/Linux: `lsof -ti:3000 | xargs kill`

### Module Not Found

**Error**: "Cannot find module 'express'"
- **Solution**: Run `npm install` again

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/student/login` - Student login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/student/register` - New student registration
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Check current session

### Student Endpoints

- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update profile
- `GET /api/student/enrollments` - Get all enrollments
- `GET /api/student/current-enrollments` - Get current semester enrollments
- `GET /api/student/academic-summary` - Get academic statistics

### Course Endpoints

- `GET /api/courses/available` - Get available courses
- `GET /api/courses/:offeringId` - Get course details
- `GET /api/courses/departments/list` - Get all departments
- `POST /api/courses/search` - Search courses

### Enrollment Endpoints

- `POST /api/enrollment/enroll` - Enroll in a course
- `POST /api/enrollment/drop` - Drop a course
- `POST /api/enrollment/withdraw` - Withdraw from a course
- `GET /api/enrollment/history` - Get enrollment history
- `POST /api/enrollment/check-eligibility` - Check enrollment eligibility

### Admin Endpoints

- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Add new student
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student
- `GET /api/admin/courses` - Get all courses
- `POST /api/admin/courses` - Add new course
- `GET /api/admin/offerings` - Get course offerings
- `POST /api/admin/offerings` - Create course offering
- `GET /api/admin/instructors` - Get instructors
- `POST /api/admin/instructors` - Add instructor
- `GET /api/admin/semesters` - Get semesters
- `POST /api/admin/semesters` - Add semester

### Report Endpoints

- `GET /api/reports/enrollment-stats` - Enrollment statistics
- `GET /api/reports/popular-courses` - Popular courses
- `GET /api/reports/department-stats` - Department statistics
- `GET /api/reports/instructor-workload` - Instructor workload
- `GET /api/reports/capacity-utilization` - Capacity utilization
- `GET /api/reports/student-load` - Student enrollment load

## 🎓 DBMS Concepts Demonstrated

- **Normalization**: Database is in 3NF
- **ER Modeling**: Complete entity-relationship design
- **Relational Schema**: Well-defined relationships
- **Triggers**: Automatic enrollment count updates
- **Views**: Simplified complex queries
- **Stored Procedures**: Could be extended
- **Transactions**: ACID compliance in enrollment
- **Constraints**: Foreign keys, check constraints
- **Indexing**: Performance optimization

## 🔮 Future Enhancements

- [ ] Email notifications for enrollment confirmations
- [ ] Online payment integration
- [ ] Grade submission by instructors
- [ ] Advanced scheduling algorithms
- [ ] Mobile app version
- [ ] Export reports to PDF/Excel
- [ ] Course evaluation system
- [ ] Degree audit functionality
- [ ] Financial aid tracking

## 👥 Contributors

- Your Name - DBMS Mini Project

## 📄 License

This project is created for educational purposes as part of a DBMS course.

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Contact: [your-email@example.com]

## 🙏 Acknowledgments

- Database design principles from DBMS course
- Modern web development practices
- Open-source community

---

**Made with ❤️ for DBMS Mini Project**
