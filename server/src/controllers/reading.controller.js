const prisma = require("../config/prisma");
const { readingSchema } = require("../validators/reading.validator");

const addReading = async (req, res) => {
  try {
    // 1. Validate request data
    const validation = readingSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid reading details.",
        errors: validation.error.issues,
      });
    }

    const { date, slot, value } = validation.data;

    // 2. Validate the calendar date
    const [year, month, day] = date.split("-").map(Number);
    const readingDate = new Date(Date.UTC(year, month - 1, day));

    if (
      readingDate.getUTCFullYear() !== year ||
      readingDate.getUTCMonth() !== month - 1 ||
      readingDate.getUTCDate() !== day
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid date.",
      });
    }

    const today = new Date();
    const todayDate = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    if (readingDate.getTime() > todayDate) {
      return res.status(400).json({
        success: false,
        message: "Future dates are not allowed.",
      });
    }

    // 3. Check for duplicate slot
    const existingReading = await prisma.reading.findUnique({
      where: {
        userId_date_slot: {
          userId: req.userId,
          date: readingDate,
          slot,
        },
      },
    });

    if (existingReading) {
      return res.status(409).json({
        success: false,
        message: "A reading already exists for this slot and date.",
      });
    }

    // 4. Check maximum four readings per day
    const dailyCount = await prisma.reading.count({
      where: {
        userId: req.userId,
        date: readingDate,
      },
    });

    if (dailyCount >= 4) {
      return res.status(409).json({
        success: false,
        message: "Maximum four readings allowed per day.",
      });
    }

    // 5. Save reading
    const reading = await prisma.reading.create({
      data: {
        userId: req.userId,
        date: readingDate,
        slot,
        value,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Glucose reading added successfully.",
      reading,
    });
  } catch (error) {
    console.error("Add reading error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A reading already exists for this slot and date.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to add glucose reading.",
    });
  }
};

const getReadings = async (req, res) => {
  try {
    const readings = await prisma.reading.findMany({
      where: {
        userId: req.userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: readings.length,
      readings,
    });
  } catch (error) {
    console.error("Get readings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve glucose readings.",
    });
  }
};

const updateReading = async (req, res) => {
  try {
    const readingId = Number(req.params.id);

    if (!Number.isInteger(readingId) || readingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid reading ID.",
      });
    }

    const validation = readingSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid reading details.",
        errors: validation.error.issues,
      });
    }

    const { date, slot, value } = validation.data;

    const [year, month, day] = date.split("-").map(Number);
    const readingDate = new Date(Date.UTC(year, month - 1, day));

    if (
      readingDate.getUTCFullYear() !== year ||
      readingDate.getUTCMonth() !== month - 1 ||
      readingDate.getUTCDate() !== day
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid date.",
      });
    }

    const today = new Date();
    const todayDate = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    if (readingDate.getTime() > todayDate) {
      return res.status(400).json({
        success: false,
        message: "Future dates are not allowed.",
      });
    }

    const existingReading = await prisma.reading.findFirst({
      where: {
        id: readingId,
        userId: req.userId,
      },
    });

    if (!existingReading) {
      return res.status(404).json({
        success: false,
        message: "Reading not found.",
      });
    }

    const duplicate = await prisma.reading.findFirst({
      where: {
        userId: req.userId,
        date: readingDate,
        slot,
        id: { not: readingId },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Another reading already exists for this slot and date.",
      });
    }

    const updatedReading = await prisma.reading.update({
      where: { id: readingId },
      data: {
        date: readingDate,
        slot,
        value,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Reading updated successfully.",
      reading: updatedReading,
    });
  } catch (error) {
    console.error("Update reading error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update glucose reading.",
    });
  }
};

const deleteReading = async (req, res) => {
  try {
    const readingId = Number(req.params.id);

    if (!Number.isInteger(readingId) || readingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid reading ID.",
      });
    }

    // Find the reading belonging to the logged-in user
    const existingReading = await prisma.reading.findFirst({
      where: {
        id: readingId,
        userId: req.userId,
      },
    });

    if (!existingReading) {
      return res.status(404).json({
        success: false,
        message: "Reading not found.",
      });
    }

    // Delete the reading
    await prisma.reading.delete({
      where: {
        id: readingId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Reading deleted successfully.",
    });
  } catch (error) {
    console.error("Delete reading error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete glucose reading.",
    });
  }
};

module.exports = {
  addReading,
  getReadings,
  updateReading,
  deleteReading,
};
