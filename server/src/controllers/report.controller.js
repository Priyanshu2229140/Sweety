const prisma = require("../config/prisma");

const getDailyReport = async (req, res) => {
  try {
    const { date } = req.query;

    // 1. Validate date format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Please provide date in YYYY-MM-DD format.",
      });
    }

    // 2. Create and validate date
    const [year, month, day] = date.split("-").map(Number);
    const reportDate = new Date(Date.UTC(year, month - 1, day));

    if (
      reportDate.getUTCFullYear() !== year ||
      reportDate.getUTCMonth() !== month - 1 ||
      reportDate.getUTCDate() !== day
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid calendar date.",
      });
    }

    // 3. Fetch user's readings for that date
    const readings = await prisma.reading.findMany({
      where: {
        userId: req.userId,
        date: reportDate,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // 4. Handle no readings
    if (readings.length === 0) {
      return res.status(200).json({
        success: true,
        date,
        count: 0,
        min: null,
        max: null,
        average: null,
        readings: [],
      });
    }

    // 5. Calculate statistics
    const values = readings.map((reading) => reading.value);

    const min = Math.min(...values);
    const max = Math.max(...values);

    const average = Number(
      (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(
        1,
      ),
    );

    // 6. Return report
    return res.status(200).json({
      success: true,
      date,
      count: readings.length,
      min,
      max,
      average,
      readings,
    });
  } catch (error) {
    console.error("Daily report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate daily report.",
    });
  }
};

const getCurrentMonthReport = async (req, res) => {
  try {
    // 1. Get today's date
    const today = new Date();

    // 2. Calculate current month's date range
    const startDate = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), 1),
    );

    const endDate = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    );

    // 3. Fetch readings for the current month
    const readings = await prisma.reading.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // 4. Handle empty readings
    if (readings.length === 0) {
      return res.status(200).json({
        success: true,
        month: today.toISOString().slice(0, 7),
        count: 0,
        min: null,
        max: null,
        average: null,
      });
    }

    // 5. Calculate statistics
    const values = readings.map((reading) => reading.value);

    const min = Math.min(...values);
    const max = Math.max(...values);

    const average = Number(
      (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(
        1,
      ),
    );

    // 6. Return report
    return res.status(200).json({
      success: true,
      month: today.toISOString().slice(0, 7),
      count: readings.length,
      min,
      max,
      average,
    });
  } catch (error) {
    console.error("Current month report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate current month report.",
    });
  }
};

const getPreviousMonthReport = async (req, res) => {
  try {
    // 1. Get today's date
    const today = new Date();

    // 2. Calculate previous month's date range
    const startDate = new Date(
      Date.UTC(today.getFullYear(), today.getMonth() - 1, 1),
    );

    const endDate = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), 1),
    );

    // 3. Fetch previous month's readings
    const readings = await prisma.reading.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // 4. Handle empty readings
    if (readings.length === 0) {
      return res.status(200).json({
        success: true,
        month: startDate.toISOString().slice(0, 7),
        count: 0,
        min: null,
        max: null,
        average: null,
      });
    }

    // 5. Calculate statistics
    const values = readings.map((reading) => reading.value);

    const min = Math.min(...values);
    const max = Math.max(...values);

    const average = Number(
      (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(
        1,
      ),
    );

    // 6. Return report
    return res.status(200).json({
      success: true,
      month: startDate.toISOString().slice(0, 7),
      count: readings.length,
      min,
      max,
      average,
    });
  } catch (error) {
    console.error("Previous month report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate previous month report.",
    });
  }
};

module.exports = {
  getDailyReport,
  getCurrentMonthReport,
  getPreviousMonthReport,
};
