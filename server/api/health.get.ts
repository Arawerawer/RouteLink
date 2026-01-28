import { useDb } from "../utils/db";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const db = useDb(config.databaseUrl);

  try {
    const result = await db`SELECT NOW() as current_time`;
    return {
      status: "ok",
      db: "connected",
      timestamp: result[0].current_time,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 503,
      message: "Database unavailable: " + error.message,
    });
  }
});
