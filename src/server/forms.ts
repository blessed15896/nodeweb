import express from "express";
import type { Express } from "express";
import repository from "./data";
import { getJsonCookie, setJsonCookie } from "./cookies";

const rowLimit = 10;

export const registerFormMiddleware = (app: Express) => {
  app.use(express.urlencoded({ extended: true }));
};

export const registerFormRoutes = (app: Express) => {
  app.get("/form", async (req, res) => {
    let history = await repository.getAllResults(rowLimit);
    res.render("age", {
      history,
      personalHistory: getJsonCookie(req, "personalHistory"),
    });
  });

  app.post("/form", async (req, res) => {
    const nextage = Number.parseInt(req.body.age) + Number(req.body.years);
    await repository.saveResult({ ...req.body, nextage });
    let pHistory = [
      {
        name: req.body.name,
        age: req.body.age,
        years: req.body.years,
        nextage,
      },
      ...(getJsonCookie(req, "personalHistory") || []),
    ].splice(0, 5);
    setJsonCookie(res, "personalHistory", pHistory);
    let history = await repository.getResultsByName(req.body.name, rowLimit);
    const context = {
      ...req.body,
      nextage,
      history,
      personalHistory: pHistory,
    };
    res.render("age", context);
  });
};
