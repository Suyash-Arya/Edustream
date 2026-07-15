import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import {
  getCourseDetails,
  fallbackCourses,
} from "../controllers/course.controller.js";

test("getCourseDetails returns a fallback course when the database is unavailable", async () => {
  const calls = {};
  const req = { params: { courseId: fallbackCourses[0]._id } };
  const res = {
    status(code) {
      calls.statusCode = code;
      return this;
    },
    json(payload) {
      calls.payload = payload;
      return this;
    },
  };
  const next = (err) => {
    calls.error = err;
  };

  const originalReadyState = mongoose.connection.readyState;
  mongoose.connection.readyState = 0;

  getCourseDetails(req, res, next);
  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(calls.statusCode, 200);
  assert.equal(calls.payload.data._id, fallbackCourses[0]._id);
  assert.equal(calls.error, undefined);

  mongoose.connection.readyState = originalReadyState;
});
