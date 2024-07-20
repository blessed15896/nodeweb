import express from "express";
import type { Express } from "express";

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

  app.post("/form", (req, res) => {
    res.write(`Content-Type: ${req.headers["content-type"]}\n`);
    for (const key in req.body) {
      res.write(`${key}: ${req.body[key]}\n`);
    }
    res.end();
  });
};
