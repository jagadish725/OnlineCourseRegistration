const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { isAuthenticated, isStudent } = require('../middleware/auth');

// Enroll in a course
router.post('/enroll', isAuthenticated, isStudent, async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { offeringId } = req.body;
        const studentId = req.session.userId;

        // Check if already enrolled
        const [existing] = await connection.query(
            'SELECT * FROM enrollments WHERE student_id = ? AND offering_id = ?',
            [studentId, offeringId]
        );

        if (existing.length > 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Already enrolled in this course'
            });
        }

        // Check course capacity
        const [offerings] = await connection.query(
            'SELECT * FROM course_offerings WHERE offering_id = ?',
            [offeringId]
        );

        if (offerings.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Course offering not found'
            });
        }

        const offering = offerings[0];

        if (offering.enrolled_count >= offering.max_capacity) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Course is full'
            });
        }

        // Check for time conflicts
        const [conflicts] = await connection.query(
            `SELECT c.course_code, co.schedule_days, co.schedule_time
             FROM enrollments e
             JOIN course_offerings co ON e.offering_id = co.offering_id
             JOIN courses c ON co.course_id = c.course_id
             JOIN semesters sem ON co.semester_id = sem.semester_id
             WHERE e.student_id = ?
               AND e.status = 'ENROLLED'
               AND sem.is_current = TRUE
               AND co.schedule_days = ?
               AND co.schedule_time = ?`,
            [studentId, offering.schedule_days, offering.schedule_time]
        );

        if (conflicts.length > 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: `Time conflict with ${conflicts[0].course_code}`
            });
        }

        // Check prerequisites
        const [courseInfo] = await connection.query(
            `SELECT c.*, prereq.course_code AS prereq_code
             FROM courses c
             LEFT JOIN courses prereq ON c.prerequisite_course_id = prereq.course_id
             WHERE c.course_id = ?`,
            [offering.course_id]
        );

        if (courseInfo[0].prerequisite_course_id) {
            const [prereqCheck] = await connection.query(
                `SELECT * FROM enrollments e
                 JOIN course_offerings co ON e.offering_id = co.offering_id
                 WHERE e.student_id = ?
                   AND co.course_id = ?
                   AND e.status = 'COMPLETED'
                   AND e.grade IN ('A', 'B', 'C', 'D')`,
                [studentId, courseInfo[0].prerequisite_course_id]
            );

            if (prereqCheck.length === 0) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Prerequisite not met: ${courseInfo[0].prereq_code} required`
                });
            }
        }

        // Enroll student
        await connection.query(
            'INSERT INTO enrollments (student_id, offering_id, status) VALUES (?, ?, "ENROLLED")',
            [studentId, offeringId]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Enrollment successful'
        });
    } catch (error) {
        await connection.rollback();
        console.error('Enrollment error:', error);
        res.status(500).json({
            success: false,
            message: 'Enrollment failed',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Drop a course
router.post('/drop', isAuthenticated, isStudent, async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { enrollmentId } = req.body;
        const studentId = req.session.userId;

        // Verify enrollment belongs to student
        const [enrollments] = await connection.query(
            'SELECT * FROM enrollments WHERE enrollment_id = ? AND student_id = ?',
            [enrollmentId, studentId]
        );

        if (enrollments.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        if (enrollments[0].status !== 'ENROLLED') {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cannot drop this course'
            });
        }

        // Update enrollment status
        await connection.query(
            'UPDATE enrollments SET status = "DROPPED" WHERE enrollment_id = ?',
            [enrollmentId]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Course dropped successfully'
        });
    } catch (error) {
        await connection.rollback();
        console.error('Drop course error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to drop course',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Withdraw from a course
router.post('/withdraw', isAuthenticated, isStudent, async (req, res) => {
    try {
        const { enrollmentId } = req.body;
        const studentId = req.session.userId;

        // Verify and update
        const [result] = await pool.query(
            'UPDATE enrollments SET status = "WITHDRAWN" WHERE enrollment_id = ? AND student_id = ? AND status = "ENROLLED"',
            [enrollmentId, studentId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot withdraw from this course'
            });
        }

        res.json({
            success: true,
            message: 'Withdrawal successful'
        });
    } catch (error) {
        console.error('Withdraw error:', error);
        res.status(500).json({
            success: false,
            message: 'Withdrawal failed',
            error: error.message
        });
    }
});

// Get enrollment history
router.get('/history', isAuthenticated, isStudent, async (req, res) => {
    try {
        const [history] = await pool.query(
            `SELECT 
                e.*,
                c.course_code,
                c.course_name,
                c.credits,
                co.section_number,
                sem.semester_name,
                sem.academic_year,
                CONCAT(i.first_name, ' ', i.last_name) AS instructor_name
             FROM enrollments e
             JOIN course_offerings co ON e.offering_id = co.offering_id
             JOIN courses c ON co.course_id = c.course_id
             JOIN semesters sem ON co.semester_id = sem.semester_id
             LEFT JOIN instructors i ON co.instructor_id = i.instructor_id
             WHERE e.student_id = ?
             ORDER BY e.enrollment_date DESC`,
            [req.session.userId]
        );

        res.json({
            success: true,
            history
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch history',
            error: error.message
        });
    }
});

// Check if can enroll (validate prerequisites, conflicts, etc.)
router.post('/check-eligibility', isAuthenticated, isStudent, async (req, res) => {
    try {
        const { offeringId } = req.body;
        const studentId = req.session.userId;

        const eligibility = {
            canEnroll: true,
            reasons: []
        };

        // Check if already enrolled
        const [existing] = await pool.query(
            'SELECT * FROM enrollments WHERE student_id = ? AND offering_id = ?',
            [studentId, offeringId]
        );

        if (existing.length > 0) {
            eligibility.canEnroll = false;
            eligibility.reasons.push('Already enrolled in this course');
        }

        // Check capacity
        const [offerings] = await pool.query(
            'SELECT * FROM course_offerings WHERE offering_id = ?',
            [offeringId]
        );

        if (offerings[0].enrolled_count >= offerings[0].max_capacity) {
            eligibility.canEnroll = false;
            eligibility.reasons.push('Course is full');
        }

        // Check prerequisites
        const [courseInfo] = await pool.query(
            `SELECT c.*, prereq.course_code AS prereq_code
             FROM courses c
             LEFT JOIN courses prereq ON c.prerequisite_course_id = prereq.course_id
             WHERE c.course_id = ?`,
            [offerings[0].course_id]
        );

        if (courseInfo[0].prerequisite_course_id) {
            const [prereqCheck] = await pool.query(
                `SELECT * FROM enrollments e
                 JOIN course_offerings co ON e.offering_id = co.offering_id
                 WHERE e.student_id = ?
                   AND co.course_id = ?
                   AND e.status = 'COMPLETED'
                   AND e.grade IN ('A', 'B', 'C', 'D')`,
                [studentId, courseInfo[0].prerequisite_course_id]
            );

            if (prereqCheck.length === 0) {
                eligibility.canEnroll = false;
                eligibility.reasons.push(`Prerequisite required: ${courseInfo[0].prereq_code}`);
            }
        }

        res.json({
            success: true,
            eligibility
        });
    } catch (error) {
        console.error('Check eligibility error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check eligibility',
            error: error.message
        });
    }
});

module.exports = router;
