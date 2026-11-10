import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { createDemoData } from "@/lib/demo/create-demo-data";
const DEMO_DURATION_HOURS = 1;

export async function createDemoSession() {
  const expiresAt = new Date(Date.now() + DEMO_DURATION_HOURS * 60 * 60 * 1000);

  const userId = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: `demo-${randomUUID()}@flowboard.local`,
        isDemo: true,
        passwordHash: randomUUID(), 
        name: "Demo User ",
        lastname: "Demo User",        
      },
    });

    await tx.demoSession.create({
      data: {
        userId: user.id,
        expiresAt,
      },
    });

    await createDemoData(tx, user.id);

    return user.id;
  });

  return {
    userId,
    expiresAt,
  };
}
