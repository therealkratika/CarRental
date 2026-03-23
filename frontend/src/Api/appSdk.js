import api from "./Axios";

export const AppSDK = {
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );

            const data = await res.json();

            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "";

            const area =
              data.address.suburb ||
              data.address.neighbourhood ||
              data.address.state_district ||
              "";

            resolve({
              lat,
              lng,
              city,
              area,
            });

          } catch (error) {
            reject(error);
          }
        },
        () => reject("Location permission denied")
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
}