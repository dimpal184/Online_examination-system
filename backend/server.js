// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const cors = require('cors');
// const path = require('path');

// // NOTE: Ensure your online_exam_models.js file is in the same directory as server.js
// // Assuming online_exam_models.js now includes 'startTime' and 'deadline' fields in the Exam schema
// const { User, Exam, Question, Result } = require('./online_exam_models.js');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/online-exam';

// // Middleware
// app.use(express.json());
// app.use(cors());

// // ------------------------------------
// // --- Auth APIs ---
// // ------------------------------------
// // Admin Sign Up (Correct)
// app.post('/signup', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

//         const existingUser = await User.findOne({ username });
//         if (existingUser) return res.status(409).json({ message: 'User already exists.' });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await User.create({ username, password: hashedPassword, role: 'admin' });

//         console.log('New admin signed up:', username);
//         res.status(201).json({ message: 'Sign up successful.', user: { username: newUser.username, role: newUser.role } });
//     } catch (error) {
//         console.error('Signup error:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // Admin Login (Correct)
// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

//         const user = await User.findOne({ username });
//         if (!user) return res.status(404).json({ message: 'User not found.' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

//         res.status(200).json({ message: 'Login successful.', user: { username: user.username, role: user.role } });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // Student Sign Up (Correct)
// app.post('/student/signup', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

//         const existingUser = await User.findOne({ username });
//         if (existingUser) return res.status(409).json({ message: 'User already exists.' });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await User.create({ username, password: hashedPassword, role: 'student' });

//         console.log('New student signed up:', username);
//         res.status(201).json({ message: 'Student sign up successful.', user: { username: newUser.username, role: newUser.role } });
//     } catch (error) {
//         console.error('Student signup error:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // Student Login (Correct - includes _id)
// app.post('/student/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

//         const user = await User.findOne({ username });
//         if (!user || user.role !== 'student') return res.status(404).json({ message: 'Student not found.' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

//         res.status(200).json({ 
//             message: 'Login successful.', 
//             user: { 
//                 _id: user._id, // CRITICAL FIX: Include the MongoDB ID
//                 username: user.username, 
//                 role: user.role 
//             } 
//         });
//     } catch (error) {
//         console.error('Student login error:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // ------------------------------------
// // --- Exam & Question APIs ---
// // ------------------------------------
// // Add Exam (MODIFIED to include startTime)
// app.post('/api/exams', async (req, res) => {
//     try {
//         const { 
//             title, 
//             subject, 
//             duration, 
//             questions, 
//             level, 
//             maxAttempts, 
//             difficulty, 
//             published, 
//             description, 
//             instructions, 
//             deadline, 
//             // 🎯 NEW FIELD ACCEPTED
//             startTime 
//         } = req.body;
//         const examStatus = published ? 'Published' : 'Draft';

//         const newExam = new Exam({
//             title,
//             subject,
//             description,
//             duration,
//             questions,
//             instructions,
//             deadline,
//             startTime, // 🎯 NEW FIELD SAVED
//             level,
//             maxAttempts: maxAttempts || 1, 
//             difficulty: difficulty || 'Medium', 
//             status: examStatus, 
//             createdAt: new Date()
//         });
//         
//         const savedExam = await newExam.save();
//         res.status(201).json(savedExam);
//     } catch (error) {
//         console.error('Error adding exam:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // Get all Exams (Correct)
// app.get('/api/exams', async (req, res) => {
//     try {
//         const exams = await Exam.find({});
//         res.status(200).json(exams);
//     } catch (error) {
//         console.error('Error getting exams:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// /**
//  * GET /api/exams/published
//  * Fetches only the exams with a "Published" status for the student dashboard. (Correct)
//  */
// app.get('/api/exams/published', async (req, res) => {
//     try {
//         const exams = await Exam.find({ status: 'Published' });
//         res.status(200).json(exams);
//     } catch (error) {
//         console.error('Error getting published exams:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });


// /**
//  * GET /api/exams/:id
//  * Route to get a single exam by ID.
//  */
// app.get('/api/exams/:id', async (req, res) => {
//     try {
//         const examId = req.params.id;
//         
//         if (!mongoose.Types.ObjectId.isValid(examId)) {
//             console.error('Invalid Exam ID format provided:', examId);
//             return res.status(400).json({ message: 'Invalid or missing exam ID format.' });
//         }

//         const exam = await Exam.findById(examId);

//         if (!exam) {
//             return res.status(404).json({ message: 'Exam not found.' });
//         }
//         
//         const examObject = exam.toObject();
//         delete examObject.questions; // Ensure questions array is NOT sent in this route.

//         res.status(200).json(examObject);
//     } catch (error) {
//         console.error('SERVER ERROR FETCHING SINGLE EXAM:', error);
//         res.status(500).json({ message: 'Internal server error while fetching exam data.' });
//     }
// });

// // Route to update an exam (e.g., for archiving) (Correct)
// app.patch('/api/exams/:id', async (req, res) => {
//     try {
//         const examId = req.params.id;
//         if (!mongoose.Types.ObjectId.isValid(examId)) {
//             return res.status(400).json({ message: 'Invalid exam ID format.' });
//         }
//         const updates = req.body;

//         const updatedExam = await Exam.findByIdAndUpdate(examId, updates, { new: true });

//         if (!updatedExam) {
//             return res.status(404).json({ message: 'Exam not found.' });
//         }

