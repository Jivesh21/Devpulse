import api from "@/api/axios";

export const createPost = async (formData) => {
  const { data } = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getAllPosts = async () => {
  const { data } = await api.get("/posts");

  return data;
};