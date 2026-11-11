const express = require("express");
const authenticateToken = require("../middleware/auth.middleware");

const {
  getDailyReport,
  getCurrentMonthReport,
  getPreviousMonthReport,
} = require("../controllers/report.controller");

const router = express.Router();

router.use(authenticateToken);

router.get("/daily", getDailyReport);
router.get("/monthly/current", getCurrentMonthReport);
router.get("/monthly/previous", getPreviousMonthReport);

module.exports = router;