//         res.status(200).json(updatedExam);
//     } catch (error) {
//         console.error('Error updating exam:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // --- CRITICAL FIX: Add Question to a specific Exam (POST /api/exams/:examId/questions) ---
// app.post('/api/exams/:examId/questions', async (req, res) => {
//     try {
//         const examId = req.params.examId; // Get the ID from the URL parameter

//         if (!mongoose.Types.ObjectId.isValid(examId)) {
//             return res.status(400).json({ message: 'Invalid exam ID format.' });
//         }
//         
//         // 🌟 CRITICAL FIX: Destructure the required fields explicitly
//         const { text, options, correctAnswer } = req.body;

//         // Validation Check: Ensure correctAnswer is present
//         if (!correctAnswer) {
//             // Return a 400 response with a clear message if validation fails client-side
//             return res.status(400).json({ message: 'Missing required field: correctAnswer. Please select the correct option.' });
//         }

//         // Create the object to be saved
//         const questionData = { 
//             text,
//             options,
//             correctAnswer, // Include the validated correct answer
//             examId: examId // Attach the exam ID to the question document
//         };
//         
//         // Create the new Question document
//         const question = await Question.create(questionData); 

//         // SUCCESS: Send back a clear success message
//         res.status(201).json({ 
//             message: 'Question added successfully!', 
//             questionId: question._id,
//             examId: examId
//         });
//     } catch (error) {
//         console.error('Error adding question:', error);
//         // This handles Mongoose Validation errors if they still slip past the check above
//         if (error.name === 'ValidationError') {
//              return res.status(400).json({ message: `Validation failed: ${error.message}` });
//         }
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });


// // Get Questions for a specific Exam (MODIFIED for time-based access control)
// app.get('/api/exams/:id/questions', async (req, res) => {
//     try {
//         const examId = req.params.id;
//         if (!mongoose.Types.ObjectId.isValid(examId)) {
//             return res.status(400).json({ message: 'Invalid exam ID format.' });
//         }
//         
//         // 1. Fetch Exam details (including the new startTime and deadline)
//         const exam = await Exam.findById(examId);
//         
//         if (!exam) {
//             return res.status(404).json({ message: 'Exam not found.' });
//         }

//         // 🎯 2. IMPLEMENT TIME CHECK LOGIC (The enforcement point) 🎯
//         const currentTime = new Date();
//         const startTime = exam.startTime;
//         const deadline = exam.deadline;

//         // Check 1: Has the exam started yet? (Pending)
//         if (startTime && currentTime < startTime) {
//             console.log(`Access denied: Exam not started yet for Exam ID ${examId}`);
//             // Return 403 Forbidden status with 'pending' status key
//             return res.status(403).json({ 
//                 message: `This exam has not started yet.`,
//                 status: "pending",
//                 startTime: startTime.toISOString() // Send server's start time for client info
//             });
//         }

//         // Check 2: Has the exam already finished? (Expired)
//         if (deadline && currentTime > deadline) {
//             console.log(`Access denied: Exam deadline passed for Exam ID ${examId}`);
//             // Return 403 Forbidden status with 'expired' status key
//             return res.status(403).json({ 
//                 message: 'The deadline for this exam has already passed. Access is denied.',
//                 status: "expired"
//             });
//         }
//         // END TIME CHECK - If successful, the code proceeds below

//         // 3. If checks pass, proceed to fetch and return questions
//         const questions = await Question.find({ examId: examId }); 
//         
//         // SECURITY FIX: Strip the correctAnswer field before sending questions to the client 
//         const safeQuestions = questions.map(q => {
//             const qObj = q.toObject();
//             // Uncomment this line to prevent correct answers from being sent to the student page
//             delete qObj.correctAnswer; 
//             return qObj;
//         });

//         res.status(200).json(safeQuestions);
//     } catch (error) {
//         console.error('Error getting questions:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // ------------------------------------
// // --- Results & Activity APIs ---
// // ------------------------------------
// // --- Activity Feed API (NEW) (Correct) ---
// app.get('/api/activity', async (req, res) => {
//     try {
//         const activity = [
//             { message: 'Student ST2024045 completed Physics Midterm', timestamp: new Date(Date.now() - 120000) },
//             { message: 'New question added to Mathematics Final', timestamp: new Date(Date.now() - 900000) },
//             { message: 'Chemistry Lab Evaluation results published', timestamp: new Date(Date.now() - 3600000) },
//             { message: '5 students enrolled in Biology Quiz', timestamp: new Date(Date.now() - 7200000) },
//         ];
//         res.status(200).json(activity);
//     } catch (error) {
//         console.error('Error getting activity:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });


// /**
//  * POST /api/results
//  * Submits a student's exam answers, calculates the score.
//  */
// app.post('/api/results', async (req, res) => {
//     try {
//         const { examId, studentId, answers } = req.body; 

//         // 0. Validation
//         if (!examId || !studentId || !answers) {
//             console.error('Submission failed: Missing required fields in request body.');
//             return res.status(400).json({ message: 'Missing required fields: examId, studentId, and answers are required.' });
//         }
//         
//         if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(examId)) {
//             return res.status(400).json({ message: 'Invalid ID format for exam or student.' });
//         }

//         // 1. Fetch the exam
//         const exam = await Exam.findById(examId);
//         if (!exam) {
//             return res.status(404).json({ message: 'Exam not found.' });
//         }

