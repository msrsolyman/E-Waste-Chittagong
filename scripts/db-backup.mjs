import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

function backupDatabase() {
  console.log("====================================================");
  console.log("  E-Waste Chittagong — Database Backup Utility      ");
  console.log("====================================================\n");

  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.resolve(process.cwd(), "backups");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  if (dbUrl.startsWith("file:")) {
    const relativePath = dbUrl.replace("file:", "");
    // Handles ./prisma/dev.db or ./dev.db
    let dbFilePath = path.resolve(process.cwd(), relativePath);
    if (!fs.existsSync(dbFilePath)) {
      dbFilePath = path.resolve(process.cwd(), "prisma", relativePath);
    }
    if (!fs.existsSync(dbFilePath)) {
      dbFilePath = path.resolve(process.cwd(), "dev.db");
    }

    if (!fs.existsSync(dbFilePath)) {
      console.error(`❌ Error: SQLite database file not found at ${dbFilePath}`);
      process.exit(1);
    }

    const backupFilePath = path.join(backupDir, `sqlite-ewc-${timestamp}.db`);
    fs.copyFileSync(dbFilePath, backupFilePath);

    const stats = fs.statSync(backupFilePath);
    console.log(`✅ SQLite backup completed successfully!`);
    console.log(`   Source: ${dbFilePath}`);
    console.log(`   Target: ${backupFilePath}`);
    console.log(`   Size:   ${(stats.size / 1024).toFixed(2)} KB\n`);
  } else if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
    console.log("ℹ️  PostgreSQL Database Detected.");
    console.log("   To perform a full PostgreSQL backup, execute:");
    console.log(`   pg_dump "${dbUrl}" > backups/postgres-ewc-${timestamp}.sql\n`);
  }
}

backupDatabase();
