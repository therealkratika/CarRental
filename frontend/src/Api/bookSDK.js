import api from "./Axios";

export const BookSDK = {
  getAll: async () => {
    try {
      const res = await api.get("/books");
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
  create: async (data) => {
    try {
      const res = await api.post("/books", data);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
  getMy: async () => {
    try {
      const res = await api.get("/books/my");
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
  deleteMy: async (id) => {
    try {
      const res = await api.delete(`/books/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
  getNearby: async (lat, lng, distance = 5000) => {
    try {
      const res = await api.get(
        `/books/nearby?lat=${lat}&lng=${lng}&distance=${distance}`
      );
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
  getById: async (id) => {
    try {
      const res = await api.get(`/books/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
  addToWishlist: async (bookId) => {
    try {
      const res = await api.post("/wishlist", { bookId });
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },

  getWishlist: async () => {
    try {
      const res = await api.get("/wishlist");
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },

  removeFromWishlist: async (bookId) => {
    try {
      const res = await api.delete(`/wishlist/${bookId}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
  handleAction: async (id, action, days = 1) => {
    try {
      const res = await api.post(`/books/${id}/action`, {
        action, 
        days,
      });
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
  rateBook: async (id, rating) => {
  try {
    const response = await api.post(`/books/${id}/rate`, { rating });

    return response.data; // ✅ MUST BE THIS
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
};