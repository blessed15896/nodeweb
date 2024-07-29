import validator from "validator";
import {
  ModelValidation,
  ValidationRequirements,
  ValidationRule,
  WebServiceValidation,
} from "./validation_types";

const intValidator: ValidationRule = {
  validation: [(val) => validator.isInt(val.toString())],
  converter: (val) => Number.parseInt(val),
};

const partialResultValidator: ValidationRequirements = {
  name: [(val) => !validator.isEmpty(val)],
  age: intValidator,
  years: intValidator,
};

export const ResultWebServiceValidation: WebServiceValidation = {
  keyValidator: intValidator,
  store: partialResultValidator,
  replace: {
    ...partialResultValidator,
    nextage: intValidator,
  },
};

export const ResultModelValidation: ModelValidation = {
  propertyRules: { ...partialResultValidator, nextage: intValidator },
  modelRule: [(m: any) => m.nextage === m.age + m.years],
};
