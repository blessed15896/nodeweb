import express from "express";
import type { Express } from "express";
import repository from "./data";
import { getJsonCookie, setJsonCookie } from "./cookies";
import cookieParser from "cookie-parser";
import { CustomSessionMiddleware } from "./sessions/middleware";
import { getSession } from "./sessions/helper";

const rowLimit = 10;

export const registerFormMiddleware = (app: Express) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser("mysecret"));
  app.use(CustomSessionMiddleware());
};

export const registerFormRoutes = (app: Express) => {
  app.get("/form", async (req, res) => {
    let history = await repository.getAllResults(rowLimit);
    res.render("age", {
      history,
      personalHistory: getSession(req).data.personalHistory,
    });
  });

  app.post("/form", async (req, res) => {
    const nextage = Number.parseInt(req.body.age) + Number(req.body.years);
    await repository.saveResult({ ...req.body, nextage });
    req.session.data.personalHistory = [
      {
        name: req.body.name,
        age: req.body.age,
        years: req.body.years,
        nextage,
      },
      ...(req.session.data.personalHistory || []),
    ].splice(0, 5);
    let history = await repository.getResultsByName(req.body.name, rowLimit);
    const context = {
      ...req.body,
      nextage,
      history,
      personalHistory: req.session.data.personalHistory,
    };
    res.render("age", context);
  });
};
