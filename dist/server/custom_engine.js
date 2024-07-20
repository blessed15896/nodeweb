"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCustomTemplateEngine = void 0;
const fs_1 = require("fs");
const renderTemplate = (path, context, callback) => {
    (0, fs_1.readFile)(path, (err, data) => {
        if (err != undefined)
            callback("Cannot generate content", undefined);
        else
            callback(undefined, parseTemplate(data.toString(), context));
    });
};
const parseTemplate = (template, context) => {
    const expr = /{{(.*)}}/gm;
    return template.toString().replace(expr, (match, group) => {
        return context[group.trim()] ?? "(no data)";
    });
};
const registerCustomTemplateEngine = (expressApp) => expressApp.engine("custom", renderTemplate);
exports.registerCustomTemplateEngine = registerCustomTemplateEngine;
