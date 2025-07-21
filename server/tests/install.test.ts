// 1. Charge les variables d’environnement
import "dotenv/config";

// 2. Importations
import fs from "node:fs";
import path from "node:path";
import databaseClient from "../database/client";

// 3. Ferme la connexion après tous les tests
afterAll(async () => {
  await databaseClient.end();
});

describe("Postgres Installation & Migration", () => {
  it("should have a .env file", () => {
    expect(fs.existsSync(path.resolve(__dirname, "../.env"))).toBe(true);
  });

  it("should have a .env.sample file", () => {
    expect(fs.existsSync(path.resolve(__dirname, "../.env.sample"))).toBe(true);
  });

  it("should connect to the database successfully", () => {
    expect(databaseClient).toBeDefined();
  });

  it('should have run migrations (table "companies")', async () => {
    const result = await databaseClient.query("SELECT 1 FROM recipe LIMIT 1");
    expect(Array.isArray(result.rows)).toBe(true);
  });
});
