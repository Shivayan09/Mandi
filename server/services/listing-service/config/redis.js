import { createClient } from "redis";

const redis = createClient({
    url: "redis://localhost:6379"
});

redis.on("error", (err) => console.error("Redis Client Error", err));
redis.on("connect", () => console.log("Connected to Redis successfully!"));

await redis.connect();

export default redis;