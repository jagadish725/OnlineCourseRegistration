const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Get all available courses for current semester
router.get('/available', isAuthenticated, async (req, res) => {
    try {
        const { department, search } = req.query;
        
        let query = `
            SELECT 
                co.offering_id,
                c.course_id,
                c.course_code,
                c.course_name,
                c.description,
                c.credits,
                d.department_name,
                co.section_number,
                co.schedule_days,
                co.schedule_time,
                co.classroom,
                co.max_capacity,
                co.enrolled_count,
                (co.max_capacity - co.enrolled_count) AS available_seats,
                co.status,
                CONCAT(i.first_name, ' ', i.last_name) AS instructor_name,
                prereq.course_code AS prerequisite_code
            FROM course_offerings co
            JOIN courses c ON co.course_id = c.course_id
            JOIN semesters sem ON co.semester_id = sem.semester_id
            LEFT JOIN departments d ON c.department_id = d.department_id
            LEFT JOIN instructors i ON co.instructor_id = i.instructor_id
            LEFT JOIN courses prereq ON c.prerequisite_course_id = prereq.course_id
            WHERE sem.is_current = TRUE
              AND co.status = 'OPEN'
        `;

        const params = [];

        if (department) {
            query += ' AND d.department_id = ?';
            params.push(department);
        }

        if (search) {
            query += ' AND (c.course_code LIKE ? OR c.course_name LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY c.course_code, co.section_number';

        const [courses] = await pool.query(query, params);

        res.json({
            success: true,
            courses
        });
    } catch (error) {
        console.error('Get available courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
            error: error.message
        });
    }
});

// Get course details
router.get('/:offeringId', isAuthenticated, async (req, res) => {
    try {
        const [courses] = await pool.query(
            `SELECT 
                co.*,
                c.course_code,
                c.course_name,
                c.description,
                c.credits,
                d.department_name,
                sem.semester_name,
                sem.academic_year,
                CONCAT(i.first_name, ' ', i.last_name) AS instructor_name,
                i.email AS instructor_email,
                i.office_location,
                prereq.course_code AS prerequisite_code,
                prereq.course_name AS prerequisite_name
             FROM course_offerings co
             JOIN courses c ON co.course_id = c.course_id
             JOIN semesters sem ON co.semester_id = sem.semester_id
             LEFT JOIN departments d ON c.department_id = d.department_id
             LEFT JOIN instructors i ON co.instructor_id = i.instructor_id
             LEFT JOIN courses prereq ON c.prerequisite_course_id = prereq.course_id
             WHERE co.offering_id = ?`,
            [req.params.offeringId]
        );

        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            course: courses[0]
        });
    } catch (error) {
        console.error('Get course details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course details',
            error: error.message
        });
    }
});

// Get all departments
router.get('/departments/list', isAuthenticated, async (req, res) => {
    try {
        const [departments] = await pool.query(
            'SELECT * FROM departments ORDER BY department_name'
        );

        res.json({
            success: true,
            departments
        });
    } catch (error) {
        console.error('Get departments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch departments',
            error: error.message
        });
    }
});

// Search courses
router.post('/search', isAuthenticated, async (req, res) => {
    try {
        const { keyword, departmentId, credits, days } = req.body;

        let query = `
            SELECT 
                co.offering_id,
                c.course_code,
                c.course_name,
                c.credits,
                d.department_name,
                co.section_number,
                co.schedule_days,
                co.schedule_time,
                co.max_capacity,
                co.enrolled_count,
                (co.max_capacity - co.enrolled_count) AS available_seats,
                CONCAT(i.first_name, ' ', i.last_name) AS instructor_name
            FROM course_offerings co
            JOIN courses c ON co.course_id = c.course_id
            JOIN semesters sem ON co.semester_id = sem.semester_id
            LEFT JOIN departments d ON c.department_id = d.department_id
            LEFT JOIN instructors i ON co.instructor_id = i.instructor_id
            WHERE sem.is_current = TRUE AND co.status = 'OPEN'
        `;

        const params = [];

        if (keyword) {
            query += ' AND (c.course_code LIKE ? OR c.course_name LIKE ? OR c.description LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        if (departmentId) {
            query += ' AND d.department_id = ?';
            params.push(departmentId);
        }

        if (credits) {
            query += ' AND c.credits = ?';
            params.push(credits);
        }

        if (days) {
            query += ' AND co.schedule_days LIKE ?';
            params.push(`%${days}%`);
        }

        query += ' ORDER BY c.course_code';

        const [courses] = await pool.query(query, params);

        res.json({
            success: true,
            count: courses.length,
            courses
        });
    } catch (error) {
        console.error('Search courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
});

module.exports = router;
