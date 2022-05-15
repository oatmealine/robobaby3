import { redis } from "./redis";

interface IStatisticOptions {
  category: string[];
  amount?: number;
}

export class Statistics {
  static Increment(options: IStatisticOptions) {
    const key = this.GetKey(options);
    redis.get(key).then((res) => {
      const value = parseInt(res || "0");
      redis.set(key, value + (options.amount || 1));
    });
  }

  static GetKey = (options: IStatisticOptions) => `stats:${options.category.join(":")}`;
}
