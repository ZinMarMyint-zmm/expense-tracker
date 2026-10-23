
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Only allow this seed to run when explicitly enabled.
  if (process.env.E2E_TEST_DB !== "true") {
    throw new Error(
      "Seeding blocked. Set E2E_TEST_DB=true to confirm this is the test database."
    );
  }

  const email = "e2e-admin@example.com";
  const password = process.env.E2E_ADMIN_PASSWORD;

  if (!password) {
    throw new Error("Missing E2E_ADMIN_PASSWORD environment variable.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name: "E2E Admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      name: "E2E Admin",
      email,
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log(`E2E admin ready: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error("Failed to seed E2E admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
