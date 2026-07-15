import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const fallbackUsers = [];
let nextId = 1;

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const ensureDemoUser = async () => {
  if (fallbackUsers.some((user) => user.email === "demo@example.com")) {
    return;
  }

  const demoUser = {
    _id: `local-${nextId++}`,
    name: "Demo User",
    email: "demo@example.com",
    password: await bcrypt.hash("demo123456", 12),
    role: "student",
    avatar: "default-avatar.png",
    bio: "",
    enrolledCourses: [],
    createdCourses: [],
    lastActive: Date.now(),
  };

  fallbackUsers.push(demoUser);
};

export const shouldUseFallbackAuth = () => {
  return !process.env.MONGO_URI || mongoose.connection.readyState !== 1;
};

export const findFallbackUserByEmail = async (email) => {
  await ensureDemoUser();
  return fallbackUsers.find((user) => user.email === normalizeEmail(email));
};

export const findFallbackUserById = async (id) => {
  await ensureDemoUser();
  return fallbackUsers.find((user) => user._id === id);
};

export const createFallbackUser = async ({
  name,
  email,
  password,
  role = "student",
}) => {
  await ensureDemoUser();
  const normalizedEmail = normalizeEmail(email);

  if (fallbackUsers.some((user) => user.email === normalizedEmail)) {
    throw new Error("User already exists with this email");
  }

  const user = {
    _id: `local-${nextId++}`,
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
    role,
    avatar: "default-avatar.png",
    bio: "",
    enrolledCourses: [],
    createdCourses: [],
    lastActive: Date.now(),
  };

  fallbackUsers.push(user);
  return user;
};

export const updateFallbackUser = async (id, updateData) => {
  const user = await findFallbackUserById(id);
  if (!user) {
    return null;
  }

  Object.assign(user, updateData);
  user.lastActive = Date.now();
  return user;
};

export const serializeFallbackUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  bio: user.bio,
  enrolledCourses: user.enrolledCourses || [],
  createdCourses: user.createdCourses || [],
  lastActive: user.lastActive,
});
