import Forbidden from "@/components/Forbbiden";
import Settings from "@/components/settings/Settings";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <Forbidden />;
  }

  const userData = await prisma.user.findFirst({
    where: {
      id: Number(user.userID),
    },
    omit: {
      passwordHash: true,
    },
  });

  return <Settings user={userData} />;
}
