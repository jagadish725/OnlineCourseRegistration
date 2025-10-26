const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Enrollment statistics
router.get('/enrollment-stats', isAuthenticated, async (req, res) => {
    try {
        const [stats] = await pool.query(
            `SELECT 
                s.semester_name,
                s.academic_year,
                COUNT(e.enrollment_id) AS total_enrollments,
                COUNT(DISTINCT e.student_id) AS unique_students,
                COUNT(DISTINCT co.course_id) AS courses_offered
             FROM semesters s
             LEFT JOIN course_offerings co ON s.semester_id = co.semester_id
             LEFT JOIN enrollments e ON co.offering_id = e.offering_id AND e.status = 'ENROLLED'
             GROUP BY s.semester_id, s.semester_name, s.academic_year
             ORDER BY s.academic_year DESC`
        );

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Enrollment stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enrollment statistics',
            error: error.message
        });
    }
});

// Most popular courses
router.get('/popular-courses', isAuthenticated, async (req, res) => {
    try {
        const [courses] = await pool.query(
            `SELECT 
                c.course_code,
                c.course_name,
                d.department_name,
                COUNT(e.enrollment_id) AS total_enrollments,
                AVG(co.enrolled_count) AS avg_section_size
             FROM courses c
             JOIN course_offerings co ON c.course_id = co.course_id
             LEFT JOIN enrollments e ON co.offering_id = e.offering_id AND e.status = 'ENROLLED'
             JOIN departments d ON c.department_id = d.department_id
             WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
             GROUP BY c.course_id, c.course_code, c.course_name, d.department_name
             ORDER BY total_enrollments DESC
             LIMIT 10`
        );

        res.json({
            success: true,
            courses
        });
    } catch (error) {
        console.error('Popular courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch popular courses',
            error: error.message
        });
    }
});

// Department statistics
router.get('/department-stats', isAuthenticated, async (req, res) => {
    try {
        const [stats] = await pool.query(
            `SELECT 
                d.department_name,
                COUNT(DISTINCT s.student_id) AS total_students,
                COUNT(DISTINCT c.course_id) AS courses_offered,
                COUNT(DISTINCT co.offering_id) AS total_sections,
                COUNT(e.enrollment_id) AS total_enrollments
             FROM departments d
             LEFT JOIN students s ON d.department_id = s.department_id AND s.status = 'ACTIVE'
             LEFT JOIN courses c ON d.department_id = c.department_id
             LEFT JOIN course_offerings co ON c.course_id = co.course_id
             LEFT JOIN enrollments e ON co.offering_id = e.offering_id AND e.status = 'ENROLLED'
             WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE) OR co.semester_id IS NULL
             GROUP BY d.department_id, d.department_name
             ORDER BY total_enrollments DESC`
        );

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Department stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch department statistics',
            error: error.message
        });
    }
});

// Student enrollment load
router.get('/student-load', isAuthenticated, async (req, res) => {
    try {
        const [students] = await pool.query(
            `SELECT 
                s.student_number,
                CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                d.department_name,
                COUNT(e.enrollment_id) AS courses_enrolled,
                SUM(c.credits) AS total_credits
             FROM students s
             LEFT JOIN departments d ON s.department_id = d.department_id
             LEFT JOIN enrollments e ON s.student_id = e.student_id AND e.status = 'ENROLLED'
             LEFT JOIN course_offerings co ON e.offering_id = co.offering_id
             LEFT JOIN courses c ON co.course_id = c.course_id
             WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
               AND s.status = 'ACTIVE'
             GROUP BY s.student_id, s.student_number, s.first_name, s.last_name, d.department_name
             HAVING courses_enrolled > 0
             ORDER BY total_credits DESC
             LIMIT 50`
        );

        res.json({
            success: true,
            students
        });
    } catch (error) {
        console.error('Student load error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student load',
            error: error.message
        });
    }
});

// Instructor workload
router.get('/instructor-workload', isAuthenticated, async (req, res) => {
    try {
        const [instructors] = await pool.query(
            `SELECT 
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
             ORDER BY courses_teaching DESC, total_students DESC`
        );

        res.json({
            success: true,
            instructors
        });
    } catch (error) {
        console.error('Instructor workload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch instructor workload',
            error: error.message
        });
    }
});

