const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");

const { registerSchema, loginSchema } = require("../validators/auth.validator");

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
const register = async (req, res) => {
  try {
    // Step 1: Validate incoming data
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.issues.map((issue) => issue.message),
      });
    }

    // Step 2: Extract validated data
    const { name, email, password } = validation.data;

    const normalizedEmail = email.toLowerCase();

    // Step 3: Check whether the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Step 4: Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Step 5: Create the user in PostgreSQL
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Step 6: Generate authentication token
    const token = generateToken(user.id);

    // Step 7: Send successful response
    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate email race conditions
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration.",
    });
  }
};
const login = async (req, res) => {
  try {
    // Step 1: Validate login details
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.issues.map((issue) => issue.message),
      });
    }

    // Step 2: Extract validated credentials
    const { email, password } = validation.data;

    // Step 3: Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    // Step 4: Check whether user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Step 5: Compare entered password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Step 6: Generate JWT
    const token = generateToken(user.id);

    // Step 7: Return successful response
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during login.",
    });
  }
};
module.exports = {
  register,
  login,
};
