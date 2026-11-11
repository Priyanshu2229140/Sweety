require("dotenv").config();

const bcrypt = require("bcrypt");
const prisma = require("./src/config/prisma");

async function resetPassword() {
  try {
    const newPassword = "Sweety@123";

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: {
        email: "demo@sweety.com",
      },
      data: {
        passwordHash,
      },
    });

    console.log("Password reset successfully!");
  } catch (error) {
    console.error("Password reset failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
