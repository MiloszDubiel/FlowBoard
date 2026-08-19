import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await axios.get("/api/auth/me");
      return response.data.user;
    },
  });
