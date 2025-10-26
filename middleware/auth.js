// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please login first.'
    });
}

// Student authentication middleware
function isStudent(req, res, next) {
    if (req.session && req.session.userType === 'student') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Access denied. Students only.'
    });
}

// Admin authentication middleware
function isAdmin(req, res, next) {
    if (req.session && req.session.userType === 'admin') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.'
    });
}

module.exports = {
    isAuthenticated,
    isStudent,
    isAdmin
};
