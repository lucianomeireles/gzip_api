import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import logger from "./winston.config";

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    logger.info("Connected to MongoDB");
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
}

export default { connect };
