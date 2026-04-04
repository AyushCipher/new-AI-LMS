import { Server } from 'socket.io';

export let io = null;

export function setupSocket(server) {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8000',
    'https://new-ai-lms-frontend.onrender.com',
    'https://new-ai-lms.onrender.com',
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
    console.log('New user connected:', socket.id);
    
    // Join room for each course the user is enrolled in
    socket.on('joinCourses', (courseIds) => {
      if (Array.isArray(courseIds)) {
        courseIds.forEach(courseId => {
          const roomName = `course_${courseId}`;
          socket.join(roomName);
        });
        console.log(`User ${socket.id} joined course rooms:`, courseIds.map(id => `course_${id}`));
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

export function emitAnnouncement(courseId, announcement) {
  if (io) {
    const roomName = `course_${courseId}`;
    const announcementToSend = {
      _id: announcement._id,
      course: String(courseId), // Ensure course is a string
      title: announcement.title,
      content: announcement.content,
      createdBy: announcement.createdBy,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt
    };
    
    console.log(`Emitting announcement to room ${roomName}:`, announcementToSend.title);
    io.to(roomName).emit('newAnnouncement', announcementToSend);
  }
}
