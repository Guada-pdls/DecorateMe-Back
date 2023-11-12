import dotenv from "dotenv";
import commander from "../utils/commander.js";
import MongoSingleton from "./singletonMongoConnect.js";

const { mode } = commander.opts();

dotenv.config({
  path: mode === "development" ? "./.env.development" : "./.env.production",
});

export default {
  MODE: mode || "",
  SECRET_JWT: process.env.SECRET_JWT || "",
  SECRET_SESSION: process.env.SECRET_SESSION || "",
  PORT: process.env.PORT || 8080,
  MONGO_LINK: process.env.MONGO_LINK || "",
  PERSISTENCE: process.env.PERSISTENCE || "MONGO",
  FRONT_DOMAIN: process.env.FRONT_DOMAIN || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GMAIL_USER_APP: process.env.GMAIL_USER_APP || "",
  GMAIL_PASS_APP: process.env.GMAIL_PASS_APP || "",
  connectDB: async () => MongoSingleton.getInstance(),
};
