import dotenv from "dotenv";
dotenv.config();

function checkEnvironment() {
  console.log("====================================================");
  console.log("  E-Waste Chittagong — Environment Readiness Audit  ");
  console.log("====================================================\n");

  const isProduction = process.env.NODE_ENV === "production";
  let hasErrors = false;
  let hasWarnings = false;

  console.log(`Current NODE_ENV: ${process.env.NODE_ENV || "development (default)"}\n`);

  // 1. DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ CRITICAL: DATABASE_URL is missing.");
    hasErrors = true;
  } else {
    if (dbUrl.startsWith("file:")) {
      console.log("ℹ️  DATABASE_URL: Configured for SQLite (Local/Persistent Server).");
      if (isProduction) {
        console.warn("⚠️  WARNING: Using SQLite in production. Ensure persistent storage/disk is enabled (not ephemeral serverless).");
        hasWarnings = true;
      }
    } else if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
      console.log("✅ DATABASE_URL: Configured for PostgreSQL (Cloud/Serverless Production Ready).");
    } else {
      console.log("✅ DATABASE_URL: Present and configured.");
    }
  }

  // 2. JWT_SECRET
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    if (isProduction) {
      console.error("❌ CRITICAL: JWT_SECRET must be set in production! Fallback secrets are disabled.");
      hasErrors = true;
    } else {
      console.warn("⚠️  WARNING: JWT_SECRET is unset. Using development fallback secret.");
      hasWarnings = true;
    }
  } else {
    if (jwtSecret.length < 32) {
      console.warn("⚠️  WARNING: JWT_SECRET length is less than 32 characters. Consider generating a 64+ char random token.");
      hasWarnings = true;
    } else {
      console.log("✅ JWT_SECRET: Present and satisfies minimum length requirements (>32 chars).");
    }
  }

  // 3. NEXT_PUBLIC_APP_URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.warn("⚠️  WARNING: NEXT_PUBLIC_APP_URL is not set. Defaulting to canonical http://localhost:3000.");
    hasWarnings = true;
  } else {
    try {
      new URL(appUrl);
      console.log(`✅ NEXT_PUBLIC_APP_URL: Valid URL format configured.`);
    } catch {
      console.error("❌ ERROR: NEXT_PUBLIC_APP_URL is not a valid absolute URL.");
      hasErrors = true;
    }
  }

  console.log("\n----------------------------------------------------");
  if (hasErrors) {
    console.error("❌ RESULT: Environment audit FAILED. Please resolve critical errors before deployment.");
    process.exit(1);
  } else if (hasWarnings) {
    console.log("⚠️  RESULT: Environment audit PASSED with warnings. Review configuration above.");
  } else {
    console.log("🎉 RESULT: Environment audit PASSED with 100% compliance.");
  }
}

checkEnvironment();
