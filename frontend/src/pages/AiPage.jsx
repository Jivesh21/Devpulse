import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Trash2,
  X,
  Check,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  createAIConversation,
  getAIConversations,
  getAIConversation,
  deleteAIConversation,
  streamAIMessage,
} from "@/services/ai.service";

// ====================================
// Default Assistant Message
// ====================================

const DEFAULT_ASSISTANT_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I'm DevPulse AI. Ask me anything about programming, debugging, projects, or your developer journey.",
};

// ====================================
// DevPulse AI Page
// ====================================

const AiPage = () => {
  const [messages, setMessages] = useState([
    DEFAULT_ASSISTANT_MESSAGE,
  ]);

  const [conversationId, setConversationId] =
    useState(null);

  const [conversations, setConversations] =
    useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [initializing, setInitializing] =
    useState(true);

  const [loadingConversation, setLoadingConversation] =
    useState(false);

  const [deletingConversationId, setDeletingConversationId] =
    useState(null);

  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const messagesEndRef = useRef(null);

  // ====================================
  // Load Conversations
  // ====================================

  const loadConversations = async () => {
    const response = await getAIConversations();

    const conversationList = response?.data || [];

    setConversations(conversationList);

    return conversationList;
  };

  // ====================================
  // Load Single Conversation
  // ====================================

  const loadConversation = async (id) => {
    if (!id) {
      return;
    }

    try {
      setLoadingConversation(true);
      setError("");

      const response = await getAIConversation(id);

      const conversation = response?.data;

      if (!conversation?._id) {
        throw new Error(
          "Unable to load AI conversation."
        );
      }

      setConversationId(conversation._id);

      if (conversation.messages?.length) {
        setMessages(conversation.messages);
      } else {
        setMessages([
          DEFAULT_ASSISTANT_MESSAGE,
        ]);
      }
    } catch (error) {
      console.error(
        "AI conversation loading error:",
        error
      );

      setError(
        error?.message ||
          "Unable to load AI conversation."
      );
    } finally {
      setLoadingConversation(false);
    }
  };

  // ====================================
  // Initialize AI
  // ====================================

  useEffect(() => {
    const initializeConversation = async () => {
      try {
        setInitializing(true);
        setError("");

        const conversationList =
          await loadConversations();

        if (conversationList.length > 0) {
          await loadConversation(
            conversationList[0]._id
          );

          return;
        }

        const response =
          await createAIConversation();

        const newConversation =
          response?.data;

        if (!newConversation?._id) {
          throw new Error(
            "Unable to create AI conversation."
          );
        }

        setConversationId(
          newConversation._id
        );

        setMessages([
          DEFAULT_ASSISTANT_MESSAGE,
        ]);

        setConversations([
          newConversation,
        ]);
      } catch (error) {
        console.error(
          "AI initialization error:",
          error
        );

        setError(
          error?.message ||
            "Unable to initialize DevPulse AI."
        );
      } finally {
        setInitializing(false);
      }
    };

    initializeConversation();
  }, []);

  // ====================================
  // Scroll To Latest Message
  // ====================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ====================================
  // Create New Conversation
  // ====================================

  const handleNewConversation = async () => {
    if (
      loading ||
      loadingConversation ||
      deletingConversationId
    ) {
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response =
        await createAIConversation();

      const newConversation =
        response?.data;

      if (!newConversation?._id) {
        throw new Error(
          "Unable to create new AI conversation."
        );
      }

      setConversationId(
        newConversation._id
      );

      setMessages([
        DEFAULT_ASSISTANT_MESSAGE,
      ]);

      setConversations((previous) => [
        newConversation,
        ...previous,
      ]);
    } catch (error) {
      console.error(
        "New AI conversation error:",
        error
      );

      setError(
        error?.message ||
          "Unable to create a new AI conversation."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // Select Conversation
  // ====================================

  const handleSelectConversation = async (
    id
  ) => {
    if (
      id === conversationId ||
      loading ||
      loadingConversation ||
      deletingConversationId
    ) {
      return;
    }

    await loadConversation(id);
  };

  // ====================================
  // Delete Conversation
  // ====================================

  const handleDeleteConversation = async (
    id
  ) => {
    // IMPORTANT:
    // Do NOT check deletingConversationId here.
    // It is already set when the user clicks ✓.

    if (
      !id ||
      loading ||
      loadingConversation
    ) {
      return;
    }

    try {
      setError("");

      await deleteAIConversation(id);

      // ====================================
      // Remove Deleted Conversation Locally
      // ====================================

      const remainingConversations =
        conversations.filter(
          (conversation) =>
            conversation._id !== id
        );

      setConversations(
        remainingConversations
      );

      // ====================================
      // Active Conversation Was Deleted
      // ====================================

      if (id === conversationId) {
        if (
          remainingConversations.length >
          0
        ) {
          await loadConversation(
            remainingConversations[0]._id
          );
        } else {
          const response =
            await createAIConversation();

          const newConversation =
            response?.data;

          if (!newConversation?._id) {
            throw new Error(
              "Unable to create a new AI conversation."
            );
          }

          setConversationId(
            newConversation._id
          );

          setMessages([
            DEFAULT_ASSISTANT_MESSAGE,
          ]);

          setConversations([
            newConversation,
          ]);
        }
      }
    } catch (error) {
      console.error(
        "Delete AI conversation error:",
        error
      );

      setError(
        error?.message ||
          "Unable to delete AI conversation."
      );
    } finally {
      setDeletingConversationId(null);
    }
  };

  // ====================================
  // Send Message
  // ====================================

  const handleSendMessage = async () => {
    const message = input.trim();

    if (
      !message ||
      loading ||
      initializing ||
      loadingConversation ||
      deletingConversationId ||
      !conversationId
    ) {
      return;
    }

    setError("");
    setInput("");
    setLoading(true);

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);

    try {
      await streamAIMessage(
        conversationId,
        message,
        (chunk) => {
          setMessages(
            (previousMessages) => {
              const updatedMessages = [
                ...previousMessages,
              ];

              const lastMessageIndex =
                updatedMessages.length - 1;

              const lastMessage =
                updatedMessages[
                  lastMessageIndex
                ];

              if (
                !lastMessage ||
                lastMessage.role !==
                  "assistant"
              ) {
                return updatedMessages;
              }

              updatedMessages[
                lastMessageIndex
              ] = {
                ...lastMessage,
                content:
                  lastMessage.content +
                  chunk,
              };

              return updatedMessages;
            }
          );
        }
      );

      await loadConversations();
    } catch (error) {
      console.error(
        "AI streaming error:",
        error
      );

      setError(
        error?.message ||
          "Unable to get a response from DevPulse AI."
      );

      setMessages(
        (previousMessages) => {
          const lastMessage =
            previousMessages[
              previousMessages.length - 1
            ];

          if (
            lastMessage?.role ===
              "assistant" &&
            !lastMessage.content
          ) {
            return previousMessages.slice(
              0,
              -1
            );
          }

          return previousMessages;
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // Handle Enter
  // ====================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSendMessage();
    }
  };

  // ====================================
  // Initial Loading
  // ====================================

  if (initializing) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-background">
        <div className="flex items-center gap-3 border-b px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot size={22} />
          </div>

          <div>
            <h1 className="text-lg font-semibold">
              DevPulse AI
            </h1>

            <p className="text-sm text-muted-foreground">
              Loading your conversations...
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="animate-pulse">
              ●
            </span>

            Loading DevPulse AI...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 bg-background">
      {/* ====================================
          AI Conversation Sidebar
      ==================================== */}

      {sidebarOpen && (
        <aside className="flex w-64 shrink-0 flex-col border-r bg-background">
          {/* Sidebar Header */}

          <div className="flex items-center justify-between border-b px-4 py-4">
            <div>
              <h2 className="text-sm font-semibold">
                AI Chats
              </h2>

              <p className="text-xs text-muted-foreground">
                Your conversations
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close chat sidebar"
            >
              <PanelLeftClose
                size={18}
              />
            </button>
          </div>

          {/* New Chat */}

          <div className="p-3">
            <button
              type="button"
              onClick={
                handleNewConversation
              }
              disabled={
                loading ||
                loadingConversation ||
                !!deletingConversationId
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={17} />

              New Chat
            </button>
          </div>

          {/* Conversation List */}

          <div className="flex-1 overflow-y-auto px-2 pb-3">
            <div className="space-y-1">
              {conversations.map(
                (conversation) => {
                  const isActive =
                    conversation._id ===
                    conversationId;

                  const isDeleting =
                    deletingConversationId ===
                    conversation._id;

                  return (
                    <div
                      key={
                        conversation._id
                      }
                      className={`group flex items-center gap-1 rounded-xl transition-colors ${
                        isActive
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                    >
                      {/* Conversation Button */}

                      <button
                        type="button"
                        onClick={() =>
                          handleSelectConversation(
                            conversation._id
                          )
                        }
                        disabled={
                          loading ||
                          loadingConversation ||
                          !!deletingConversationId
                        }
                        className={`flex min-w-0 flex-1 items-start gap-3 px-3 py-3 text-left ${
                          isActive
                            ? "text-primary"
                            : ""
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <MessageSquare
                          size={17}
                          className="mt-0.5 shrink-0"
                        />

                        <span className="min-w-0 flex-1 truncate text-sm">
                          {conversation.title ||
                            "New AI Chat"}
                        </span>
                      </button>

                      {/* ====================================
                          Delete Controls
                      ==================================== */}

                      {isDeleting ? (
                        <div className="flex shrink-0 items-center gap-1 pr-2">
                          {/* Confirm Delete */}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();

                              handleDeleteConversation(
                                conversation._id
                              );
                            }}
                            className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10"
                            aria-label="Confirm delete"
                          >
                            <Check
                              size={15}
                            />
                          </button>

                          {/* Cancel Delete */}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();

                              setDeletingConversationId(
                                null
                              );
                            }}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                            aria-label="Cancel delete"
                          >
                            <X
                              size={15}
                            />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            setDeletingConversationId(
                              conversation._id
                            );
                          }}
                          disabled={
                            loading ||
                            loadingConversation ||
                            !!deletingConversationId
                          }
                          className="mr-2 shrink-0 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-0"
                          aria-label="Delete conversation"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>
                      )}
                    </div>
                  );
                }
              )}

              {conversations.length ===
                0 && (
                <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No conversations yet.
                </div>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* ====================================
          Main AI Area
      ==================================== */}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}

        <div className="flex items-center justify-between border-b px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Open chat sidebar"
              >
                <PanelLeft
                  size={19}
                />
              </button>
            )}

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot size={22} />
            </div>

            <div>
              <h1 className="text-lg font-semibold">
                DevPulse AI
              </h1>

              <p className="text-sm text-muted-foreground">
                Your developer assistant
              </p>
            </div>
          </div>

          {/* New Chat */}

          <button
            type="button"
            onClick={
              handleNewConversation
            }
            disabled={
              loading ||
              loadingConversation ||
              !!deletingConversationId
            }
            className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={17} />

            <span className="hidden sm:inline">
              New Chat
            </span>
          </button>
        </div>

        {/* ====================================
            Messages
        ==================================== */}

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-5">
            {loadingConversation ? (
              <div className="flex flex-1 items-center justify-center py-20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="animate-pulse">
                    ●
                  </span>

                  Loading conversation...
                </div>
              </div>
            ) : (
              messages.map(
                (message, index) => {
                  const isUser =
                    message.role ===
                    "user";

                  return (
                    <div
                      key={`${conversationId}-${message.role}-${index}`}
                      className={`flex gap-3 ${
                        isUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Bot size={17} />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                          isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {isUser ? (
                          <div className="whitespace-pre-wrap">
                            {
                              message.content
                            }
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-3 prose-headings:mt-5 prose-p:my-2 prose-ul:my-3 prose-ol:my-3 prose-li:my-0 prose-pre:my-3">
                            {message.content ? (
                              <ReactMarkdown
                                remarkPlugins={[
                                  remarkGfm,
                                ]}
                                components={{
                                  ul({
                                    children,
                                  }) {
                                    return (
                                      <ul className="my-3 ml-5 list-disc space-y-1">
                                        {
                                          children
                                        }
                                      </ul>
                                    );
                                  },

                                  ol({
                                    children,
                                  }) {
                                    return (
                                      <ol className="my-3 ml-5 list-decimal space-y-1">
                                        {
                                          children
                                        }
                                      </ol>
                                    );
                                  },

                                  li({
                                    children,
                                  }) {
                                    return (
                                      <li className="pl-1">
                                        {
                                          children
                                        }
                                      </li>
                                    );
                                  },

                                  code({
                                    inline,
                                    className,
                                    children,
                                    ...props
                                  }) {
                                    const match =
                                      /language-(\w+)/.exec(
                                        className ||
                                          ""
                                      );

                                    if (
                                      !inline &&
                                      match
                                    ) {
                                      return (
                                        <pre className="overflow-x-auto rounded-lg bg-black/80 p-4 text-sm text-white">
                                          <code
                                            className={
                                              className
                                            }
                                            {...props}
                                          >
                                            {
                                              children
                                            }
                                          </code>
                                        </pre>
                                      );
                                    }

                                    return (
                                      <code
                                        className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/10"
                                        {...props}
                                      >
                                        {
                                          children
                                        }
                                      </code>
                                    );
                                  },

                                  pre({
                                    children,
                                  }) {
                                    return (
                                      <div className="overflow-x-auto">
                                        {
                                          children
                                        }
                                      </div>
                                    );
                                  },

                                  a({
                                    children,
                                    href,
                                    ...props
                                  }) {
                                    return (
                                      <a
                                        href={
                                          href
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium underline"
                                        {...props}
                                      >
                                        {
                                          children
                                        }
                                      </a>
                                    );
                                  },
                                }}
                              >
                                {
                                  message.content
                                }
                              </ReactMarkdown>
                            ) : (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="animate-pulse">
                                  ●
                                </span>

                                <span>
                                  DevPulse AI is
                                  thinking...
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
                          <User
                            size={17}
                          />
                        </div>
                      )}
                    </div>
                  );
                }
              )
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ====================================
            Error
        ==================================== */}

        {error && (
          <div className="px-4 pb-2 md:px-8">
            <div className="mx-auto max-w-4xl rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {error}
            </div>
          </div>
        )}

        {/* ====================================
            Input
        ==================================== */}

        <div className="border-t p-4 md:px-8">
          <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm">
            <textarea
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask DevPulse AI..."
              rows={1}
              disabled={
                loading ||
                loadingConversation ||
                !!deletingConversationId
              }
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={
                !input.trim() ||
                loading ||
                loadingConversation ||
                !!deletingConversationId ||
                !conversationId
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>

          <p className="mx-auto mt-2 max-w-4xl text-center text-xs text-muted-foreground">
            DevPulse AI can make mistakes.
            Verify important technical
            information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiPage;