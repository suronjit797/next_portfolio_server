import mongoose from "mongoose";
import { Server } from "http";
import { errorLogger, successLogger } from "./shared/logger";
import config from "./config";
import app from "./app";

// Define server variable type
export let server: Server;

process.on("uncaughtException", (error: Error) => {
  errorLogger(`uncaughtException: ${error.message}`);
  process.exit(1);
});

const bootFunctions = async (): Promise<void> => {
  try {
    if (!config.PORT || !config.DB_URI) {
      errorLogger("Port or DB_URI not found in config");
      return process.exit(1);
    }

    successLogger(`Connecting to database at ${config.DB_URI}`);
    await mongoose.connect(config.DB_URI as string);
    successLogger("🛢 Database connected...");

    server = app.listen(config.PORT, () => {
      successLogger(
        `[${config.NODE_ENV === "production" ? "Prod" : "Dev"}] Server is online at http://localhost:${config.PORT}/`
      );
    });
  } catch (error: any) {
    errorLogger(`Database connection failed: ${error.message}`);
    process.exit(1);
  }

  process.on("unhandledRejection", (error: Error) => {
    if (server) {
      server.close(() => {
        errorLogger(`Unhandled rejection: ${error.message}`);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

bootFunctions();
