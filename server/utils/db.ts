import postgres from "postgres";

const connections = new Map<string, postgres.Sql>();

export const useDb = (databaseUrl: string) => {
  if (connections.has(databaseUrl)) {
    return connections.get(databaseUrl)!;
  }

  const sql = postgres(databaseUrl);
  connections.set(databaseUrl, sql);
  return sql;
};
