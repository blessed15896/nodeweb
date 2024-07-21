import express from "express";
import type { Express } from "express";
import repository from "./data";

const rowLimit = 10;

export const registerFormMiddleware = (app: Express) => {
  app.use(express.urlencoded({ extended: true }));
};

export const registerFormRoutes = (app: Express) => {
  app.get("/form", async (req, res) => {
    let history = await repository.getAllResults(rowLimit);
    res.render("age", { history });
  });

  app.post("/form", async (req, res) => {
    const nextage = Number.parseInt(req.body.age) + Number(req.body.years);
    await repository.saveResult({ ...req.body, nextage });
    let history = await repository.getResultsByName(req.body.name, rowLimit);
    const context = { ...req.body, nextage, history };
    res.render("age", context);
  });
};
