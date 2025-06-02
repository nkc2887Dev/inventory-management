import mongoose from "mongoose";
import config from "./processEnv.config";
import { DB_EVENTS } from "../constants/common.constant";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGO.URL);
    console.info("✅ MongoDB connected successfully.");

    const db = mongoose.connection;

    db.once(DB_EVENTS.OPEN, () => {
      console.info("📡 MongoDB connection is open.");
    });

    db.on(DB_EVENTS.ERROR, (error: any) => {
      console.error("❌ MongoDB error:", error);
    });

    db.on(DB_EVENTS.DISCONNECTED, () => {
      console.warn("⚠️ MongoDB disconnected.");
    });
  } catch (err) {
    console.error("❌ MongoDB initial connection error:", err);
    process.exit(1);
  }
};

export { connectDB, mongoose };
