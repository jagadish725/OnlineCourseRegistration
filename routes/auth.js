const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { pool } = require('../config/database');

// Student Login
router.post('/student/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find student
        const [students] = await pool.query(
            'SELECT * FROM students WHERE email = ? AND status = "ACTIVE"',
            [email]
        );

        if (students.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const student = students[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, student.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create session
        req.session.userId = student.student_id;
        req.session.userType = 'student';
        req.session.email = student.email;
        req.session.name = `${student.first_name} ${student.last_name}`;

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: student.student_id,
                studentNumber: student.student_number,
                name: `${student.first_name} ${student.last_name}`,
                email: student.email,
                type: 'student'
            }
        });
    } catch (error) {
        console.error('Student login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find admin
        const [admins] = await pool.query(
            'SELECT * FROM admins WHERE email = ?',
            [email]
        );

        if (admins.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const admin = admins[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create session
        req.session.userId = admin.admin_id;
        req.session.userType = 'admin';
        req.session.email = admin.email;
        req.session.name = admin.full_name;
        req.session.role = admin.role;

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: admin.admin_id,
                name: admin.full_name,
                email: admin.email,
                role: admin.role,
                type: 'admin'
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Student Registration
router.post('/student/register', async (req, res) => {
    try {
        const {
            studentNumber,
            firstName,
            lastName,
            email,
            password,
            phone,
            dateOfBirth,
            gender,
            address,
            departmentId,
            enrollmentYear
        } = req.body;

        // Validate required fields
        if (!studentNumber || !firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if email already exists
        const [existing] = await pool.query(
            'SELECT * FROM students WHERE email = ? OR student_number = ?',
            [email, studentNumber]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email or student number already registered'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert student
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
            message: 'Registration successful',
            studentId: result.insertId
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        res.json({
            success: true,
            message: 'Logout successful'
        });
    });
});

// Check session
router.get('/session', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({
            success: true,
            authenticated: true,
            user: {
                id: req.session.userId,
                name: req.session.name,
                email: req.session.email,
                type: req.session.userType,
                role: req.session.role
            }
        });
    } else {
        res.json({
            success: true,
            authenticated: false
        });
    }
});

module.exports = router;
