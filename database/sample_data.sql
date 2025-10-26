-- ============================================
-- Sample Data Insert Script
-- Online Course Registration System
-- ============================================

USE course_registration_db;

-- ============================================
-- INSERT DEPARTMENTS
-- ============================================
INSERT INTO departments (department_code, department_name, building, phone) VALUES
('CS', 'Computer Science', 'Tech Building A', '555-0101'),
('MATH', 'Mathematics', 'Science Hall', '555-0102'),
('ENG', 'English', 'Liberal Arts Building', '555-0103'),
('PHYS', 'Physics', 'Science Hall', '555-0104'),
('CHEM', 'Chemistry', 'Science Hall', '555-0105'),
('BIO', 'Biology', 'Life Sciences Building', '555-0106'),
('ECON', 'Economics', 'Business School', '555-0107'),
('HIST', 'History', 'Liberal Arts Building', '555-0108');

-- ============================================
-- INSERT SEMESTERS
-- ============================================
INSERT INTO semesters (semester_name, academic_year, start_date, end_date, registration_start, registration_end, is_current) VALUES
('Fall', '2024-2025', '2024-09-01', '2024-12-15', '2024-08-01', '2024-09-10', FALSE),
('Spring', '2024-2025', '2025-01-15', '2025-05-15', '2024-12-01', '2025-01-25', FALSE),
('Fall', '2025-2026', '2025-09-01', '2025-12-15', '2025-08-01', '2025-09-10', TRUE),
('Spring', '2026-2027', '2026-01-15', '2026-05-15', '2025-12-01', '2026-01-25', FALSE);

-- ============================================
-- INSERT INSTRUCTORS
-- ============================================
INSERT INTO instructors (first_name, last_name, email, phone, department_id, hire_date, office_location) VALUES
('John', 'Smith', 'john.smith@university.edu', '555-1001', 1, '2015-08-15', 'Tech-301'),
('Emily', 'Johnson', 'emily.johnson@university.edu', '555-1002', 1, '2017-01-10', 'Tech-305'),
('Michael', 'Williams', 'michael.williams@university.edu', '555-1003', 2, '2014-09-01', 'Science-201'),
('Sarah', 'Brown', 'sarah.brown@university.edu', '555-1004', 3, '2016-08-20', 'Liberal-101'),
('David', 'Jones', 'david.jones@university.edu', '555-1005', 4, '2013-09-01', 'Science-301'),
('Jessica', 'Garcia', 'jessica.garcia@university.edu', '555-1006', 5, '2018-01-15', 'Science-401'),
('Robert', 'Martinez', 'robert.martinez@university.edu', '555-1007', 1, '2019-08-20', 'Tech-310'),
('Linda', 'Rodriguez', 'linda.rodriguez@university.edu', '555-1008', 7, '2015-01-10', 'Business-205');

-- ============================================
-- INSERT COURSES
-- ============================================
INSERT INTO courses (course_code, course_name, description, credits, department_id, prerequisite_course_id) VALUES
-- Computer Science Courses
('CS101', 'Introduction to Programming', 'Fundamentals of programming using Python', 3, 1, NULL),
('CS102', 'Data Structures', 'Study of fundamental data structures and algorithms', 4, 1, 1),
('CS201', 'Object-Oriented Programming', 'Advanced programming concepts using Java', 3, 1, 1),
('CS202', 'Database Management Systems', 'Design and implementation of database systems', 3, 1, 2),
('CS301', 'Software Engineering', 'Principles and practices of software development', 3, 1, 3),
('CS302', 'Web Development', 'Full-stack web development with modern frameworks', 3, 1, 1),
('CS401', 'Artificial Intelligence', 'Introduction to AI and machine learning', 4, 1, 2),

-- Mathematics Courses
('MATH101', 'Calculus I', 'Differential calculus and applications', 4, 2, NULL),
('MATH102', 'Calculus II', 'Integral calculus and series', 4, 2, 8),
('MATH201', 'Linear Algebra', 'Vectors, matrices, and linear transformations', 3, 2, NULL),
('MATH301', 'Discrete Mathematics', 'Logic, sets, relations, and graph theory', 3, 2, NULL),

