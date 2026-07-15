import test from "node:test";
import assert from "node:assert/strict";
import { generateToken } from "../utils/generateToken.js";

test("generateToken returns a token and safe user payload", () => {
  const calls = {};
  const res = {
    status(code) {
      calls.statusCode = code;
      return this;
    },
    cookie(name, value, options) {
      calls.cookie = { name, value, options };
      return this;
    },
    json(payload) {
      calls.payload = payload;
      return this;
    },
  };

  const user = {
    _id: "user-123",
    name: "Test User",
    email: "test@example.com",
    password: "secret",
  };

  generateToken(res, user, "Signed in");

  assert.equal(calls.statusCode, 200);
  assert.equal(typeof calls.payload.token, "string");
  assert.equal(calls.payload.user.name, "Test User");
  assert.equal(calls.payload.user.email, "test@example.com");
  assert.equal(calls.payload.user.password, undefined);
  assert.equal(calls.cookie.name, "token");
});
