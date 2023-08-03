const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

const HOST = "localhost";
const PORT = 8013;

const API_SERVICE_URL = "http://localhost:8000/";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(
  cors({
    exposedHeaders: "*",
  })
);

app.use(
  "/",
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    ws: true,
    logLevel: "debug",
  })
);

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy Server at ${HOST}:${PORT}`);
});
