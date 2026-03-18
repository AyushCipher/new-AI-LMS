import React, { useEffect, useState } from 'react'
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { setCreatorCourseData } from '../../redux/courseSlice';
import img1 from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
import EnrolledStudentsProgress from '../../components/EnrolledStudentsProgress';

function Courses() {

  let navigate = useNavigate()
  let dispatch = useDispatch()
  const { creatorCourseData } = useSelector(state => state.course)
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [showStudents, setShowStudents] = useState(false)

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true })
        await dispatch(setCreatorCourseData(result.data))
        console.log(result.data)

      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      }
    }
    getCreatorData()
  }, [])


  const handleViewStudents = (courseId) => {
    setSelectedCourseId(courseId)
    setShowStudents(true)
  }

  const handleBackToCourses = () => {
    setShowStudents(false)
    setSelectedCourseId(null)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-[100%] min-h-screen p-4 sm:p-6 bg-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 ">
          
          <div className='flex items-center justify-center gap-3'>
            <FaArrowLeftLong className=' w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/dashboard")}/>
            <h1 className="text-xl font-semibold">Courses</h1>
          </div>

          <button className="bg-[black] text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => navigate("/createcourses")}>
            Create Course
          </button>
        </div>


        {!showStudents ? (
          <div className="hidden md:block bg-white rounded-xl shadow p-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Course</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Action</th>
                  <th className="text-left py-3 px-4">Students</th>
                </tr>
              </thead>

              <tbody>
                {creatorCourseData?.map((course, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                    <td className="py-3 px-4 flex items-center gap-4">
                      {course?.thumbnail ? (
                        <img 
                          src={course.thumbnail}
                          alt="Course Thumbnail"
                          className="w-20 h-14 object-cover rounded-md"
                        />
                      ) : (
                        <img 
                          src={img1}
                          alt="Default Thumbnail"
                          className="w-14 h-14 object-cover rounded-md"
                        />
                      )}
                      <span>{course?.title}</span>
                    </td>

                    {course?.price ? <td className="py-3 px-4">₹{course?.price}</td> : <td className="py-3 px-4">₹ NA</td>}

                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${course?.isPublished ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>
                        {course?.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <FaEdit className="text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/addcourses/${course?._id}`)} />
                    </td>

                    <td className="py-3 px-4">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                        onClick={() => handleViewStudents(course._id)}
                      >
                        View Students
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-center text-sm text-gray-400 mt-6">
              A list of your recent courses.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-4 mt-6">
            <button
              className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              onClick={handleBackToCourses}
            >
              Back to Courses
            </button>
            <EnrolledStudentsProgress courseId={selectedCourseId} />
          </div>
        )}

      </div>
    </div>
  );
}

export default Courses
