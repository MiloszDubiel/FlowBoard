import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useList = () => {
  const deleteList = useMutation({
    mutationFn: async (id: number | undefined) => {
      console.log(id);

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
