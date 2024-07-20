import { readFile } from "fs";
import type { Express } from "express";
import * as features from "./custom_features";

const renderTemplate = (
  path: string,
  context: any,
  callback: (err: any, response: string | undefined) => void
) => {
  readFile(path, (err, data) => {
    if (err != undefined) callback("Cannot generate content", undefined);
    else
      callback(
        undefined,
        parseTemplate(data.toString(), { ...context, features })
      );
  });
};

const parseTemplate = (template: string, context: any) => {
  const ctx = Object.keys(context)
    .map((k) => `const ${k} = context.${k}`)
    .join(";");
  const expr = /{{(.*)}}/gm;
  return template.toString().replace(expr, (match, group) => {
    const evalFunc = (expr: string) => eval(`${ctx};${expr}`);
    try {
      if (group.trim()[0] === "@") {
        group = `features.${group.trim().substring(1)}`;
        group = group.replace(/\)$/m, ", context)");
      }
      debugger;
      let result = evalFunc(group);
      if (expr.test(result)) {
        result = parseTemplate(result, context);
      }
      return result;
    } catch (err) {
      return err;
    }
  });
};

export const registerCustomTemplateEngine = (expressApp: Express) =>
  expressApp.engine("custom", renderTemplate);
