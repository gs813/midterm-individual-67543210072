// src/business/services/studentService.js
const studentRepository = require('../../data/repositories/studentRepository');
const studentValidator = require('../validators/studentValidator');

class StudentService {
    // TODO: Implement getAllStudents
    async getAllStudents(major = null, status = null) {
        // 1. Validate filters (if provided)
        if (major && !studentValidator.isValidMajor(major)) {
            throw new Error('Invalid major');
        }
        if (status && !studentValidator.isValidStatus(status)) {
            throw new Error('Invalid status');
        }

        // 2. เรียก studentRepository.findAll(major, status)
        const students = await studentRepository.findAll(major, status);

        // 3. คำนวณสถิติ (active, graduated, suspended, total, avgGPA)
        const statistics = {
            active: students.filter(s => s.status === 'active').length,
            graduated: students.filter(s => s.status === 'graduated').length,
            suspended: students.filter(s => s.status === 'suspended').length,
            total: students.length,
            avgGPA:
                students.length > 0
                    ? students.reduce((sum, s) => sum + (s.gpa || 0), 0) / students.length
                    : 0,
        };

        // 4. return { students, statistics }
        return { students, statistics };
    }

    // TODO: Implement getStudentById
    async getStudentById(id) {
        // 1. Validate ID
        if (!studentValidator.isValidId(id)) {
            throw new Error('Invalid ID');
        }

        // 2. เรียก repository
        const student = await studentRepository.findById(id);

        // 3. ถ้าไม่เจอ throw NotFoundError
        if (!student) {
            const error = new Error('Student not found');
            error.name = 'NotFoundError';
            throw error;
        }

        // 4. return student
        return student;
    }

    // TODO: Implement createStudent
    async createStudent(studentData) {
        // 1. Validate student data
        const validationErrors = studentValidator.validateStudent(studentData);
        if (validationErrors.length > 0) {
            const error = new Error(validationErrors.join(', '));
            error.name = 'ValidationError';
            throw error;
        }

        // 2. Validate student_code format
        if (!studentValidator.isValidStudentCode(studentData.student_code)) {
            const error = new Error('Invalid student code format');
            error.name = 'ValidationError';
            throw error;
        }

        // 3. Validate email format
        if (!studentValidator.isValidEmail(studentData.email)) {
            const error = new Error('Invalid email format');
            error.name = 'ValidationError';
            throw error;
        }

        // 4. Validate major
        if (!studentValidator.isValidMajor(studentData.major)) {
            const error = new Error('Invalid major');
            error.name = 'ValidationError';
            throw error;
        }

        // 5. เรียก repository.create()
        const createdStudent = await studentRepository.create(studentData);

        // 6. return created student
        return createdStudent;
    }

    // TODO: Implement updateStudent
    async updateStudent(id, studentData) {
        // 1. Validate ID
        if (!studentValidator.isValidId(id)) {
            throw new Error('Invalid ID');
        }

        // 2. ตรวจสอบว่ามีนักศึกษาในระบบหรือไม่
        const existingStudent = await studentRepository.findById(id);
        if (!existingStudent) {
            const error = new Error('Student not found');
            error.name = 'NotFoundError';
            throw error;
        }

        // 3. Validate update data (optional fields)
        const validationErrors = studentValidator.validateStudentUpdate(studentData);
        if (validationErrors.length > 0) {
            const error = new Error(validationErrors.join(', '));
            error.name = 'ValidationError';
            throw error;
        }

        // 4. ถ้ามี student_code ต้องตรวจสอบ format
        if (studentData.student_code && !studentValidator.isValidStudentCode(studentData.student_code)) {
            const error = new Error('Invalid student code format');
            error.name = 'ValidationError';
            throw error;
        }

        // 5. ถ้ามี email ต้องตรวจสอบ format
        if (studentData.email && !studentValidator.isValidEmail(studentData.email)) {
            const error = new Error('Invalid email format');
            error.name = 'ValidationError';
            throw error;
        }

        // 6. ถ้ามี major ต้องตรวจสอบ
        if (studentData.major && !studentValidator.isValidMajor(studentData.major)) {
            const error = new Error('Invalid major');
            error.name = 'ValidationError';
            throw error;
        }

        // 7. เรียก repository.update()
        const updatedStudent = await studentRepository.update(id, studentData);

        // 8. return updated student
        return updatedStudent;
    }

    // TODO: Implement updateGPA
    async updateGPA(id, gpa) {
        // 1. Validate GPA range (0.0 - 4.0)
        if (typeof gpa !== 'number' || gpa < 0.0 || gpa > 4.0) {
            const error = new Error('GPA must be a number between 0.0 and 4.0');
            error.name = 'ValidationError';
            throw error;
        }

        // 2. ดึงนักศึกษาจาก repository
        const student = await studentRepository.findById(id);
        if (!student) {
            const error = new Error('Student not found');
            error.name = 'NotFoundError';
            throw error;
        }

        // 3. เรียก repository.updateGPA(id, gpa)
        const updatedStudent = await studentRepository.updateGPA(id, gpa);

        // 4. return updated student
        return updatedStudent;
    }

    // TODO: Implement updateStatus
    async updateStatus(id, status) {
        // 1. Validate status
        if (!studentValidator.isValidStatus(status)) {
            const error = new Error('Invalid status');
            error.name = 'ValidationError';
            throw error;
        }

        // 2. ดึงนักศึกษาจาก repository
        const student = await studentRepository.findById(id);
        if (!student) {
            const error = new Error('Student not found');
            error.name = 'NotFoundError';
            throw error;
        }

        // 3. ตรวจสอบ business rule: ไม่สามารถเปลี่ยนสถานะ withdrawn ได้
        if (student.status === 'withdrawn') {
            const error = new Error('Cannot change status of withdrawn student');
            error.name = 'ConflictError';
            throw error;
        }

        // 4. เรียก repository.updateStatus(id, status)
        const updatedStudent = await studentRepository.updateStatus(id, status);

        // 5. return updated student
        return updatedStudent;
    }

    // TODO: Implement deleteStudent
    async deleteStudent(id) {
        // 1. ดึงนักศึกษาจาก repository
        const student = await studentRepository.findById(id);
        if (!student) {
            const error = new Error('Student not found');
            error.name = 'NotFoundError';
            throw error;
        }

        // 2. ตรวจสอบ business rule: ไม่สามารถลบ active student
        if (student.status === 'active') {
            const error = new Error('Cannot delete active student');
            error.name = 'ConflictError';
            throw error;
        }

        // 3. เรียก repository.delete(id)
        const deleted = await studentRepository.delete(id);

        return deleted;
    }
}

module.exports = new StudentService();
