// This file defines the Mongoose schemas and models for the Online Exam System.
// It groups all the models in a single file for simplicity.

const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Schema (Students/Admin)
// Stores user information, including role for authentication.
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In a real app, hash this password.
    role: { type: String, enum: ['admin', 'student'], default: 'student' }
});
const User = mongoose.model('User', userSchema);

// Exam Schema (Exam Info)
// Stores details about each exam, such as title and duration.
const examSchema = new Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true }, // New: Subject of the exam
    description: { type: String }, // New: Description of the exam
    duration: { type: Number, required: true }, // Duration in minutes
    difficulty: { type: String, required: true }, // New: Difficulty level
    status: { type: String, default: 'DRAFT' },
    maxAttempts: { type: Number, required: true }, // New: Maximum number of attempts
    deadline: { type: Date }, // New: Exam submission deadline
    instructions: { type: String }, // New: Instructions for the student
    createdAt: { type: Date, default: Date.now }
});
const Exam = mongoose.model('Exam', examSchema);

// Question Schema (Questions linked to exams)
// Stores question text, options, and the correct answer, linked to an exam.
const questionSchema = new Schema({
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    text: { type: String, required: true },
    options: { type: [String], required: true }, // Array of strings for multiple-choice options.
    correctAnswer: { type: String, required: true }
});
const Question = mongoose.model('Question', questionSchema);

// Result Schema (Student scores)
// Stores a student's score and answers for a specific exam.
const resultSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    score: { type: Number, required: true },
    answers: { type: Object, required: true }, // Stores questionId: selectedAnswer
    submittedAt: { type: Date, default: Date.now }
});
const Result = mongoose.model('Result', resultSchema);

module.exports = { User, Exam, Question, Result };
