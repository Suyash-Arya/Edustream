import api from './axios';

export const progressAPI = {
  getCourseProgress: async (courseId) => {
    return api.get(`/progress/course/${courseId}`);
  },

  updateLectureProgress: async (courseId, lectureId) => {
    return api.patch(`/progress/course/${courseId}/lecture/${lectureId}`);
  },

  completeCourse: async (courseId) => {
    return api.post(`/progress/course/${courseId}/complete`);
  },
};
