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
      message: "缺少 id",
    });
  }

  const config = useRuntimeConfig(event);
  const db = useDb(config.databaseUrl);

  try {
    // 只刪除該使用者的該筆資料
    const result = await db`
      DELETE FROM locations
      WHERE id = ${id} AND user_id = ${user.sub}
      RETURNING *
    `;
    //如果沒有刪除任何東西
    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "找不到該地點或無權限刪除",
      });
    }

    return {
      success: true,
      data: result[0],
    };
  } catch (error: any) {
    //把404錯誤丟出來
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      message: "刪除失敗: " + error.message,
    });
  }
});
