let currentUser = null;
let departments = [];
let courses = [];
let instructors = [];
let semesters = [];

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (!data.authenticated || data.user.type !== 'admin') {
            window.location.href = '/';
            return;
        }

        currentUser = data.user;
        document.getElementById('userName').textContent = data.user.name;
        document.getElementById('userAvatar').textContent = data.user.name.charAt(0).toUpperCase();
        
        loadDashboardData();
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/';
    }
}

// Load dashboard data
async function loadDashboardData() {
    await loadDashboardStats();
    await loadDepartments();
    // Show students tab by default
    showTab('students');
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await fetch('/api/admin/dashboard-stats');
        const data = await response.json();

        if (data.success) {
            document.getElementById('activeStudents').textContent = data.stats.activeStudents;
            document.getElementById('totalCourses').textContent = data.stats.totalCourses;
            document.getElementById('currentOfferings').textContent = data.stats.currentOfferings;
            document.getElementById('currentEnrollments').textContent = data.stats.currentEnrollments;
        }
    } catch (error) {
        console.error('Load stats error:', error);
    }
}

// Load departments
async function loadDepartments() {
    try {
        const response = await fetch('/api/courses/departments/list');
        const data = await response.json();

        if (data.success) {
            departments = data.departments;
            populateDepartmentSelects();
        }
    } catch (error) {
        console.error('Load departments error:', error);
    }
}

// Populate department dropdowns
function populateDepartmentSelects() {
    const selects = ['studentDepartment', 'courseDepartment', 'instructorDepartment'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Select Department</option>' +
                departments.map(d => `<option value="${d.department_id}">${d.department_name}</option>`).join('');
        }
    });
}

// Show tab
function showTab(tab) {
    // Hide all tabs
    const tabs = ['students', 'courses', 'offerings', 'instructors', 'semesters', 'reports'];
    tabs.forEach(t => {
        const element = document.getElementById(t + 'Tab');
        if (element) element.style.display = 'none';
    });

    // Show selected tab
    const selectedTab = document.getElementById(tab + 'Tab');
    if (selectedTab) selectedTab.style.display = 'block';

    // Load data for tab
    switch(tab) {
        case 'students':
            loadStudents();
            break;
        case 'courses':
            loadCourses();
            break;
        case 'offerings':
            loadOfferings();
            break;
        case 'instructors':
            loadInstructors();
            break;
        case 'semesters':
            loadSemesters();
            break;
    }
}

// Load students
async function loadStudents() {
    try {
        const container = document.getElementById('studentsList');
        container.innerHTML = '<p>Loading students...</p>';
        
        const response = await fetch('/api/admin/students');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        console.log('Students data:', data); // Debug log

        if (data.success && data.students && data.students.length > 0) {
            container.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <button class="btn btn-success" onclick="showAddStudentModal()">➕ Add Student</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Student Number</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>GPA</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.students.map(s => `
                            <tr>
                                <td>${s.student_number}</td>
                                <td>${s.first_name} ${s.last_name}</td>
                                <td>${s.email}</td>
                                <td>${s.department_name || 'N/A'}</td>
                                <td>${s.gpa != null ? Number(s.gpa).toFixed(2) : '0.00'}</td>
                                <td><span class="badge badge-${s.status === 'ACTIVE' ? 'success' : 'warning'}">${s.status}</span></td>
                                <td>
                                    ${s.status === 'ACTIVE' 
                                        ? `<button class="btn btn-warning btn-sm" onclick="toggleStudentStatus(${s.student_id}, 'INACTIVE')">Deactivate</button>`
                                        : `<button class="btn btn-success btn-sm" onclick="toggleStudentStatus(${s.student_id}, 'ACTIVE')">Activate</button>`
                                    }
                                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${s.student_id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            container.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <button class="btn btn-success" onclick="showAddStudentModal()">➕ Add Student</button>
                </div>
                <p>No students found. Click "Refresh" to reload.</p>
            `;
        }
    } catch (error) {
        console.error('Load students error:', error);
        const container = document.getElementById('studentsList');
        container.innerHTML = `<div class="alert alert-danger">
            <strong>Error loading students:</strong> ${error.message}<br>
            <small>Check console for details. Make sure you're logged in as admin.</small><br>
            <button class="btn btn-primary" onclick="loadStudents()">Try Again</button>
        </div>`;
    }
}

// Show add student modal
function showAddStudentModal() {
    document.getElementById('addStudentModal').classList.add('show');
}

// Add student form submission
document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        studentNumber: formData.get('studentNumber'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone') || null,
        dateOfBirth: formData.get('dateOfBirth') || null,
        gender: formData.get('gender') || null,
        address: formData.get('address') || null,
        departmentId: parseInt(formData.get('departmentId')),
        enrollmentYear: parseInt(formData.get('enrollmentYear'))
    };

    try {
        const response = await fetch('/api/admin/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Student added successfully', 'success');
            closeModal('addStudentModal');
            e.target.reset();
            loadStudents();
            loadDashboardStats();
        } else {
            showAlert(result.message || 'Failed to add student');
        }
    } catch (error) {
        console.error('Add student error:', error);
        showAlert('Failed to add student');
    }
});

