# Database Design Documentation
## Online Course Registration System

---

## Entity-Relationship (ER) Diagram Description

### Entities and Attributes

#### 1. STUDENT
**Attributes:**
- student_id (PK) - Primary identifier
- student_number (UNIQUE) - Official student ID
- first_name - Student's first name
- last_name - Student's last name
- email (UNIQUE) - Student email address
- password_hash - Encrypted password
- phone - Contact number
- date_of_birth - Birth date
- gender - Gender (Male/Female/Other)
- address - Residential address
- department_id (FK) - References DEPARTMENT
- enrollment_year - Year of admission
- current_semester - Current academic semester
- gpa - Grade Point Average
- status - Student status (ACTIVE/INACTIVE/GRADUATED/SUSPENDED)
- created_at - Account creation timestamp

**Primary Key:** student_id  
**Foreign Keys:** department_id → departments(department_id)

---

#### 2. COURSE
**Attributes:**
- course_id (PK) - Primary identifier
- course_code (UNIQUE) - Official course code (e.g., CS101)
- course_name - Full course name
- description - Course description
- credits - Credit hours
- department_id (FK) - References DEPARTMENT
- prerequisite_course_id (FK) - References COURSE (self-referencing)
- created_at - Record creation timestamp

**Primary Key:** course_id  
**Foreign Keys:** 
- department_id → departments(department_id)
- prerequisite_course_id → courses(course_id)

---

#### 3. INSTRUCTOR
**Attributes:**
- instructor_id (PK) - Primary identifier
- first_name - Instructor's first name
- last_name - Instructor's last name
- email (UNIQUE) - Instructor email
- phone - Contact number
- department_id (FK) - References DEPARTMENT
- hire_date - Date of joining
- office_location - Office room number
- created_at - Record creation timestamp

**Primary Key:** instructor_id  
**Foreign Keys:** department_id → departments(department_id)

---

#### 4. DEPARTMENT
**Attributes:**
- department_id (PK) - Primary identifier
- department_code (UNIQUE) - Short code (e.g., CS, MATH)
- department_name - Full department name
- building - Building location
- phone - Department contact number
- created_at - Record creation timestamp

**Primary Key:** department_id

---

#### 5. SEMESTER
**Attributes:**
- semester_id (PK) - Primary identifier
- semester_name - Term name (Fall/Spring/Summer/Winter)
- academic_year - Academic year (e.g., 2025-2026)
- start_date - Semester start date
- end_date - Semester end date
- registration_start - Registration period start
- registration_end - Registration period end
- is_current - Boolean flag for active semester
- created_at - Record creation timestamp

**Primary Key:** semester_id  
**Unique Constraint:** (semester_name, academic_year)

---

#### 6. COURSE_OFFERING
**Attributes:**
- offering_id (PK) - Primary identifier
- course_id (FK) - References COURSE
- semester_id (FK) - References SEMESTER
- instructor_id (FK) - References INSTRUCTOR
- section_number - Section identifier (A, B, C, etc.)
- max_capacity - Maximum enrollment capacity
- enrolled_count - Current enrollment count
- schedule_days - Class days (e.g., Mon/Wed/Fri)
- schedule_time - Class time (e.g., 09:00-10:30)
- classroom - Room location
- status - Offering status (OPEN/CLOSED/CANCELLED)
- created_at - Record creation timestamp

**Primary Key:** offering_id  
**Foreign Keys:**
- course_id → courses(course_id)
- semester_id → semesters(semester_id)
- instructor_id → instructors(instructor_id)  
**Unique Constraint:** (course_id, semester_id, section_number)

---

#### 7. ENROLLMENT
**Attributes:**
- enrollment_id (PK) - Primary identifier
- student_id (FK) - References STUDENT
- offering_id (FK) - References COURSE_OFFERING
- enrollment_date - Date of enrollment
- status - Enrollment status (ENROLLED/DROPPED/COMPLETED/WITHDRAWN)
- grade - Final grade (A, B, C, D, F)
- grade_points - Numerical grade value
- attendance_percentage - Attendance record

**Primary Key:** enrollment_id  
**Foreign Keys:**
- student_id → students(student_id)
- offering_id → course_offerings(offering_id)  
**Unique Constraint:** (student_id, offering_id)

---

#### 8. ADMIN
**Attributes:**
- admin_id (PK) - Primary identifier
- username (UNIQUE) - Admin username
- email (UNIQUE) - Admin email
- password_hash - Encrypted password
- full_name - Administrator full name
- role - Role level (SUPER_ADMIN/ADMIN/STAFF)
- created_at - Account creation timestamp

