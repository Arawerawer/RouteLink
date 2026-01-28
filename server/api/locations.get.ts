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
    const result = await db`
      SELECT * FROM locations
      WHERE user_id = ${user.sub}
      ORDER BY created_at DESC
    `;

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "取得地點失敗: " + error.message,
    });
  }
});
