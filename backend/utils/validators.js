import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").isIn(["seeker", "employer"]),
];

export const loginValidator = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

export const jobValidator = [
  body("title").trim().notEmpty(),
  body("description").trim().notEmpty(),
  body("location").trim().notEmpty(),
  body("skills").isArray({ min: 1 }),
];