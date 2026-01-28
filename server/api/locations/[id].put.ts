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

  const body = await readBody(event);
  const { name, address } = body;

  if (!name || !address) {
    throw createError({
      statusCode: 400,
      message: "缺少必填欄位: name, address",
    });
  }

  const config = useRuntimeConfig(event);
  const db = useDb(config.databaseUrl);

  try {
    // 只更新該使用者的該筆資料
    const result = await db`
      UPDATE locations
      SET name = ${name}, address = ${address}
      WHERE id = ${id} AND user_id = ${user.sub}
      RETURNING *
    `;

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "找不到該地點或無權限修改",
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
      message: "更新失敗: " + error.message,
    });
  }
});
