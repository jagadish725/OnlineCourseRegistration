-- ============================================
-- Sample Queries for Reports and Analytics
-- Online Course Registration System
-- ============================================

USE course_registration_db;

-- ============================================
-- 1. ENROLLMENT STATISTICS
-- ============================================

-- Total enrollments by semester
SELECT 
    s.semester_name,
    s.academic_year,
    COUNT(e.enrollment_id) AS total_enrollments,
    COUNT(DISTINCT e.student_id) AS unique_students,
    COUNT(DISTINCT co.course_id) AS courses_offered
FROM semesters s
LEFT JOIN course_offerings co ON s.semester_id = co.semester_id
LEFT JOIN enrollments e ON co.offering_id = e.offering_id AND e.status = 'ENROLLED'
GROUP BY s.semester_id, s.semester_name, s.academic_year
ORDER BY s.academic_year DESC, 
         FIELD(s.semester_name, 'Spring', 'Summer', 'Fall', 'Winter');

-- Enrollment status breakdown
SELECT 
    status,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM enrollments), 2) AS percentage
FROM enrollments
GROUP BY status
ORDER BY count DESC;

-- ============================================
-- 2. COURSE POPULARITY ANALYSIS
-- ============================================

-- Most popular courses (by enrollment count)
SELECT 
    c.course_code,
    c.course_name,
    d.department_name,
    COUNT(e.enrollment_id) AS total_enrollments,
    AVG(co.enrolled_count) AS avg_section_size,
    COUNT(DISTINCT co.offering_id) AS sections_offered
FROM courses c
JOIN course_offerings co ON c.course_id = co.course_id
LEFT JOIN enrollments e ON co.offering_id = e.offering_id AND e.status = 'ENROLLED'
JOIN departments d ON c.department_id = d.department_id
WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
GROUP BY c.course_id, c.course_code, c.course_name, d.department_name
ORDER BY total_enrollments DESC
LIMIT 10;

-- Courses with available seats
SELECT 
    c.course_code,
    c.course_name,
    co.section_number,
    CONCAT(i.first_name, ' ', i.last_name) AS instructor,
    co.schedule_days,
    co.schedule_time,
    co.enrolled_count,
    co.max_capacity,
    (co.max_capacity - co.enrolled_count) AS available_seats,
    ROUND((co.enrolled_count / co.max_capacity) * 100, 2) AS fill_percentage
FROM course_offerings co
JOIN courses c ON co.course_id = c.course_id
LEFT JOIN instructors i ON co.instructor_id = i.instructor_id
WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
    AND co.status = 'OPEN'
    AND co.enrolled_count < co.max_capacity
ORDER BY available_seats DESC;

-- ============================================
-- 3. STUDENT STATISTICS
-- ============================================

-- Students by department
SELECT 
    d.department_name,
    COUNT(s.student_id) AS total_students,
    COUNT(CASE WHEN s.status = 'ACTIVE' THEN 1 END) AS active_students,
    ROUND(AVG(s.gpa), 2) AS average_gpa
FROM departments d
LEFT JOIN students s ON d.department_id = s.department_id
GROUP BY d.department_id, d.department_name
ORDER BY total_students DESC;

-- Student enrollment load (current semester)
SELECT 
    s.student_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    d.department_name,
    COUNT(e.enrollment_id) AS courses_enrolled,
    SUM(c.credits) AS total_credits,
    s.gpa
FROM students s
LEFT JOIN departments d ON s.department_id = d.department_id
LEFT JOIN enrollments e ON s.student_id = e.student_id AND e.status = 'ENROLLED'
LEFT JOIN course_offerings co ON e.offering_id = co.offering_id
LEFT JOIN courses c ON co.course_id = c.course_id
WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
GROUP BY s.student_id, s.student_number, s.first_name, s.last_name, d.department_name, s.gpa
HAVING courses_enrolled > 0
ORDER BY total_credits DESC;

-- Students with no enrollments (current semester)
SELECT 
    s.student_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    s.email,
    d.department_name,
    s.status
FROM students s
LEFT JOIN departments d ON s.department_id = d.department_id
WHERE s.student_id NOT IN (
    SELECT DISTINCT e.student_id 
    FROM enrollments e
    JOIN course_offerings co ON e.offering_id = co.offering_id
    WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
        AND e.status = 'ENROLLED'
)
AND s.status = 'ACTIVE'
ORDER BY s.student_number;

-- ============================================
-- 4. INSTRUCTOR WORKLOAD
-- ============================================

-- Instructor teaching load
SELECT 
    i.instructor_id,
    CONCAT(i.first_name, ' ', i.last_name) AS instructor_name,
    d.department_name,
    COUNT(DISTINCT co.offering_id) AS courses_teaching,
    SUM(co.enrolled_count) AS total_students,
    ROUND(AVG(co.enrolled_count), 2) AS avg_class_size
FROM instructors i
LEFT JOIN departments d ON i.department_id = d.department_id
LEFT JOIN course_offerings co ON i.instructor_id = co.instructor_id
WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
GROUP BY i.instructor_id, i.first_name, i.last_name, d.department_name
HAVING courses_teaching > 0
ORDER BY courses_teaching DESC, total_students DESC;

-- ============================================
-- 5. DEPARTMENT ANALYTICS
-- ============================================

