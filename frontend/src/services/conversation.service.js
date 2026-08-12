import api from "@/api/axios";

// ====================================
// Create or Get Direct Conversation
// ====================================
export const createOrGetConversation = async (
  userId
) => {
  const response = await api.post(
    "/conversations",
    {
      userId,
    }
  );

  return response.data;
};

// ====================================
// Get Current User Conversations
// ====================================
export const getUserConversations = async (
  params = {}
) => {
  const response = await api.get(
    "/conversations",
    {
      params,
    }
  );

  return response.data;
};

// ====================================
// Get Single Conversation
// ====================================
export const getConversation = async (
  conversationId
) => {
  const response = await api.get(
    `/conversations/${conversationId}`
  );

  return response.data;
};