const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { pool } = require('../config/database');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Get all students
router.get('/students', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [students] = await pool.query(
            `SELECT s.*, d.department_name
             FROM students s
             LEFT JOIN departments d ON s.department_id = d.department_id
             ORDER BY s.student_number`
        );

        res.json({
            success: true,
            students
        });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch students',
            error: error.message
        });
    }
});

// Add new student
router.post('/students', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const {
            studentNumber, firstName, lastName, email, password,
            phone, dateOfBirth, gender, address, departmentId, enrollmentYear
        } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO students 
            (student_number, first_name, last_name, email, password_hash, phone,
             date_of_birth, gender, address, department_id, enrollment_year, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
            [studentNumber, firstName, lastName, email, passwordHash, phone,
             dateOfBirth, gender, address, departmentId, enrollmentYear]
        );

        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            studentId: result.insertId
        });
    } catch (error) {
        console.error('Add student error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add student',
            error: error.message
        });
    }
});

// Update student
router.put('/students/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { firstName, lastName, phone, address, status, gpa, currentSemester } = req.body;

        // Build dynamic update query based on provided fields
        const updates = [];
        const values = [];

        if (firstName !== undefined) { updates.push('first_name = ?'); values.push(firstName); }
        if (lastName !== undefined) { updates.push('last_name = ?'); values.push(lastName); }
        if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
        if (address !== undefined) { updates.push('address = ?'); values.push(address); }
        if (status !== undefined) { updates.push('status = ?'); values.push(status); }
        if (gpa !== undefined) { updates.push('gpa = ?'); values.push(gpa); }
        if (currentSemester !== undefined) { updates.push('current_semester = ?'); values.push(currentSemester); }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(req.params.id);

        await pool.query(
            `UPDATE students SET ${updates.join(', ')} WHERE student_id = ?`,
            values
        );

        res.json({
            success: true,
            message: 'Student updated successfully'
        });
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update student',
            error: error.message
        });
    }
});

// Delete student
router.delete('/students/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM students WHERE student_id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete student',
            error: error.message
        });
    }
});

// Get all courses
router.get('/courses', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [courses] = await pool.query(
            `SELECT c.*, d.department_name, prereq.course_code AS prerequisite_code
             FROM courses c
             LEFT JOIN departments d ON c.department_id = d.department_id
             LEFT JOIN courses prereq ON c.prerequisite_course_id = prereq.course_id
             ORDER BY c.course_code`
        );

        res.json({
            success: true,
            courses
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
            error: error.message
        });
    }
});

