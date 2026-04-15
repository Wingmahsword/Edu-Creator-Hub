import express, { type Express } from "express";
import cors from "cors";
// @ts-ignore
import pinoHttp from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// @ts-ignore
const loggerMiddleware = pinoHttp({
  logger,
  serializers: {
    // @ts-ignore
    req: (req: any) => ({
      id: req.id,
      method: req.method,
      url: req.url?.split("?")[0],
    }),
    // @ts-ignore
    res: (res: any) => ({
      statusCode: res.statusCode,
    }),
  },
});

app.use(loggerMiddleware);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
