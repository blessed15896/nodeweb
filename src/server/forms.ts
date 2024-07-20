import type { Express } from "express";

export const registerFormMiddleware = (app: Express) => {
  // no middleware yet
};

export const registerFormRoutes = (app: Express) => {
  app.get("/form", (req, res) => {
    for (const key in req.query) {
      res.write(`${key}: ${req.query[key]}\n`);
    }
    res.end();
  });
};
