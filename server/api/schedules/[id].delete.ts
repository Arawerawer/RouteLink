import { serverSupabaseUser } from "#supabase/server";
import { useDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "未登入",
    });
  }

  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "缺少必填欄位: id",
    });
  }

  const config = useRuntimeConfig(event);
  const db = useDb(config.databaseUrl);

  try {
    const result = await db`
      DELETE FROM schedules
      WHERE id = ${id} AND user_id = ${user.sub}
      RETURNING *
    `;

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "找不到該行程或無權限刪除",
      });
    }

    return {
      success: true,
      data: result[0],
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      message: "刪除行程失敗: " + error.message,
    });
  }
});