// Course capacity utilization
router.get('/capacity-utilization', isAuthenticated, async (req, res) => {
    try {
        const [[overall]] = await pool.query(
            `SELECT 
                SUM(co.max_capacity) AS total_capacity,
                SUM(co.enrolled_count) AS total_enrolled,
                SUM(co.max_capacity) - SUM(co.enrolled_count) AS empty_seats,
                ROUND((SUM(co.enrolled_count) / SUM(co.max_capacity)) * 100, 2) AS utilization_rate
             FROM course_offerings co
             WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)`
        );

        const [byDepartment] = await pool.query(
            `SELECT 
                d.department_name,
                SUM(co.max_capacity) AS total_capacity,
                SUM(co.enrolled_count) AS seats_filled,
                ROUND((SUM(co.enrolled_count) / SUM(co.max_capacity)) * 100, 2) AS utilization_percentage
             FROM departments d
             LEFT JOIN courses c ON d.department_id = c.department_id
             LEFT JOIN course_offerings co ON c.course_id = co.course_id
             WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
             GROUP BY d.department_id, d.department_name
             ORDER BY utilization_percentage DESC`
        );

        res.json({
            success: true,
            overall,
            byDepartment
        });
    } catch (error) {
        console.error('Capacity utilization error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch capacity utilization',
            error: error.message
        });
    }
});

// Course availability report
router.get('/course-availability', isAuthenticated, async (req, res) => {
    try {
        const [courses] = await pool.query(
            `SELECT 
                c.course_code,
                c.course_name,
                co.section_number,
                CONCAT(i.first_name, ' ', i.last_name) AS instructor,
                co.schedule_days,
                co.schedule_time,
                co.enrolled_count,
                co.max_capacity,
                (co.max_capacity - co.enrolled_count) AS available_seats,
                ROUND((co.enrolled_count / co.max_capacity) * 100, 2) AS fill_percentage,
                co.status
             FROM course_offerings co
             JOIN courses c ON co.course_id = c.course_id
             LEFT JOIN instructors i ON co.instructor_id = i.instructor_id
             WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
             ORDER BY available_seats DESC`
        );

        res.json({
            success: true,
            courses
        });
    } catch (error) {
        console.error('Course availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course availability',
            error: error.message
        });
    }
});

// Enrollment trends
router.get('/enrollment-trends', isAuthenticated, async (req, res) => {
    try {
        const [trends] = await pool.query(
            `SELECT 
                DATE(e.enrollment_date) AS registration_date,
                COUNT(*) AS enrollments_count,
                COUNT(DISTINCT e.student_id) AS unique_students
             FROM enrollments e
             JOIN course_offerings co ON e.offering_id = co.offering_id
             WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
               AND e.status = 'ENROLLED'
             GROUP BY DATE(e.enrollment_date)
             ORDER BY registration_date`
        );

        res.json({
            success: true,
            trends
        });
    } catch (error) {
        console.error('Enrollment trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enrollment trends',
            error: error.message
        });
    }
});

// Student transcript
router.get('/student-transcript/:studentId', isAuthenticated, async (req, res) => {
    try {
        const [transcript] = await pool.query(
            `SELECT 
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
             WHERE s.student_id = ?
             ORDER BY sem.academic_year DESC, c.course_code`,
            [req.params.studentId]
        );

        res.json({
            success: true,
            transcript
        });
    } catch (error) {
        console.error('Transcript error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transcript',
            error: error.message
        });
    }
});

// Revenue projection
router.get('/revenue-projection', isAuthenticated, async (req, res) => {
    try {
        const costPerCredit = 500; // Default cost per credit

        const [revenue] = await pool.query(
            `SELECT 
                d.department_name,
                COUNT(e.enrollment_id) AS total_enrollments,
                SUM(c.credits) AS total_credits,
                SUM(c.credits) * ? AS projected_revenue
             FROM enrollments e
             JOIN course_offerings co ON e.offering_id = co.offering_id
             JOIN courses c ON co.course_id = c.course_id
             JOIN departments d ON c.department_id = d.department_id
             WHERE co.semester_id = (SELECT semester_id FROM semesters WHERE is_current = TRUE)
               AND e.status = 'ENROLLED'
             GROUP BY d.department_id, d.department_name
             ORDER BY projected_revenue DESC`,
            [costPerCredit]
        );

        res.json({
            success: true,
            costPerCredit,
            revenue
        });
    } catch (error) {
        console.error('Revenue projection error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revenue projection',
            error: error.message
        });
    }
});

module.exports = router;
