import express from "express";
import type { Express } from "express";
import repository from "./data";
import cookieParser from "cookie-parser";
import { getSession, sessionMiddleware } from "./sessions/helper";
import { Result } from "./data/repository";

const rowLimit = 10;

export const registerFormMiddleware = (app: Express) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser("mysecret"));
  app.use(sessionMiddleware());
};

export const registerFormRoutes = (app: Express) => {
  app.get("/form", async (req, res) => {
    res.render("data", { data: await repository.getAllResults(rowLimit) });
  });

  app.post("/form/delete/:id", async (req, res) => {
    const id = Number.parseInt(req.params["id"]);
    await repository.delete(id);
    res.redirect("/form");
    res.end();
  });

  app.post("/form/add", async (req, res) => {
    const nextage =
      Number.parseInt(req.body["age"]) + Number.parseInt(req.body["years"]);
    await repository.saveResult({ ...req.body, nextage } as Result);
    res.redirect("/form");
    res.end();
  });
};