// Toggle student status (activate/deactivate)
async function toggleStudentStatus(studentId, newStatus) {
    const action = newStatus === 'ACTIVE' ? 'activate' : 'deactivate';
    if (!confirm(`Are you sure you want to ${action} this student?`)) return;

    try {
        const response = await fetch(`/api/admin/students/${studentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (data.success) {
            showAlert(`Student ${action}d successfully`, 'success');
            loadStudents();
            loadDashboardStats();
        } else {
            showAlert(data.message || `Failed to ${action} student`);
        }
    } catch (error) {
        console.error(`Toggle student status error:`, error);
        showAlert(`Failed to ${action} student`);
    }
}

// Delete student
async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
        const response = await fetch(`/api/admin/students/${studentId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Student deleted successfully', 'success');
            loadStudents();
            loadDashboardStats();
        } else {
            showAlert(data.message || 'Failed to delete student');
        }
    } catch (error) {
        console.error('Delete student error:', error);
        showAlert('Failed to delete student');
    }
}

// Load courses
async function loadCourses() {
    try {
        const response = await fetch('/api/admin/courses');
        const data = await response.json();

        const container = document.getElementById('coursesList');

        if (data.success && data.courses.length > 0) {
            courses = data.courses;
            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Credits</th>
                            <th>Department</th>
                            <th>Prerequisite</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.courses.map(c => `
                            <tr>
                                <td>${c.course_code}</td>
                                <td>${c.course_name}</td>
                                <td>${c.credits}</td>
                                <td>${c.department_name || 'N/A'}</td>
                                <td>${c.prerequisite_code || 'None'}</td>
                                <td>
                                    <button class="btn btn-danger btn-sm" onclick="deleteCourse(${c.course_id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            container.innerHTML = '<p>No courses found</p>';
        }
    } catch (error) {
        console.error('Load courses error:', error);
        document.getElementById('coursesList').innerHTML = '<p>Failed to load courses</p>';
    }
}

// Show add course modal
function showAddCourseModal() {
    // Populate prerequisite dropdown
    const prereqSelect = document.getElementById('prerequisiteCourse');
    prereqSelect.innerHTML = '<option value="">None</option>' +
        courses.map(c => `<option value="${c.course_id}">${c.course_code} - ${c.course_name}</option>`).join('');
    
    document.getElementById('addCourseModal').classList.add('show');
}

// Add course form submission
document.getElementById('addCourseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        courseCode: formData.get('courseCode'),
        courseName: formData.get('courseName'),
        description: formData.get('description'),
        credits: parseInt(formData.get('credits')),
        departmentId: parseInt(formData.get('departmentId')),
        prerequisiteCourseId: formData.get('prerequisiteCourseId') || null
    };

    try {
        const response = await fetch('/api/admin/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Course added successfully', 'success');
            closeModal('addCourseModal');
            e.target.reset();
            loadCourses();
            loadDashboardStats();
        } else {
            showAlert(result.message || 'Failed to add course');
        }
    } catch (error) {
        console.error('Add course error:', error);
        showAlert('Failed to add course');
    }
});

// Delete course
async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
        const response = await fetch(`/api/admin/courses/${courseId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Course deleted successfully', 'success');
            loadCourses();
            loadDashboardStats();
        } else {
            showAlert(data.message || 'Failed to delete course');
        }
    } catch (error) {
        console.error('Delete course error:', error);
        showAlert('Failed to delete course');
    }
}

// Load offerings
async function loadOfferings() {
    try {
        const response = await fetch('/api/admin/offerings');
        const data = await response.json();

        const container = document.getElementById('offeringsList');

        if (data.success && data.offerings.length > 0) {
            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Semester</th>
                            <th>Section</th>
                            <th>Instructor</th>
                            <th>Schedule</th>
                            <th>Capacity</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.offerings.map(o => `
                            <tr>
                                <td>${o.course_code}</td>
                                <td>${o.semester_name} ${o.academic_year}</td>
                                <td>${o.section_number}</td>
                                <td>${o.instructor_name || 'TBA'}</td>
                                <td>${o.schedule_days} ${o.schedule_time}</td>
                                <td>${o.enrolled_count} / ${o.max_capacity}</td>
                                <td><span class="badge badge-${o.status === 'OPEN' ? 'success' : 'warning'}">${o.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            container.innerHTML = '<p>No offerings found</p>';
        }
    } catch (error) {
        console.error('Load offerings error:', error);
        document.getElementById('offeringsList').innerHTML = '<p>Failed to load offerings</p>';
    }
}

// Show add offering modal
async function showAddOfferingModal() {
    // Load data for dropdowns
    if (courses.length === 0) {
        const response = await fetch('/api/admin/courses');
        const data = await response.json();
        if (data.success) courses = data.courses;
    }

    if (semesters.length === 0) {
        const response = await fetch('/api/admin/semesters');
        const data = await response.json();
        if (data.success) semesters = data.semesters;
    }

    if (instructors.length === 0) {
        const response = await fetch('/api/admin/instructors');
        const data = await response.json();
        if (data.success) instructors = data.instructors;
    }

    // Populate dropdowns
    document.getElementById('offeringCourse').innerHTML = 
        courses.map(c => `<option value="${c.course_id}">${c.course_code} - ${c.course_name}</option>`).join('');
    
    document.getElementById('offeringSemester').innerHTML = 
        semesters.map(s => `<option value="${s.semester_id}">${s.semester_name} ${s.academic_year}</option>`).join('');
    
    document.getElementById('offeringInstructor').innerHTML = 
        instructors.map(i => `<option value="${i.instructor_id}">${i.first_name} ${i.last_name}</option>`).join('');

    document.getElementById('addOfferingModal').classList.add('show');
}

// Add offering form submission
document.getElementById('addOfferingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        courseId: parseInt(formData.get('courseId')),
        semesterId: parseInt(formData.get('semesterId')),
        instructorId: parseInt(formData.get('instructorId')),
        sectionNumber: formData.get('sectionNumber'),
        maxCapacity: parseInt(formData.get('maxCapacity')),
        scheduleDays: formData.get('scheduleDays'),
        scheduleTime: formData.get('scheduleTime'),
        classroom: formData.get('classroom')
    };

    try {
        const response = await fetch('/api/admin/offerings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Course offering added successfully', 'success');
            closeModal('addOfferingModal');
            e.target.reset();
            loadOfferings();
            loadDashboardStats();
        } else {
            showAlert(result.message || 'Failed to add offering');
        }
    } catch (error) {
        console.error('Add offering error:', error);
        showAlert('Failed to add offering');
    }
});

// Load instructors
async function loadInstructors() {
    try {
        const response = await fetch('/api/admin/instructors');
        const data = await response.json();

        const container = document.getElementById('instructorsList');

        if (data.success && data.instructors.length > 0) {
            instructors = data.instructors;
            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th>Office</th>
                            <th>Hire Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.instructors.map(i => `
                            <tr>
                                <td>${i.first_name} ${i.last_name}</td>
                                <td>${i.email}</td>
                                <td>${i.phone || 'N/A'}</td>
                                <td>${i.department_name || 'N/A'}</td>
                                <td>${i.office_location || 'N/A'}</td>
                                <td>${i.hire_date ? new Date(i.hire_date).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            container.innerHTML = '<p>No instructors found</p>';
        }
    } catch (error) {
        console.error('Load instructors error:', error);
        document.getElementById('instructorsList').innerHTML = '<p>Failed to load instructors</p>';
    }
}

// Show add instructor modal
function showAddInstructorModal() {
    document.getElementById('addInstructorModal').classList.add('show');
}

// Add instructor form submission
document.getElementById('addInstructorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        departmentId: parseInt(formData.get('departmentId')),
        hireDate: formData.get('hireDate'),
        officeLocation: formData.get('officeLocation')
    };

    try {
        const response = await fetch('/api/admin/instructors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Instructor added successfully', 'success');
            closeModal('addInstructorModal');
            e.target.reset();
            loadInstructors();
        } else {
            showAlert(result.message || 'Failed to add instructor');
        }
    } catch (error) {
        console.error('Add instructor error:', error);
        showAlert('Failed to add instructor');
    }
});

// Load semesters
async function loadSemesters() {
    try {
        const response = await fetch('/api/admin/semesters');
        const data = await response.json();

        const container = document.getElementById('semestersList');

        if (data.success && data.semesters.length > 0) {
            semesters = data.semesters;
            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Semester</th>
                            <th>Academic Year</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Registration Period</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.semesters.map(s => `
                            <tr>
                                <td>${s.semester_name}</td>
                                <td>${s.academic_year}</td>
                                <td>${new Date(s.start_date).toLocaleDateString()}</td>
                                <td>${new Date(s.end_date).toLocaleDateString()}</td>
                                <td>${new Date(s.registration_start).toLocaleDateString()} - ${new Date(s.registration_end).toLocaleDateString()}</td>
                                <td><span class="badge badge-${s.is_current ? 'success' : 'info'}">${s.is_current ? 'Current' : 'Inactive'}</span></td>
                                <td>
                                    ${!s.is_current ? `<button class="btn btn-success btn-sm" onclick="setCurrentSemester(${s.semester_id})">Set Current</button>` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            container.innerHTML = '<p>No semesters found</p>';
        }
    } catch (error) {
        console.error('Load semesters error:', error);
        document.getElementById('semestersList').innerHTML = '<p>Failed to load semesters</p>';
    }
}

// Show add semester modal
function showAddSemesterModal() {
    document.getElementById('addSemesterModal').classList.add('show');
}

// Add semester form submission
document.getElementById('addSemesterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        semesterName: formData.get('semesterName'),
        academicYear: formData.get('academicYear'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        registrationStart: formData.get('registrationStart'),
        registrationEnd: formData.get('registrationEnd'),
        isCurrent: formData.get('isCurrent') === 'on'
    };

    try {
        const response = await fetch('/api/admin/semesters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Semester added successfully', 'success');
            closeModal('addSemesterModal');
            e.target.reset();
            loadSemesters();
        } else {
            showAlert(result.message || 'Failed to add semester');
        }
    } catch (error) {
        console.error('Add semester error:', error);
        showAlert('Failed to add semester');
    }
});

// Set current semester
async function setCurrentSemester(semesterId) {
    if (!confirm('Set this as the current semester?')) return;

    try {
        const response = await fetch(`/api/admin/semesters/${semesterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isCurrent: true })
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Current semester updated', 'success');
            loadSemesters();
        } else {
            showAlert(data.message || 'Failed to update semester');
        }
    } catch (error) {
        console.error('Update semester error:', error);
        showAlert('Failed to update semester');
    }
}

// Load reports
async function loadReport(reportType) {
    const reportContent = document.getElementById('reportContent');
    const reportTitle = document.getElementById('reportTitle');
    const reportData = document.getElementById('reportData');

    reportContent.style.display = 'block';
    reportData.innerHTML = '<p>Loading report...</p>';

    try {
        let endpoint = '';
        let title = '';

        switch(reportType) {
            case 'enrollment-stats':
                endpoint = '/api/reports/enrollment-stats';
                title = 'Enrollment Statistics';
                break;
            case 'popular-courses':
                endpoint = '/api/reports/popular-courses';
                title = 'Popular Courses';
                break;
            case 'department-stats':
                endpoint = '/api/reports/department-stats';
                title = 'Department Statistics';
                break;
            case 'instructor-workload':
                endpoint = '/api/reports/instructor-workload';
                title = 'Instructor Workload';
                break;
            case 'capacity-utilization':
                endpoint = '/api/reports/capacity-utilization';
                title = 'Capacity Utilization';
                break;
            case 'student-load':
                endpoint = '/api/reports/student-load';
                title = 'Student Load';
                break;
        }

        reportTitle.textContent = title;

        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.success) {
            displayReport(reportType, data);
        } else {
            reportData.innerHTML = '<p>Failed to load report</p>';
        }
    } catch (error) {
        console.error('Load report error:', error);
        reportData.innerHTML = '<p>Error loading report</p>';
    }
}

// Display report
function displayReport(type, data) {
    const reportData = document.getElementById('reportData');

    switch(type) {
        case 'enrollment-stats':
            reportData.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Semester</th>
                            <th>Academic Year</th>
                            <th>Total Enrollments</th>
                            <th>Unique Students</th>
                            <th>Courses Offered</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.stats.map(s => `
                            <tr>
                                <td>${s.semester_name}</td>
                                <td>${s.academic_year}</td>
                                <td>${s.total_enrollments}</td>
                                <td>${s.unique_students}</td>
                                <td>${s.courses_offered}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;

        case 'popular-courses':
            reportData.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Department</th>
                            <th>Total Enrollments</th>
                            <th>Avg Section Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.courses.map(c => `
                            <tr>
                                <td>${c.course_code}</td>
                                <td>${c.course_name}</td>
                                <td>${c.department_name}</td>
                                <td>${c.total_enrollments}</td>
                                <td>${c.avg_section_size ? parseFloat(c.avg_section_size).toFixed(1) : 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;

        case 'department-stats':
            reportData.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th>Students</th>
                            <th>Courses</th>
                            <th>Sections</th>
                            <th>Enrollments</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.stats.map(d => `
                            <tr>
                                <td>${d.department_name}</td>
                                <td>${d.total_students}</td>
                                <td>${d.courses_offered}</td>
                                <td>${d.total_sections}</td>
                                <td>${d.total_enrollments}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;

        case 'instructor-workload':
            reportData.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Instructor</th>
                            <th>Department</th>
                            <th>Courses Teaching</th>
                            <th>Total Students</th>
                            <th>Avg Class Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.instructors.map(i => `
                            <tr>
                                <td>${i.instructor_name}</td>
                                <td>${i.department_name || 'N/A'}</td>
                                <td>${i.courses_teaching}</td>
                                <td>${i.total_students}</td>
                                <td>${i.avg_class_size}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;

        case 'capacity-utilization':
            reportData.innerHTML = `
                <h4>Overall Utilization</h4>
                <p><strong>Total Capacity:</strong> ${data.overall.total_capacity}</p>
                <p><strong>Total Enrolled:</strong> ${data.overall.total_enrolled}</p>
                <p><strong>Empty Seats:</strong> ${data.overall.empty_seats}</p>
                <p><strong>Utilization Rate:</strong> ${data.overall.utilization_rate}%</p>
                <hr>
                <h4>By Department</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th>Total Capacity</th>
                            <th>Seats Filled</th>
                            <th>Utilization %</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.byDepartment.map(d => `
                            <tr>
                                <td>${d.department_name}</td>
                                <td>${d.total_capacity}</td>
                                <td>${d.seats_filled}</td>
                                <td>${d.utilization_percentage}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;

        case 'student-load':
            reportData.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Student Number</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Courses Enrolled</th>
                            <th>Total Credits</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.students.map(s => `
                            <tr>
                                <td>${s.student_number}</td>
                                <td>${s.student_name}</td>
                                <td>${s.department_name || 'N/A'}</td>
                                <td>${s.courses_enrolled}</td>
                                <td>${s.total_credits}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
    }
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Logout
async function logout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Alert functions
function showAlert(message, type = 'danger') {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`;
    setTimeout(() => hideAlert(), 5000);
}

function hideAlert() {
    const alertBox = document.getElementById('alertBox');
    alertBox.classList.remove('show');
}

// Initialize
checkAuth();
