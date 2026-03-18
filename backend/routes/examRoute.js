import express from "express";
import isAuth from "../middlewares/isAuth.js";
import isApprovedEducator from "../middlewares/isApprovedEducator.js";
import upload from "../middlewares/multer.js";
import {
  createExam,
  getExamsByCourse,
  getExamById,
  updateExam,
  deleteExam,
  toggleExamPublish,
  addQuestion,
  addBulkQuestions,
  updateQuestion,
  deleteQuestion,
  getStudentExams,
  startExam,
  submitAnswer,
  submitExam,
  getExamResult,
  getStudentExamHistory,
  getExamAnalytics,
  getProctoringReport,
  gradeAnswer,
  reviewProctoringEvent,
  getExamAttemptDetails,
  deleteExamAttempt,
} from "../controllers/examController.js";

const examRouter = express.Router();

// ==================== INSTRUCTOR EXAM MANAGEMENT ====================

// Create exam for a course
examRouter.post("/create/:courseId", isAuth, isApprovedEducator, createExam);

// Get all exams for a course
examRouter.get("/course/:courseId", isAuth, getExamsByCourse);

// Get exam by ID
examRouter.get("/:examId", isAuth, getExamById);

// Update exam
examRouter.put("/:examId", isAuth, isApprovedEducator, updateExam);

// Delete exam
examRouter.delete("/:examId", isAuth, isApprovedEducator, deleteExam);

// Publish/Unpublish exam
examRouter.post("/:examId/toggle-publish", isAuth, isApprovedEducator, toggleExamPublish);

// ==================== QUESTION MANAGEMENT ====================

// Add single question
examRouter.post("/:examId/questions", isAuth, isApprovedEducator, addQuestion);

// Add multiple questions
examRouter.post("/:examId/questions/bulk", isAuth, isApprovedEducator, addBulkQuestions);

// Update question
examRouter.put("/questions/:questionId", isAuth, isApprovedEducator, updateQuestion);

// Delete question
examRouter.delete("/questions/:questionId", isAuth, isApprovedEducator, deleteQuestion);

// ==================== STUDENT EXAM OPERATIONS ====================

// Get available exams for student
examRouter.get("/student/available", isAuth, getStudentExams);

// Start exam
examRouter.post("/:examId/start", isAuth, startExam);

// Submit answer for a question
examRouter.post("/attempt/:attemptId/answer", isAuth, submitAnswer);

// Submit entire exam
examRouter.post("/attempt/:attemptId/submit", isAuth, submitExam);

// Get exam result
examRouter.get("/attempt/:attemptId/result", isAuth, getExamResult);

// Get student exam history
examRouter.get("/student/history", isAuth, getStudentExamHistory);

// ==================== INSTRUCTOR ANALYTICS & GRADING ====================

// Get exam analytics
examRouter.get("/:examId/analytics", isAuth, isApprovedEducator, getExamAnalytics);

// Get proctoring report for an attempt
examRouter.get("/attempt/:attemptId/proctoring-report", isAuth, isApprovedEducator, getProctoringReport);

// Get exam attempt details for instructor
examRouter.get("/attempt/:attemptId/details", isAuth, isApprovedEducator, getExamAttemptDetails);

// Delete exam attempt (instructor only)
examRouter.delete("/attempt/:attemptId", isAuth, isApprovedEducator, deleteExamAttempt);

// Grade a descriptive answer
examRouter.post("/attempt/:attemptId/grade/:questionId", isAuth, isApprovedEducator, gradeAnswer);

// Review proctoring event
examRouter.post("/proctoring-event/:eventId/review", isAuth, isApprovedEducator, reviewProctoringEvent);

export default examRouter;
