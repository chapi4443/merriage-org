const mongoose = require("mongoose");

// Define the Event schema
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  eventImage: String, 
});

// Create an Event model from the schema
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
