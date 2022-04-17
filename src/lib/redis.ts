import { createClient } from "redis";
import * as dotenv from "dotenv";
dotenv.config();

export const redis = createClient({ url: process.env.REDISTOGO_URL });
