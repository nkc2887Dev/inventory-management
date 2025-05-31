import app from "./app";
import { connectDB } from "./config/db.config";
import config from "./config/processEnv.config";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  await connectDB();
  app.listen(config.PORT, () => {
    console.info(
      `✅ server running successfully on http://localhost:${config.PORT}`
    );
  });

  process.on("unhandledRejection", (reason: unknown, promise: Promise<any>) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });

  process.on("uncaughtException", (error: Error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
  });
})();
