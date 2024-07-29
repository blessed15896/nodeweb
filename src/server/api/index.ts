import type { Express } from "express";
import { createAdapter } from "./http_adapter";
import { ResultWebService } from "./result_api";
import { Validator } from "./validation_adapter";
import { ResultWebServiceValidation } from "./result_api_validator";

export const createApi = (app: Express) => {
  createAdapter(
    app,
    new Validator(new ResultWebService(), ResultWebServiceValidation),
    "/api/results"
  );
};
