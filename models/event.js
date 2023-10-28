const mongoose = require("mongoose");

// Define the Event schema
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },

    // Add a reference to a User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the 'User' model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create an Event model from the schema
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
