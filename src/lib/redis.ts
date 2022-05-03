import { createClient, SocketClosedUnexpectedlyError } from "redis";
import { loadWatchlist } from "./watchlist";
import * as dotenv from "dotenv";
dotenv.config();

export const redis = createClient({ url: process.env.REDISTOGO_URL });

export const connectToRedis = () => {
  redis
    .connect()
    .then(() => {
      loadWatchlist();
      console.log("Connected to redis database");
    })
    .catch(console.log);

  redis.on("error", (err) => {
    if (!(err instanceof SocketClosedUnexpectedlyError)) console.log("Redis error", err);
  });
};
