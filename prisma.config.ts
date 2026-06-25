import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

const loadEnvFile = (
  process as NodeJS.Process & { loadEnvFile?: (path?: string) => void }
).loadEnvFile;

if (existsSync(".env.local")) {
  loadEnvFile?.(".env.local");
} else if (existsSync(".env")) {
  loadEnvFile?.(".env");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/aangan_bazaar",
  },
});
