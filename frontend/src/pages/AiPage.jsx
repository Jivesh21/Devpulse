import { useEffect, useRef, useState } from "react";
import { Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { streamAIMessage } from "@/services/ai.service";

// ====================================
// DevPulse AI Page
// ====================================

const AiPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm DevPulse AI. Ask me anything about programming, debugging, projects, or your developer journey.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // ====================================
  // Scroll To Latest Message
  // ====================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ====================================
  // Send Message
  // ====================================

  const handleSendMessage = async () => {
    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setError("");
    setInput("");
    setLoading(true);

    // ====================================
    // Add User Message
    // ====================================

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
      // ====================================
      // Stream AI Response
      // ====================================

      await streamAIMessage(message, (chunk) => {
        setMessages((previousMessages) => {
          const updatedMessages = [
            ...previousMessages,
          ];

          const lastMessageIndex =
            updatedMessages.length - 1;

          const lastMessage =
            updatedMessages[lastMessageIndex];

          if (
            !lastMessage ||
            lastMessage.role !== "assistant"
          ) {
            return updatedMessages;
          }

          updatedMessages[lastMessageIndex] = {
            ...lastMessage,
            content:
              lastMessage.content + chunk,
          };

          return updatedMessages;
        });
      });
    } catch (error) {
      console.error("AI streaming error:", error);

      setError(
        error?.message ||
          "Unable to get a response from DevPulse AI."
      );

      // ====================================
      // Remove Empty AI Message On Failure
      // ====================================

      setMessages((previousMessages) => {
        const lastMessage =
          previousMessages[
            previousMessages.length - 1
          ];

        if (
          lastMessage?.role === "assistant" &&
          !lastMessage.content
        ) {
          return previousMessages.slice(0, -1);
        }

        return previousMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // Handle Enter Key
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

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* ====================================
          Header
      ==================================== */}

      <div className="flex items-center gap-3 border-b px-6 py-4">
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

      {/* ====================================
          Messages
      ==================================== */}

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {messages.map((message, index) => {
            const isUser =
              message.role === "user";

            return (
              <div
                key={`${message.role}-${index}`}
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
                      {message.content}
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-3 prose-headings:mt-5 prose-p:my-2 prose-ul:my-3 prose-ol:my-3 prose-li:my-0 prose-pre:my-3">
                      {message.content ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // ====================================
                            // Unordered Lists
                            // ====================================

                            ul({ children }) {
                              return (
                                <ul className="my-3 ml-5 list-disc space-y-1">
                                  {children}
                                </ul>
                              );
                            },

                            // ====================================
                            // Ordered Lists
                            // ====================================

                            ol({ children }) {
                              return (
                                <ol className="my-3 ml-5 list-decimal space-y-1">
                                  {children}
                                </ol>
                              );
                            },

                            // ====================================
                            // List Items
                            // ====================================

                            li({ children }) {
                              return (
                                <li className="pl-1">
                                  {children}
                                </li>
                              );
                            },

                            // ====================================
                            // Code Blocks / Inline Code
                            // ====================================

                            code({
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              const match =
                                /language-(\w+)/.exec(
                                  className || ""
                                );

                              if (
                                !inline &&
                                match
                              ) {
                                return (
                                  <pre className="overflow-x-auto rounded-lg bg-black/80 p-4 text-sm text-white">
                                    <code
                                      className={className}
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  </pre>
                                );
                              }

                              return (
                                <code
                                  className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/10"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },

                            // ====================================
                            // Preformatted Blocks
                            // ====================================

                            pre({ children }) {
                              return (
                                <div className="overflow-x-auto">
                                  {children}
                                </div>
                              );
                            },

                            // ====================================
                            // Links
                            // ====================================

                            a({
                              children,
                              href,
                              ...props
                            }) {
                              return (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium underline"
                                  {...props}
                                >
                                  {children}
                                </a>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="animate-pulse">
                            ●
                          </span>

                          <span>
                            DevPulse AI is thinking...
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
                    <User size={17} />
                  </div>
                )}
              </div>
            );
          })}

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
            disabled={loading}
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={
              !input.trim() || loading
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>

        <p className="mx-auto mt-2 max-w-4xl text-center text-xs text-muted-foreground">
          DevPulse AI can make mistakes. Verify important technical information.
        </p>
      </div>
    </div>
  );
};

export default AiPage;