-- English Courses
('ENG101', 'Composition I', 'Academic writing and critical thinking', 3, 3, NULL),
('ENG102', 'Composition II', 'Research writing and argumentation', 3, 3, 12),
('ENG201', 'World Literature', 'Survey of global literary traditions', 3, 3, NULL),

-- Physics Courses
('PHYS101', 'Physics I', 'Mechanics and thermodynamics', 4, 4, NULL),
('PHYS102', 'Physics II', 'Electricity, magnetism, and optics', 4, 4, 15),

-- Chemistry Courses
('CHEM101', 'General Chemistry I', 'Fundamental principles of chemistry', 4, 5, NULL),
('CHEM102', 'General Chemistry II', 'Chemical reactions and equilibrium', 4, 5, 17),

-- Economics Courses
('ECON101', 'Microeconomics', 'Principles of microeconomic theory', 3, 7, NULL),
('ECON102', 'Macroeconomics', 'Principles of macroeconomic theory', 3, 7, NULL);

-- ============================================
-- INSERT COURSE OFFERINGS (Current Semester)
-- ============================================
INSERT INTO course_offerings (course_id, semester_id, instructor_id, section_number, max_capacity, schedule_days, schedule_time, classroom, status) VALUES
-- Fall 2025-2026 (Current Semester - semester_id = 3)
(1, 3, 1, 'A', 35, 'Mon/Wed', '09:00-10:30', 'Tech-101', 'OPEN'),
(1, 3, 2, 'B', 35, 'Tue/Thu', '11:00-12:30', 'Tech-102', 'OPEN'),
(2, 3, 1, 'A', 30, 'Mon/Wed', '14:00-15:30', 'Tech-103', 'OPEN'),
(3, 3, 2, 'A', 30, 'Tue/Thu', '09:00-10:30', 'Tech-104', 'OPEN'),
(4, 3, 7, 'A', 30, 'Mon/Wed/Fri', '10:00-11:00', 'Tech-201', 'OPEN'),
(5, 3, 2, 'A', 25, 'Tue/Thu', '14:00-15:30', 'Tech-202', 'OPEN'),
(6, 3, 7, 'A', 30, 'Mon/Wed', '16:00-17:30', 'Tech-Lab1', 'OPEN'),
(7, 3, 1, 'A', 25, 'Tue/Thu', '16:00-18:00', 'Tech-301', 'OPEN'),

(8, 3, 3, 'A', 40, 'Mon/Wed/Fri', '08:00-09:00', 'Science-101', 'OPEN'),
(9, 3, 3, 'A', 40, 'Mon/Wed/Fri', '10:00-11:00', 'Science-101', 'OPEN'),
(10, 3, 3, 'B', 35, 'Tue/Thu', '13:00-14:30', 'Science-102', 'OPEN'),
(11, 3, 3, 'A', 30, 'Mon/Wed', '11:00-12:30', 'Science-103', 'OPEN'),

(12, 3, 4, 'A', 30, 'Mon/Wed', '09:00-10:30', 'Liberal-201', 'OPEN'),
(13, 3, 4, 'A', 30, 'Tue/Thu', '11:00-12:30', 'Liberal-201', 'OPEN'),
(14, 3, 4, 'B', 25, 'Mon/Wed', '14:00-15:30', 'Liberal-202', 'OPEN'),

(15, 3, 5, 'A', 35, 'Mon/Wed', '08:00-10:00', 'Science-Lab1', 'OPEN'),
(16, 3, 5, 'A', 35, 'Tue/Thu', '08:00-10:00', 'Science-Lab1', 'OPEN'),

(17, 3, 6, 'A', 30, 'Mon/Wed', '10:00-12:00', 'Chem-Lab1', 'OPEN'),
(18, 3, 6, 'A', 30, 'Tue/Thu', '10:00-12:00', 'Chem-Lab1', 'OPEN'),

(19, 3, 8, 'A', 40, 'Mon/Wed/Fri', '09:00-10:00', 'Business-101', 'OPEN'),
(20, 3, 8, 'A', 40, 'Tue/Thu', '14:00-15:30', 'Business-102', 'OPEN');

