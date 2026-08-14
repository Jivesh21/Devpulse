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

  // ====================================
  // Validate Stream
  // ====================================

  if (!response.body) {
    throw new Error(
      "AI response stream is unavailable."
    );
  }

  // ====================================
  // Stream Reader
  // ====================================

  const reader =
    response.body.getReader();

  const decoder =
    new TextDecoder("utf-8");

  let buffer = "";

  // ====================================
  // Process SSE Event
  // ====================================

  const processEvent = (event) => {
    if (!event?.trim()) {
      return false;
    }

    // Normalize Windows/Linux line endings.
    const lines =
      event.replace(
        /\r/g,
        ""
      ).split("\n");

    // ====================================
    // Collect data lines
    // ====================================

    const dataLines = [];

    for (const line of lines) {
      if (
        line.startsWith("data:")
      ) {
        dataLines.push(
          line.slice(5).trim()
        );
      }
    }

    if (!dataLines.length) {
      return false;
    }

    // SSE allows multiple data lines.
    const rawData =
      dataLines.join("\n").trim();

    if (!rawData) {
      return false;
    }

    // ====================================
    // Handle SSE Done Marker
    // ====================================

    if (rawData === "[DONE]") {
      return true;
    }

    // ====================================
    // Parse JSON
    // ====================================

    let data;

    try {
      data = JSON.parse(rawData);
    } catch (error) {
      console.error(
        "Invalid AI stream data:",
        rawData
      );

      return false;
    }

    // ====================================
    // Text Chunk
    // ====================================

    if (
      data?.type === "text"
    ) {
      if (
        typeof onChunk ===
        "function" &&
        typeof data.text ===
          "string"
      ) {
        onChunk(data.text);
      }

      return false;
    }

    // ====================================
    // Usage Information
    // ====================================

    if (
      data?.type === "usage"
    ) {
      // Usage is handled by the backend.
      // Nothing needs to be displayed
      // inside the conversation.

      return false;
    }

    // ====================================
    // AI Error
    // ====================================

    if (
      data?.type === "error"
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
      data?.type === "done"
    ) {
      return true;
    }

    return false;
  };

  // ====================================
  // Read SSE Stream
  // ====================================

  try {
    while (true) {
      const {
        value,
        done,
      } = await reader.read();

      // ====================================
      // Stream Finished
      // ====================================

      if (done) {
        break;
      }

      // ====================================
      // Decode Chunk
      // ====================================

      buffer += decoder.decode(
        value,
        {
          stream: true,
        }
      );

      // ====================================
      // Normalize Line Endings
      // ====================================

      buffer =
        buffer.replace(
          /\r\n/g,
          "\n"
        );

      buffer =
        buffer.replace(
          /\r/g,
          "\n"
        );

      // ====================================
      // Split SSE Events
      // ====================================

      const events =
        buffer.split("\n\n");

      // Keep incomplete event
      buffer =
        events.pop() || "";

      // ====================================
      // Process Complete Events
      // ====================================

      for (const event of events) {
        const shouldStop =
          processEvent(event);

        if (shouldStop) {
          return;
        }
      }
    }

    // ====================================
    // Flush Decoder
    // ====================================

    buffer += decoder.decode();

    // ====================================
    // Process Final Event
    // ====================================

    if (buffer.trim()) {
      processEvent(buffer);
    }
  } finally {
    reader.releaseLock();
  }
};