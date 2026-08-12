import { useEffect, useMemo, useRef, useState } from "react";

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
  ArrowLeft,
  MessageCircle,
  Search,
  Send,
  Loader2,
  MoreVertical,
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
// Date Helpers
// ====================================

const formatTime = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
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

  const [conversationSearch, setConversationSearch] =
    useState("");

  const [showConversationList, setShowConversationList] =
    useState(true);

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
  // Refs
  // ====================================

  const messagesEndRef = useRef(null);

  const inputRef = useRef(null);

  // ====================================
  // Fetch Conversations
  // ====================================

  useEffect(() => {
    const fetchConversations = async () => {
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

        setConversations(conversationList);
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
  // Filter Conversations
  // ====================================

  const filteredConversations = useMemo(() => {
    const search =
      conversationSearch
        .trim()
        .toLowerCase();

    if (!search) {
      return conversations;
    }

    return conversations.filter(
      (conversation) => {
        const participant =
          getOtherParticipant(
            conversation
          );

        const name =
          participant?.fullName || "";

        const username =
          participant?.username || "";

        const lastMessage =
          conversation?.lastMessage
            ?.content || "";

        return (
          name
            .toLowerCase()
            .includes(search) ||
          username
            .toLowerCase()
            .includes(search) ||
          lastMessage
            .toLowerCase()
            .includes(search)
        );
      }
    );
  }, [
    conversations,
    conversationSearch,
    user?._id,
  ]);

  // ====================================
  // Fetch Messages
  // ====================================

  useEffect(() => {
    if (!selectedConversation?._id) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
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
  // Auto Scroll
  // ====================================

  useEffect(() => {
    if (!selectedConversation) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [
    messages,
    selectedConversation,
  ]);

  // ====================================
  // Socket - Incoming Messages
  // ====================================

  useEffect(() => {
    const handleNewMessage = (message) => {
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

      if (!messageConversationId) {
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

        // Mobile: open chat
        setShowConversationList(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } catch (error) {
        console.error(
          "❌ Failed to open conversation:",
          error
        );

        setSelectedConversation(
          conversation
        );

        setShowConversationList(false);
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

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
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
  // Enter To Send
  // ====================================

  const handleInputKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (
        content.trim() &&
        selectedConversation &&
        !sending
      ) {
        handleSendMessage(event);
      }
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
    <div
      className="
        h-[calc(100vh-8rem)]
        min-h-[600px]
        overflow-hidden
        rounded-2xl
        border
        border-border/60
        bg-background
        shadow-sm
      "
    >
      <div className="flex h-full min-h-0">

        {/* ====================================
            Conversation List
        ==================================== */}

        <aside
          className={`
            h-full
            w-full
            shrink-0
            border-r
            border-border/60
            bg-background

            md:block
            md:w-[340px]
            lg:w-[360px]

            ${
              showConversationList
                ? "block"
                : "hidden md:block"
            }
          `}
        >
          {/* Header */}

          <div
            className="
              border-b
              border-border/60
              px-4
              py-4
              sm:px-5
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                  text-primary
                "
              >
                <MessageCircle className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h1 className="font-semibold">
                  Messages
                </h1>

                <p className="text-xs text-muted-foreground">
                  {conversations.length}{" "}
                  {conversations.length === 1
                    ? "conversation"
                    : "conversations"}
                </p>
              </div>
            </div>

            {/* Search */}

            <div className="relative mt-4">
              <Search
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <Input
                value={conversationSearch}
                onChange={(event) =>
                  setConversationSearch(
                    event.target.value
                  )
                }
                placeholder="Search conversations..."
                className="
                  h-10
                  rounded-xl
                  bg-muted/40
                  pl-9
                "
              />
            </div>
          </div>

          {/* Conversations */}

          <div
            className="
              h-[calc(100%-145px)]
              overflow-y-auto
              p-2
              sm:p-3
            "
          >
            {loadingConversations && (
              <div className="flex items-center justify-center py-12">
                <Loader2
                  className="
                    h-5
                    w-5
                    animate-spin
                    text-primary
                  "
                />
              </div>
            )}

            {!loadingConversations &&
              filteredConversations.length === 0 && (
                <div
                  className="
                    rounded-xl
                    bg-muted/40
                    p-6
                    text-center
                  "
                >
                  <MessageCircle
                    className="
                      mx-auto
                      mb-3
                      h-8
                      w-8
                      text-muted-foreground
                    "
                  />

                  <p className="text-sm font-medium">
                    {conversationSearch
                      ? "No conversations found"
                      : "No conversations"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {conversationSearch
                      ? "Try a different name or username."
                      : "Start a conversation with a developer."}
                  </p>
                </div>
              )}

            <div className="space-y-1">
              {!loadingConversations &&
                filteredConversations.map(
                  (conversation) => {
                    const participant =
                      getOtherParticipant(
                        conversation
                      );

                    const isActive =
                      selectedConversation?._id?.toString() ===
                      conversation._id?.toString();

                    const participantName =
                      participant?.fullName ||
                      participant?.username ||
                      "Developer";

                    const lastMessage =
                      conversation.lastMessage
                        ?.content || "";

                    const lastMessageTime =
                      conversation.lastMessage
                        ?.createdAt;

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
                                ring-1
                                ring-primary/10
                              `
                              : `
                                hover:bg-muted/60
                              `
                          }
                        `}
                      >
                        <div className="relative shrink-0">
                          <Avatar
                            className="
                              h-11
                              w-11
                              border
                              border-border/60
                            "
                          >
                            <AvatarImage
                              src={
                                participant?.avatar
                              }
                              alt={
                                participantName
                              }
                            />

                            <AvatarFallback
                              className="
                                bg-primary/10
                                font-semibold
                                text-primary
                              "
                            >
                              {participantName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "D"}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`
                                truncate
                                text-sm
                                ${
                                  isActive
                                    ? "font-semibold text-primary"
                                    : "font-medium"
                                }
                              `}
                            >
                              {participantName}
                            </p>

                            {lastMessageTime && (
                              <span
                                className="
                                  shrink-0
                                  text-[10px]
                                  text-muted-foreground
                                "
                              >
                                {formatTime(
                                  lastMessageTime
                                )}
                              </span>
                            )}
                          </div>

                          <p className="truncate text-xs text-muted-foreground">
                            {participant?.username
                              ? `@${participant.username}`
                              : "Developer"}
                          </p>

                          {lastMessage && (
                            <p
                              className="
                                mt-1
                                truncate
                                text-xs
                                text-muted-foreground
                              "
                            >
                              {lastMessage}
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

        <main
          className={`
            flex
            min-w-0
            flex-1
            flex-col
            bg-background

            ${
              showConversationList
                ? "hidden md:flex"
                : "flex"
            }
          `}
        >
          {!selectedConversation ? (
            <div
              className="
                flex
                flex-1
                flex-col
                items-center
                justify-center
                px-6
                text-center
              "
            >
              <div
                className="
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary/10
                  text-primary
                "
              >
                <MessageCircle className="h-8 w-8" />
              </div>

              <h2 className="text-lg font-semibold">
                Your messages
              </h2>

              <p
                className="
                  mt-2
                  max-w-sm
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                Select a conversation to view
                messages and start chatting.
              </p>
            </div>
          ) : (
            <>
              {/* ====================================
                  Chat Header
              ==================================== */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-3
                  border-b
                  border-border/60
                  px-4
                  py-3
                  sm:px-5
                  sm:py-4
                "
              >
                {/* Mobile Back */}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setShowConversationList(
                      true
                    )
                  }
                  className="
                    h-9
                    w-9
                    shrink-0
                    rounded-xl
                    md:hidden
                  "
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <Avatar
                  className="
                    h-10
                    w-10
                    shrink-0
                    border
                    border-border/60
                  "
                >
                  <AvatarImage
                    src={
                      activeParticipant?.avatar
                    }
                    alt={
                      activeParticipant?.fullName ||
                      "Developer"
                    }
                  />

                  <AvatarFallback
                    className="
                      bg-primary/10
                      font-semibold
                      text-primary
                    "
                  >
                    {activeParticipant?.fullName
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      activeParticipant?.username
                        ?.charAt(0)
                        ?.toUpperCase() ||
                      "D"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold">
                    {activeParticipant?.fullName ||
                      activeParticipant?.username ||
                      "Developer"}
                  </h2>

                  {activeParticipant?.username && (
                    <p
                      className="
                        truncate
                        text-xs
                        text-muted-foreground
                      "
                    >
                      @{activeParticipant.username}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="
                    hidden
                    h-9
                    w-9
                    shrink-0
                    rounded-xl
                    sm:inline-flex
                  "
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* ====================================
                  Messages
              ==================================== */}

              <div
                className="
                  min-h-0
                  flex-1
                  overflow-y-auto
                  px-4
                  py-5
                  sm:px-6
                  sm:py-6
                "
              >
                {loadingMessages && (
                  <div className="flex items-center justify-center py-10">
                    <Loader2
                      className="
                        h-5
                        w-5
                        animate-spin
                        text-primary
                      "
                    />
                  </div>
                )}

                {!loadingMessages &&
                  messages.length === 0 && (
                    <div className="flex h-full min-h-[300px] items-center justify-center">
                      <div className="text-center">
                        <div
                          className="
                            mx-auto
                            mb-3
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-muted
                          "
                        >
                          <MessageCircle
                            className="
                              h-5
                              w-5
                              text-muted-foreground
                            "
                          />
                        </div>

                        <p className="text-sm font-medium">
                          No messages yet
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Say hello and start the
                          conversation.
                        </p>
                      </div>
                    </div>
                  )}

                <div className="mx-auto max-w-3xl space-y-3">
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
                          className={`
                            flex
                            ${
                              isOwnMessage
                                ? "justify-end"
                                : "justify-start"
                            }
                          `}
                        >
                          <div
                            className={`
                              max-w-[82%]
                              sm:max-w-[70%]
                            `}
                          >
                            <div
                              className={`
                                rounded-2xl
                                px-4
                                py-2.5
                                text-sm
                                leading-6
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
                                      border
                                      border-border/50
                                      bg-muted
                                    `
                                }
                              `}
                            >
                              {message.content}
                            </div>

                            <p
                              className={`
                                mt-1
                                px-1
                                text-[10px]
                                text-muted-foreground

                                ${
                                  isOwnMessage
                                    ? "text-right"
                                    : "text-left"
                                }
                              `}
                            >
                              {formatTime(
                                message.createdAt
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}

                  <div
                    ref={messagesEndRef}
                    className="h-px"
                  />
                </div>
              </div>

              {/* ====================================
                  Send Form
              ==================================== */}

              <div
                className="
                  shrink-0
                  border-t
                  border-border/60
                  bg-background
                  p-3
                  sm:p-4
                "
              >
                <form
                  onSubmit={
                    handleSendMessage
                  }
                  className="
                    mx-auto
                    flex
                    max-w-3xl
                    items-center
                    gap-2
                  "
                >
                  <Input
                    ref={inputRef}
                    value={content}
                    onChange={(event) =>
                      setContent(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleInputKeyDown
                    }
                    placeholder="Write a message..."
                    disabled={sending}
                    className="
                      h-11
                      rounded-xl
                      bg-muted/30
                    "
                  />

                  <Button
                    type="submit"
                    size="icon"
                    disabled={
                      sending ||
                      !content.trim()
                    }
                    className="
                      h-11
                      w-11
                      shrink-0
                      rounded-xl
                    "
                  >
                    {sending ? (
                      <Loader2
                        className="
                          h-4
                          w-4
                          animate-spin
                        "
                      />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ====================================
          Error
      ==================================== */}

      {error && (
        <div
          className="
            fixed
            bottom-5
            left-1/2
            z-50
            max-w-[90vw]
            -translate-x-1/2
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            px-4
            py-3
            text-sm
            text-red-500
            shadow-lg
          "
        >
          {error}
        </div>
      )}
    </div>
  );
}