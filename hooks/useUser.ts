import { getCurrentUserData } from "@/lib/auth/get-current-user";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUserData();
      setUser(user);
    };

    getUser();
  }, []);

  return {
    user,
  };
};
