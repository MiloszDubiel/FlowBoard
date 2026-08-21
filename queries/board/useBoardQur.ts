import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useBoardQur = (id: number) => {
  const getBoard = useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await axios.get(`/api/boards/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  return {
    getBoard,
  };
};