-- Department enrollment summary
SELECT 
    d.department_name,
    COUNT(DISTINCT c.course_id) AS courses_offered,
    COUNT(DISTINCT co.offering_id) AS total_sections,
    COUNT(e.enrollment_id) AS total_enrollments,
    SUM(co.max_capacity) AS total_capacity,
    SUM(co.enrolled_count) AS seats_filled,
    ROUND((SUM(co.enrolled_count) / SUM(co.max_capacity)) * 100, 2) AS utilization_percentage
FROM departments d
LEFT JOIN courses c ON d.department_id = c.department_id
LEFT JOIN course_offerings co ON c.course_id = co.course_id
LEFT JOIN enrollments e ON co.offering_id = e.offering_id AND e.status = 'ENROLLED'
WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
GROUP BY d.department_id, d.department_name
ORDER BY total_enrollments DESC;

-- ============================================
-- 6. WAITLIST ANALYSIS
-- ============================================

-- Current waitlist summary
SELECT 
    c.course_code,
    c.course_name,
    co.section_number,
    COUNT(w.waitlist_id) AS waitlist_count,
    co.max_capacity,
    co.enrolled_count
FROM waitlist w
JOIN course_offerings co ON w.offering_id = co.offering_id
JOIN courses c ON co.course_id = c.course_id
WHERE w.status = 'WAITING'
    AND co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
GROUP BY c.course_code, c.course_name, co.section_number, co.max_capacity, co.enrolled_count
ORDER BY waitlist_count DESC;

-- ============================================
-- 7. PREREQUISITE COMPLIANCE CHECK
-- ============================================

-- Students enrolled in courses without completing prerequisites
SELECT 
    s.student_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    c.course_code AS enrolled_course,
    prereq.course_code AS required_prerequisite
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
JOIN course_offerings co ON e.offering_id = co.offering_id
JOIN courses c ON co.course_id = c.course_id
JOIN courses prereq ON c.prerequisite_course_id = prereq.course_id
WHERE e.status = 'ENROLLED'
    AND NOT EXISTS (
        SELECT 1 
        FROM enrollments e2
        JOIN course_offerings co2 ON e2.offering_id = co2.offering_id
        WHERE e2.student_id = s.student_id
            AND co2.course_id = prereq.course_id
            AND e2.status = 'COMPLETED'
            AND e2.grade IN ('A', 'B', 'C', 'D')
    )
ORDER BY s.student_number, c.course_code;

-- ============================================
-- 8. GRADE DISTRIBUTION (if grades available)
-- ============================================

-- Grade distribution by course
SELECT 
    c.course_code,
    c.course_name,
    e.grade,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY c.course_id), 2) AS percentage
FROM enrollments e
JOIN course_offerings co ON e.offering_id = co.offering_id
JOIN courses c ON co.course_id = c.course_id
WHERE e.grade IS NOT NULL
GROUP BY c.course_id, c.course_code, c.course_name, e.grade
ORDER BY c.course_code, e.grade;

-- ============================================
-- 9. TIME-BASED ANALYSIS
-- ============================================

-- Enrollment trends by registration date
SELECT 
    DATE(e.enrollment_date) AS registration_date,
    COUNT(*) AS enrollments_count,
    COUNT(DISTINCT e.student_id) AS unique_students
FROM enrollments e
JOIN course_offerings co ON e.offering_id = co.offering_id
WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
    AND e.status = 'ENROLLED'
GROUP BY DATE(e.enrollment_date)
ORDER BY registration_date;

-- ============================================
-- 10. COMPREHENSIVE STUDENT TRANSCRIPT
-- ============================================

-- Generate transcript for a specific student
SELECT 
    s.student_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    d.department_name AS major,
    sem.semester_name,
    sem.academic_year,
    c.course_code,
    c.course_name,
    c.credits,
    CONCAT(i.first_name, ' ', i.last_name) AS instructor,
    e.grade,
    e.status
FROM students s
JOIN departments d ON s.department_id = d.department_id
JOIN enrollments e ON s.student_id = e.student_id
JOIN course_offerings co ON e.offering_id = co.offering_id
JOIN courses c ON co.course_id = c.course_id
JOIN semesters sem ON co.semester_id = sem.semester_id
LEFT JOIN instructors i ON co.instructor_id = i.instructor_id
WHERE s.student_number = 'STU2023001'  -- Replace with specific student number
ORDER BY sem.academic_year DESC, 
         FIELD(sem.semester_name, 'Spring', 'Summer', 'Fall', 'Winter'),
         c.course_code;

-- ============================================
-- 11. CAPACITY UTILIZATION REPORT
-- ============================================

-- Overall capacity utilization
SELECT 
    'Current Semester' AS period,
    SUM(co.max_capacity) AS total_capacity,
    SUM(co.enrolled_count) AS total_enrolled,
    SUM(co.max_capacity) - SUM(co.enrolled_count) AS empty_seats,
    ROUND((SUM(co.enrolled_count) / SUM(co.max_capacity)) * 100, 2) AS utilization_rate
FROM course_offerings co
WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE);

-- ============================================
-- 12. REVENUE PROJECTION (assuming cost per credit)
-- ============================================

-- Enrollment revenue by department (assuming $500 per credit)
SELECT 
    d.department_name,
    COUNT(e.enrollment_id) AS total_enrollments,
    SUM(c.credits) AS total_credits,
    SUM(c.credits) * 500 AS projected_revenue
FROM enrollments e
JOIN course_offerings co ON e.offering_id = co.offering_id
JOIN courses c ON co.course_id = c.course_id
JOIN departments d ON c.department_id = d.department_id
WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
    AND e.status = 'ENROLLED'
GROUP BY d.department_id, d.department_name
ORDER BY projected_revenue DESC;
