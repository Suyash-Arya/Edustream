import api from './axios';

export const courseAPI = {
  // Public endpoints
  getPublishedCourses: async (params) => {
    return api.get('/course/published', { params });
  },

  searchCourses: async (params) => {
    return api.get('/course/search', { params });
  },

  getCourseDetails: async (courseId) => {
    return api.get(`/course/c/${courseId}`);
  },

  // Instructor endpoints
  createCourse: async (courseData) => {
    return api.post('/course', courseData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getMyCreatedCourses: async () => {
    return api.get('/course');
  },

  updateCourse: async (courseId, courseData) => {
    return api.patch(`/course/c/${courseId}`, courseData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Lecture management
  addLecture: async (courseId, lectureData) => {
    return api.post(`/course/c/${courseId}/lectures`, lectureData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getCourseLectures: async (courseId) => {
    return api.get(`/course/c/${courseId}/lectures`);
  },
};
