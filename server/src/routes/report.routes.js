const express = require("express");
const authenticateToken = require("../middleware/auth.middleware");
const { getDailyReport } = require("../controllers/report.controller");

const router = express.Router();

router.use(authenticateToken);

router.get("/daily", getDailyReport);

module.exports = router;
