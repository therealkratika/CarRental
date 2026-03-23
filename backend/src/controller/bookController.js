import Book from "../model/book.js";
import User from "../model/user.js";
export const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      category,
      condition,
      isForSale,
      isForRent,
      salePrice,
      rentPricePerDay,
      image,
      city,
      area,
      coordinates, 
      name,
      phone,
      email,
    } = req.body;

    if (!isForSale && !isForRent) {
      return res.status(400).json({
        message: "Book must be for rent or sale",
      });
    }

    const book = await Book.create({
      title,
      author,
      description,
      category,
      condition,
      isForSale,
      isForRent,
      salePrice,
      rentPricePerDay,
      image,

      location: {
        type: "Point",
        coordinates: [
          coordinates.lng, 
          coordinates.lat,
        ],
        city,
        area,
      },

      contact: {
        name,
        phone,
        email,
      },

      owner: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, {
      isSeller: true,
    });

    res.status(201).json(book);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ status: "available" }).populate(
      "owner",
      "name email phone"
    );

    res.json(books);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user._id });

    res.json(books);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await book.deleteOne();

    res.json({ message: "Book deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const handleBookAction = async (req, res) => {
  try {
    const { action, days } = req.body; 

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.status !== "available") {
      return res.status(400).json({ message: "Book not available" });
    }

    if (action === "buy") {
      if (!book.isForSale) {
        return res.status(400).json({ message: "Not for sale" });
      }
      book.status = "sold";
    }

    if (action === "rent") {
      if (!book.isForRent) {
        return res.status(400).json({ message: "Not for rent" });
      }
      book.status = "rented";
      book.rentedForDays = days || 1;
    }

    await book.save();

    res.json({ message: "Success", book });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getNearbyBooks = async (req, res) => {
  try {
    const { lat, lng, distance = 5000 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude required",
      });
    }

    const books = await Book.find({
      status: "available",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(distance),
        },
      },
    }).populate("owner", "name phone email");

    res.json(books);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};