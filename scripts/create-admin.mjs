import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

function validatePassword(password) {
  if (password.length < 12) {
    return "Password must be at least 12 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one digit.";
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  return null;
}

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function main() {
  console.log("=================================================");
  console.log("  E-Waste Chittagong — Secure Admin Provisioner  ");
  console.log("=================================================\n");

  // Allow CLI flags, environment variables, or interactive input
  const args = process.argv.slice(2);
  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
  };

  let name = getArg("--name") || process.env.ADMIN_NAME;
  let email = getArg("--email") || process.env.ADMIN_EMAIL;
  let password = getArg("--password") || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    name = name || (await askQuestion("Enter Administrator Full Name: "));
    email = email || (await askQuestion("Enter Administrator Email: "));
    password = password || (await askQuestion("Enter Secure Master Password: "));
  }

  if (!name || !email || !password) {
    console.error("❌ Error: Name, email, and password are all required.");
    process.exit(1);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("❌ Error: Invalid email format provided.");
    process.exit(1);
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    console.error(`❌ Security Policy Error: ${passwordError}`);
    process.exit(1);
  }

  console.log("\n🔒 Hashing credentials with bcrypt (cost factor 12)...");
  const passwordHash = await bcrypt.hash(password, 12);

  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      name,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
    create: {
      email: normalizedEmail,
      name,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "ADMIN_PROVISIONED_VIA_CLI",
      details: JSON.stringify({ email: normalizedEmail, role: "SUPER_ADMIN" }),
      ipAddress: "system-cli",
    },
  });

  console.log("✅ Super Administrator account provisioned successfully!");
  console.log(`   ID:    ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role:  ${user.role}`);
  console.log("   Status: ACTIVE");
  console.log("\n🔑 Login available at: /admin/login\n");
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
