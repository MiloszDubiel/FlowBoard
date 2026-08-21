import { cookies } from "next/headers";
import { verifyToken } from "../auth";

export const getCurrentUser = async () => {
  const cookiesStore = await cookies();

  const token = cookiesStore.get("token")?.value;

  if (!token) {
    return console.log("Brak tokena");
  }

  const user = await verifyToken(token);

  return user;
};