**Primary Key:** admin_id

---

#### 9. WAITLIST
**Attributes:**
- waitlist_id (PK) - Primary identifier
- student_id (FK) - References STUDENT
- offering_id (FK) - References COURSE_OFFERING
- position - Queue position
- added_date - Date added to waitlist
- status - Waitlist status (WAITING/ENROLLED/EXPIRED)

**Primary Key:** waitlist_id  
**Foreign Keys:**
- student_id → students(student_id)
- offering_id → course_offerings(offering_id)  
**Unique Constraint:** (student_id, offering_id)

---

## Relationships

### 1. DEPARTMENT ↔ STUDENT (One-to-Many)
- One department can have many students
- Each student belongs to one department
- **Relationship Type:** Identifying
- **Cardinality:** 1:N

### 2. DEPARTMENT ↔ COURSE (One-to-Many)
- One department offers many courses
- Each course belongs to one department
- **Relationship Type:** Identifying
- **Cardinality:** 1:N

### 3. DEPARTMENT ↔ INSTRUCTOR (One-to-Many)
- One department employs many instructors
- Each instructor belongs to one department
- **Relationship Type:** Non-identifying
- **Cardinality:** 1:N

### 4. COURSE ↔ COURSE (Recursive - Prerequisite)
- One course can be a prerequisite for many other courses
- Each course can have zero or one prerequisite
- **Relationship Type:** Self-referencing
- **Cardinality:** 1:N (optional)

### 5. SEMESTER ↔ COURSE_OFFERING (One-to-Many)
- One semester has many course offerings
- Each course offering belongs to one semester
- **Relationship Type:** Identifying
- **Cardinality:** 1:N

### 6. COURSE ↔ COURSE_OFFERING (One-to-Many)
- One course can have many offerings across semesters
- Each offering is for one specific course
- **Relationship Type:** Identifying
- **Cardinality:** 1:N

### 7. INSTRUCTOR ↔ COURSE_OFFERING (One-to-Many)
- One instructor can teach many course offerings
- Each offering is taught by one instructor
- **Relationship Type:** Non-identifying
- **Cardinality:** 1:N

### 8. STUDENT ↔ ENROLLMENT (One-to-Many)
- One student can have many enrollments
- Each enrollment belongs to one student
- **Relationship Type:** Identifying
- **Cardinality:** 1:N

### 9. COURSE_OFFERING ↔ ENROLLMENT (One-to-Many)
- One course offering can have many enrollments
- Each enrollment is for one course offering
- **Relationship Type:** Identifying
- **Cardinality:** 1:N

### 10. STUDENT ↔ WAITLIST (One-to-Many)
- One student can be on waitlist for many courses
- Each waitlist entry belongs to one student
- **Relationship Type:** Identifying
- **Cardinality:** 1:N

### 11. COURSE_OFFERING ↔ WAITLIST (One-to-Many)
- One course offering can have many students on waitlist
- Each waitlist entry is for one course offering
- **Relationship Type:** Identifying
- **Cardinality:** 1:N

---

## ER Diagram (Textual Representation)

```
┌─────────────┐
│ DEPARTMENT  │
│─────────────│
│ PK: dept_id │
│ dept_code   │
│ dept_name   │
└──────┬──────┘
       │
       ├──────────────┬──────────────┬─────────────┐
       │              │              │             │
       ▼              ▼              ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ 
│  STUDENT    │ │   COURSE    │ │ INSTRUCTOR  │ 
│─────────────│ │─────────────│ │─────────────│ 
│ PK: stu_id  │ │ PK: crs_id  │ │ PK: ins_id  │ 
│ FK: dept_id │ │ FK: dept_id │ │ FK: dept_id │ 
│ stu_number  │ │ course_code │ │ email       │ 
│ email       │ │ course_name │ │ name        │ 
│ password    │ │ credits     │ │ office      │ 
│ gpa         │ │ FK: prereq  ├─┐             │ 
└──────┬──────┘ └──────┬──────┘ │ └──────┬────┘
       │               │        │        │
       │               │        └────────┤ (self-ref)
       │               │                 │
       │         ┌─────▼─────────────────▼──────┐
       │         │     COURSE_OFFERING          │
       │         │─────────────────────────────│
       │         │ PK: offering_id              │
       │         │ FK: course_id                │
       │         │ FK: semester_id              │
       │         │ FK: instructor_id            │
       │         │ section_number               │
       │         │ max_capacity                 │
       │         │ enrolled_count               │
       │         │ schedule                     │
       │         └──────┬───────────────────────┘
       │                │
       │         ┌──────▼──────┐
       │         │  SEMESTER   │
       │         │─────────────│
       │         │ PK: sem_id  │
       │         │ sem_name    │
       │         │ acad_year   │
       │         │ start_date  │
       │         │ is_current  │
       │         └─────────────┘
       │                │
       └────────┬───────┘
                │
         ┌──────▼──────────┐
         │   ENROLLMENT    │
         │─────────────────│
         │ PK: enroll_id   │
         │ FK: student_id  │
         │ FK: offering_id │
         │ status          │
         │ grade           │
         │ enroll_date     │
         └─────────────────┘

         ┌─────────────┐
         │  WAITLIST   │
         │─────────────│
         │ PK: wait_id │
         │ FK: stu_id  │
         │ FK: off_id  │
         │ position    │
         └─────────────┘

         ┌─────────────┐
         │   ADMIN     │
         │─────────────│
         │ PK: adm_id  │
         │ username    │
         │ email       │
         │ password    │
         │ role        │
         └─────────────┘
```

