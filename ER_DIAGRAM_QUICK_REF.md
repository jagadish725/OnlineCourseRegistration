# 📊 ER Diagram Quick Reference

## View the ER Diagram

You can view the Entity-Relationship diagram in multiple formats:

### 1. **Mermaid Diagram (Recommended)**
- Open: [`ER_DIAGRAM.md`](ER_DIAGRAM.md)
- Best viewed in: GitHub, VS Code (with Mermaid extension), or any Markdown viewer with Mermaid support
- Contains: Interactive visual diagram + detailed documentation

### 2. **ASCII Art Diagram**
- Open: [`ER_DIAGRAM_ASCII.txt`](ER_DIAGRAM_ASCII.txt)
- Best viewed in: Any text editor, terminal, or code editor
- Contains: Text-based visual representation

### 3. **Database Design Document**
- Open: [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md)
- Contains: Textual ER diagram description, entities, relationships

---

## Quick ER Diagram Summary

### 🎯 9 Entities

1. **STUDENTS** - Student accounts and information
2. **COURSES** - Course catalog
3. **INSTRUCTORS** - Faculty information
4. **DEPARTMENTS** - Academic departments
5. **SEMESTERS** - Academic terms
6. **COURSE_OFFERINGS** - Course sections per semester
7. **ENROLLMENTS** - Student registrations
8. **WAITLIST** - Course waitlist
9. **ADMINS** - Administrator accounts

### 🔗 9 Key Relationships

1. **DEPARTMENTS → STUDENTS** (1:N) - A department has many students
2. **DEPARTMENTS → COURSES** (1:N) - A department offers many courses
3. **DEPARTMENTS → INSTRUCTORS** (1:N) - A department employs many instructors
4. **COURSES → COURSES** (1:N, Recursive) - Course prerequisites
5. **COURSES → COURSE_OFFERINGS** (1:N) - A course has many sections
6. **SEMESTERS → COURSE_OFFERINGS** (1:N) - A semester schedules many offerings
7. **INSTRUCTORS → COURSE_OFFERINGS** (1:N) - An instructor teaches many sections
8. **STUDENTS ↔ COURSE_OFFERINGS** (M:N via ENROLLMENTS) - Students enroll in offerings
9. **STUDENTS ↔ COURSE_OFFERINGS** (M:N via WAITLIST) - Students wait for offerings

---

## 📐 Simplified Visual Structure

```
                    DEPARTMENTS
                    (Central Hub)
                         |
          ┌──────────────┼──────────────┐
          |              |              |
      STUDENTS       COURSES      INSTRUCTORS
          |              |              |
          |              └──────┬───────┘
          |                     |
          |              COURSE_OFFERINGS
          |                     |
          └──────┬──────────────┘
                 |
          ┌──────┴──────┐
          |             |
     ENROLLMENTS    WAITLIST
```

---

## 🎨 Entity Color Coding (in ASCII diagram)

- **Blue** - Core/Central Entities (DEPARTMENTS)
- **Green** - User Entities (STUDENTS, INSTRUCTORS)
- **Yellow** - Time Entities (SEMESTERS)
- **Orange** - Associative/Weak Entities (COURSE_OFFERINGS)
- **Red** - Relationship Entities (ENROLLMENTS, WAITLIST)
- **Purple** - Independent Entities (ADMINS)

---

## 🔑 Primary & Foreign Keys

### Primary Keys (PKs)
All tables have auto-increment integer primary keys:
- `student_id`, `course_id`, `instructor_id`, `department_id`, etc.

### Foreign Keys (FKs)
Key relationships maintained via foreign keys:
- `STUDENTS.department_id` → `DEPARTMENTS.department_id`
- `COURSES.department_id` → `DEPARTMENTS.department_id`
- `COURSES.prerequisite_course_id` → `COURSES.course_id`
- `COURSE_OFFERINGS.course_id` → `COURSES.course_id`
- `COURSE_OFFERINGS.semester_id` → `SEMESTERS.semester_id`
- `COURSE_OFFERINGS.instructor_id` → `INSTRUCTORS.instructor_id`
- `ENROLLMENTS.student_id` → `STUDENTS.student_id`
- `ENROLLMENTS.offering_id` → `COURSE_OFFERINGS.offering_id`
- `WAITLIST.student_id` → `STUDENTS.student_id`
- `WAITLIST.offering_id` → `COURSE_OFFERINGS.offering_id`

---

## 🎓 Normalization Status

✅ **Third Normal Form (3NF)** compliant

- **1NF**: All attributes are atomic
- **2NF**: No partial dependencies on composite keys
- **3NF**: No transitive dependencies

**Exception:** `enrolled_count` in `COURSE_OFFERINGS` is denormalized for performance but maintained via triggers.

See [`docs/NORMALIZATION.md`](docs/NORMALIZATION.md) for detailed analysis.

---

## 🔧 Special Features

### Triggers (3 total)
1. `after_enrollment_insert` - Updates enrolled_count when student enrolls
2. `after_enrollment_update` - Updates enrolled_count when enrollment status changes
3. `before_enrollment_insert` - Validates capacity before enrollment

### Views (3 total)
1. `student_enrollment_summary` - Student enrollment statistics
2. `course_offerings_detail` - Complete offering information
3. `enrollment_details` - Full enrollment information

### Indexes
- Auto-indexed: All PKs, FKs, and Unique Keys
- Custom indexes on frequently queried columns

---

## 📖 How to Read the ER Diagram

### Cardinality Notation

- **1:1** (One-to-One) - Single line both sides
- **1:N** (One-to-Many) - Single line one side, crow's foot other side
- **M:N** (Many-to-Many) - Crow's foot both sides (requires junction table)

### Participation

- **Total** (Mandatory) - Double line, entity must participate
- **Partial** (Optional) - Single line, entity may participate

### Example

```
DEPARTMENTS ||--o{ STUDENTS
     (1)            (N)
```

Reads as: "One department has many students" (1:N relationship)

---

## 🚀 Using the ER Diagram

### For Development
- Reference entity structure when writing queries
- Understand relationships for JOIN operations
- Identify foreign key constraints

### For Documentation
- Explain database design to stakeholders
- Show data flow and relationships
- Demonstrate normalization

### For Learning
- Study proper database design principles
- Understand ER modeling techniques
- Learn relationship cardinality

---

## 💡 Tips

1. **GitHub Users**: View `ER_DIAGRAM.md` on GitHub for best rendering
2. **VS Code Users**: Install "Markdown Preview Mermaid Support" extension
3. **Terminal Users**: Use `ER_DIAGRAM_ASCII.txt` for text-based view
4. **Print/Export**: Use GitHub's print function to export as PDF

---

## 📝 Need More Detail?

- Full documentation: [`ER_DIAGRAM.md`](ER_DIAGRAM.md)
- Database design: [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md)
- Normalization proof: [`docs/NORMALIZATION.md`](docs/NORMALIZATION.md)

---

**Quick Reference Guide for Online Course Registration System ER Diagram**
