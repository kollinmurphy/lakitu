import express from "express";
import { handler as ssrHandler } from "../dist/server/entry.mjs";
import { webhook } from "./webhook";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.use(webhook);
app.use("/", express.static("../dist/client/"));
app.use(ssrHandler);

console.log("Listening on port 8080");
app.listen(8080);
