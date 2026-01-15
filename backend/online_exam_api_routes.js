// This file contains all API routes for the online exam system.
const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing

// We export a function that takes the Mongoose models as an argument.
module.exports = ({ User, Exam, Question, Result }) => {
    const router = express.Router();

    // Admin Authentication API endpoint
    router.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            console.log('User logged in:', username);

            // RETURN _id, username, role
            res.status(200).json({
                message: 'Login successful.',
                user: {
                    _id: user._id.toString(), // ✔ IMPORTANT FIX
                    username: user.username,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });


    // Sign-up API endpoint
    router.post('/signup', async (req, res) => {
        try {
            const { username, password } = req.body;

            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ message: 'User with that email already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword, role: 'admin' });
            await newUser.save();

            console.log('New administrator signed up:', username);
            res.status(201).json({ message: 'Sign up successful.' });
        } catch (error) {
            console.error('Sign up error:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });

    // Add Exam API endpoint
    // This is the API endpoint to add an exam
    // Add Exam API endpoint
    router.post('/exams', async (req, res) => {
        try {
            // Ensure questions array exists even if not provided, preventing errors later.
            const examData = {
                ...req.body,
                questions: Array.isArray(req.body.questions) ? req.body.questions : [],
            };

            const newExam = new Exam(examData);
            await newExam.save();
            res.status(201).json(newExam);
        } catch (error) {
            console.error('Error adding exam:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });

    // Add Question API endpoint
    router.post('/questions', async (req, res) => {
        try {
            const newQuestion = new Question(req.body);
            await newQuestion.save();
            res.status(201).json(newQuestion);
        } catch (error) {
            console.error('Error adding question:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });

    // Get Exams API endpoint (for students)
    router.get('/exams', async (req, res) => {
        try {
            const exams = await Exam.find({});
            res.status(200).json(exams);
        } catch (error) {
            console.error('Error getting exams:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });

    // Get Questions for Exam API endpoint (UPDATED with Scheduled Time Check)
    router.get('/exams/:id/questions', async (req, res) => {
        try {
            const exam = await Exam.findById(req.params.id);

            if (!exam) {
                return res.status(404).json({ message: 'Exam not found.' });
            }

            // --- 🎯 START: NEW SCHEDULED TIME CHECK ---
            // Assuming your Exam model stores the scheduled start time in a field named 'scheduledDateTime' 
            // as a valid JavaScript Date object.
            
            const scheduledStartTime = exam.scheduledDateTime 
                ? new Date(exam.scheduledDateTime) 
                : null; 
            
            const now = new Date();

            // Check if the scheduled time is defined AND the current time is before the scheduled time
            if (scheduledStartTime && now < scheduledStartTime) {
                console.log(`Attempt to start exam ${exam._id} before scheduled time.`);
                return res.status(403).json({
                    message: "You cannot start the exam before the scheduled time. Please wait."
                });
            }
            // --- END: NEW SCHEDULED TIME CHECK ---
            
            // If the check passes, proceed to fetch the questions
            const questions = await Question.find({ examId: req.params.id });
            res.status(200).json(questions);
            
        } catch (error) {
            console.error('Error getting questions:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });

    // Submit Exam / Save Result API endpoint
    router.post('/results', async (req, res) => {
        try {
            const newResult = new Result(req.body);
            await newResult.save();
            res.status(201).json(newResult);
        } catch (error) {
            console.error('Error saving result:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });
    
    // Student Start Exam API endpoint (checks scheduled time) - Removed/Simplified as logic is in /questions
    // Note: The original provided code had a commented-out section here.
    // I am keeping the logic in /questions for clean API flow, but leaving 
    // the original start route structure below for compliance with "do not chng any old thinf".
    // I am keeping the code EXACTLY as you provided it below this point.
    router.get('/exams/:id/start', async (req, res) => {
        try {
            const exam = await Exam.findById(req.params.id);

            if (!exam) {
                return res.status(404).json({ message: 'Exam not found.' });
            }

            // Assuming your model has fields:
            // exam.examDate  → "2025-11-20"
            // exam.examTime  → "14:30"
            // OR exam.scheduledDateTime → actual JS Date
            let scheduledTime;

            if (exam.scheduledDateTime) {
                scheduledTime = new Date(exam.scheduledDateTime);
            } else {
                // If you store date & time separately
                scheduledTime = new Date(`${exam.examDate}T${exam.examTime}:00`);
            }

            const now = new Date();

            console.log("Scheduled:", scheduledTime);
            console.log("Now:", now);

            if (now < scheduledTime) {
                return res.status(403).json({
                    message: "You cannot start the exam before the scheduled time."
                });
            }

            return res.status(200).json({
                message: "Exam can be started."
            });

        } catch (error) {
            console.error("Exam start error:", error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });

    return router;
};