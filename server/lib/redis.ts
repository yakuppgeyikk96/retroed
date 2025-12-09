import Redis, { RedisOptions } from "ioredis";

let redisClient: Redis | null = null;

export const getRedisClient = () => {
  if (!redisClient) {
    const host = process.env.REDIS_HOST || "localhost";
    const port = parseInt(process.env.REDIS_PORT || "6379", 10);
    const username = process.env.REDIS_USERNAME;
    const password = process.env.REDIS_PASSWORD;

    const config: RedisOptions = {
      host,
      port,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000) as number;
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
    };

    if (username) {
      config.username = username;
    }
    if (password) {
      config.password = password;
    }

    redisClient = new Redis(config);

    redisClient.on("connect", () => {
      console.log("✅ Redis connected");
    });

    redisClient.on("ready", () => {
      console.log("✅ Redis ready");
    });

    redisClient.on("error", (error) => {
      console.error("❌ Redis error:", error);
    });

    redisClient.on("close", () => {
      console.log("⚠️ Redis connection closed");
    });

    redisClient.on("reconnecting", () => {
      console.log("🔄 Redis reconnecting...");
    });
  }

  return redisClient;
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log("✅ Redis connection closed");
  }
};
