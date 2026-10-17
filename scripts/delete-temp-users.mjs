import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const res = await prisma.user.deleteMany({
    where: { email: { startsWith: "test_manager_" } },
  });
  console.log(`Deleted ${res.count} temporary test users.`);

  const remaining = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  console.log("Current active administrators in database:");
  remaining.forEach((u) => {
    console.log(`- ${u.name} <${u.email}> (${u.role}) Active: ${u.isActive}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
