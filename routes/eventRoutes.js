const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");


const eventControllers = require("../controllers/eventController");

// Route for creating a new event with an image upload
router.post('/createimage', authenticateUser, authorizePermissions("admin"), eventControllers.createEvent);

// Route for editing an existing event with a new image upload
router.put(
  "/editimage/:id",
  authenticateUser,
  authorizePermissions("admin"),
  eventControllers.editEvent
);

// Route for deleting an event
router.delete(
  "/deleteimage/:id",
  authenticateUser,
  authorizePermissions("admin"),
  eventControllers.deleteEvent
);


// Route for creating a new event
router.post(
  "/create",
  authenticateUser,
  authorizePermissions("admin"),
  eventControllers.createevent
);

// Route for retrieving all events
router.get('/', eventControllers.getAllevents);

// Route for retrieving a single event by ID
router.get(
  "/:id",
  authenticateUser,
  eventControllers.getSingleevent
);

// Route for updating an existing event by ID
router.put(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  eventControllers.updateevents
);

// Route for deleting an event by ID
router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  eventControllers.deleteevent
);

module.exports = router;