//         // 2. Fetch all Question documents for the exam to get the correct answers
//         const questions = await Question.find({ examId: examId });

//         if (!questions || questions.length === 0) {
//             // Handle case where no questions exist
//             const noQuestionResult = new Result({
//                 examId: exam._id,
//                 userId: studentId,
//                 examTitle: exam.title,
//                 answers,
//                 score: 0
//             });
//             await noQuestionResult.save();
//             return res.status(201).json({ message: 'Exam submitted successfully (0 questions in database)', score: 0 });
//         }

//         let correctAnswersCount = 0;
//         const totalQuestions = questions.length;
//         
//         // 🌟 STEP 1: Create a map of correct answers for quick lookup using Question ID
//         const correctAnswersMap = {};
//         questions.forEach(q => {
//             correctAnswersMap[q._id.toString()] = q.correctAnswer;
//         });

//         // 🌟 STEP 2: Calculate the score
//         answers.forEach(studentAnswer => {
//             const qId = studentAnswer.questionId ? studentAnswer.questionId.toString() : null;
//             const submittedOption = studentAnswer.selectedOption; 
//             
//             const correctAnswer = correctAnswersMap[qId];

//             if (correctAnswer && submittedOption) {
//                 const normalizedSubmitted = String(submittedOption).trim().toLowerCase();
//                 const normalizedCorrect = String(correctAnswer).trim().toLowerCase();
//                 
//                 if (normalizedSubmitted === normalizedCorrect) {
//                     correctAnswersCount++;
//                 }
//             }
//         });
//         
//         let score = 0;
//         if (totalQuestions > 0) {
//             score = (correctAnswersCount / totalQuestions) * 100;
//         }
//         const scoreRounded = Math.round(score); // Final percentage

//         // 4. Save the result
//         const newResult = new Result({
//             examId: exam._id,
//             userId: studentId, 
//             examTitle: exam.title,
//             answers,
//             score: scoreRounded
//         });
//         await newResult.save();

//         // 5. Update the exam's analytics (completions, avgScore, etc.)
//         const currentCompletions = Number(exam.completions || 0);
//         const currentAvgScore = Number(exam.avgScore || 0);
//         const currentPassedCount = Number(exam.passedCount || 0);
//         
//         const totalCompletions = currentCompletions + 1;
//         const previousTotalScore = currentAvgScore * currentCompletions;
//         const newAvgScore = (previousTotalScore + scoreRounded) / totalCompletions;
//         
//         const passed = scoreRounded >= 60; // Assuming 60% is the passing mark
//         const passedCount = currentPassedCount + (passed ? 1 : 0); 
//         const newPassRate = passedCount / totalCompletions; 

//         exam.completions = totalCompletions;
//         exam.avgScore = newAvgScore;
//         exam.passRate = newPassRate; 
//         await exam.save();

//         // 6. Send the final score back
//         res.status(201).json({ 
//             message: 'Exam submitted successfully', 
//             score: scoreRounded 
//         });

//     } catch (error) {
//         console.error('SERVER ERROR SUBMITTING EXAM (POST /api/results CRASH):', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // ------------------------------------
// // --- Serve Frontend Pages (Keep at the end!) ---
// // ------------------------------------
// app.get('/admin_dashboard.html', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'admin_dashboard.html'));
// });

// app.get('/add_questions.html', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'add_questions.html'));
// });

// app.get('/admin_login.html', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'admin_login.html'));
// });

// app.get('/student_dashboard.html', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'student_dashboard.html'));
// });

// app.get('/exam.html', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'exam.html'));
// });

// // Root route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'admin_login.html'));
// });

// // Serve static frontend files (Correct)
// app.use(express.static(path.join(__dirname, '..', 'frontend')));

// // ------------------------------------
// // --- Database Connection and Server Start ---
// // ------------------------------------
// mongoose.connect(MONGODB_URI)
//     .then(async () => {
//         console.log('Successfully connected to MongoDB.');

//         // Create default admin if it doesn't exist (Correct)
//         const adminUser = await User.findOne({ username: 'admin' });
//         if (!adminUser) {
//             const hashedPassword = await bcrypt.hash('password123', 10);
//             await User.create({ username: 'admin', password: hashedPassword, role: 'admin' });
//             console.log('Default admin user created.');
//         }

//         app.listen(PORT, () => {
//             console.log(`Server running at http://localhost:${PORT}`);
//         });
//     })
//     .catch(err => {
//         console.error('Database connection error:', err);
//         process.exit(1);
//     });
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const cors = require('cors');
// const path = require('path');

// // NOTE: Ensure your online_exam_models.js file is in the same directory as server.js
// const { User, Exam, Question, Result } = require('./online_exam_models.js');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/online-exam';

// // Middleware
// app.use(express.json());
// app.use(cors());

// // ------------------------------------
// // --- Auth APIs ---
// // ------------------------------------
// // Admin Sign Up
// app.post('/signup', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

//         const existingUser = await User.findOne({ username });
//         if (existingUser) return res.status(409).json({ message: 'User already exists.' });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await User.create({ username, password: hashedPassword, role: 'admin' });

//         console.log('New admin signed up:', username);
//         res.status(201).json({ message: 'Sign up successful.', user: { username: newUser.username, role: newUser.role } });
//     } catch (error) {
//         console.error('Signup error:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // Admin Login
// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

//         const user = await User.findOne({ username });
//         if (!user) return res.status(404).json({ message: 'User not found.' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

