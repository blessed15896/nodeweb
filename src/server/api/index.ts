import type { Express } from "express";
import { ResultWebService } from "./result_api";
import { Validator } from "./validation_adapter";
import { ResultWebServiceValidation } from "./result_api_validator";
import feathersExpress, { rest } from "@feathersjs/express";
import { feathers } from "@feathersjs/feathers";
import { FeathersWrapper } from "./feathers_adapter";
import { ValidationError } from "./validation_types";

export const createApi = (app: Express) => {
  const feathersApp = feathersExpress(feathers(), app).configure(rest());
  const service = new Validator(
    new ResultWebService(),
    ResultWebServiceValidation
  );
  feathersApp.use("/api/results", new FeathersWrapper(service));
  feathersApp.hooks({
    error: {
      all: [
        (ctx) => {
          if (ctx.error instanceof ValidationError) {
            ctx.http = { status: 400 };
            ctx.error = undefined;
          }
        },
      ],
    },
  });
};
