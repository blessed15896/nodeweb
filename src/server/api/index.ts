import type { Express } from "express";
import { createAdapter } from "./http_adapter";
import { ResultWebService } from "./result_api";

export const createApi = (app: Express) => {
  createAdapter(app, new ResultWebService(), "/api/results");
};
