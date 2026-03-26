import api from "./Axios";

export const BookSDK = {
  
  getAll: async () => {
    try {
      const response = await api.get("/books");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post("/books", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getMy: async () => {
    try {
      const response = await api.get("/books/my");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteMy: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getNearby: async (lat, lng, distance = 5000) => {
    try {
      const response = await api.get(
        `/books/nearby?lat=${lat}&lng=${lng}&distance=${distance}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  handleAction: async (id, action, days = 1) => {
    try {
      const response = await api.post(`/books/${id}/action`, {
        action, 
        days,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};