// Add new course
router.post('/courses', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { courseCode, courseName, description, credits, departmentId, prerequisiteCourseId } = req.body;

        const [result] = await pool.query(
            `INSERT INTO courses (course_code, course_name, description, credits, department_id, prerequisite_course_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [courseCode, courseName, description, credits, departmentId, prerequisiteCourseId || null]
        );

        res.status(201).json({
            success: true,
            message: 'Course added successfully',
            courseId: result.insertId
        });
    } catch (error) {
        console.error('Add course error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add course',
            error: error.message
        });
    }
});

// Update course
router.put('/courses/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { courseName, description, credits, departmentId, prerequisiteCourseId } = req.body;

        await pool.query(
            `UPDATE courses 
             SET course_name = ?, description = ?, credits = ?, department_id = ?, prerequisite_course_id = ?
             WHERE course_id = ?`,
            [courseName, description, credits, departmentId, prerequisiteCourseId || null, req.params.id]
        );

        res.json({
            success: true,
            message: 'Course updated successfully'
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update course',
            error: error.message
        });
    }
});

// Delete course
router.delete('/courses/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM courses WHERE course_id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete course',
            error: error.message
        });
    }
});

// Get all course offerings
router.get('/offerings', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [offerings] = await pool.query(
            `SELECT 
                co.*,
                c.course_code,
                c.course_name,
                sem.semester_name,
                sem.academic_year,
                CONCAT(i.first_name, ' ', i.last_name) AS instructor_name
             FROM course_offerings co
             JOIN courses c ON co.course_id = c.course_id
             JOIN semesters sem ON co.semester_id = sem.semester_id
             LEFT JOIN instructors i ON co.instructor_id = i.instructor_id
             ORDER BY sem.academic_year DESC, c.course_code`
        );

        res.json({
            success: true,
            offerings
        });
    } catch (error) {
        console.error('Get offerings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch offerings',
            error: error.message
        });
    }
});

// Add course offering
router.post('/offerings', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const {
            courseId, semesterId, instructorId, sectionNumber,
            maxCapacity, scheduleDays, scheduleTime, classroom
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO course_offerings 
            (course_id, semester_id, instructor_id, section_number, max_capacity,
             schedule_days, schedule_time, classroom, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
            [courseId, semesterId, instructorId, sectionNumber, maxCapacity,
             scheduleDays, scheduleTime, classroom]
        );

        res.status(201).json({
            success: true,
            message: 'Course offering added successfully',
            offeringId: result.insertId
        });
    } catch (error) {
        console.error('Add offering error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add course offering',
            error: error.message
        });
    }
});

// Update course offering
router.put('/offerings/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const {
            instructorId, maxCapacity, scheduleDays, scheduleTime, classroom, status
        } = req.body;

        await pool.query(
            `UPDATE course_offerings 
             SET instructor_id = ?, max_capacity = ?, schedule_days = ?,
                 schedule_time = ?, classroom = ?, status = ?
             WHERE offering_id = ?`,
            [instructorId, maxCapacity, scheduleDays, scheduleTime, classroom, status, req.params.id]
        );

        res.json({
            success: true,
            message: 'Course offering updated successfully'
        });
    } catch (error) {
        console.error('Update offering error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update course offering',
            error: error.message
        });
    }
});

// Get all instructors
router.get('/instructors', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [instructors] = await pool.query(
            `SELECT i.*, d.department_name
             FROM instructors i
             LEFT JOIN departments d ON i.department_id = d.department_id
             ORDER BY i.last_name, i.first_name`
        );

        res.json({
            success: true,
            instructors
        });
    } catch (error) {
        console.error('Get instructors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch instructors',
            error: error.message
        });
    }
});

// Add instructor
router.post('/instructors', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const {
            firstName, lastName, email, phone, departmentId, hireDate, officeLocation
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO instructors 
            (first_name, last_name, email, phone, department_id, hire_date, office_location)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, phone, departmentId, hireDate, officeLocation]
        );

        res.status(201).json({
            success: true,
            message: 'Instructor added successfully',
            instructorId: result.insertId
        });
    } catch (error) {
        console.error('Add instructor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add instructor',
            error: error.message
        });
    }
});

// Get all semesters
router.get('/semesters', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [semesters] = await pool.query(
            'SELECT * FROM semesters ORDER BY academic_year DESC, semester_name'
        );

        res.json({
            success: true,
            semesters
        });
    } catch (error) {
        console.error('Get semesters error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch semesters',
            error: error.message
        });
    }
});

// Add semester
router.post('/semesters', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const {
            semesterName, academicYear, startDate, endDate,
            registrationStart, registrationEnd, isCurrent
        } = req.body;

        // If setting as current, unset others
        if (isCurrent) {
            await pool.query('UPDATE semesters SET is_current = FALSE');
        }

        const [result] = await pool.query(
            `INSERT INTO semesters 
            (semester_name, academic_year, start_date, end_date,
             registration_start, registration_end, is_current)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [semesterName, academicYear, startDate, endDate,
             registrationStart, registrationEnd, isCurrent]
        );

        res.status(201).json({
            success: true,
            message: 'Semester added successfully',
            semesterId: result.insertId
        });
    } catch (error) {
        console.error('Add semester error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add semester',
            error: error.message
        });
    }
});

// Update semester
router.put('/semesters/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { isCurrent } = req.body;

        if (isCurrent) {
            await pool.query('UPDATE semesters SET is_current = FALSE');
        }

        await pool.query(
            'UPDATE semesters SET is_current = ? WHERE semester_id = ?',
            [isCurrent, req.params.id]
        );

        res.json({
            success: true,
            message: 'Semester updated successfully'
        });
    } catch (error) {
        console.error('Update semester error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update semester',
            error: error.message
        });
    }
});

// Get dashboard statistics
router.get('/dashboard-stats', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [[studentCount]] = await pool.query(
            'SELECT COUNT(*) as count FROM students WHERE status = "ACTIVE"'
        );

        const [[courseCount]] = await pool.query(
            'SELECT COUNT(*) as count FROM courses'
        );

        const [[offeringCount]] = await pool.query(
            `SELECT COUNT(*) as count FROM course_offerings co
             JOIN semesters sem ON co.semester_id = sem.semester_id
             WHERE sem.is_current = TRUE`
        );

        const [[enrollmentCount]] = await pool.query(
            `SELECT COUNT(*) as count FROM enrollments e
             JOIN course_offerings co ON e.offering_id = co.offering_id
             JOIN semesters sem ON co.semester_id = sem.semester_id
             WHERE sem.is_current = TRUE AND e.status = 'ENROLLED'`
        );

        res.json({
            success: true,
            stats: {
                activeStudents: studentCount.count,
                totalCourses: courseCount.count,
                currentOfferings: offeringCount.count,
                currentEnrollments: enrollmentCount.count
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

module.exports = router;
