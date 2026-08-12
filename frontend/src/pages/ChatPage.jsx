import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  getUserConversations,
  getConversation,
  createOrGetConversation,
} from "@/services/conversation.service";

import {
  getConversationMessages,
  sendMessage,
  markConversationAsRead,
} from "@/services/message.service";

import { socket } from "@/socket/socket";

import { useAuthContext } from "@/context/AuthContext";

import { useSearchDevelopers } from "@/hooks/useSearchDevelopers";

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
  Plus,
  X,
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

  const location = useLocation();
  const navigate = useNavigate();

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
  // New Chat
  // ====================================

  const [newChatOpen, setNewChatOpen] =
    useState(false);

  const [newChatSearch, setNewChatSearch] =
    useState("");

  const [startingNewChat, setStartingNewChat] =
    useState(false);

  // ====================================
  // Developer Search
  // ====================================

  const {
    data: searchData,
    isLoading: searchingDevelopers,
  } = useSearchDevelopers(
    newChatSearch
  );

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

  useEffect(() => {
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
  // Search Developer Results
  // ====================================

  const developerResults = useMemo(() => {
    const data =
      unwrapResponse(searchData);

    let users = [];

    if (Array.isArray(data)) {
      users = data;
    } else {
      users =
        data?.users ||
        data?.results ||
        data?.data ||
        [];
    }

    if (!Array.isArray(users)) {
      return [];
    }

    return users.filter(
      (developer) =>
        developer?._id?.toString() !==
        user?._id?.toString()
    );
  }, [
    searchData,
    user?._id,
  ]);

  // ====================================
  // Check If Message Is Read
  // ====================================

  const isMessageRead = (
    message
  ) => {
    if (
      !Array.isArray(message?.readBy) ||
      !activeParticipant?._id
    ) {
      return false;
    }

    return message.readBy.some(
      (reader) => {
        const readerId =
          reader?._id || reader;

        return (
          readerId?.toString() ===
          activeParticipant._id.toString()
        );
      }
    );
  };

  // ====================================
  // Mark Conversation As Read
  // ====================================

  const handleMarkConversationAsRead =
    async (conversationId) => {
      if (!conversationId) {
        return;
      }

      try {
        await markConversationAsRead(
          conversationId
        );

        // Immediately remove unread badge.
        setConversations(
          (previousConversations) =>
            previousConversations.map(
              (conversation) =>
                conversation?._id?.toString() ===
                conversationId.toString()
                  ? {
                      ...conversation,
                      unreadCount: 0,
                    }
                  : conversation
            )
        );

        // Also update currently loaded
        // messages so read receipts turn blue
        // immediately when this conversation
        // is opened.
        setMessages(
          (previousMessages) =>
            previousMessages.map(
              (message) => {
                const senderId =
                  message.sender?._id ||
                  message.sender;

                // Only incoming messages need
                // the current user's read status.
                if (
                  senderId?.toString() ===
                  user?._id?.toString()
                ) {
                  return message;
                }

                const alreadyRead =
                  Array.isArray(
                    message.readBy
                  ) &&
                  message.readBy.some(
                    (reader) => {
                      const readerId =
                        reader?._id ||
                        reader;

                      return (
                        readerId?.toString() ===
                        user?._id?.toString()
                      );
                    }
                  );

                if (alreadyRead) {
                  return message;
                }

                return {
                  ...message,
                  readBy: [
                    ...(message.readBy || []),
                    user._id,
                  ],
                };
              }
            )
        );
      } catch (error) {
        console.error(
          "❌ Failed to mark conversation as read:",
          error
        );
      }
    };

  // ====================================
  // Select Conversation
  // ====================================

  const handleSelectConversation =
    async (conversation) => {
      try {
        if (!conversation?._id) {
          return;
        }

        setError("");

        const response =
          await getConversation(
            conversation._id
          );

        const conversationData =
          unwrapResponse(response);

        const openedConversation =
          conversationData ||
          conversation;

        setSelectedConversation(
          openedConversation
        );

        setShowConversationList(false);

        // Mark conversation as read.
        await handleMarkConversationAsRead(
          conversation._id
        );

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

        await handleMarkConversationAsRead(
          conversation?._id
        );
      }
    };

  // ====================================
  // Start New Chat
  // ====================================

  const handleStartNewChat =
    async (developer) => {
      if (
        !developer?._id ||
        startingNewChat
      ) {
        return;
      }

      try {
        setStartingNewChat(true);
        setError("");

        const response =
          await createOrGetConversation(
            developer._id
          );

        console.log(
          "💬 New chat response:",
          response
        );

        const conversation =
          response?.data?.conversation;

        if (!conversation?._id) {
          console.error(
            "❌ Conversation not found:",
            response
          );

          setError(
            "Could not open this conversation."
          );

          return;
        }

        setConversations(
          (previousConversations) => {
            const exists =
              previousConversations.some(
                (item) =>
                  item?._id?.toString() ===
                  conversation._id.toString()
              );

            if (exists) {
              return previousConversations.map(
                (item) =>
                  item?._id?.toString() ===
                  conversation._id.toString()
                    ? {
                        ...item,
                        ...conversation,
                        unreadCount: 0,
                      }
                    : item
              );
            }

            return [
              {
                ...conversation,
                unreadCount: 0,
              },
              ...previousConversations,
            ];
          }
        );

        setNewChatOpen(false);
        setNewChatSearch("");

        await handleSelectConversation(
          conversation
        );
      } catch (error) {
        console.error(
          "❌ Failed to start new chat:",
          error
        );

        setError(
          "Failed to start conversation."
        );
      } finally {
        setStartingNewChat(false);
      }
    };

  // ====================================
  // Open Conversation From Profile
  // ====================================

  useEffect(() => {
    const conversationId =
      location.state?.conversationId;

    if (
      !conversationId ||
      loadingConversations ||
      !conversations.length
    ) {
      return;
    }

    const conversation =
      conversations.find(
        (item) =>
          item?._id?.toString() ===
          conversationId.toString()
      );

    if (!conversation) {
      console.warn(
        "Conversation from navigation was not found:",
        conversationId
      );

      navigate("/messages", {
        replace: true,
        state: {},
      });

      return;
    }

    handleSelectConversation(
      conversation
    );

    navigate("/messages", {
      replace: true,
      state: {},
    });
  }, [
    conversations,
    loadingConversations,
    location.state?.conversationId,
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

      if (!message) {
        return;
      }

      const messageConversationId =
        message.conversation?._id ||
        message.conversation;

      if (!messageConversationId) {
        return;
      }

      const conversationId =
        messageConversationId.toString();

      const activeConversationId =
        selectedConversation?._id?.toString();

      // ====================================
      // Message belongs to active chat
      // ====================================

      if (
        activeConversationId ===
        conversationId
      ) {
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

        // Active conversation is already open,
        // so incoming message is immediately read.
        handleMarkConversationAsRead(
          conversationId
        );

        return;
      }

      // ====================================
      // Message belongs to another chat
      // ====================================

      setConversations(
        (previousConversations) => {
          const existingConversation =
            previousConversations.find(
              (conversation) =>
                conversation?._id?.toString() ===
                conversationId
            );

          if (!existingConversation) {
            fetchConversations();

            return previousConversations;
          }

          const updatedConversation = {
            ...existingConversation,

            lastMessage: message,

            lastMessageAt:
              message.createdAt,

            unreadCount:
              Number(
                existingConversation.unreadCount ||
                  0
              ) + 1,
          };

          return [
            updatedConversation,

            ...previousConversations.filter(
              (conversation) =>
                conversation?._id?.toString() !==
                conversationId
            ),
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
  }, [
    selectedConversation,
  ]);

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

        // Update conversation locally.
        setConversations(
          (previousConversations) => {
            const conversationId =
              selectedConversation._id.toString();

            const updated =
              previousConversations.map(
                (conversation) =>
                  conversation?._id?.toString() ===
                  conversationId
                    ? {
                        ...conversation,
                        lastMessage:
                          sentMessage,
                        lastMessageAt:
                          sentMessage?.createdAt,
                        unreadCount: 0,
                      }
                    : conversation
              );

            return updated;
          }
        );

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);

        fetchConversations();
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
        relative
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
            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3">
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

              {/* New Chat */}

              <Button
                type="button"
                size="sm"
                onClick={() =>
                  setNewChatOpen(true)
                }
                className="
                  h-9
                  shrink-0
                  gap-1.5
                  rounded-xl
                  px-3
                "
              >
                <Plus className="h-4 w-4" />

                <span className="hidden sm:inline">
                  New chat
                </span>
              </Button>
            </div>

            {/* Search Conversations */}

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

                    const unreadCount =
                      Number(
                        conversation?.unreadCount ||
                          0
                      );

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
                        <Avatar
                          className="
                            h-11
                            w-11
                            shrink-0
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

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`
                                truncate
                                text-sm
                                ${
                                  isActive
                                    ? "font-semibold text-primary"
                                    : unreadCount > 0
                                      ? "font-semibold"
                                      : "font-medium"
                                }
                              `}
                            >
                              {participantName}
                            </p>

                            <div className="flex shrink-0 items-center gap-2">
                              {lastMessageTime && (
                                <span
                                  className="
                                    text-[10px]
                                    text-muted-foreground
                                  "
                                >
                                  {formatTime(
                                    lastMessageTime
                                  )}
                                </span>
                              )}

                              {/* Unread Badge */}

                              {unreadCount > 0 && (
                                <span
                                  className="
                                    flex
                                    h-5
                                    min-w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-primary
                                    px-1.5
                                    text-[10px]
                                    font-bold
                                    text-primary-foreground
                                  "
                                >
                                  {unreadCount > 99
                                    ? "99+"
                                    : unreadCount}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="truncate text-xs text-muted-foreground">
                            {participant?.username
                              ? `@${participant.username}`
                              : "Developer"}
                          </p>

                          {lastMessage && (
                            <p
                              className={`
                                mt-1
                                truncate
                                text-xs
                                ${
                                  unreadCount > 0
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground"
                                }
                              `}
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
                Select a conversation or
                start a new chat.
              </p>

              <Button
                type="button"
                onClick={() =>
                  setNewChatOpen(true)
                }
                className="
                  mt-5
                  gap-2
                  rounded-xl
                "
              >
                <Plus className="h-4 w-4" />
                Start a new chat
              </Button>
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

                      const read =
                        isOwnMessage &&
                        isMessageRead(
                          message
                        );

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
                            className="
                              max-w-[82%]
                              sm:max-w-[70%]
                            "
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

                            {/* ====================================
                                Message Time + Read Receipt
                            ==================================== */}

                            <div
                              className={`
                                mt-1
                                flex
                                items-center
                                gap-1
                                px-1
                                text-[10px]
                                text-muted-foreground

                                ${
                                  isOwnMessage
                                    ? "justify-end"
                                    : "justify-start"
                                }
                              `}
                            >
                              <span>
                                {formatTime(
                                  message.createdAt
                                )}
                              </span>

                              {isOwnMessage && (
                                <span
                                  title={
                                    read
                                      ? "Read"
                                      : "Delivered"
                                  }
                                  className={`
                                    font-semibold
                                    tracking-[-2px]
                                    ${
                                      read
                                        ? "text-blue-500"
                                        : "text-muted-foreground"
                                    }
                                  `}
                                >
                                  ✓✓
                                </span>
                              )}
                            </div>
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
          New Chat Modal
      ==================================== */}

      {newChatOpen && (
        <div
          className="
            absolute
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-background/70
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              flex
              max-h-[80%]
              w-full
              max-w-md
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-border/60
              bg-background
              shadow-2xl
            "
          >
            {/* Modal Header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-border/60
                px-5
                py-4
              "
            >
              <div>
                <h2 className="font-semibold">
                  Start a new chat
                </h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Find a developer to message
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setNewChatOpen(false);
                  setNewChatSearch("");
                }}
                className="
                  h-9
                  w-9
                  rounded-xl
                "
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}

            <div className="px-5 py-4">
              <div className="relative">
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
                  autoFocus
                  value={newChatSearch}
                  onChange={(event) =>
                    setNewChatSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search developers..."
                  className="
                    h-11
                    rounded-xl
                    bg-muted/30
                    pl-9
                  "
                />
              </div>
            </div>

            {/* Results */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                px-3
                pb-3
              "
            >
              {!newChatSearch.trim() && (
                <div
                  className="
                    px-4
                    py-10
                    text-center
                  "
                >
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
                      bg-primary/10
                      text-primary
                    "
                  >
                    <Search className="h-5 w-5" />
                  </div>

                  <p className="text-sm font-medium">
                    Find a developer
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Type at least 2 characters
                    to search.
                  </p>
                </div>
              )}

              {newChatSearch.trim().length >= 2 &&
                searchingDevelopers && (
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

              {newChatSearch.trim().length >= 2 &&
                !searchingDevelopers &&
                developerResults.length === 0 && (
                  <div
                    className="
                      px-4
                      py-10
                      text-center
                    "
                  >
                    <p className="text-sm font-medium">
                      No developers found
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Try another name or
                      username.
                    </p>
                  </div>
                )}

              <div className="space-y-1">
                {developerResults.map(
                  (developer) => (
                    <button
                      key={
                        developer._id
                      }
                      type="button"
                      disabled={
                        startingNewChat
                      }
                      onClick={() =>
                        handleStartNewChat(
                          developer
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        p-3
                        text-left
                        transition-colors
                        hover:bg-muted/60
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      <Avatar
                        className="
                          h-11
                          w-11
                          shrink-0
                          border
                          border-border/60
                        "
                      >
                        <AvatarImage
                          src={
                            developer.avatar
                          }
                          alt={
                            developer.fullName ||
                            developer.username
                          }
                        />

                        <AvatarFallback
                          className="
                            bg-primary/10
                            font-semibold
                            text-primary
                          "
                        >
                          {developer.fullName
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            developer.username
                              ?.charAt(0)
                              ?.toUpperCase() ||
                            "D"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {developer.fullName ||
                            developer.username ||
                            "Developer"}
                        </p>

                        {developer.username && (
                          <p className="truncate text-xs text-muted-foreground">
                            @{developer.username}
                          </p>
                        )}
                      </div>

                      {startingNewChat ? (
                        <Loader2
                          className="
                            h-4
                            w-4
                            shrink-0
                            animate-spin
                            text-primary
                          "
                        />
                      ) : (
                        <MessageCircle
                          className="
                            h-4
                            w-4
                            shrink-0
                            text-muted-foreground
                          "
                        />
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================
          Error
      ==================================== */}

      {error && (
        <div
          className="
            absolute
            bottom-5
            left-1/2
            z-[60]
            max-w-[90%]
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