import { readFile } from "fs";
import type { Express } from "express";

const renderTemplate = (
  path: string,
  context: any,
  callback: (err: any, response: string | undefined) => void
) => {
  readFile(path, (err, data) => {
    if (err != undefined) callback("Cannot generate content", undefined);
    else callback(undefined, parseTemplate(data.toString(), context));
  });
};

const parseTemplate = (template: string, context: any) => {
  const ctx = Object.keys(context)
    .map((k) => `const ${k} = context.${k}`)
    .join(";");
  const expr = /{{(.*)}}/gm;
  return template.toString().replace(expr, (match, group) => {
    return eval(`${ctx};${group}`);
  });
};

export const registerCustomTemplateEngine = (expressApp: Express) =>
  expressApp.engine("custom", renderTemplate);
