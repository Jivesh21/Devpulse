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
  Code2,
  Loader2,
  MessageCircle,
  MoreVertical,
  Plus,
  Search,
  Send,
  Sparkles,
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
// Initials
// ====================================

const getInitials = (name) => {
  if (!name) return "D";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

  const [
    conversationSearch,
    setConversationSearch,
  ] = useState("");

  const [
    showConversationList,
    setShowConversationList,
  ] = useState(true);

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
  // Typing State
  // ====================================

  const [
    isOtherUserTyping,
    setIsOtherUserTyping,
  ] = useState(false);

  const [
    typingUsername,
    setTypingUsername,
  ] = useState("");

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

  const typingTimeoutRef =
    useRef(null);

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
  // Active Participant
  // ====================================

  const activeParticipant =
    getOtherParticipant(
      selectedConversation
    );
const handleOpenProfile = () => {
  const username =
    activeParticipant?.username;

  if (!username) {
    return;
  }

  navigate(`/profile/${username}`);
};
  // ====================================
  // Filter Conversations
  // ====================================

  const filteredConversations =
    useMemo(() => {
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
  // Developer Search Results
  // ====================================

  const developerResults =
    useMemo(() => {
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
  // Read Receipt
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

        setMessages(
          (previousMessages) =>
            previousMessages.map(
              (message) => {
                const senderId =
                  message.sender?._id ||
                  message.sender;

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

        setIsOtherUserTyping(false);
        setTypingUsername("");

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

        await handleMarkConversationAsRead(
          conversation._id
        );

        setTimeout(() => {
          inputRef.current?.focus();
        }, 150);
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

        const conversation =
          response?.data?.conversation;

        if (!conversation?._id) {
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
    isOtherUserTyping,
  ]);

  // ====================================
  // Socket - New Messages
  // ====================================

  useEffect(() => {
    const handleNewMessage = (
      message
    ) => {
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

        setIsOtherUserTyping(false);
        setTypingUsername("");

        handleMarkConversationAsRead(
          conversationId
        );

        return;
      }

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
  // Socket - Messages Read
  // ====================================

  useEffect(() => {
    const handleMessagesRead = (
      data
    ) => {
      if (!data?.conversationId) {
        return;
      }

      const conversationId =
        data.conversationId.toString();

      const activeConversationId =
        selectedConversation?._id?.toString();

      if (
        activeConversationId !==
        conversationId
      ) {
        return;
      }

      const readerId =
        data.readerId?.toString();

      if (!readerId) {
        return;
      }

      setMessages(
        (previousMessages) =>
          previousMessages.map(
            (message) => {
              const senderId =
                message.sender?._id ||
                message.sender;

              if (
                senderId?.toString() !==
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
                    const existingReaderId =
                      reader?._id ||
                      reader;

                    return (
                      existingReaderId?.toString() ===
                      readerId
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
                  readerId,
                ],
              };
            }
          )
      );
    };

    socket.on(
      "messages_read",
      handleMessagesRead
    );

    return () => {
      socket.off(
        "messages_read",
        handleMessagesRead
      );
    };
  }, [
    selectedConversation,
    user?._id,
  ]);

  // ====================================
  // Socket - Typing
  // ====================================

  useEffect(() => {
    const handleUserTyping = (
      data
    ) => {
      if (!data?.conversationId) {
        return;
      }

      const conversationId =
        data.conversationId.toString();

      const activeConversationId =
        selectedConversation?._id?.toString();

      if (
        activeConversationId !==
        conversationId
      ) {
        return;
      }

      if (
        data.userId?.toString() ===
        user?._id?.toString()
      ) {
        return;
      }

      setIsOtherUserTyping(true);

      setTypingUsername(
        data.username || ""
      );
    };

    const handleUserStoppedTyping = (
      data
    ) => {
      if (!data?.conversationId) {
        return;
      }

      const conversationId =
        data.conversationId.toString();

      const activeConversationId =
        selectedConversation?._id?.toString();

      if (
        activeConversationId !==
        conversationId
      ) {
        return;
      }

      if (
        data.userId?.toString() ===
        user?._id?.toString()
      ) {
        return;
      }

      setIsOtherUserTyping(false);
      setTypingUsername("");
    };

    socket.on(
      "user_typing",
      handleUserTyping
    );

    socket.on(
      "user_stopped_typing",
      handleUserStoppedTyping
    );

    return () => {
      socket.off(
        "user_typing",
        handleUserTyping
      );

      socket.off(
        "user_stopped_typing",
        handleUserStoppedTyping
      );
    };
  }, [
    selectedConversation,
    user?._id,
  ]);

  // ====================================
  // Typing Start
  // ====================================

  const handleTypingStart = () => {
    if (
      !selectedConversation?._id ||
      !socket.connected
    ) {
      return;
    }

    socket.emit(
      "typing_start",
      {
        conversationId:
          selectedConversation._id,
      }
    );
  };

  // ====================================
  // Typing Stop
  // ====================================

  const handleTypingStop = () => {
    if (
      !selectedConversation?._id ||
      !socket.connected
    ) {
      return;
    }

    socket.emit(
      "typing_stop",
      {
        conversationId:
          selectedConversation._id,
      }
    );
  };

  // ====================================
  // Input Change
  // ====================================

  const handleContentChange = (
    event
  ) => {
    const value =
      event.target.value;

    setContent(value);

    if (!value.trim()) {
      handleTypingStop();

      if (typingTimeoutRef.current) {
        clearTimeout(
          typingTimeoutRef.current
        );
      }

      return;
    }

    handleTypingStart();

    if (typingTimeoutRef.current) {
      clearTimeout(
        typingTimeoutRef.current
      );
    }

    typingTimeoutRef.current =
      setTimeout(() => {
        handleTypingStop();
      }, 1500);
  };

  // ====================================
  // Cleanup Typing
  // ====================================

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(
          typingTimeoutRef.current
        );
      }

      if (socket.connected) {
        socket.emit(
          "typing_stop",
          {
            conversationId:
              selectedConversation?._id,
          }
        );
      }
    };
  }, [
    selectedConversation?._id,
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

      handleTypingStop();

      if (typingTimeoutRef.current) {
        clearTimeout(
          typingTimeoutRef.current
        );

        typingTimeoutRef.current =
          null;
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

        setConversations(
          (previousConversations) => {
            const conversationId =
              selectedConversation._id.toString();

            return previousConversations.map(
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

  const handleInputKeyDown = (
    event
  ) => {
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
  // Render
  // ====================================

  return (
    <div
      className="
        relative
        h-[calc(100vh-9.5rem)]
        min-h-[560px]
        overflow-hidden
        rounded-[24px]
        border
        border-border/60
        bg-background
        shadow-lg
        shadow-black/5
      "
    >
      <div className="flex h-full min-h-0">

        {/* ====================================
            Sidebar
        ==================================== */}

        <aside
          className={`
            relative
            h-full
            w-full
            shrink-0
            border-r
            border-border/60
            bg-background/95
            backdrop-blur-xl

            md:block
            md:w-[340px]
            lg:w-[380px]

            ${
              showConversationList
                ? "block"
                : "hidden md:block"
            }
          `}
        >
          {/* Sidebar Header */}

          <div
            className="
              relative
              overflow-hidden
              border-b
              border-border/60
              px-5
              pb-4
              pt-5
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-20
                h-40
                w-40
                rounded-full
                bg-primary/10
                blur-3xl
              "
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-primary/10
                      text-primary
                      ring-1
                      ring-primary/10
                    "
                  >
                    <MessageCircle className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg font-bold tracking-tight">
                        Messages
                      </h1>

                      <span
                        className="
                          hidden
                          rounded-full
                          bg-primary/10
                          px-2
                          py-0.5
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-primary
                          sm:inline-flex
                        "
                      >
                        DevPulse
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {conversations.length}{" "}
                      {conversations.length === 1
                        ? "conversation"
                        : "conversations"}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  size="icon"
                  onClick={() =>
                    setNewChatOpen(true)
                  }
                  className="
                    h-9
                    w-9
                    shrink-0
                    rounded-xl
                    shadow-sm
                  "
                  title="New conversation"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}

              <div className="relative mt-5">
                <Search
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
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
                    h-11
                    rounded-2xl
                    border-border/50
                    bg-muted/40
                    pl-10
                    pr-10
                    shadow-none
                    transition-all
                    focus:bg-background
                  "
                />

                {conversationSearch && (
                  <button
                    type="button"
                    onClick={() =>
                      setConversationSearch("")
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-md
                      p-1
                      text-muted-foreground
                      transition-colors
                      hover:bg-muted
                      hover:text-foreground
                    "
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Conversation List */}

          <div
            className="
              h-[calc(100%-145px)]
              overflow-y-auto
              px-2.5
              py-3
            "
          >
            {loadingConversations && (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(
                  (item) => (
                    <div
                      key={item}
                      className="
                        flex
                        animate-pulse
                        items-center
                        gap-3
                        rounded-2xl
                        p-3
                      "
                    >
                      <div className="h-11 w-11 shrink-0 rounded-full bg-muted" />

                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-28 rounded-full bg-muted" />
                        <div className="h-2.5 w-40 rounded-full bg-muted" />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {!loadingConversations &&
              filteredConversations.length === 0 && (
                <div
                  className="
                    flex
                    min-h-[350px]
                    flex-col
                    items-center
                    justify-center
                    px-5
                    text-center
                  "
                >
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-primary/10
                      text-primary
                    "
                  >
                    <Search className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold">
                    {conversationSearch
                      ? "No conversations found"
                      : "No conversations yet"}
                  </h3>

                  <p className="mt-1.5 max-w-[240px] text-xs leading-5 text-muted-foreground">
                    {conversationSearch
                      ? "Try searching for another developer."
                      : "Start connecting with developers and your conversations will appear here."}
                  </p>

                  {!conversationSearch && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
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
                      Start a chat
                    </Button>
                  )}
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
                          group
                          relative
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-2xl
                          p-3
                          text-left
                          transition-all
                          duration-200

                          ${
                            isActive
                              ? `
                                bg-primary/10
                                shadow-sm
                                ring-1
                                ring-primary/15
                              `
                              : `
                                hover:bg-muted/60
                              `
                          }
                        `}
                      >
                        {isActive && (
                          <span
                            className="
                              absolute
                              bottom-3
                              left-0
                              top-3
                              w-0.5
                              rounded-full
                              bg-primary
                            "
                          />
                        )}

                        <button
  type="button"
  onClick={handleOpenProfile}
  disabled={!activeParticipant?.username}
  className="
    relative
    shrink-0
    rounded-full
    focus:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary/50
    disabled:cursor-default
  "
>
  <Avatar
    className="
      h-12
      w-12
      border
      border-border/60
      shadow-sm
      transition-transform
      duration-200
      group-hover:scale-[1.03]
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
                              {getInitials(
                                participantName
                              )}
                            </AvatarFallback>
                          </Avatar>

                          {isActive && (
                            <span
                              className="
                                absolute
                                bottom-0
                                right-0
                                h-3
                                w-3
                                rounded-full
                                border-2
                                border-background
                                bg-emerald-500
                              "
                            />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`
                                truncate
                                text-sm
                                ${
                                  unreadCount > 0 ||
                                  isActive
                                    ? "font-semibold"
                                    : "font-medium"
                                }
                              `}
                            >
                              {participantName}
                            </p>

                            {lastMessageTime && (
                              <span
                                className={`
                                  shrink-0
                                  text-[10px]
                                  ${
                                    unreadCount > 0
                                      ? "font-semibold text-primary"
                                      : "text-muted-foreground"
                                  }
                                `}
                              >
                                {formatTime(
                                  lastMessageTime
                                )}
                              </span>
                            )}
                          </div>

                          <p className="truncate text-[11px] text-muted-foreground">
                            {participant?.username
                              ? `@${participant.username}`
                              : "Developer"}
                          </p>

                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p
                              className={`
                                truncate
                                text-xs
                                ${
                                  unreadCount > 0
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground"
                                }
                              `}
                            >
                              {lastMessage ||
                                "Start a conversation"}
                            </p>

                            {unreadCount > 0 && (
                              <span
                                className="
                                  flex
                                  h-5
                                  min-w-5
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-primary
                                  px-1.5
                                  text-[10px]
                                  font-bold
                                  text-primary-foreground
                                  shadow-sm
                                "
                              >
                                {unreadCount > 99
                                  ? "99+"
                                  : unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  }
                )}
            </div>
          </div>
        </aside>

        {/* ====================================
            Chat Area
        ==================================== */}

        <main
          className={`
            relative
            flex
            min-w-0
            flex-1
            flex-col
            overflow-hidden
            bg-muted/[0.12]

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
                relative
                flex
                flex-1
                items-center
                justify-center
                overflow-hidden
                px-6
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-80
                  w-80
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-primary/5
                  blur-3xl
                "
              />

              <div className="relative max-w-md text-center">
                <div
                  className="
                    mx-auto
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-[28px]
                    bg-primary/10
                    text-primary
                    shadow-sm
                    ring-1
                    ring-primary/10
                  "
                >
                  <MessageCircle className="h-9 w-9" />
                </div>

                <div className="mt-6 flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />

                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    DevPulse Messages
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight">
                  Your developer network,
                  <br />
                  one conversation away.
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  Connect with developers,
                  discuss projects, share ideas,
                  and build meaningful
                  professional connections.
                </p>

                <Button
                  type="button"
                  onClick={() =>
                    setNewChatOpen(true)
                  }
                  className="
                    mt-6
                    h-11
                    gap-2
                    rounded-xl
                    px-5
                    shadow-sm
                  "
                >
                  <Plus className="h-4 w-4" />
                  Start a conversation
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* ====================================
                  Chat Header
              ==================================== */}

              <header
                className="
                  relative
                  z-10
                  flex
                  shrink-0
                  items-center
                  gap-3
                  border-b
                  border-border/60
                  bg-background/90
                  px-4
                  py-3
                  shadow-sm
                  backdrop-blur-xl
                  sm:px-5
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

                <div className="relative shrink-0">
                  <Avatar
                    className="
                      h-11
                      w-11
                      border
                      border-border/60
                      shadow-sm
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
                      {getInitials(
                        activeParticipant?.fullName ||
                          activeParticipant?.username
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <span
                    className="
                      absolute
                      bottom-0
                      right-0
                      h-3
                      w-3
                      rounded-full
                      border-2
                      border-background
                      bg-emerald-500
                    "
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <button
  type="button"
  onClick={handleOpenProfile}
  disabled={!activeParticipant?.username}
  className="
    max-w-full
    truncate
    text-left
    text-sm
    font-bold
    transition-colors
    hover:text-primary
    focus:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary/50
    sm:text-base
  "
>
  {activeParticipant?.fullName ||
    activeParticipant?.username ||
    "Developer"}
</button>

                    <span
                      className="
                        hidden
                        rounded-full
                        bg-emerald-500/10
                        px-2
                        py-0.5
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-emerald-600
                        sm:inline-flex
                      "
                    >
                      Active
                    </span>
                  </div>

                  {activeParticipant?.username && (
                    <p className="truncate text-[11px] text-muted-foreground">
                      @{activeParticipant.username}
                    </p>
                  )}

                  {isOtherUserTyping && (
                    <p
                      className="
                        mt-0.5
                        flex
                        items-center
                        gap-1
                        text-[11px]
                        font-medium
                        text-primary
                      "
                    >
                      <span>
                        {typingUsername ||
                          activeParticipant?.fullName ||
                          "Developer"}{" "}
                        is typing
                      </span>

                      <span className="flex gap-0.5">
                        <span className="animate-bounce [animation-delay:-0.3s]">
                          .
                        </span>

                        <span className="animate-bounce [animation-delay:-0.15s]">
                          .
                        </span>

                        <span className="animate-bounce">
                          .
                        </span>
                      </span>
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="
                    h-9
                    w-9
                    shrink-0
                    rounded-xl
                    text-muted-foreground
                    hover:text-foreground
                  "
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </header>

              {/* ====================================
                  Messages
              ==================================== */}

              <div
                className="
                  relative
                  min-h-0
                  flex-1
                  overflow-y-auto
                  px-4
                  py-6
                  sm:px-8
                  sm:py-8
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-0
                    h-72
                    w-72
                    -translate-x-1/2
                    rounded-full
                    bg-primary/[0.025]
                    blur-3xl
                  "
                />

                {loadingMessages && (
                  <div className="relative flex items-center justify-center py-10">
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-border/50
                        bg-background/80
                        px-4
                        py-3
                        shadow-sm
                        backdrop-blur
                      "
                    >
                      <Loader2
                        className="
                          h-4
                          w-4
                          animate-spin
                          text-primary
                        "
                      />

                      <span className="text-xs text-muted-foreground">
                        Loading conversation...
                      </span>
                    </div>
                  </div>
                )}

                {!loadingMessages &&
                  messages.length === 0 && (
                    <div
                      className="
                        relative
                        flex
                        h-full
                        min-h-[350px]
                        items-center
                        justify-center
                      "
                    >
                      <div className="max-w-sm text-center">
                        <div
                          className="
                            mx-auto
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-[22px]
                            bg-background
                            text-primary
                            shadow-md
                            ring-1
                            ring-border/60
                          "
                        >
                          <Code2 className="h-7 w-7" />
                        </div>

                        <h3 className="mt-5 text-base font-bold">
                          Start the conversation
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Say hello, discuss a
                          project, or exchange
                          some developer ideas.
                        </p>
                      </div>
                    </div>
                  )}

                <div
                  className="
                    relative
                    mx-auto
                    max-w-3xl
                    space-y-4
                  "
                >
                  {messages.map(
                    (message, index) => {
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

                      const previousMessage =
                        messages[index - 1];

                      const previousSenderId =
                        previousMessage?.sender?._id ||
                        previousMessage?.sender;

                      const isSameSender =
                        previousSenderId
                          ?.toString() ===
                        senderId?.toString();

                      return (
                        <div
                          key={
                            message._id
                          }
                          className={`
                            flex
                            items-end
                            gap-2.5
                            ${
                              isOwnMessage
                                ? "justify-end"
                                : "justify-start"
                            }
                          `}
                        >
                          {/* Incoming avatar */}
{/* Incoming avatar */}

{!isOwnMessage &&
  !isSameSender && (
    <button
      type="button"
      onClick={() => {
        const username =
          activeParticipant?.username;

        if (!username) return;

        navigate(`/profile/${username}`);
      }}
      disabled={!activeParticipant?.username}
      className="
        mb-5
        shrink-0
        rounded-full
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary/50
        disabled:cursor-default
      "
    >
      <Avatar
        className="
          h-7
          w-7
          shrink-0
          border
          border-border/50
          transition-transform
          duration-200
          hover:scale-[1.08]
        "
      >
        <AvatarImage
          src={
            activeParticipant?.avatar
          }
          alt=""
        />

        <AvatarFallback
          className="
            bg-primary/10
            text-[9px]
            font-semibold
            text-primary
          "
        >
          {getInitials(
            activeParticipant?.fullName ||
              activeParticipant?.username
          )}
        </AvatarFallback>
      </Avatar>
    </button>
  )}
                          {!isOwnMessage &&
                            isSameSender && (
                              <div className="w-7 shrink-0" />
                            )}

                          <div
                            className="
                              group
                              max-w-[72%]
                              sm:max-w-[60%]
                            "
                          >
                            {/* Message Bubble */}

                            <div
                              className={`
                                relative
                                px-3.5
                                py-2
                                text-sm
                                leading-5
                                transition-all
                                duration-200
                                ${
                                  isOwnMessage
                                    ? `
                                      rounded-[16px]
                                      rounded-br-[5px]
                                      bg-primary
                                      text-primary-foreground
                                      shadow-sm
                                      shadow-primary/10
                                    `
                                    : `
                                      rounded-[16px]
                                      rounded-bl-[5px]
                                      border
                                      border-border/50
                                      bg-background
                                      text-foreground
                                      shadow-sm
                                    `
                                }
                              `}
                            >
                              <p className="whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                            </div>

                            {/* Message Meta */}

                            <div
                              className={`
                                mt-1
                                flex
                                items-center
                                gap-1.5
                                px-1
                                text-[9px]
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
                                  className="
                                    relative
                                    inline-flex
                                    h-4
                                    w-5
                                    shrink-0
                                    items-center
                                  "
                                  title={
                                    read
                                      ? "Read"
                                      : "Delivered"
                                  }
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="
                                      absolute
                                      left-0
                                      h-4
                                      w-4
                                      text-blue-500
                                    "
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                  >
                                    <path d="M4 12l4 4L16 8" />
                                  </svg>

                                  <svg
                                    viewBox="0 0 24 24"
                                    className="
                                      absolute
                                      left-[5px]
                                      h-4
                                      w-4
                                      text-blue-500
                                    "
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                  >
                                    <path d="M8 12l4 4L20 8" />
                                  </svg>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                  {/* ====================================
                      Typing Bubble
                  ==================================== */}

                  {isOtherUserTyping && (
                    <div className="flex items-end gap-2.5">
                      <Avatar
                        className="
                          h-7
                          w-7
                          shrink-0
                          border
                          border-border/50
                        "
                      >
                        <AvatarImage
                          src={
                            activeParticipant?.avatar
                          }
                          alt=""
                        />

                        <AvatarFallback
                          className="
                            bg-primary/10
                            text-[9px]
                            font-semibold
                            text-primary
                          "
                        >
                          {getInitials(
                            activeParticipant?.fullName ||
                              activeParticipant?.username
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className="
                          flex
                          items-center
                          gap-1
                          rounded-[16px]
                          rounded-bl-[5px]
                          border
                          border-border/50
                          bg-background
                          px-3.5
                          py-2
                          shadow-sm
                        "
                      >
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />

                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />

                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                      </div>
                    </div>
                  )}

                  <div
                    ref={messagesEndRef}
                    className="h-px"
                  />
                </div>
              </div>

              {/* ====================================
                  Composer
              ==================================== */}

              <div
                className="
                  relative
                  shrink-0
                  border-t
                  border-border/60
                  bg-background/90
                  px-3
                  py-3
                  backdrop-blur-xl
                  sm:px-5
                  sm:py-4
                "
              >
                <form
                  onSubmit={
                    handleSendMessage
                  }
                  className="
                    mx-auto
                    max-w-3xl
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      border
                      border-border/70
                      bg-muted/30
                      p-1.5
                      shadow-sm
                      transition-all
                      duration-200
                      focus-within:border-primary/30
                      focus-within:bg-background
                      focus-within:shadow-md
                      focus-within:shadow-primary/5
                    "
                  >
                    <button
                      type="button"
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-muted-foreground
                        transition-colors
                        hover:bg-muted
                        hover:text-foreground
                      "
                      title="Developer tools"
                    >
                      <Code2 className="h-4 w-4" />
                    </button>

                    <Input
                      ref={inputRef}
                      value={content}
                      onChange={
                        handleContentChange
                      }
                      onKeyDown={
                        handleInputKeyDown
                      }
                      placeholder="Write a message..."
                      disabled={sending}
                      className="
                        h-10
                        flex-1
                        border-0
                        bg-transparent
                        px-1
                        shadow-none
                        focus-visible:ring-0
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
                        h-9
                        w-9
                        shrink-0
                        rounded-xl
                        shadow-sm
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
                  </div>

                  <div className="mt-2 hidden justify-between px-1 sm:flex">
                    <span className="text-[10px] text-muted-foreground">
                      Enter to send
                    </span>

                    <span className="text-[10px] text-muted-foreground">
                      Shift + Enter for a new line
                    </span>
                  </div>
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
            backdrop-blur-md
          "
        >
          <div
            className="
              flex
              max-h-[82%]
              w-full
              max-w-lg
              flex-col
              overflow-hidden
              rounded-[26px]
              border
              border-border/60
              bg-background/95
              shadow-2xl
              backdrop-blur-xl
            "
          >
            {/* Modal Header */}

            <div
              className="
                relative
                overflow-hidden
                border-b
                border-border/60
                px-5
                pb-5
                pt-5
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-36
                  w-36
                  rounded-full
                  bg-primary/10
                  blur-3xl
                "
              />

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary/10
                      text-primary
                    "
                  >
                    <MessageCircle className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold">
                      New conversation
                    </h2>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Find a developer on DevPulse
                    </p>
                  </div>
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
            </div>

            {/* Search */}

            <div className="px-5 py-4">
              <div className="relative">
                <Search
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
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
                  placeholder="Search by name or username..."
                  className="
                    h-11
                    rounded-2xl
                    bg-muted/30
                    pl-10
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
                    py-12
                    text-center
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-primary/10
                      text-primary
                    "
                  >
                    <Search className="h-6 w-6" />
                  </div>

                  <p className="mt-4 text-sm font-semibold">
                    Find someone to talk to
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Search for a developer by
                    name or username.
                  </p>
                </div>
              )}

              {newChatSearch.trim().length >= 2 &&
                searchingDevelopers && (
                  <div className="flex items-center justify-center py-12">
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-muted/40
                        px-4
                        py-3
                      "
                    >
                      <Loader2
                        className="
                          h-4
                          w-4
                          animate-spin
                          text-primary
                        "
                      />

                      <span className="text-xs text-muted-foreground">
                        Searching developers...
                      </span>
                    </div>
                  </div>
                )}

              {newChatSearch.trim().length >= 2 &&
                !searchingDevelopers &&
                developerResults.length === 0 && (
                  <div className="px-4 py-12 text-center">
                    <div
                      className="
                        mx-auto
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-muted
                      "
                    >
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <p className="mt-4 text-sm font-semibold">
                      No developers found
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Try another name or username.
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
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-2xl
                        p-3
                        text-left
                        transition-all
                        duration-200
                        hover:bg-muted/60
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      <div className="relative shrink-0">
                        <Avatar
                          className="
                            h-12
                            w-12
                            border
                            border-border/60
                            shadow-sm
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
                            {getInitials(
                              developer.fullName ||
                                developer.username
                            )}
                          </AvatarFallback>
                        </Avatar>

                        <span
                          className="
                            absolute
                            bottom-0
                            right-0
                            h-3
                            w-3
                            rounded-full
                            border-2
                            border-background
                            bg-emerald-500
                          "
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {developer.fullName ||
                            developer.username ||
                            "Developer"}
                        </p>

                        {developer.username && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            @{developer.username}
                          </p>
                        )}

                        {developer.bio && (
                          <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground/70">
                            {developer.bio}
                          </p>
                        )}
                      </div>

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-primary/10
                          text-primary
                          opacity-70
                          transition-all
                          group-hover:opacity-100
                        "
                      >
                        {startingNewChat ? (
                          <Loader2
                            className="
                              h-4
                              w-4
                              animate-spin
                            "
                          />
                        ) : (
                          <MessageCircle className="h-4 w-4" />
                        )}
                      </div>
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
            rounded-2xl
            border
            border-red-500/20
            bg-background
            px-4
            py-3
            text-sm
            text-red-500
            shadow-xl
          "
        >
          {error}
        </div>
      )}
    </div>
  );
}