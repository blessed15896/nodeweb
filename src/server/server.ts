import { createServer } from "http";
import express from "express";
import httpProxy from "http-proxy";
import helmet from "helmet";
import { testHandler } from "./testHandler";

const port = 5000;

const app = express();
const proxy = httpProxy.createProxyServer({
  target: "http://localhost:5100",
  ws: true,
});

app.use(helmet());
app.use(express.json());

app.post("/test", testHandler);

app.use(express.static("static"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use((req, res) => proxy.web(req, res));

const server = createServer(app);
server.on("upgrade", (req, socket, head) => proxy.ws(req, socket, head));

server.listen(port, () => console.log(`HTTP Server listening on port ${port}`));
