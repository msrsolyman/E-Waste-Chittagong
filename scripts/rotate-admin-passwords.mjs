import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0];
  const newPassword = args[1];

  if (!email || !newPassword) {
    console.log("Usage: node scripts/rotate-admin-passwords.mjs <email> <newPassword>");
    console.log("Example: node scripts/rotate-admin-passwords.mjs admin@ewastechittagong.com \"NewSecretPass2026!\"");
    process.exit(1);
  }

  if (newPassword.length < 10) {
    console.error("Error: New password must be at least 10 characters long.");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    console.error(`User with email "${email}" not found.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "ADMIN_PASSWORD_ROTATED_CLI",
      details: JSON.stringify({
        email: user.email,
        rotatedAt: new Date().toISOString(),
      }),
    },
  });

  console.log(`✅ Successfully rotated password for administrator: ${user.email} (${user.role})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