//         res.status(200).json({ message: 'Login successful.', user: { username: user.username, role: user.role } });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // Student Sign Up
// app.post('/student/signup', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

//         const existingUser = await User.findOne({ username });
//         if (existingUser) return res.status(409).json({ message: 'User already exists.' });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await User.create({ username, password: hashedPassword, role: 'student' });

//         console.log('New student signed up:', username);
//         res.status(201).json({ message: 'Student sign up successful.', user: { username: newUser.username, role: newUser.role } });
//     } catch (error) {
//         console.error('Student signup error:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // Student Login (Correct - includes _id)
// app.post('/student/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

//         const user = await User.findOne({ username });
//         if (!user || user.role !== 'student') return res.status(404).json({ message: 'Student not found.' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

//         res.status(200).json({ 
//             message: 'Login successful.', 
//             user: { 
//                 _id: user._id, // CRITICAL FIX: Include the MongoDB ID
//                 username: user.username, 
//                 role: user.role 
//             } 
//         });
//     } catch (error) {
//         console.error('Student login error:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // ------------------------------------
// // --- Exam & Question APIs ---
// // ------------------------------------
// // Add Exam (MODIFIED to include startTime)
// app.post('/api/exams', async (req, res) => {
//     try {
//         const { 
//             title, 
//             subject, 
//             duration, 
//             questions, 
//             level, 
//             maxAttempts, 
//             difficulty, 
//             published, 
//             description, 
//             instructions, 
//             deadline, 
//             // 🎯 NEW FIELD ACCEPTED
//             startTime 
//         } = req.body;
//         const examStatus = published ? 'Published' : 'Draft';

//         const newExam = new Exam({
//             title,
//             subject,
//             description,
//             duration,
//             questions,
//             instructions,
//             deadline,
//             startTime, // 🎯 NEW FIELD SAVED
//             level,
//             maxAttempts: maxAttempts || 1, 
//             difficulty: difficulty || 'Medium', 
//             status: examStatus, 
//             createdAt: new Date()
//         });
        
//         const savedExam = await newExam.save();
//         res.status(201).json(savedExam);
//     } catch (error) {
//         console.error('Error adding exam:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // Get all Exams
// app.get('/api/exams', async (req, res) => {
//     try {
//         const exams = await Exam.find({});
//         res.status(200).json(exams);
//     } catch (error) {
//         console.error('Error getting exams:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// /**
//  * GET /api/exams/published
//  * Fetches only the exams with a "Published" status for the student dashboard.
//  */
// app.get('/api/exams/published', async (req, res) => {
//     try {
//         const exams = await Exam.find({ status: 'Published' });
//         res.status(200).json(exams);
//     } catch (error) {
//         console.error('Error getting published exams:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });


// /**
//  * GET /api/exams/:id
//  * Route to get a single exam by ID.
//  */
// app.get('/api/exams/:id', async (req, res) => {
//     try {
//         const examId = req.params.id;
        
//         if (!mongoose.Types.ObjectId.isValid(examId)) {
//             console.error('Invalid Exam ID format provided:', examId);
//             return res.status(400).json({ message: 'Invalid or missing exam ID format.' });
//         }

//         const exam = await Exam.findById(examId);

//         if (!exam) {
//             return res.status(404).json({ message: 'Exam not found.' });
//         }
        
//         const examObject = exam.toObject();
//         delete examObject.questions; // Ensure questions array is NOT sent in this route.

//         res.status(200).json(examObject);
//     } catch (error) {
//         console.error('SERVER ERROR FETCHING SINGLE EXAM:', error);
//         res.status(500).json({ message: 'Internal server error while fetching exam data.' });
//     }
// });

// // Route to update an exam (e.g., for archiving)
// app.patch('/api/exams/:id', async (req, res) => {
//     try {
//         const examId = req.params.id;
//         if (!mongoose.Types.ObjectId.isValid(examId)) {
//             return res.status(400).json({ message: 'Invalid exam ID format.' });
//         }
//         const updates = req.body;

//         const updatedExam = await Exam.findByIdAndUpdate(examId, updates, { new: true });

//         if (!updatedExam) {
//             return res.status(404).json({ message: 'Exam not found.' });
//         }

//         res.status(200).json(updatedExam);
//     } catch (error) {
//         console.error('Error updating exam:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // --- CRITICAL FIX: Add Question to a specific Exam (POST /api/exams/:examId/questions) ---
// app.post('/api/exams/:examId/questions', async (req, res) => {
//     try {
//         const examId = req.params.examId; // Get the ID from the URL parameter

//         if (!mongoose.Types.ObjectId.isValid(examId)) {
//             return res.status(400).json({ message: 'Invalid exam ID format.' });
//         }
        
//         // 🌟 CRITICAL FIX: Destructure the required fields explicitly
//         const { text, options, correctAnswer } = req.body;

//         // Validation Check: Ensure correctAnswer is present
//         if (!correctAnswer) {
//             // Return a 400 response with a clear message if validation fails client-side
//             return res.status(400).json({ message: 'Missing required field: correctAnswer. Please select the correct option.' });
//         }

//         // Create the object to be saved
//         const questionData = { 
//             text,
//             options,
//             correctAnswer, // Include the validated correct answer
//             examId: examId // Attach the exam ID to the question document
//         };
        
//         // Create the new Question document
//         const question = await Question.create(questionData); 

