// ====================================
// Create AI Conversation
// ====================================

export const createAIConversation = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/ai/conversations`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    let errorMessage =
      "Unable to create AI conversation.";

    try {
      const errorData =
        await response.json();

      errorMessage =
        errorData?.message ||
        errorMessage;
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

// ====================================
// Get AI Conversations
// ====================================

export const getAIConversations =
  async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/ai/conversations`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      let errorMessage =
        "Unable to fetch AI conversations.";

      try {
        const errorData =
          await response.json();

        errorMessage =
          errorData?.message ||
          errorMessage;
      } catch {
        // Ignore JSON parsing errors
      }

      throw new Error(errorMessage);
    }

    return response.json();
  };

// ====================================
// Get Single AI Conversation
// ====================================

export const getAIConversation =
  async (conversationId) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/ai/conversations/${conversationId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      let errorMessage =
        "Unable to fetch AI conversation.";

      try {
        const errorData =
          await response.json();

        errorMessage =
          errorData?.message ||
          errorMessage;
      } catch {
        // Ignore JSON parsing errors
      }

      throw new Error(errorMessage);
    }

    return response.json();
  };

// ====================================
// Stream AI Chat Message
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        message,
      }),
    }
  );

  // ====================================
  // Handle HTTP Errors
  // ====================================

  if (!response.ok) {
    let errorMessage =
      "Unable to get a response from DevPulse AI.";

    try {
      const errorData =
        await response.json();

      errorMessage =
        errorData?.message ||
        errorMessage;
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error(
      "Streaming is not supported by this browser."
    );
  }

  // ====================================
  // Read Streaming Response
  // ====================================

  const reader =
    response.body.getReader();

  const decoder = new TextDecoder();

  let buffer = "";

  try {
    while (true) {
      const { value, done } =
        await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, {
        stream: true,
      });

      const events =
        buffer.split("\n\n");

      buffer =
        events.pop() || "";

      for (const event of events) {
        const line = event
          .split("\n")
          .find((line) =>
            line.startsWith("data:")
          );

        if (!line) {
          continue;
        }

        const data = line
          .slice(5)
          .trim();

        if (!data) {
          continue;
        }

        try {
          const parsedData =
            JSON.parse(data);

          if (
            parsedData.type === "text" &&
            parsedData.text
          ) {
            onChunk(parsedData.text);
          }

          if (
            parsedData.type === "error"
          ) {
            throw new Error(
              parsedData.message ||
                "AI response failed."
            );
          }
        } catch (error) {
          if (
            error instanceof Error &&
            error.message !==
              "Unexpected end of JSON input"
          ) {
            throw error;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};
// ====================================
// Delete AI Conversation
// ====================================

export const deleteAIConversation =
  async (conversationId) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/ai/conversations/${conversationId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      let errorMessage =
        "Unable to delete AI conversation.";

      try {
        const errorData =
          await response.json();

        errorMessage =
          errorData?.message ||
          errorMessage;
      } catch {
        // Ignore JSON parsing errors
      }

      throw new Error(errorMessage);
    }

    return response.json();
  };