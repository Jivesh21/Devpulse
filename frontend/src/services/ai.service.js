import api from "@/api/axios";

// ====================================
// Create AI Conversation
// ====================================

export const createAIConversation =
  async () => {
    const response =
      await api.post(
        "/ai/conversations"
      );

    return response.data;
  };

// ====================================
// Get AI Conversations
// ====================================

export const getAIConversations =
  async () => {
    const response =
      await api.get(
        "/ai/conversations"
      );

    return response.data;
  };

// ====================================
// Get Single AI Conversation
// ====================================

export const getAIConversation =
  async (conversationId) => {
    const response =
      await api.get(
        `/ai/conversations/${conversationId}`
      );

    return response.data;
  };

// ====================================
// Delete AI Conversation
// ====================================

export const deleteAIConversation =
  async (conversationId) => {
    const response =
      await api.delete(
        `/ai/conversations/${conversationId}`
      );

    return response.data;
  };

// ====================================
// Stream AI Message
// ====================================

export const streamAIMessage = async (
  conversationId,
  message,
  onChunk
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/ai/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        conversationId,
        message,
      }),
    }
  );

  // ====================================
  // HTTP-Level Error
  // ====================================

  if (!response.ok) {
    let errorMessage =
      "Unable to generate AI response.";

    try {
      const data =
        await response.json();

      errorMessage =
        data?.message ||
        errorMessage;
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error(
      "AI response stream is unavailable."
    );
  }

  // ====================================
  // Read SSE Stream
  // ====================================

  const reader =
    response.body.getReader();

  const decoder =
    new TextDecoder("utf-8");

  let buffer = "";

  try {
    while (true) {
      const {
        value,
        done,
      } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(
        value,
        {
          stream: true,
        }
      );

      // ====================================
      // Split SSE Events
      // ====================================

      const events =
        buffer.split("\n\n");

      // Keep incomplete event
      buffer =
        events.pop() || "";

      for (const event of events) {
        const lines =
          event.split("\n");

        for (const line of lines) {
          if (
            !line.startsWith(
              "data:"
            )
          ) {
            continue;
          }

          const rawData =
            line
              .slice(5)
              .trim();

          if (!rawData) {
            continue;
          }

          let data;

          try {
            data =
              JSON.parse(rawData);
          } catch (error) {
            console.error(
              "Invalid AI stream data:",
              rawData
            );

            continue;
          }

          // ====================================
          // Text Chunk
          // ====================================

          if (
            data.type ===
            "text"
          ) {
            if (
              typeof onChunk ===
              "function"
            ) {
              onChunk(data.text);
            }
          }

          // ====================================
          // AI Error
          // ====================================

          if (
            data.type ===
            "error"
          ) {
            throw new Error(
              data.message ||
                "Unable to generate AI response."
            );
          }

          // ====================================
          // Stream Complete
          // ====================================

          if (
            data.type ===
            "done"
          ) {
            return;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};