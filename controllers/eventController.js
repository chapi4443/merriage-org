const Event = require("../models/event");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const Event = require("../models/event");


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
// Multer storage configuration for event images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/events/"); // Define the destination folder for event images
  },
  filename: (req, file, cb) => {
    cb(null, `event_${req.user.userId}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5 MB
  },
});

// Create an event image
const addEventImage = upload.single("eventImage"); // 'eventImage' is the field name in your form

const createEventImage = async (req, res) => {
  try {
    addEventImage(req, res, async (err) => {
      if (err) {
        throw new CustomError.BadRequestError(
          "Error uploading event image"
        );
      }

      // You can save the file path or other relevant information in your event
      const eventImagePath = req.file.path;

      // Here, you should associate the event image with your event data model
      // You didn't provide your data model, so you should save the event image path accordingly.

      // Example: Assuming you have an 'Event' model
      const event = new Event({
        // other event properties
        eventImage: eventImagePath,
      });

      await event.save();

      res
        .status(StatusCodes.OK)
        .json({ msg: "Event image uploaded successfully" });
    });
  } catch (error) {
    // Handle errors appropriately
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Edit an event image
const editEventImage = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId });
    const eventImagePath = event.eventImage;

    if (eventImagePath) {
      // Delete the old event image using fs.unlink or other methods
      fs.unlink(eventImagePath, (err) => {
        if (err) {
          throw new CustomError.InternalServerError(
            "Error deleting old event image"
          );
        }
      });
    }

    // Now, update the event image with the new one
    addEventImage(req, res, async (err) => {
      if (err) {
        throw new CustomError.BadRequestError(
          "Error uploading new event image"
        );
      }

      // Update the event's eventImage field with the new path
      const newEventImagePath = req.file.path;

      // Assuming you have an 'Event' model, update the event image path accordingly
      event.eventImage = newEventImagePath;

      await event.save();

      res
        .status(StatusCodes.OK)
        .json({ msg: "Event image updated successfully" });
    });
  } catch (error) {
    // Handle errors appropriately
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Delete an event image
const deleteEventImage = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId });
    const eventImagePath = event.eventImage;

    if (eventImagePath) {
      // Delete the event image from the server using fs.unlink or other methods
      fs.unlink(eventImagePath, (err) => {
        if (err) {
          throw new CustomError.InternalServerError(
            "Error deleting event image"
          );
        }

        // Clear the eventImage field in the Event model
        event.eventImage = null;

        // Save the event
        event.save((err) => {
          if (err) {
            throw new CustomError.InternalServerError(
              "Error saving event after deleting event image"
            );
          }
          res
            .status(StatusCodes.OK)
            .json({ msg: "Event image deleted successfully" });
        });
      });
    } else {
      throw new CustomError.BadRequestError("No event image to delete");
    }
  } catch (error) {
    // Handle errors appropriately
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
deleteevent,
updateevents,
getSingleevent,
createevent ,
getAllevents,
createEventImage,
editEventImage,
deleteEventImage

};
