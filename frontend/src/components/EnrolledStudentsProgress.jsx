import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';

const EnrolledStudentsProgress = ({ courseId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverUrl}/api/course/enrolled-students/${courseId}`, { withCredentials: true });
        setStudents(res.data.students);
      } catch (err) {
        setError('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchStudents();
  }, [courseId]);

  if (loading) return <div>Loading students...</div>;
  if (error) return <div>{error}</div>;
  if (!students.length) return <div>No students enrolled yet.</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-lg font-semibold mb-4">Enrolled Students & Progress</h2>
      <table className="min-w-full text-left border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Progress</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td className="py-2 px-4 border-b">{student.name}</td>
              <td className="py-2 px-4 border-b">{student.email}</td>
              <td className="py-2 px-4 border-b">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs ml-2">{student.progress}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnrolledStudentsProgress;
