import type { Express } from "express";
import repository from "../data";

export const createApi = (app: Express) => {
  app.get("/api/results", async (req, res) => {
    if (req.query.name) {
      const data = await repository.getResultsByName(
        req.query.name.toString(),
        10
      );
      if (data.length > 0) res.json(data);
      else res.writeHead(404);
    } else {
      let data = await repository.getAllResults(10);
      res.json(data);
    }
    res.end();
  });
};
