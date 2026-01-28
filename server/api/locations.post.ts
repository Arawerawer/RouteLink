import { serverSupabaseUser } from "#supabase/server";
import { useDb } from "../utils/db";

export default defineEventHandler(async (event) => {
  // 後端驗證 JWT，取得 user (回傳 JWT payload，user id 在 sub 欄位)
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "未登入",
    });
  }

  const config = useRuntimeConfig(event);
  const db = useDb(config.databaseUrl);

  const body = await readBody(event);
  const { name, address } = body;

  if (!name || !address) {
    throw createError({
      statusCode: 400,
      message: "缺少必填欄位: name, address",
    });
  }

  try {
    const result = await db`
      INSERT INTO locations (user_id, name, address)
      VALUES (${user.sub}, ${name}, ${address})
      RETURNING *
    `;

    return {
      success: true,
      data: result[0],
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "新增失敗: " + error.message,
    });
  }
});
