// src/presentation/controllers/studentController.js
const studentService = require('../../business/services/studentService');

class StudentController {
    // TODO: Implement getAllStudents
    async getAllStudents(req, res, next) {
        try {
            const { major, status } = req.query;
            const students = await studentService.getAllStudents({ major, status });
            res.status(200).json(students);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement getStudentById
    async getStudentById(req, res, next) {
        try {
            const { id } = req.params;
            const student = await studentService.getStudentById(id);
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(200).json(student);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement createStudent
    async createStudent(req, res, next) {
        try {
            const studentData = req.body;
            const newStudent = await studentService.createStudent(studentData);
            res.status(201).json(newStudent);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement updateStudent
    async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedStudent = await studentService.updateStudent(id, updateData);
            if (!updatedStudent) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(200).json(updatedStudent);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement updateGPA
    async updateGPA(req, res, next) {
        try {
            const { id } = req.params;
            const { gpa } = req.body;
            const updatedStudent = await studentService.updateGPA(id, gpa);
            if (!updatedStudent) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(200).json(updatedStudent);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement updateStatus
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedStudent = await studentService.updateStatus(id, status);
            if (!updatedStudent) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(200).json(updatedStudent);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement deleteStudent
    async deleteStudent(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await studentService.deleteStudent(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();