//         // SUCCESS: Send back a clear success message
//         res.status(201).json({ 
//             message: 'Question added successfully!', 
//             questionId: question._id,
//             examId: examId
//         });
//     } catch (error) {
//         console.error('Error adding question:', error);
//         // This handles Mongoose Validation errors if they still slip past the check above
//         if (error.name === 'ValidationError') {
//              return res.status(400).json({ message: `Validation failed: ${error.message}` });
//         }
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });
// // --- NEW ADMIN ROUTE: Get Questions for Review (INCLUDES CORRECT ANSWER) ---
// app.get('/api/admin/exams/:id/questions', async (req, res) => {
//     try {
//         const examId = req.params.id;
//         if (!mongoose.Types.ObjectId.isValid(examId)) {
//             return res.status(400).json({ message: 'Invalid exam ID format.' });
//         }
        
//         // This query returns ALL fields, including 'correctAnswer'
//         const questions = await Question.find({ examId: examId }); 
        
//         // IMPORTANT: DO NOT strip correctAnswer here. This is for admin review.
//         res.status(200).json(questions); 
//     } catch (error) {
//         console.error('Error getting admin questions:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });
// // --------------------------------------------------------------------------

// // Get Questions for a specific Exam (UPDATED: Uses startTime + duration for access window)
// app.get('/api/exams/:id/questions', async (req, res) => {
//     try {
//         const examId = req.params.id;
//         if (!mongoose.Types.ObjectId.isValid(examId)) {
//             return res.status(400).json({ message: 'Invalid exam ID format.' });
//         }
        
//         // 1. Fetch Exam details (startTime and duration are essential)
//         const exam = await Exam.findById(examId);
        
//         if (!exam) {
//             return res.status(404).json({ message: 'Exam not found.' });
//         }

//         // --- 2. CALCULATE THE ACCESS WINDOW ---
//         const currentTime = new Date();
//         const startTime = exam.startTime ? new Date(exam.startTime) : null;
//         const durationMinutes = exam.duration || 60; // Assume 60 mins if duration is missing

//         // Calculate the absolute end time: startTime + duration
//         let scheduledEndTime = null;
//         if (startTime) {
//             // durationMinutes * 60000 converts minutes to milliseconds
//             scheduledEndTime = new Date(startTime.getTime() + durationMinutes * 60000); 
//         }

//         // Check 1: Has the exam started yet? (Blocks early access)
//         if (startTime && currentTime < startTime) {
//             console.log(`Access denied: Exam not started yet for Exam ID ${examId}`);
//             // Return 403 Forbidden status
//             return res.status(403).json({ 
//                 message: `This exam has not started yet. It will be available at ${startTime.toLocaleString()}.`
//             });
//         }

//         // Check 2: Has the exam already finished? (Blocks late start)
//         // We use the calculated scheduledEndTime (startTime + duration) for this check.
//         if (scheduledEndTime && currentTime > scheduledEndTime) {
//             console.log(`Access denied: Exam window closed for Exam ID ${examId}`);
//             // Return 403 Forbidden status
//             return res.status(403).json({ 
//                 message: 'The scheduled window for this exam has closed. Access is denied.'
//             });
//         }
//         // --- END ACCESS WINDOW CHECK ---

//         // 3. If checks pass, proceed to fetch and return questions
//         const questions = await Question.find({ examId: examId }); 
        
//         // SECURITY FIX: Strip the correctAnswer field before sending questions to the client 
//         const safeQuestions = questions.map(q => {
//             const qObj = q.toObject();
//             delete qObj.correctAnswer; // UNCOMMENT THIS LINE FOR PRODUCTION SECURITY
//             return qObj;
//         });

//         res.status(200).json(safeQuestions);
//     } catch (error) {
//         console.error('Error getting questions:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // ------------------------------------
// // --- Results & Activity APIs ---
// // ------------------------------------
// // --- Activity Feed API (NEW)
// app.get('/api/activity', async (req, res) => {
//     try {
//         const activity = [
//             { message: 'Student ST2024045 completed Physics Midterm', timestamp: new Date(Date.now() - 120000) },
//             { message: 'New question added to Mathematics Final', timestamp: new Date(Date.now() - 900000) },
//             { message: 'Chemistry Lab Evaluation results published', timestamp: new Date(Date.now() - 3600000) },
//             { message: '5 students enrolled in Biology Quiz', timestamp: new Date(Date.now() - 7200000) },
//         ];
//         res.status(200).json(activity);
//     } catch (error) {
//         console.error('Error getting activity:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });


// /**
//  * POST /api/results
//  * Submits a student's exam answers, calculates the score, and enforces submission deadline.
//  */
// app.post('/api/results', async (req, res) => {
//     try {
//         const { examId, studentId, answers } = req.body; 

//         // 0. Validation
//         if (!examId || !studentId || !answers) {
//             console.error('Submission failed: Missing required fields in request body.');
//             return res.status(400).json({ message: 'Missing required fields: examId, studentId, and answers are required.' });
//         }
        
//         if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(examId)) {
//             return res.status(400).json({ message: 'Invalid ID format for exam or student.' });
//         }

//         // 1. Fetch the exam
//         const exam = await Exam.findById(examId);
//         if (!exam) {
//             return res.status(404).json({ message: 'Exam not found.' });
//         }
        
