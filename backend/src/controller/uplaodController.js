import cloudinary from "../../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64 = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "books",
    });

    res.json({ url: result.secure_url });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};