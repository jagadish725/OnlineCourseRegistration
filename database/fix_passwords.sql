-- Fix Password Hashes
-- This file updates all student and admin passwords to use proper bcrypt hashes

-- Update student passwords (password: student123)
UPDATE students SET password_hash = '$2a$10$88kTyjUzsMy9TyLAzL/Q9eGq1H1q9CdA3coQIxJZFdxUZVPz7f00O';

-- Update admin passwords (password: admin123)
UPDATE admins SET password_hash = '$2a$10$gClTsLjZAT.frykHGDZfru.MCKqezFB6cHuyKWavmo68mvZYVvRDK';

-- Verify updates
SELECT 'Student passwords updated:' AS Status, COUNT(*) AS Count FROM students;
SELECT 'Admin passwords updated:' AS Status, COUNT(*) AS Count FROM admins;
