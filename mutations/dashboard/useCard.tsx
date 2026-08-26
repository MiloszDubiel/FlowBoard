import { useMutation } from "@tanstack/react-query";
import axios from "axios";
export const useCard = (files?: File) => {
  const addFile = useMutation({
    mutationFn: async (body: any) => {
      const { data } = await axios.post("/api/card/file", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
  });

  const addCard = useMutation({
    mutationFn: async (body: any) => {
      const { data } = await axios.post("/api/card/add", body);
      return data;
    },
  });

  return {
    addFile,
    addCard,
  };
};