-- ============================================
-- INSERT ADMINS
-- Note: Default password is 'admin123' (hashed using bcrypt)
-- ============================================
INSERT INTO admins (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@university.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', 'System Administrator', 'SUPER_ADMIN'),
('staff1', 'staff1@university.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', 'John Doe', 'ADMIN');

-- ============================================
-- INSERT STUDENTS
-- Note: Default password is 'student123' (hashed using bcrypt)
-- ============================================
INSERT INTO students (student_number, first_name, last_name, email, password_hash, phone, date_of_birth, gender, address, department_id, enrollment_year, current_semester, gpa, status) VALUES
('STU2023001', 'Alice', 'Anderson', 'alice.anderson@student.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', '555-2001', '2005-03-15', 'Female', '123 Main St, City', 1, 2023, 5, 3.75, 'ACTIVE'),
('STU2023002', 'Bob', 'Baker', 'bob.baker@student.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', '555-2002', '2004-07-22', 'Male', '456 Oak Ave, City', 1, 2023, 5, 3.50, 'ACTIVE'),
('STU2024001', 'Carol', 'Chen', 'carol.chen@student.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', '555-2003', '2005-11-08', 'Female', '789 Pine Rd, City', 1, 2024, 3, 3.85, 'ACTIVE'),
('STU2024002', 'David', 'Davis', 'david.davis@student.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', '555-2004', '2005-02-14', 'Male', '321 Elm St, City', 2, 2024, 3, 3.60, 'ACTIVE'),
('STU2024003', 'Emma', 'Evans', 'emma.evans@student.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', '555-2005', '2006-09-30', 'Female', '654 Maple Dr, City', 3, 2024, 3, 3.90, 'ACTIVE'),
('STU2025001', 'Frank', 'Foster', 'frank.foster@student.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', '555-2006', '2006-05-12', 'Male', '987 Cedar Ln, City', 1, 2025, 1, 0.00, 'ACTIVE'),
('STU2025002', 'Grace', 'Green', 'grace.green@student.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', '555-2007', '2006-12-25', 'Female', '147 Birch Ave, City', 1, 2025, 1, 0.00, 'ACTIVE'),
('STU2025003', 'Henry', 'Harris', 'henry.harris@student.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', '555-2008', '2007-01-18', 'Male', '258 Walnut St, City', 2, 2025, 1, 0.00, 'ACTIVE'),
('STU2025004', 'Iris', 'Irving', 'iris.irving@student.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', '555-2009', '2006-08-05', 'Female', '369 Spruce Rd, City', 4, 2025, 1, 0.00, 'ACTIVE'),
('STU2025005', 'Jack', 'Jackson', 'jack.jackson@student.edu', '$2a$10$rKZHVZXHvJlKzYhcJHYzK.VWYXxYJ8RQdpxXfJ0XYvZRYXYXYXYXY', '555-2010', '2006-04-22', 'Male', '741 Ash Blvd, City', 7, 2025, 1, 0.00, 'ACTIVE');

-- ============================================
-- INSERT SAMPLE ENROLLMENTS
-- ============================================
INSERT INTO enrollments (student_id, offering_id, enrollment_date, status, grade, grade_points) VALUES
-- Student 1 (Alice Anderson) - CS Senior
(1, 5, '2025-08-15 10:30:00', 'ENROLLED', NULL, NULL),
(1, 6, '2025-08-15 10:35:00', 'ENROLLED', NULL, NULL),
(1, 8, '2025-08-15 10:40:00', 'ENROLLED', NULL, NULL),

-- Student 2 (Bob Baker) - CS Senior
(2, 5, '2025-08-16 09:20:00', 'ENROLLED', NULL, NULL),
(2, 7, '2025-08-16 09:25:00', 'ENROLLED', NULL, NULL),
(2, 11, '2025-08-16 09:30:00', 'ENROLLED', NULL, NULL),

-- Student 3 (Carol Chen) - CS Junior
(3, 3, '2025-08-17 11:00:00', 'ENROLLED', NULL, NULL),
(3, 4, '2025-08-17 11:05:00', 'ENROLLED', NULL, NULL),
(3, 10, '2025-08-17 11:10:00', 'ENROLLED', NULL, NULL),
(3, 13, '2025-08-17 11:15:00', 'ENROLLED', NULL, NULL),

-- Student 4 (David Davis) - Math Junior
(4, 9, '2025-08-18 14:00:00', 'ENROLLED', NULL, NULL),
(4, 10, '2025-08-18 14:05:00', 'ENROLLED', NULL, NULL),
(4, 11, '2025-08-18 14:10:00', 'ENROLLED', NULL, NULL),

-- Student 5 (Emma Evans) - English Junior
(5, 13, '2025-08-19 10:00:00', 'ENROLLED', NULL, NULL),
(5, 14, '2025-08-19 10:05:00', 'ENROLLED', NULL, NULL),
(5, 19, '2025-08-19 10:10:00', 'ENROLLED', NULL, NULL),

-- Student 6 (Frank Foster) - CS Freshman
(6, 1, '2025-08-20 08:30:00', 'ENROLLED', NULL, NULL),
(6, 8, '2025-08-20 08:35:00', 'ENROLLED', NULL, NULL),
(6, 12, '2025-08-20 08:40:00', 'ENROLLED', NULL, NULL),
(6, 15, '2025-08-20 08:45:00', 'ENROLLED', NULL, NULL),

-- Student 7 (Grace Green) - CS Freshman
(7, 2, '2025-08-21 09:00:00', 'ENROLLED', NULL, NULL),
(7, 8, '2025-08-21 09:05:00', 'ENROLLED', NULL, NULL),
(7, 12, '2025-08-21 09:10:00', 'ENROLLED', NULL, NULL),

-- Student 8 (Henry Harris) - Math Freshman
(8, 8, '2025-08-22 10:30:00', 'ENROLLED', NULL, NULL),
(8, 10, '2025-08-22 10:35:00', 'ENROLLED', NULL, NULL),
(8, 12, '2025-08-22 10:40:00', 'ENROLLED', NULL, NULL),

-- Student 9 (Iris Irving) - Physics Freshman
(9, 15, '2025-08-23 11:00:00', 'ENROLLED', NULL, NULL),
(9, 17, '2025-08-23 11:05:00', 'ENROLLED', NULL, NULL),
(9, 8, '2025-08-23 11:10:00', 'ENROLLED', NULL, NULL),

-- Student 10 (Jack Jackson) - Economics Freshman
(10, 19, '2025-08-24 13:00:00', 'ENROLLED', NULL, NULL),
(10, 20, '2025-08-24 13:05:00', 'ENROLLED', NULL, NULL),
(10, 12, '2025-08-24 13:10:00', 'ENROLLED', NULL, NULL);

-- ============================================
-- Update enrolled counts (manual update for demo)
-- ============================================
UPDATE course_offerings SET enrolled_count = 2 WHERE offering_id = 1;
UPDATE course_offerings SET enrolled_count = 1 WHERE offering_id = 2;
UPDATE course_offerings SET enrolled_count = 1 WHERE offering_id = 3;
UPDATE course_offerings SET enrolled_count = 1 WHERE offering_id = 4;
UPDATE course_offerings SET enrolled_count = 2 WHERE offering_id = 5;
UPDATE course_offerings SET enrolled_count = 1 WHERE offering_id = 6;
UPDATE course_offerings SET enrolled_count = 1 WHERE offering_id = 7;
UPDATE course_offerings SET enrolled_count = 6 WHERE offering_id = 8;
UPDATE course_offerings SET enrolled_count = 1 WHERE offering_id = 9;
UPDATE course_offerings SET enrolled_count = 2 WHERE offering_id = 10;
UPDATE course_offerings SET enrolled_count = 1 WHERE offering_id = 11;
UPDATE course_offerings SET enrolled_count = 4 WHERE offering_id = 12;
UPDATE course_offerings SET enrolled_count = 2 WHERE offering_id = 13;
UPDATE course_offerings SET enrolled_count = 1 WHERE offering_id = 14;
UPDATE course_offerings SET enrolled_count = 2 WHERE offering_id = 15;
UPDATE course_offerings SET enrolled_count = 1 WHERE offering_id = 17;
UPDATE course_offerings SET enrolled_count = 1 WHERE offering_id = 19;
UPDATE course_offerings SET enrolled_count = 1 WHERE offering_id = 20;

-- ============================================
-- Verification Queries
-- ============================================
SELECT 'Database populated successfully!' AS status;
SELECT COUNT(*) AS total_students FROM students;
SELECT COUNT(*) AS total_courses FROM courses;
SELECT COUNT(*) AS total_instructors FROM instructors;
SELECT COUNT(*) AS total_enrollments FROM enrollments;
