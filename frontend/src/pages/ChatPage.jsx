import { useEffect, useState } from "react";

import {
  getUserConversations,
  getConversation,
} from "@/services/conversation.service";

import {
  getConversationMessages,
  sendMessage,
} from "@/services/message.service";

import { socket } from "@/socket/socket";

import { useAuthContext } from "@/context/AuthContext";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  MessageCircle,
  Send,
  Loader2,
} from "lucide-react";

// ====================================
// Response Helpers
// ====================================

const unwrapResponse = (response) => {
  return (
    response?.data?.data ??
    response?.data ??
    response
  );
};

const getConversationList = (response) => {
  const data = unwrapResponse(response);

  if (Array.isArray(data)) {
    return data;
  }

  return data?.conversations || [];
};

const getMessageList = (response) => {
  const data = unwrapResponse(response);

  if (Array.isArray(data)) {
    return data;
  }

  return data?.messages || [];
};

// ====================================
// Chat Page
// ====================================

export default function ChatPage() {
  const { user } = useAuthContext();

  // ====================================
  // Conversations
  // ====================================

  const [conversations, setConversations] =
    useState([]);

  const [
    selectedConversation,
    setSelectedConversation,
  ] = useState(null);

  // ====================================
  // Messages
  // ====================================

  const [messages, setMessages] =
    useState([]);

  // ====================================
  // Message Input
  // ====================================

  const [content, setContent] =
    useState("");

  // ====================================
  // Loading States
  // ====================================

  const [
    loadingConversations,
    setLoadingConversations,
  ] = useState(true);

  const [
    loadingMessages,
    setLoadingMessages,
  ] = useState(false);

  const [sending, setSending] =
    useState(false);

  // ====================================
  // Error
  // ====================================

  const [error, setError] =
    useState("");

  // ====================================
  // Fetch Conversations
  // ====================================

  useEffect(() => {
    const fetchConversations =
      async () => {
        try {
          setLoadingConversations(true);
          setError("");

          const response =
            await getUserConversations();

          console.log(
            "📨 Conversations response:",
            response
          );

          const conversationList =
            getConversationList(response);

          setConversations(
            conversationList
          );
        } catch (error) {
          console.error(
            "❌ Failed to fetch conversations:",
            error
          );

          setError(
            "Failed to load conversations."
          );
        } finally {
          setLoadingConversations(false);
        }
      };

    fetchConversations();
  }, []);

  // ====================================
  // Get Other Participant
  // ====================================

  const getOtherParticipant = (
    conversation
  ) => {
    if (
      !conversation?.participants ||
      !user?._id
    ) {
      return null;
    }

    return conversation.participants.find(
      (participant) =>
        participant?._id?.toString() !==
        user._id.toString()
    );
  };

  // ====================================
  // Fetch Messages
  // ====================================

  useEffect(() => {
    if (!selectedConversation?._id) {
      setMessages([]);
      return;
    }

    const fetchMessages =
      async () => {
        try {
          setLoadingMessages(true);
          setError("");

          const response =
            await getConversationMessages(
              selectedConversation._id
            );

          console.log(
            "💬 Messages response:",
            response
          );

          const messageList =
            getMessageList(response);

          setMessages(messageList);
        } catch (error) {
          console.error(
            "❌ Failed to fetch messages:",
            error
          );

          setError(
            "Failed to load messages."
          );
        } finally {
          setLoadingMessages(false);
        }
      };

    fetchMessages();
  }, [selectedConversation]);

  // ====================================
  // Socket - Incoming Messages
  // ====================================

  useEffect(() => {
    const handleNewMessage =
      (message) => {
        console.log(
          "💬 ChatPage received:",
          message
        );

        if (
          !selectedConversation?._id ||
          !message
        ) {
          return;
        }

        const messageConversationId =
          message.conversation?._id ||
          message.conversation;

        if (
          !messageConversationId
        ) {
          return;
        }

        if (
          messageConversationId.toString() !==
          selectedConversation._id.toString()
        ) {
          return;
        }

        setMessages(
          (previousMessages) => {
            const messageId =
              message._id?.toString();

            const alreadyExists =
              previousMessages.some(
                (existingMessage) =>
                  existingMessage._id?.toString() ===
                  messageId
              );

            if (alreadyExists) {
              return previousMessages;
            }

            return [
              ...previousMessages,
              message,
            ];
          }
        );
      };

    socket.on(
      "new_message",
      handleNewMessage
    );

    return () => {
      socket.off(
        "new_message",
        handleNewMessage
      );
    };
  }, [selectedConversation]);

  // ====================================
  // Select Conversation
  // ====================================

  const handleSelectConversation =
    async (conversation) => {
      try {
        setError("");

        const response =
          await getConversation(
            conversation._id
          );

        const conversationData =
          unwrapResponse(response);

        setSelectedConversation(
          conversationData ||
            conversation
        );
      } catch (error) {
        console.error(
          "❌ Failed to open conversation:",
          error
        );

        setSelectedConversation(
          conversation
        );
      }
    };

  // ====================================
  // Send Message
  // ====================================

  const handleSendMessage =
    async (event) => {
      event.preventDefault();

      const trimmedContent =
        content.trim();

      if (
        !trimmedContent ||
        !selectedConversation?._id ||
        sending
      ) {
        return;
      }

      try {
        setSending(true);
        setError("");

        const response =
          await sendMessage(
            selectedConversation._id,
            trimmedContent
          );

        const sentMessage =
          unwrapResponse(response);

        if (sentMessage?._id) {
          setMessages(
            (previousMessages) => {
              const alreadyExists =
                previousMessages.some(
                  (message) =>
                    message._id?.toString() ===
                    sentMessage._id.toString()
                );

              if (alreadyExists) {
                return previousMessages;
              }

              return [
                ...previousMessages,
                sentMessage,
              ];
            }
          );
        }

        setContent("");
      } catch (error) {
        console.error(
          "❌ Failed to send message:",
          error
        );

        setError(
          "Failed to send message."
        );
      } finally {
        setSending(false);
      }
    };

  // ====================================
  // Active Participant
  // ====================================

  const activeParticipant =
    getOtherParticipant(
      selectedConversation
    );

  // ====================================
  // Render
  // ====================================

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[600px] overflow-hidden rounded-2xl border border-border/60 bg-background/50 shadow-sm">
      <div className="flex h-full min-h-0">
        {/* ====================================
            Conversation List
        ==================================== */}

        <aside className="w-full max-w-sm shrink-0 border-r border-border/60">
          {/* Header */}

          <div className="border-b border-border/60 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageCircle className="h-5 w-5" />
              </div>

              <div>
                <h1 className="font-semibold">
                  Messages
                </h1>

                <p className="text-xs text-muted-foreground">
                  Your conversations
                </p>
              </div>
            </div>
          </div>

          {/* Conversations */}

          <div className="h-[calc(100%-81px)] overflow-y-auto p-3">
            {loadingConversations && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}

            {!loadingConversations &&
              conversations.length === 0 && (
                <div className="rounded-xl bg-muted/40 p-5 text-center">
                  <MessageCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />

                  <p className="text-sm font-medium">
                    No conversations
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Start a conversation with a developer.
                  </p>
                </div>
              )}

            <div className="space-y-1">
              {conversations.map(
                (conversation) => {
                  const participant =
                    getOtherParticipant(
                      conversation
                    );

                  const isActive =
                    selectedConversation?._id?.toString() ===
                    conversation._id?.toString();

                  return (
                    <button
                      key={
                        conversation._id
                      }
                      type="button"
                      onClick={() =>
                        handleSelectConversation(
                          conversation
                        )
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        p-3
                        text-left
                        transition-all
                        duration-200

                        ${
                          isActive
                            ? `
                              bg-primary/10
                              text-primary
                            `
                            : `
                              hover:bg-muted/60
                            `
                        }
                      `}
                    >
                      <Avatar className="h-11 w-11 shrink-0 border border-primary/10">
                        <AvatarImage
                          src={
                            participant?.avatar
                          }
                          alt={
                            participant?.fullName ||
                            "Developer"
                          }
                        />

                        <AvatarFallback className="bg-primary/10 text-primary">
                          {participant?.fullName
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            participant?.username
                              ?.charAt(0)
                              ?.toUpperCase() ||
                            "D"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {participant?.fullName ||
                            participant?.username ||
                            "Developer"}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {participant?.username
                            ? `@${participant.username}`
                            : "Developer"}
                        </p>

                        {conversation.lastMessage
                          ?.content && (
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {
                              conversation
                                .lastMessage
                                .content
                            }
                          </p>
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </aside>

        {/* ====================================
            Chat Window
        ==================================== */}

        <main className="flex min-w-0 flex-1 flex-col">
          {!selectedConversation ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageCircle className="h-8 w-8" />
              </div>

              <h2 className="text-lg font-semibold">
                Your messages
              </h2>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Select a conversation to view messages and start chatting.
              </p>
            </div>
          ) : (
            <>
              {/* ====================================
                  Chat Header
              ==================================== */}

              <div className="flex shrink-0 items-center gap-3 border-b border-border/60 px-5 py-4">
                <Avatar className="h-10 w-10 border border-primary/10">
                  <AvatarImage
                    src={
                      activeParticipant?.avatar
                    }
                    alt={
                      activeParticipant?.fullName ||
                      "Developer"
                    }
                  />

                  <AvatarFallback className="bg-primary/10 text-primary">
                    {activeParticipant?.fullName
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "D"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <h2 className="truncate font-semibold">
                    {activeParticipant?.fullName ||
                      activeParticipant?.username ||
                      "Developer"}
                  </h2>

                  {activeParticipant?.username && (
                    <p className="truncate text-xs text-muted-foreground">
                      @{activeParticipant.username}
                    </p>
                  )}
                </div>
              </div>

              {/* ====================================
                  Messages
              ==================================== */}

              <div className="flex-1 overflow-y-auto px-5 py-5">
                {loadingMessages && (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}

                {!loadingMessages &&
                  messages.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        No messages yet. Say hello!
                      </p>
                    </div>
                  )}

                <div className="space-y-3">
                  {messages.map(
                    (message) => {
                      const senderId =
                        message.sender?._id ||
                        message.sender;

                      const isOwnMessage =
                        senderId
                          ?.toString() ===
                        user?._id?.toString();

                      return (
                        <div
                          key={
                            message._id
                          }
                          className={`flex ${
                            isOwnMessage
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`
                              max-w-[75%]
                              rounded-2xl
                              px-4
                              py-2.5
                              text-sm
                              shadow-sm

                              ${
                                isOwnMessage
                                  ? `
                                    rounded-br-md
                                    bg-primary
                                    text-primary-foreground
                                  `
                                  : `
                                    rounded-bl-md
                                    bg-muted
                                  `
                              }
                            `}
                          >
                            {message.content}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* ====================================
                  Send Form
              ==================================== */}

              <form
                onSubmit={
                  handleSendMessage
                }
                className="flex shrink-0 gap-2 border-t border-border/60 p-4"
              >
                <Input
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value
                    )
                  }
                  placeholder="Write a message..."
                  disabled={sending}
                  className="h-11 rounded-xl"
                />

                <Button
                  type="submit"
                  size="icon"
                  disabled={
                    sending ||
                    !content.trim()
                  }
                  className="h-11 w-11 shrink-0 rounded-xl"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </>
          )}
        </main>
      </div>

      {/* ====================================
          Error
      ==================================== */}

      {error && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500 shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}