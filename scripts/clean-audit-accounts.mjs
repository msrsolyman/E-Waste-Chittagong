import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("=== CLEANING TEMPORARY AUDIT ACCOUNTS ===");
  
  // Find temporary audit account
  const auditUser = await prisma.user.findUnique({
    where: { email: "officer@ewastechittagong.com" },
  });

  if (auditUser) {
    // Clean associated audit logs created by this CLI test
    await prisma.auditLog.deleteMany({
      where: { userId: auditUser.id },
    });
    // Remove temporary audit user
    await prisma.user.delete({
      where: { id: auditUser.id },
    });
    console.log("✅ Removed confirmed temporary audit user: officer@ewastechittagong.com");
  } else {
    console.log("ℹ️ No temporary audit account officer@ewastechittagong.com found.");
  }

  const remainingUsers = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });
  console.log("Remaining Active Users:", remainingUsers);
}

main().catch(console.error).finally(() => prisma.$disconnect());
