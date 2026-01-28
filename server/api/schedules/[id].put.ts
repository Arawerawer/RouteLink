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

  const body = await readBody(event);
  const { note, completed } = body;

  const config = useRuntimeConfig(event);
  const db = useDb(config.databaseUrl);

  try {
    let result;

    if (completed !== undefined) {
      result = await db`
        UPDATE schedules
        SET completed = ${completed}
        WHERE id = ${id} AND user_id = ${user.sub}
        RETURNING *
      `;
    } else {
      result = await db`
        UPDATE schedules
        SET note = ${note ?? null}
        WHERE id = ${id} AND user_id = ${user.sub}
        RETURNING *
      `;
    }

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "找不到該行程或無權限修改",
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
      message: "更新行程失敗: " + error.message,
    });
  }
});
