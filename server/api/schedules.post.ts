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

  const body = await readBody(event);
  const { location_id, note } = body;

  if (!location_id) {
    throw createError({
      statusCode: 400,
      message: "缺少必填欄位: location_id",
    });
  }

  const config = useRuntimeConfig(event);
  const db = useDb(config.databaseUrl);

  try {
    const result = await db`
      INSERT INTO schedules (user_id, location_id, note)
      VALUES (${user.sub}, ${location_id}, ${note || null})
      RETURNING *
    `;

    return {
      success: true,
      data: result[0],
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "新增行程失敗: " + error.message,
    });
  }
});
