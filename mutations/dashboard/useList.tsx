import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useList = (id: number | undefined) => {
  const deleteList = useMutation({
    mutationFn: async () => {
      if (!id) return;
      const response = await axios.delete(`/api/list/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  return {
    deleteList,
  };
};
