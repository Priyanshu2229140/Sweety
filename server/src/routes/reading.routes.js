const express = require("express");
const authenticateToken = require("../middleware/auth.middleware");
const {
  addReading,
  getReadings,
  updateReading,
  deleteReading,
} = require("../controllers/reading.controller");

const router = express.Router();

router.use(authenticateToken);

router.post("/", addReading);
router.get("/", getReadings);
router.put("/:id", updateReading);
router.delete("/:id", deleteReading);

module.exports = router;
