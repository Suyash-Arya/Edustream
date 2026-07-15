import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { User } from "../models/user.model.js";

test("isAuthenticated accepts Authorization bearer token when no cookie is present", async () => {
  let nextCalled = false;
  let receivedError = null;

  const req = {
    headers: {
      authorization: "Bearer test-token",
    },
  };
  const res = {};
  const next = (err) => {
    receivedError = err;
    nextCalled = true;
  };

  const originalVerify = jwt.verify;
  const originalFindById = User.findById;

  jwt.verify = async () => ({ userId: "user-123" });
  User.findById = async () => ({ _id: "user-123", role: "student" });

  isAuthenticated(req, res, next);
  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(nextCalled, true);
  assert.equal(receivedError, undefined);
  assert.equal(req.id, "user-123");
  assert.equal(req.user._id, "user-123");

  jwt.verify = originalVerify;
  User.findById = originalFindById;
});
