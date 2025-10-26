const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { isAuthenticated, isStudent } = require('../middleware/auth');

// Get student profile
router.get('/profile', isAuthenticated, isStudent, async (req, res) => {
    try {
        const [students] = await pool.query(
            `SELECT s.*, d.department_name 
             FROM students s
             LEFT JOIN departments d ON s.department_id = d.department_id
             WHERE s.student_id = ?`,
            [req.session.userId]
        );

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const student = students[0];
        delete student.password_hash;

        res.json({
            success: true,
            student
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
});

// Update student profile
router.put('/profile', isAuthenticated, isStudent, async (req, res) => {
    try {
        const { phone, address } = req.body;

        await pool.query(
            'UPDATE students SET phone = ?, address = ? WHERE student_id = ?',
            [phone, address, req.session.userId]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

// Get student's enrollments
router.get('/enrollments', isAuthenticated, isStudent, async (req, res) => {
    try {
        const [enrollments] = await pool.query(
            `SELECT 
                e.*,
                c.course_code,
                c.course_name,
                c.credits,
                co.section_number,
                co.schedule_days,
                co.schedule_time,
                co.classroom,
                sem.semester_name,
                sem.academic_year,
                CONCAT(i.first_name, ' ', i.last_name) AS instructor_name,
                d.department_name
             FROM enrollments e
             JOIN course_offerings co ON e.offering_id = co.offering_id
             JOIN courses c ON co.course_id = c.course_id
             JOIN semesters sem ON co.semester_id = sem.semester_id
             LEFT JOIN instructors i ON co.instructor_id = i.instructor_id
             LEFT JOIN departments d ON c.department_id = d.department_id
             WHERE e.student_id = ?
             ORDER BY sem.academic_year DESC, sem.semester_name, c.course_code`,
            [req.session.userId]
        );

        res.json({
            success: true,
            enrollments
        });
    } catch (error) {
        console.error('Get enrollments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enrollments',
            error: error.message
        });
    }
});

// Get current semester enrollments
router.get('/current-enrollments', isAuthenticated, isStudent, async (req, res) => {
    try {
        const [enrollments] = await pool.query(
            `SELECT 
                e.*,
                c.course_code,
                c.course_name,
                c.credits,
                co.section_number,
                co.schedule_days,
                co.schedule_time,
                co.classroom,
                CONCAT(i.first_name, ' ', i.last_name) AS instructor_name
             FROM enrollments e
             JOIN course_offerings co ON e.offering_id = co.offering_id
             JOIN courses c ON co.course_id = c.course_id
             JOIN semesters sem ON co.semester_id = sem.semester_id
             LEFT JOIN instructors i ON co.instructor_id = i.instructor_id
             WHERE e.student_id = ? 
               AND sem.is_current = TRUE
               AND e.status = 'ENROLLED'
             ORDER BY c.course_code`,
            [req.session.userId]
        );

        res.json({
            success: true,
            enrollments
        });
    } catch (error) {
        console.error('Get current enrollments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch current enrollments',
            error: error.message
        });
    }
});

// Get academic summary
router.get('/academic-summary', isAuthenticated, isStudent, async (req, res) => {
    try {
        const [summary] = await pool.query(
            `SELECT 
                COUNT(CASE WHEN e.status = 'ENROLLED' THEN 1 END) AS active_courses,
                COUNT(CASE WHEN e.status = 'COMPLETED' THEN 1 END) AS completed_courses,
                SUM(CASE WHEN e.status = 'COMPLETED' THEN c.credits ELSE 0 END) AS total_credits,
                s.gpa,
                s.current_semester
             FROM students s
             LEFT JOIN enrollments e ON s.student_id = e.student_id
             LEFT JOIN course_offerings co ON e.offering_id = co.offering_id
             LEFT JOIN courses c ON co.course_id = c.course_id
             WHERE s.student_id = ?
             GROUP BY s.student_id, s.gpa, s.current_semester`,
            [req.session.userId]
        );

        res.json({
            success: true,
            summary: summary[0]
        });
    } catch (error) {
        console.error('Get academic summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch academic summary',
            error: error.message
        });
    }
});

module.exports = router;