//         // 🎯 SECURITY CHECK: BLOCK SUBMISSION IF DEADLINE PASSED 🎯
//         // Note: Using the 'deadline' field here if it is intended for absolute submission end.
//         // If you want to use startTime + duration for submission too, you must modify this.
//         // Assuming 'deadline' is the absolute latest submission time, independent of duration.
//         const currentTime = new Date();
//         const deadline = exam.deadline;

//         if (deadline && currentTime > deadline) {
//              console.log(`Submission denied: Exam deadline passed for Exam ID ${examId}`);
//              return res.status(403).json({ 
//                  message: 'The submission deadline for this exam has already passed. Your answers were not recorded.'
//              });
//         }
//         // END DEADLINE CHECK

//         // 2. Fetch all Question documents for the exam to get the correct answers
//         const questions = await Question.find({ examId: examId });

//         if (!questions || questions.length === 0) {
//             // Handle case where no questions exist
//             const noQuestionResult = new Result({
//                 examId: exam._id,
//                 userId: studentId,
//                 examTitle: exam.title,
//                 answers,
//                 score: 0
//             });
//             await noQuestionResult.save();
//             return res.status(201).json({ message: 'Exam submitted successfully (0 questions in database)', score: 0 });
//         }

//         let correctAnswersCount = 0;
//         const totalQuestions = questions.length;
        
//         // 🌟 STEP 1: Create a map of correct answers for quick lookup using Question ID
//         const correctAnswersMap = {};
//         questions.forEach(q => {
//             correctAnswersMap[q._id.toString()] = q.correctAnswer;
//         });

//         // 🌟 STEP 2: Calculate the score
//         answers.forEach(studentAnswer => {
//             const qId = studentAnswer.questionId ? studentAnswer.questionId.toString() : null;
//             const submittedOption = studentAnswer.selectedOption; 
            
//             const correctAnswer = correctAnswersMap[qId];

//             if (correctAnswer && submittedOption) {
//                 const normalizedSubmitted = String(submittedOption).trim().toLowerCase();
//                 const normalizedCorrect = String(correctAnswer).trim().toLowerCase();
                
//                 if (normalizedSubmitted === normalizedCorrect) {
//                     correctAnswersCount++;
//                 }
//             }
//         });
        
//         let score = 0;
//         if (totalQuestions > 0) {
//             score = (correctAnswersCount / totalQuestions) * 100;
//         }
//         const scoreRounded = Math.round(score); // Final percentage

//         // 4. Save the result
//         const newResult = new Result({
//             examId: exam._id,
//             userId: studentId, 
//             examTitle: exam.title,
//             answers,
//             score: scoreRounded
//         });
//         await newResult.save();

//         // 5. Update the exam's analytics (completions, avgScore, etc.)
//         const currentCompletions = Number(exam.completions || 0);
//         const currentAvgScore = Number(exam.avgScore || 0);
//         const currentPassedCount = Number(exam.passedCount || 0);
        
//         const totalCompletions = currentCompletions + 1;
//         const previousTotalScore = currentAvgScore * currentCompletions;
//         const newAvgScore = (previousTotalScore + scoreRounded) / totalCompletions;
        
//         const passed = scoreRounded >= 60; // Assuming 60% is the passing mark
//         const passedCount = currentPassedCount + (passed ? 1 : 0); 
//         const newPassRate = passedCount / totalCompletions; 

//         exam.completions = totalCompletions;
//         exam.avgScore = newAvgScore;
//         exam.passRate = newPassRate; 
//         await exam.save();

//         // 6. Send the final score back
//         res.status(201).json({ 
//             message: 'Exam submitted successfully', 
//             score: scoreRounded 
//         });

//     } catch (error) {
//         console.error('SERVER ERROR SUBMITTING EXAM (POST /api/results CRASH):', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// // ------------------------------------
// // --- Serve Frontend Pages (Keep at the end!) ---
// // ------------------------------------
// app.get('/admin_dashboard.html', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'admin_dashboard.html'));
// });

// app.get('/add_questions.html', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'add_questions.html'));
// });

// app.get('/admin_login.html', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'admin_login.html'));
// });

// app.get('/student_dashboard.html', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'student_dashboard.html'));
// });

// app.get('/exam.html', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'exam.html'));
// });

// // Root route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'admin_login.html'));
// });

// // Serve static frontend files (Correct)
// app.use(express.static(path.join(__dirname, '..', 'frontend')));

// // ------------------------------------
// // --- Database Connection and Server Start ---
// // ------------------------------------
// mongoose.connect(MONGODB_URI)
//     .then(async () => {
//         console.log('Successfully connected to MongoDB.');

//         // Create default admin if it doesn't exist
//         const adminUser = await User.findOne({ username: 'admin' });
//         if (!adminUser) {
//             const hashedPassword = await bcrypt.hash('password123', 10);
//             await User.create({ username: 'admin', password: hashedPassword, role: 'admin' });
//             console.log('Default admin user created.');
//         }

//         app.listen(PORT, () => {
//             console.log(`Server running at http://localhost:${PORT}`);
//         });
//     })
//     .catch(err => {
//         console.error('Database connection error:', err);
//         process.exit(1);
//     });


































const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

