import mysql from "mysql2/promise";

async function main() {
  const config = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  console.log("Testing database connection...");
  console.log("Host:", config.host);
  console.log("Port:", config.port);
  console.log("User:", config.user);
  console.log("Database:", config.database);
  console.log("Password: [hidden]");
  console.log("");

  try {
    const conn = await mysql.createConnection(config);
    console.log("Connected successfully");

    const [dbCheck] = await conn.execute("SELECT DATABASE() AS db");
    const dbName = (dbCheck as { db: string }[])[0]?.db;
    console.log("Active database:", dbName);

    const [tables] = await conn.execute("SHOW TABLES");
    const tableList = (tables as Record<string, string>[]).map(
      (row) => Object.values(row)[0]
    );

    if (tableList.length === 0) {
      console.log("\nNo tables found. Run: mysql -h host -u user -p db < scripts/init-db.sql");
    } else {
      console.log("\nTables:");
      for (const t of tableList) {
        console.log("  -", t);
      }

      for (const t of tableList) {
        const [count] = await conn.execute(`SELECT COUNT(*) AS cnt FROM \`${t}\``);
        const cnt = (count as { cnt: number }[])[0]?.cnt;
        console.log(`  ${t}: ${cnt} rows`);
      }
    }

    await conn.end();
    console.log("\nConnection test passed");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const code = (err as { code?: string }).code || "N/A";
    console.error("Connection failed:", message);
    console.error("Error code:", code);
    process.exit(1);
  }
}

main();
