-- ============================================
-- Online Course Registration System Database
-- DBMS Mini Project
-- ============================================

-- Drop database if exists and create new
DROP DATABASE IF EXISTS course_registration_db;
CREATE DATABASE course_registration_db;
USE course_registration_db;

-- ============================================
-- TABLE: semesters
-- Manages academic semesters/terms
-- ============================================
CREATE TABLE semesters (
    semester_id INT PRIMARY KEY AUTO_INCREMENT,
    semester_name VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE NOT NULL,
    registration_end DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_semester (semester_name, academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLE: departments
-- Stores department information
-- ============================================
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_code VARCHAR(10) UNIQUE NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    building VARCHAR(50),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLE: instructors
-- Stores instructor/faculty information
-- ============================================
CREATE TABLE instructors (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id INT,
    hire_date DATE,
    office_location VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    INDEX idx_instructor_email (email),
    INDEX idx_instructor_dept (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLE: courses
-- Stores course catalog information
-- ============================================
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    description TEXT,
    credits INT NOT NULL CHECK (credits > 0),
    department_id INT,
    prerequisite_course_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    FOREIGN KEY (prerequisite_course_id) REFERENCES courses(course_id) ON DELETE SET NULL,
    INDEX idx_course_code (course_code),
    INDEX idx_course_dept (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLE: course_offerings
-- Manages course sections offered each semester
-- ============================================
CREATE TABLE course_offerings (
    offering_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    semester_id INT NOT NULL,
    instructor_id INT,
    section_number VARCHAR(10) NOT NULL,
    max_capacity INT NOT NULL DEFAULT 30,
    enrolled_count INT DEFAULT 0,
    schedule_days VARCHAR(20),
    schedule_time VARCHAR(50),
    classroom VARCHAR(50),
    status ENUM('OPEN', 'CLOSED', 'CANCELLED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id) ON DELETE SET NULL,
    UNIQUE KEY unique_offering (course_id, semester_id, section_number),
    INDEX idx_offering_semester (semester_id),
    INDEX idx_offering_course (course_id),
    CHECK (enrolled_count <= max_capacity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLE: students
-- Stores student information
-- ============================================
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    student_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    address TEXT,
    department_id INT,
    enrollment_year INT,
    current_semester INT,
    gpa DECIMAL(3,2) DEFAULT 0.00,
    status ENUM('ACTIVE', 'INACTIVE', 'GRADUATED', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    INDEX idx_student_email (email),
    INDEX idx_student_number (student_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLE: enrollments
-- Manages student course enrollments
-- ============================================
CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    offering_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ENROLLED', 'DROPPED', 'COMPLETED', 'WITHDRAWN') DEFAULT 'ENROLLED',
    grade VARCHAR(2),
    grade_points DECIMAL(3,2),
    attendance_percentage DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, offering_id),
    INDEX idx_enrollment_student (student_id),
    INDEX idx_enrollment_offering (offering_id),
    INDEX idx_enrollment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLE: admins
-- Stores administrator credentials
-- ============================================
CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('SUPER_ADMIN', 'ADMIN', 'STAFF') DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLE: waitlist
-- Manages waitlist for full courses
-- ============================================
CREATE TABLE waitlist (
    waitlist_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    offering_id INT NOT NULL,
    position INT NOT NULL,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('WAITING', 'ENROLLED', 'EXPIRED') DEFAULT 'WAITING',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (offering_id) REFERENCES course_offerings(offering_id) ON DELETE CASCADE,
    UNIQUE KEY unique_waitlist (student_id, offering_id),
    INDEX idx_waitlist_offering (offering_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update enrolled_count when new enrollment is added
DELIMITER //
CREATE TRIGGER after_enrollment_insert
AFTER INSERT ON enrollments
FOR EACH ROW
BEGIN
    IF NEW.status = 'ENROLLED' THEN
        UPDATE course_offerings 
        SET enrolled_count = enrolled_count + 1 
        WHERE offering_id = NEW.offering_id;
        
        -- Update status to CLOSED if capacity reached
        UPDATE course_offerings 
        SET status = 'CLOSED' 
        WHERE offering_id = NEW.offering_id 
        AND enrolled_count >= max_capacity;
    END IF;
END//

-- Trigger to update enrolled_count when enrollment is dropped
CREATE TRIGGER after_enrollment_update
AFTER UPDATE ON enrollments
FOR EACH ROW
BEGIN
    IF OLD.status = 'ENROLLED' AND NEW.status IN ('DROPPED', 'WITHDRAWN') THEN
        UPDATE course_offerings 
        SET enrolled_count = enrolled_count - 1 
        WHERE offering_id = NEW.offering_id;
        
        -- Reopen course if it was closed
        UPDATE course_offerings 
        SET status = 'OPEN' 
        WHERE offering_id = NEW.offering_id 
        AND status = 'CLOSED'
        AND enrolled_count < max_capacity;
    END IF;
END//

-- Trigger to prevent enrollment if capacity is full
CREATE TRIGGER before_enrollment_insert
BEFORE INSERT ON enrollments
FOR EACH ROW
BEGIN
    DECLARE current_enrolled INT;
    DECLARE max_cap INT;
    
    SELECT enrolled_count, max_capacity 
    INTO current_enrolled, max_cap
    FROM course_offerings 
    WHERE offering_id = NEW.offering_id;
    
    IF current_enrolled >= max_cap THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Course is full. Cannot enroll.';
    END IF;
END//

DELIMITER ;

-- ============================================
-- VIEWS
-- ============================================

-- View: Student enrollment summary
CREATE VIEW student_enrollment_summary AS
SELECT 
    s.student_id,
    s.student_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    s.email,
    d.department_name,
    COUNT(CASE WHEN e.status = 'ENROLLED' THEN 1 END) AS active_enrollments,
    COUNT(CASE WHEN e.status = 'COMPLETED' THEN 1 END) AS completed_courses,
    SUM(CASE WHEN e.status = 'COMPLETED' THEN c.credits ELSE 0 END) AS total_credits,
    s.gpa
FROM students s
LEFT JOIN departments d ON s.department_id = d.department_id
LEFT JOIN enrollments e ON s.student_id = e.student_id
LEFT JOIN course_offerings co ON e.offering_id = co.offering_id
LEFT JOIN courses c ON co.course_id = c.course_id
GROUP BY s.student_id, s.student_number, s.first_name, s.last_name, s.email, d.department_name, s.gpa;

-- View: Course offerings with details
CREATE VIEW course_offerings_detail AS
SELECT 
    co.offering_id,
    c.course_code,
    c.course_name,
    c.credits,
    d.department_name,
    CONCAT(i.first_name, ' ', i.last_name) AS instructor_name,
    sem.semester_name,
    sem.academic_year,
    co.section_number,
    co.schedule_days,
    co.schedule_time,
    co.classroom,
    co.enrolled_count,
    co.max_capacity,
    (co.max_capacity - co.enrolled_count) AS available_seats,
    co.status
FROM course_offerings co
JOIN courses c ON co.course_id = c.course_id
JOIN semesters sem ON co.semester_id = sem.semester_id
LEFT JOIN departments d ON c.department_id = d.department_id
LEFT JOIN instructors i ON co.instructor_id = i.instructor_id;

-- View: Enrollment details
CREATE VIEW enrollment_details AS
SELECT 
    e.enrollment_id,
    s.student_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    s.email AS student_email,
    c.course_code,
    c.course_name,
    co.section_number,
    sem.semester_name,
    sem.academic_year,
    CONCAT(i.first_name, ' ', i.last_name) AS instructor_name,
    e.enrollment_date,
    e.status AS enrollment_status,
    e.grade
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
JOIN course_offerings co ON e.offering_id = co.offering_id
JOIN courses c ON co.course_id = c.course_id
JOIN semesters sem ON co.semester_id = sem.semester_id
LEFT JOIN instructors i ON co.instructor_id = i.instructor_id;
