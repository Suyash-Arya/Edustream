import { create } from 'zustand';
import { courseAPI } from '../api/courseAPI';

export const useCourseStore = create((set, get) => ({
  courses: [],
  myCreatedCourses: [],
  currentCourse: null,
  loading: false,
  error: null,

  fetchPublishedCourses: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await courseAPI.getPublishedCourses(filters);
      set({ courses: response.data || response, loading: false });
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to fetch courses', loading: false });
      throw error;
    }
  },

  searchCourses: async (searchParams) => {
    set({ loading: true, error: null });
    try {
      const response = await courseAPI.searchCourses(searchParams);
      set({ courses: response.data || response, loading: false });
      return response;
    } catch (error) {
      set({ error: error.message || 'Search failed', loading: false });
      throw error;
    }
  },

  getCourseDetails: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const response = await courseAPI.getCourseDetails(courseId);
      set({ currentCourse: response.data || response, loading: false });
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to fetch course', loading: false });
      throw error;
    }
  },

  createCourse: async (courseData) => {
    set({ loading: true, error: null });
    try {
      const response = await courseAPI.createCourse(courseData);
      set((state) => ({
        myCreatedCourses: [...state.myCreatedCourses, response.data || response],
        loading: false,
      }));
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to create course', loading: false });
      throw error;
    }
  },

  getMyCreatedCourses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await courseAPI.getMyCreatedCourses();
      set({ myCreatedCourses: response.data || response, loading: false });
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to fetch courses', loading: false });
      throw error;
    }
  },

  updateCourse: async (courseId, courseData) => {
    set({ loading: true, error: null });
    try {
      const response = await courseAPI.updateCourse(courseId, courseData);
      set((state) => ({
        myCreatedCourses: state.myCreatedCourses.map((c) =>
          c._id === courseId ? response.data || response : c
        ),
        currentCourse: state.currentCourse?._id === courseId ? response.data || response : state.currentCourse,
        loading: false,
      }));
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to update course', loading: false });
      throw error;
    }
  },

  addLecture: async (courseId, lectureData) => {
    set({ loading: true, error: null });
    try {
      const response = await courseAPI.addLecture(courseId, lectureData);
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to add lecture', loading: false });
      throw error;
    }
  },

  getCourseLectures: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const response = await courseAPI.getCourseLectures(courseId);
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to fetch lectures', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  setCurrentCourse: (course) => set({ currentCourse: course }),

  clearCurrentCourse: () => set({ currentCourse: null }),
}));
