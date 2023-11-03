const Event = require("../models/event");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
// const Event = require("../models/event");


const createevent = async (req, res) => {
  req.body.user = req.user.userId;
  const Event = await Event.create(req.body);
  res.status(StatusCodes.CREATED).json({ Event});
};
const getAllevents = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};
const getSingleevent = async (req, res) => {
  const { id: eventId } = req.params;

  if (!eventId) {
    throw new CustomError.NotFoundError(`No product with id : ${event}`);
  }

  res.status(StatusCodes.OK).json({ product });
};
const updateevents = async (req, res) => {
  const { id: eventId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: eventId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};
const deleteevent = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
};

// const Event = require('./models/Event'); // Import the Event model
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// Multer storage configuration for event images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/event_images/"); // Define the destination folder for event images
  },
  filename: (req, file, cb) => {
    cb(null, `event_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5 MB
  },
});

// Create a new event with an image
const createEvent = async (req, res) => {
  try {
    upload.single("eventImage")(req, res, async (err) => {
      if (err) {
        throw new CustomError.BadRequestError(
          "Error uploading event image"
        );
      }
      
      const { title, description, date, location } = req.body;
      const event = new Event({ title, description, date, location, eventImage: req.file.path /* other fields */ });
      await event.save();
      
      res.status(StatusCodes.OK).json({ msg: "Event created successfully", event });
    });
  } catch (error) {
    // Handle errors appropriately
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Edit an existing event with a new image
const editEvent = async (req, res) => {
  try {
    upload.single("eventImage")(req, res, async (err) => {
      if (err) {
        throw CustomError.BadRequestError(
          "Error uploading event image"
        );
      }

      const eventId = req.params.id;
      const { title, description, date, location } = req.body;
      const updatedEventData = { title, description, date, location, eventImage: req.file.path /* other fields */ };
      const event = await Event.findByIdAndUpdate(eventId, updatedEventData, { new: true });
      
      if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Event not found' });
      }
      
      res.status(StatusCodes.OK).json({ msg: 'Event updated successfully', event });
    });
  } catch (error) {
    // Handle errors appropriately
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Event not found' });
    }
    
    if (event.eventImage) {
      // Delete the event image using fs.unlink or other methods
      fs.unlink(event.eventImage, (err) => {
        if (err) {
          throw CustomError.InternalServerError(
            "Error deleting event image"
          );
        }
      });
    }
    
    await Event.findByIdAndDelete(eventId);
    res.status(StatusCodes.OK).json({ msg: 'Event deleted successfully' });
  } catch (error) {
    // Handle errors appropriately
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = {
deleteevent,
updateevents,
getSingleevent,
createevent ,
getAllevents,
createEvent,
editEvent,
deleteEvent

};
