import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ChecklistType } from "@/schema/addChecklist.schema";
import { commentSchema, type CommentType } from "@/schema/addComment.schema";
export const useCard = () => {
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

  const removeFile = useMutation({
    mutationFn: async ({ id, files }: any) => {
      const { data } = await axios.post(`/api/card/${id}/file/`, { files });
      return data;
    },
  });

  const addFileToComment = useMutation({
    mutationFn: async ({ body, cardId, commentId }: any) => {
      const { data } = await axios.post(
        `/api/card/${cardId}/comment/${commentId}/file`,
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
  });

  const addCard = useMutation({
    mutationFn: async (body: any) => {
      const { data } = await axios.post("/api/card/add", body);
      return data;
    },
  });

  const deleteCard = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.delete(`/api/card/${id}/delete`);
      return data;
    },
  });

  const addComment = useMutation({
    mutationFn: async ({
      newComment,
      id,
    }: {
      newComment: CommentType;
      id: number;
    }) => {
      const { data } = await axios.post(`/api/card/${id}/comment`, newComment);

      return data;
    },
  });

  const changeChecklist = useMutation({
    mutationFn: async ({
      newList,
      id,
    }: {
      newList: ChecklistType[];
      id: number;
    }) => {
      const { data } = await axios.patch(`/api/card/${id}/checklist`, {
        newList,
      });

      return data;
    },
  });

  const editCard = useMutation({
    mutationFn: async ({ id, body }: any) => {
      const { data } = await axios.patch(`/api/card/${id}/edit`, body);
      return data;
    },
  });
  return {
    addFile,
    addCard,
    deleteCard,
    changeChecklist,
    addComment,
    addFileToComment,
    editCard,
    removeFile,
  };
};
