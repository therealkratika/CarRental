import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "books",
    });

    res.json({
      url: result.secure_url,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};