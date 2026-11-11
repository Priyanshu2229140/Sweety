const { z } = require("zod");

const readingSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),

  slot: z.enum([
    "Morning fasting",
    "After breakfast",
    "After lunch",
    "After dinner",
  ]),

  value: z.coerce
    .number()
    .int("Glucose value must be a whole number")
    .min(40, "Glucose value cannot be below 40 mg/dL")
    .max(600, "Glucose value cannot exceed 600 mg/dL"),
});

module.exports = { readingSchema };
