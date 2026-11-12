const prisma = require("../src/config/prisma");
const bcrypt = require("bcrypt");

async function main() {
  const email = "demo@sweety.com";
  const password = "Sweety@123";

  // Hash the demo password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create the demo user if it doesn't exist
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Demo User",
      email,
      passwordHash,
    },
  });

  console.log("Demo user ready:", user.email);

  // Sample readings across different days
  const sampleReadings = [
    { daysAgo: 0, slot: "Morning fasting", value: 110 },
    { daysAgo: 0, slot: "After breakfast", value: 145 },
    { daysAgo: 0, slot: "After lunch", value: 132 },
    { daysAgo: 0, slot: "After dinner", value: 125 },

    { daysAgo: 1, slot: "Morning fasting", value: 105 },
    { daysAgo: 1, slot: "After breakfast", value: 138 },

    { daysAgo: 2, slot: "Morning fasting", value: 115 },
    { daysAgo: 2, slot: "After lunch", value: 140 },

    { daysAgo: 3, slot: "Morning fasting", value: 108 },
    { daysAgo: 3, slot: "After dinner", value: 130 },

    { daysAgo: 4, slot: "Morning fasting", value: 112 },
    { daysAgo: 4, slot: "After breakfast", value: 142 },

    { daysAgo: 5, slot: "Morning fasting", value: 102 },
    { daysAgo: 6, slot: "Morning fasting", value: 118 },
  ];

  for (const reading of sampleReadings) {
    const date = new Date();
    date.setDate(date.getDate() - reading.daysAgo);
    date.setHours(0, 0, 0, 0);

    await prisma.reading.upsert({
      where: {
        userId_date_slot: {
          userId: user.id,
          date,
          slot: reading.slot,
        },
      },
      update: {},
      create: {
        userId: user.id,
        date,
        slot: reading.slot,
        value: reading.value,
      },
    });
  }

  console.log("Sample readings seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
