"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const helmet_1 = __importDefault(require("helmet"));
const testHandler_1 = require("./testHandler");
const custom_engine_1 = require("./custom_engine");
const port = 5000;
const app = (0, express_1.default)();
const proxy = http_proxy_1.default.createProxyServer({
    target: "http://localhost:5100",
    ws: true,
});
(0, custom_engine_1.registerCustomTemplateEngine)(app);
app.set("views", "templates/server");
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.get("/dynamic/:file", (req, res) => {
    res.render(`${req.params.file}.custom`, { message: "Hello template" });
});
app.post("/test", testHandler_1.testHandler);
app.use(express_1.default.static("static"));
app.use(express_1.default.static("node_modules/bootstrap/dist"));
app.use((req, res) => proxy.web(req, res));
const server = (0, http_1.createServer)(app);
server.on("upgrade", (req, socket, head) => proxy.ws(req, socket, head));
server.listen(port, () => console.log(`HTTP Server listening on port ${port}`));
