import { createClient, SocketClosedUnexpectedlyError } from "redis";

export const redis = createClient({ url: process.env.REDISTOGO_URL });

export const ConnectToRedis = () => {
  redis
    .connect()
    .then(() => console.log("Connected to redis database"))
    .catch(console.log);

  redis.on("error", (err) => {
    if (!(err instanceof SocketClosedUnexpectedlyError)) console.log("Redis error", err);
  });
};
