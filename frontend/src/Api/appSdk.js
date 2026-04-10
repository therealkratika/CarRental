import api from "./Axios";

export const AppSDK = {
  getProfile: async () => {
    try {
      const res = await api.get("/user/profile");
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(error.message || "Location permission denied"));
        }
      );
    });
  },
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.url;

    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};