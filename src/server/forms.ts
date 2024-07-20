import express from "express";
import type { Express } from "express";
import multer from "multer";
import { sanitizeValue } from "./sanitize";

const fileMiddleware = multer({ storage: multer.memoryStorage() });

export const registerFormMiddleware = (app: Express) => {
  app.use(express.urlencoded({ extended: true }));
};

export const registerFormRoutes = (app: Express) => {
  app.get("/form", (req, res) => {
    for (const key in req.query) {
      res.write(`${key}: ${req.query[key]}\n`);
    }
    res.end();
  });

  app.post("/form", fileMiddleware.single("datafile"), (req, res) => {
    res.setHeader("Content-Type", "text/html");
    for (const key in req.body) {
      res.write(`<div>${key}: ${sanitizeValue(req.body[key])}</div>`);
    }
    if (req.file) {
      res.write(`<div>File: ${req.file.originalname}</div>`);
      res.write(`<div>${sanitizeValue(req.file.buffer.toString())}</div>`);
    }
    res.end();
  });
};
