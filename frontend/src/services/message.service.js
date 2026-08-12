import api from "@/api/axios";

// ====================================
// Send Message
// ====================================

export const sendMessage = async (
  conversationId,
  content
) => {
  const response = await api.post(
    "/messages",
    {
      conversationId,
      content,
    }
  );

  return response.data;
};

// ====================================
// Get Conversation Messages
// ====================================

export const getConversationMessages =
  async (
    conversationId,
    params = {}
  ) => {
    const response =
      await api.get(
        `/messages/${conversationId}`,
        {
          params,
        }
      );

    return response.data;
  };

// ====================================
// Mark Conversation As Read
// ====================================

export const markConversationAsRead =
  async (conversationId) => {
    const response =
      await api.patch(
        `/messages/${conversationId}/read`
      );

    return response.data;
  };