import { createServer } from "http";
import express from "express";
import httpProxy from "http-proxy";
import helmet from "helmet";
import { testHandler } from "./testHandler";
import { engine } from "express-handlebars";
import * as helpers from "./template_helpers";
import { registerFormMiddleware, registerFormRoutes } from "./forms";

const port = 5000;

const app = express();
const proxy = httpProxy.createProxyServer({
  target: "http://localhost:5100",
  ws: true,
});

app.set("views", "templates/server");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(helmet());
app.use(express.json());

registerFormMiddleware(app);
registerFormRoutes(app);

app.get("/dynamic/:file", (req, res) => {
  res.render(`${req.params.file}.handlebars`, {
    message: "Hello template",
    req,
    helpers: { ...helpers },
  });
});

app.post("/test", testHandler);

app.use(express.static("static"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use((req, res) => proxy.web(req, res));

const server = createServer(app);
server.on("upgrade", (req, socket, head) => proxy.ws(req, socket, head));

server.listen(port, () => console.log(`HTTP Server listening on port ${port}`));
