import { Server } from 'socket.io';

export let io = null;

export function setupSocket(server) {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8000',
    process.env.FRONTEND_URL
  ].filter(Boolean); // Remove undefined values

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    // Join room for each course the user is enrolled in
    socket.on('joinCourses', (courseIds) => {
      courseIds.forEach(courseId => {
        socket.join(`course_${courseId}`);
      });
    });
  });
}

export function emitAnnouncement(courseId, announcement) {
  if (io) {
    io.to(`course_${courseId}`).emit('newAnnouncement', announcement);
  }
}
