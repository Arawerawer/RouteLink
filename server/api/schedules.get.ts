import { serverSupabaseUser } from "#supabase/server";
import { useDb } from "../utils/db";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "未登入",
    });
  }

  const config = useRuntimeConfig(event);
  const db = useDb(config.databaseUrl);

  try {
    // JOIN locations 取得地點資料
    const result = await db`
      SELECT
        schedules.id,
        schedules.location_id,
        schedules.note,
        schedules.completed,
        schedules.created_at,
        locations.name,
        locations.address
      FROM schedules
      JOIN locations ON schedules.location_id = locations.id
      WHERE schedules.user_id = ${user.sub}
      ORDER BY schedules.created_at ASC
    `;

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "取得行程失敗: " + error.message,
    });
  }
});
