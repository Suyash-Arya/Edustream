import api from './axios';

export const authAPI = {
  signup: async (userData) => {
    return api.post('/user/signup', userData);
  },

  signin: async (credentials) => {
    return api.post('/user/signin', credentials);
  },

  signout: async () => {
    return api.post('/user/signout');
  },

  getCurrentProfile: async () => {
    return api.get('/user/profile');
  },

  updateProfile: async (formData) => {
    return api.patch('/user/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  changePassword: async (passwordData) => {
    return api.patch('/user/change-password', passwordData);
  },

  deleteAccount: async () => {
    return api.delete('/user/account');
  },
};