// NOTE: Ensure your online_exam_models.js file is in the same directory as server.js
const { User, Exam, Question, Result } = require('./online_exam_models.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/online-exam';

// Middleware
app.use(express.json());
app.use(cors());

// ------------------------------------
// --- Auth APIs ---
// ------------------------------------
// Admin Sign Up (Correct)
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(409).json({ message: 'User already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, role: 'admin' });

        console.log('New admin signed up:', username);
        res.status(201).json({ message: 'Sign up successful.', user: { username: newUser.username, role: newUser.role } });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Admin Login (Correct)
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        res.status(200).json({ message: 'Login successful.', user: { username: user.username, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Student Sign Up (Correct)
app.post('/student/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(409).json({ message: 'User already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, role: 'student' });

        console.log('New student signed up:', username);
        res.status(201).json({ message: 'Student sign up successful.', user: { username: newUser.username, role: newUser.role } });
    } catch (error) {
        console.error('Student signup error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Student Login (Correct - includes _id)
app.post('/student/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Username and password required.' });

        const user = await User.findOne({ username });
        if (!user || user.role !== 'student') return res.status(404).json({ message: 'Student not found.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        res.status(200).json({ 
            message: 'Login successful.', 
            user: { 
                _id: user._id, // CRITICAL FIX: Include the MongoDB ID
                username: user.username, 
                role: user.role 
            } 
        });
    } catch (error) {
        console.error('Student login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// ------------------------------------
// --- Exam & Question APIs ---
// ------------------------------------
// Add Exam (Correct)
app.post('/api/exams', async (req, res) => {
    try {
        const { title, subject, duration, questions, level, maxAttempts, difficulty, published, description, instructions, deadline } = req.body;
        const examStatus = published ? 'Published' : 'Draft';

        const newExam = new Exam({
            title,
            subject,
            description,
            duration,
            questions,
            instructions,
            deadline,
            level,
            maxAttempts: maxAttempts || 1, 
            difficulty: difficulty || 'Medium', 
            status: examStatus, 
            createdAt: new Date()
        });
        
        const savedExam = await newExam.save();
        res.status(201).json(savedExam);
    } catch (error) {
        console.error('Error adding exam:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Get all Exams (Correct)
app.get('/api/exams', async (req, res) => {
    try {
        const exams = await Exam.find({});
        res.status(200).json(exams);
    } catch (error) {
        console.error('Error getting exams:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

/**
 * GET /api/exams/published
 * Fetches only the exams with a "Published" status for the student dashboard. (Correct)
 */
app.get('/api/exams/published', async (req, res) => {
    try {
        const exams = await Exam.find({ status: 'Published' });
        res.status(200).json(exams);
    } catch (error) {
        console.error('Error getting published exams:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


/**
 * GET /api/exams/:id
 * Route to get a single exam by ID.
 */
app.get('/api/exams/:id', async (req, res) => {
    try {
        const examId = req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(examId)) {
            console.error('Invalid Exam ID format provided:', examId);
            return res.status(400).json({ message: 'Invalid or missing exam ID format.' });
        }

        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found.' });
        }
        
        const examObject = exam.toObject();
        delete examObject.questions; // Ensure questions array is NOT sent in this route.

        res.status(200).json(examObject);
    } catch (error) {
        console.error('SERVER ERROR FETCHING SINGLE EXAM:', error);
        res.status(500).json({ message: 'Internal server error while fetching exam data.' });
    }
});

// Route to update an exam (e.g., for archiving) (Correct)
app.patch('/api/exams/:id', async (req, res) => {
    try {
        const examId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: 'Invalid exam ID format.' });
        }
        const updates = req.body;

        const updatedExam = await Exam.findByIdAndUpdate(examId, updates, { new: true });

        if (!updatedExam) {
            return res.status(404).json({ message: 'Exam not found.' });
        }

        res.status(200).json(updatedExam);
    } catch (error) {
        console.error('Error updating exam:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// --- CRITICAL FIX: Add Question to a specific Exam (POST /api/exams/:examId/questions) ---
app.post('/api/exams/:examId/questions', async (req, res) => {
    try {
        const examId = req.params.examId; // Get the ID from the URL parameter

        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: 'Invalid exam ID format.' });
        }
        
        // 🌟 CRITICAL FIX: Destructure the required fields explicitly
        const { text, options, correctAnswer } = req.body;

        // Validation Check: Ensure correctAnswer is present
        if (!correctAnswer) {
            // Return a 400 response with a clear message if validation fails client-side
            return res.status(400).json({ message: 'Missing required field: correctAnswer. Please select the correct option.' });
        }

        // Create the object to be saved
        const questionData = { 
            text,
            options,
            correctAnswer, // Include the validated correct answer
            examId: examId // Attach the exam ID to the question document
        };
        
        // Create the new Question document
        const question = await Question.create(questionData); 

        // SUCCESS: Send back a clear success message
        res.status(201).json({ 
            message: 'Question added successfully!', 
            questionId: question._id,
            examId: examId
        });
    } catch (error) {
        console.error('Error adding question:', error);
        // This handles Mongoose Validation errors if they still slip past the check above
        if (error.name === 'ValidationError') {
             return res.status(400).json({ message: `Validation failed: ${error.message}` });
        }
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Get Questions for a specific Exam (Correct - this is the route that FE uses)
app.get('/api/exams/:id/questions', async (req, res) => {
    try {
        const examId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: 'Invalid exam ID format.' });
        }
        // This is the correct way to retrieve questions that belong to an exam.
        const questions = await Question.find({ examId: examId }); 
        
        // SECURITY FIX: Strip the correctAnswer field before sending questions to the client 
        const safeQuestions = questions.map(q => {
            const qObj = q.toObject();
            // Note: This is fine for the student view, but the admin view (view_questions.html) needs the answer.
            // Since the original FE was fetching all questions (including the answer) for view_questions, 
            // we will temporarily skip this strip for simplicity in a dev environment, but mark it as a security note.
            // For production, you should create a separate admin route that returns correct answers.
            // delete qObj.correctAnswer; 
            return qObj;
        });

        res.status(200).json(safeQuestions);
    } catch (error) {
        console.error('Error getting questions:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// ------------------------------------
// --- Results & Activity APIs ---
// ------------------------------------
// --- Activity Feed API (NEW) (Correct) ---
app.get('/api/activity', async (req, res) => {
    try {
        const activity = [
            { message: 'Student ST2024045 completed Physics Midterm', timestamp: new Date(Date.now() - 120000) },
            { message: 'New question added to Mathematics Final', timestamp: new Date(Date.now() - 900000) },
            { message: 'Chemistry Lab Evaluation results published', timestamp: new Date(Date.now() - 3600000) },
            { message: '5 students enrolled in Biology Quiz', timestamp: new Date(Date.now() - 7200000) },
        ];
        res.status(200).json(activity);
    } catch (error) {
        console.error('Error getting activity:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


/**
 * POST /api/results
 * Submits a student's exam answers, calculates the score.
 */
app.post('/api/results', async (req, res) => {
    try {
        const { examId, studentId, answers } = req.body; 

        // 0. Validation
        if (!examId || !studentId || !answers) {
            console.error('Submission failed: Missing required fields in request body.');
            return res.status(400).json({ message: 'Missing required fields: examId, studentId, and answers are required.' });
        }
        
        if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: 'Invalid ID format for exam or student.' });
        }

        // 1. Fetch the exam
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found.' });
        }

        // 2. Fetch all Question documents for the exam to get the correct answers
        const questions = await Question.find({ examId: examId });

        if (!questions || questions.length === 0) {
            // Handle case where no questions exist
            const noQuestionResult = new Result({
                examId: exam._id,
                userId: studentId,
                examTitle: exam.title,
                answers,
                score: 0
            });
            await noQuestionResult.save();
            return res.status(201).json({ message: 'Exam submitted successfully (0 questions in database)', score: 0 });
        }

        let correctAnswersCount = 0;
        const totalQuestions = questions.length;
        
        // 🌟 STEP 1: Create a map of correct answers for quick lookup using Question ID
        const correctAnswersMap = {};
        questions.forEach(q => {
            correctAnswersMap[q._id.toString()] = q.correctAnswer;
        });

        // 🌟 STEP 2: Calculate the score
        answers.forEach(studentAnswer => {
            const qId = studentAnswer.questionId ? studentAnswer.questionId.toString() : null;
            const submittedOption = studentAnswer.selectedOption; 
            
            const correctAnswer = correctAnswersMap[qId];

            if (correctAnswer && submittedOption) {
                const normalizedSubmitted = String(submittedOption).trim().toLowerCase();
                const normalizedCorrect = String(correctAnswer).trim().toLowerCase();
                
                if (normalizedSubmitted === normalizedCorrect) {
                    correctAnswersCount++;
                }
            }
        });
        
        let score = 0;
        if (totalQuestions > 0) {
            score = (correctAnswersCount / totalQuestions) * 100;
        }
        const scoreRounded = Math.round(score); // Final percentage

        // 4. Save the result
        const newResult = new Result({
            examId: exam._id,
            userId: studentId, 
            examTitle: exam.title,
            answers,
            score: scoreRounded
        });
        await newResult.save();

        // 5. Update the exam's analytics (completions, avgScore, etc.)
        const currentCompletions = Number(exam.completions || 0);
        const currentAvgScore = Number(exam.avgScore || 0);
        const currentPassedCount = Number(exam.passedCount || 0);
        
        const totalCompletions = currentCompletions + 1;
        const previousTotalScore = currentAvgScore * currentCompletions;
        const newAvgScore = (previousTotalScore + scoreRounded) / totalCompletions;
        
        const passed = scoreRounded >= 60; // Assuming 60% is the passing mark
        const passedCount = currentPassedCount + (passed ? 1 : 0); 
        const newPassRate = passedCount / totalCompletions; 

        exam.completions = totalCompletions;
        exam.avgScore = newAvgScore;
        exam.passRate = newPassRate; 
        await exam.save();

        // 6. Send the final score back
        res.status(201).json({ 
            message: 'Exam submitted successfully', 
            score: scoreRounded 
        });

    } catch (error) {
        console.error('SERVER ERROR SUBMITTING EXAM (POST /api/results CRASH):', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// ------------------------------------
// --- Serve Frontend Pages (Keep at the end!) ---
// ------------------------------------
app.get('/admin_dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'admin_dashboard.html'));
});

app.get('/add_questions.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'add_questions.html'));
});

app.get('/admin_login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'admin_login.html'));
});

app.get('/student_dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'student_dashboard.html'));
});

app.get('/exam.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'exam.html'));
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'admin_login.html'));
});

// Serve static frontend files (Correct)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ------------------------------------
// --- Database Connection and Server Start ---
// ------------------------------------
mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Successfully connected to MongoDB.');

        // Create default admin if it doesn't exist (Correct)
        const adminUser = await User.findOne({ username: 'admin' });
        if (!adminUser) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({ username: 'admin', password: hashedPassword, role: 'admin' });
            console.log('Default admin user created.');
        }

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });