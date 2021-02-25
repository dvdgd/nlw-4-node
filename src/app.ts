import express from "express";
import "reflect-metadata";
import createConnection from "./database"; // import index.ts
import { router } from "./router";

createConnection();
const app = express();

app.use(express.json());
app.use(router);

export { app };
