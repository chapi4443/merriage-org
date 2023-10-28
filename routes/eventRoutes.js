const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
// const uploadImage = require("../middleware/uploadImage"); // Import the middleware for handling image uploads

const {
  deleteevent,
  updateevents,
  getSingleevent,
  createevent,
  getAllevents,
  createEventImage,
  editEventImage,
  deleteEventImage,
} = require("../controllers/eventController");

// Create Event Image - POST /api/v1/events/createeventImage
router.post(
  "/createeventImage",
  [
    authenticateUser,
    authorizePermissions("admin"),
    uploadImage.single("eventImage"),
  ],
  createEventImage
);

// Edit Event Image - PATCH /api/v1/events/editEventImage/:id
router.patch(
  "/editEventImage/:id",
  [
    authenticateUser,
    authorizePermissions("admin"),
    uploadImage.single("eventImage"),
  ],
  editEventImage
);

// Delete Event Image - DELETE /api/v1/events/deleteEventImage/:id
router.delete(
  "/deleteEventImage/:id",
  [authenticateUser, authorizePermissions("admin")],
  deleteEventImage
);

// Rest of your existing routes for managing events
router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createevent)
  .get(getAllevents);

router
  .route("/:id")
  .get(getSingleevent)
  .patch([authenticateUser, authorizePermissions("admin")], updateevents)
  .delete([authenticateUser, authorizePermissions("admin")], deleteevent);

module.exports = router;
