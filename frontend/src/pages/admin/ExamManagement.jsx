import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../../App";
import { FaArrowLeftLong, FaPlus, FaTrash, FaPenToSquare, FaEye, FaUsers, FaChartBar } from "react-icons/fa6";
import { MdPublish, MdUnpublished } from "react-icons/md";

function ExamManagement() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { userData } = useSelector((state) => state.user);
  const [exams, setExams] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/exam/course/${courseId}`, {
        withCredentials: true,
      });
      setExams(res.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchExams();
    fetchCourse();
  }, [courseId]);

  // Refetch when returning from edit page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchExams();
      }
    };

    // Also refetch on popstate (browser back/forward)
    const handlePopState = () => {
      fetchExams();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [fetchExams]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, {
        withCredentials: true,
      });
      setCourse(res.data);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const handleTogglePublish = async (examId) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/exam/${examId}/toggle-publish`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);
      fetchExams();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update exam");
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await axios.delete(`${serverUrl}/api/exam/${examId}`, {
        withCredentials: true,
      });
      toast.success("Exam deleted successfully");
      fetchExams();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete exam");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <FaArrowLeftLong
            className="w-6 h-6 cursor-pointer hover:text-gray-600"
            onClick={() => navigate(`/addcourses/${courseId}`)}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
            <p className="text-gray-600">{course?.title}</p>
          </div>
        </div>

        {/* Create Exam Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate(`/createexam/${courseId}`)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <FaPlus /> Create New Exam
          </button>
        </div>

        {/* Exams List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">No exams created yet</p>
            <p className="text-gray-400 mt-2">Create your first exam to get started</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {exams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-800">{exam.title}</h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          exam.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {exam.isPublished ? "Published" : "Draft"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          exam.proctoring?.enabled
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {exam.proctoring?.enabled ? "AI Proctored" : "No Proctoring"}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-2">{exam.description}</p>

                    <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600">
                      <span>Duration: {exam.duration} mins</span>
                      <span>Total Marks: {exam.totalMarks}</span>
                      <span>Passing: {exam.passingMarks}</span>
                      <span>Questions: {exam.questions?.length || 0}</span>
                      <span>Max Attempts: {exam.maxAttempts || 1}</span>
                    </div>

                    {exam.startTime && (
                      <div className="mt-3 text-sm text-gray-500">
                        <span>
                          Start: {new Date(exam.startTime).toLocaleString()} | End:{" "}
                          {new Date(exam.endTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/editexam/${exam._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      <FaPenToSquare /> Edit
                    </button>
                    <button
                      onClick={() => navigate(`/examquestions/${exam._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                      <FaEye /> Questions
                    </button>
                    <button
                      onClick={() => navigate(`/examanalytics/${exam._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                    >
                      <FaChartBar /> Analytics
                    </button>
                    <button
                      onClick={() => handleTogglePublish(exam._id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        exam.isPublished
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {exam.isPublished ? <MdUnpublished /> : <MdPublish />}
                      {exam.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDeleteExam(exam._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamManagement;
