import { useEffect } from 'react';
import socket from '../utils/socket';
import { useSelector } from 'react-redux';

// Hook to join only enrolled course rooms - ensures badge only shows for enrolled courses
export const useSocketCourseJoin = () => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // Check if socket is available and connected
    if (!socket) {
      console.log('Socket not initialized yet');
      return;
    }

    const checkAndJoin = () => {
      if (!socket.connected) {
        console.log('Socket not connected, retrying...');
        // Retry after a short delay
        setTimeout(checkAndJoin, 1000);
        return;
      }

      // Only collect ENROLLED courses - NOT all available courses
      const courseIds = [];

      if (userData?.enrolledCourses && Array.isArray(userData.enrolledCourses)) {
        userData.enrolledCourses.forEach(course => {
          const courseId = course._id || course;
          if (courseId && !courseIds.includes(String(courseId))) {
            courseIds.push(String(courseId));
          }
        });
      }

      // Join ONLY enrolled course rooms
      if (courseIds.length > 0) {
        console.log('Joining enrolled course rooms:', courseIds);
        socket.emit('joinCourses', courseIds);
      } else {
        console.log('No enrolled courses to join');
      }
    };

    // Check if socket is connected
    if (socket.connected) {
      checkAndJoin();
    } else {
      // Wait for connection
      socket.once('connect', () => {
        console.log('Socket connected, joining enrolled courses');
        checkAndJoin();
      });
    }
  }, [userData?.enrolledCourses]);
};

export default useSocketCourseJoin;
