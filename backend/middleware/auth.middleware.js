import jwt from "jsonwebtoken";
import { AppError } from "./error.middleware.js";
import { catchAsync } from "./error.middleware.js";
import { User } from "../models/user.model.js";
import { getJwtSecrets } from "../utils/generateToken.js";

export const isAuthenticated = catchAsync(async (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers?.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";
  const token = cookieToken || bearerToken;

  if (!token) {
    throw new AppError(
      "You are not logged in. Please log in to get access.",
      401,
    );
  }

  try {
    let decoded;
    let lastError;

    for (const secret of getJwtSecrets()) {
      try {
        decoded = await jwt.verify(token, secret);
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!decoded) {
      throw lastError || new Error("Invalid token");
    }

    // Add user ID to request
    req.id = decoded.userId;
    const user = await User.findById(req.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid token. Please log in again.", 401);
    }
    if (error.name === "TokenExpiredError") {
      throw new AppError("Your token has expired. Please log in again.", 401);
    }
    throw error;
  }
});

// Middleware for role-based access control
export const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    // roles is an array ['admin', 'instructor']
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "You do not have permission to perform this action",
        403,
      );
    }
    next();
  });
};

// Optional authentication middleware
export const optionalAuth = catchAsync(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      let decoded;
      for (const secret of getJwtSecrets()) {
        try {
          decoded = await jwt.verify(token, secret);
          break;
        } catch {
          // Try the next configured secret
        }
      }
      if (decoded) {
        req.id = decoded.userId;
      }
    }
    next();
  } catch (error) {
    // If token is invalid, just continue without authentication
    next();
  }
});