---

## Database Constraints

### Primary Key Constraints
- Each table has a single-column auto-incrementing primary key
- Ensures unique identification of each record

### Foreign Key Constraints
- All relationships implemented with foreign keys
- `ON DELETE CASCADE` for dependent entities (enrollments)
- `ON DELETE SET NULL` for optional relationships (instructors, departments)
- Maintains referential integrity

### Unique Constraints
- `students.student_number` - No duplicate student IDs
- `students.email` - No duplicate email addresses
- `courses.course_code` - Unique course codes
- `instructors.email` - No duplicate instructor emails
- `departments.department_code` - Unique department codes
- `(course_id, semester_id, section_number)` - Unique course sections
- `(student_id, offering_id)` - One enrollment per student per offering
- `(semester_name, academic_year)` - Unique semester definitions

### Check Constraints
- `credits > 0` - Courses must have positive credits
- `enrolled_count <= max_capacity` - Enrollment cannot exceed capacity
- `gpa BETWEEN 0.00 AND 4.00` - Valid GPA range
- Enum constraints on status fields

### Not Null Constraints
- Essential fields cannot be null
- Names, emails, codes are mandatory
- Dates and identifiers are required

---

## Database Triggers

### 1. after_enrollment_insert
**Purpose:** Automatically update enrolled_count when a student enrolls  
**Event:** AFTER INSERT on enrollments  
**Action:**
- Increment `enrolled_count` in `course_offerings`
- Update status to 'CLOSED' if capacity is reached

### 2. after_enrollment_update
**Purpose:** Update enrolled_count when enrollment status changes  
**Event:** AFTER UPDATE on enrollments  
**Action:**
- Decrement `enrolled_count` when status changes to DROPPED/WITHDRAWN
- Reopen course if seats become available

### 3. before_enrollment_insert
**Purpose:** Prevent enrollment if course is full  
**Event:** BEFORE INSERT on enrollments  
**Action:**
- Check current enrollment vs capacity
- Raise error if course is full

---

## Database Views

### 1. student_enrollment_summary
**Purpose:** Quick overview of student academic status  
**Columns:**
- student_id, student_number, student_name
- email, department_name
- active_enrollments, completed_courses
- total_credits, gpa

### 2. course_offerings_detail
**Purpose:** Complete course offering information  
**Columns:**
- offering_id, course_code, course_name, credits
- department_name, instructor_name
- semester_name, academic_year
- section_number, schedule, capacity, availability

### 3. enrollment_details
**Purpose:** Comprehensive enrollment records  
**Columns:**
- enrollment_id, student_number, student_name
- course_code, course_name, section_number
- semester, instructor_name
- enrollment_date, status, grade

---

## Indexes

### Performance Optimization Indexes

1. **students:**
   - `idx_student_email` on email
   - `idx_student_number` on student_number

2. **courses:**
   - `idx_course_code` on course_code
   - `idx_course_dept` on department_id

3. **instructors:**
   - `idx_instructor_email` on email
   - `idx_instructor_dept` on department_id

4. **course_offerings:**
   - `idx_offering_semester` on semester_id
   - `idx_offering_course` on course_id

5. **enrollments:**
   - `idx_enrollment_student` on student_id
   - `idx_enrollment_offering` on offering_id
   - `idx_enrollment_status` on status

6. **admins:**
   - `idx_admin_email` on email

7. **waitlist:**
   - `idx_waitlist_offering` on offering_id

---

This design ensures data integrity, performance, and scalability for the course registration system.
