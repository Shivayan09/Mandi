"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Send, MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Skeleton } from "@/components/skeleton";
import socket from "@/lib/socket";
import { deleteMessage as deleteMessageRequest, fetchConversations, fetchMessages, type Conversation, type Message } from "@/services/chat/api";
import { useRouter } from "next/navigation";

function MessagesContent() {
  const searchParams = useSearchParams();
  const conversationIdFromQuery = searchParams.get("conversationId");
  const { user } = useAppContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [manualConversationId, setManualConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMessageMenuId, setOpenMessageMenuId] = useState<string | null>(null);
  const selectedConversationId = conversationIdFromQuery ?? manualConversationId;
  const selectedConversationIdRef = useRef<string | null>(selectedConversationId);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const getParticipantId = (participant?: { _id?: string; userId?: string } | null) => participant?._id ?? participant?.userId ?? null;
  const getMessageDateKey = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toDateString();
  };

  const formatMessageTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const formatDateDivider = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    let active = true;

    const loadConversations = async () => {
      try {
        setLoadingConversations(true);
        const items = await fetchConversations();
        if (!active) return;
        setConversations(items);
        if (!selectedConversationId && items.length > 0) {
          setManualConversationId(items[0]._id);
        }
        setError(null);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load conversations");
      } finally {
        if (active) {
          setLoadingConversations(false);
        }
      }
    };
    void loadConversations();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedConversationId) return;
    let active = true;
    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const items = await fetchMessages(selectedConversationId);
        if (!active) return;
        setMessages(items.reverse());
        setError(null);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load messages");
      } finally {
        if (active) {
          setLoadingMessages(false);
        }
      }
    };
    void loadMessages();
    return () => {
      active = false;
    };
  }, [selectedConversationId]);

  useEffect(() => {
    socket.connect();
    const handleMessage = (message: Message) => {
      if (message.conversation !== selectedConversationIdRef.current) {
        void fetchConversations().then(setConversations).catch(() => undefined);
        return;
      }
      setMessages((current) => {
        if (current.some((item) => item._id === message._id)) {
          return current;
        }
        return [...current, message];
      });
    };
    const handleMessageDeleted = (payload: { messageId?: string; conversationId?: string }) => {
      if (!payload?.messageId || !payload?.conversationId) return;

      if (payload.conversationId === selectedConversationIdRef.current) {
        setMessages((current) => current.filter((message) => message._id !== payload.messageId));
      }

      void fetchConversations().then(setConversations).catch(() => undefined);
    };
    const refreshConversations = () => {
      void fetchConversations().then((items) => {
        setConversations(items);
        if (!selectedConversationIdRef.current && items.length > 0) {
          setManualConversationId(items[0]._id);
        }
      }).catch(() => undefined);
    };
    socket.on("message:new", handleMessage);
    socket.on("message:deleted", handleMessageDeleted);
    socket.on("conversation:new", refreshConversations);
    socket.on("conversation:updated", refreshConversations);
    return () => {
      socket.off("message:new", handleMessage);
      socket.off("message:deleted", handleMessageDeleted);
      socket.off("conversation:new", refreshConversations);
      socket.off("conversation:updated", refreshConversations);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedConversationId) return;

    socket.emit("joinConversation", selectedConversationId);
  }, [selectedConversationId]);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpenMessageMenuId(null);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, selectedConversationId, loadingMessages]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === selectedConversationId) ?? null,
    [conversations, selectedConversationId],
  );

  const selectedParticipant = useMemo(() => {
    if (!selectedConversation || !user) return null;
    return (
      selectedConversation.participants.find((participant) => getParticipantId(participant) !== user.userId) ??
      selectedConversation.participants[0] ??
      null
    );
  }, [selectedConversation, user]);

  const handleSendMessage = () => {
    const cleanText = messageText.trim();
    if (!selectedConversationId || !cleanText) return;
    socket.emit(
      "sendMessage",
      { conversationId: selectedConversationId, text: cleanText },
      (response: { success?: boolean; message?: string }) => {
        if (!response?.success) {
          setError(response?.message ?? "Could not send message");
          return;
        }
        setMessageText("");
      },
    );
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedConversationId) return;
    if (!window.confirm("Delete this message?")) return;
    setError(null);
    try {
      await deleteMessageRequest(messageId);
      setMessages((current) => current.filter((message) => message._id !== messageId));
      setOpenMessageMenuId(null);
      void fetchConversations().then(setConversations).catch(() => undefined);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete message");
    }
  };

  return (
    user ? (<div className="mx-auto h-[calc(100dvh-10rem)] min-h-145">
      <div className="grid h-full min-h-0 lg:grid-cols-[320px_1fr]">
        <aside className="hidden min-h-0 flex-col overflow-hidden border border-black/10 bg-white shadow-[0_20px_70px_rgba(17,17,17,0.06)] lg:flex">
          <div className="border-b border-black/10 p-4">
            <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-zinc-50 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-zinc-400" />
              <input
                type="search"
                placeholder="Search chats"
                aria-label="Search chats"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="scrollbar-hidden flex-1 overflow-y-auto p-4">
            {loadingConversations ? (
              <ConversationListSkeleton />
            ) : conversations.length > 0 ? (
              <div className="space-y-3">
                {conversations.map((conversation) => {
                  const otherParticipant =
                    conversation.participants.find((participant) => getParticipantId(participant) !== user?.userId) ??
                    conversation.participants[0];
                  const isActive = conversation._id === selectedConversationId;

                  return (
                    <button
                      key={conversation._id}
                      type="button"
                      onClick={() => {
                        setOpenMessageMenuId(null);
                        setManualConversationId(conversation._id);
                      }}
                      className={`w-full cursor-pointer rounded-2xl border p-2 text-left transition ${isActive
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white hover:border-black/20 hover:bg-black/5"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isActive ? "bg-white/10" : "bg-zinc-100"}`}>
                          {otherParticipant?.name?.slice(0, 1) ?? "S"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">
                            {otherParticipant?.name ?? otherParticipant?.username ?? "Seller"}
                          </div>
                          <div className={`mt-1 truncate text-xs ${isActive ? "text-white/70" : "text-zinc-500"}`}>
                            {conversation.lastMessage?.text ?? "No messages yet"}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
                No conversations yet. Open a listing and tap Talk to seller.
              </div>
            )}
          </div>
        </aside>

        <main className="flex min-h-0 flex-col overflow-hidden border border-black/10 bg-white shadow-[0_20px_70px_rgba(17,17,17,0.06)]">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-5">
            <div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">
                {selectedParticipant?.name ?? selectedParticipant?.username ?? "Select a thread"}
              </h2>
            </div>
            <div className="rounded-full border border-dashed border-zinc-300 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">
              {selectedConversationId ? "Live" : "Empty"}
            </div>
          </div>

          <div className="scrollbar-hidden flex-1 min-h-0 overflow-y-auto px-5 py-6 sm:px-8">
            {selectedConversationId ? (
              loadingMessages ? (
                <MessageThreadSkeleton />
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const mine = message.sender === user?.userId;
                    const currentDateKey = getMessageDateKey(message.createdAt);
                    const previousDateKey = getMessageDateKey(messages[index - 1]?.createdAt);
                    const showDateDivider = currentDateKey && currentDateKey !== previousDateKey;
                    const timeLabel = formatMessageTime(message.createdAt);

                    return (
                      <div key={message._id} className="space-y-4">
                        {showDateDivider ? (
                          <div className="flex justify-center py-2">
                            <span className="rounded-full border border-black/10 bg-white px-4 py-1 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-black/55">
                              {formatDateDivider(message.createdAt)}
                            </span>
                          </div>
                        ) : null}

                        <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div className={`group relative max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-6 ${mine ? "bg-black text-white" : "bg-zinc-100 text-zinc-950"}`}>
                            {mine ? (
                              <>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setOpenMessageMenuId((current) =>
                                      current === message._id ? null : message._id,
                                    );
                                  }}
                                  className="absolute right-0 cursor-pointer top-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
                                  aria-label="Message options"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>

                                {openMessageMenuId === message._id ? (
                                  <div
                                    ref={menuRef}
                                    className="absolute right-2 top-11 z-20 min-w-36 overflow-hidden rounded-2xl border border-black/10 bg-white text-black shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => void handleDeleteMessage(message._id)}
                                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ) : null}
                              </>
                            ) : null}

                            <p className={mine ? "pr-10" : ""}>{message.text}</p>

                            <div className={`flex items-center justify-end gap-2 text-[0.68rem] ${mine ? "text-white/65" : "text-zinc-500"}`}>
                              <span>{timeLabel}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center px-6 py-10 sm:px-10">
                  <div className="max-w-md text-center">
                    <div className="mx-auto mb-6 h-16 w-16 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50" />
                    <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                      Say hello to the seller.
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                      Your first message will appear here once you send it.
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex h-full items-center justify-center px-6 py-10 sm:px-10">
                <div className="max-w-md text-center">
                  <div className="mx-auto mb-6 h-16 w-16 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50" />
                  <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                    No conversation is selected yet.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    Open a product and tap Talk to seller to jump straight into a thread.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-black/10 p-4">
            {error ? (
              <p className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <div className="flex items-end gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                disabled={!selectedConversationId}
                placeholder="Write a message..."
                className="h-12 flex-1 px-3 rounded-2xl border border-black/10 bg-zinc-50 text-sm outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!selectedConversationId}
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>)
      : (
        <div className="min-h-[60vh] w-full flex items-center justify-center">
          <div className="flex items-center justify-center flex-col gap-3">
            <p>Log in to see your messages</p>
            <button onClick={() => { router.push('/auth/login') }} className="bg-black transition-all hover:bg-black/80 text-white px-5 py-2 rounded-xl cursor-pointer">
              Continue to Log in
            </button>
          </div>
        </div>
      )
  );
}


export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesPageSkeleton />}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesPageSkeleton() {
  return (
    <div className="mx-auto h-[calc(100dvh-10rem)] min-h-145">
      <div className="grid h-full min-h-0 lg:grid-cols-[320px_1fr]">
        <aside className="hidden min-h-0 flex-col overflow-hidden border border-black/10 bg-white shadow-[0_20px_70px_rgba(17,17,17,0.06)] lg:flex">
          <div className="border-b border-black/10 p-4">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3 rounded-full" />
                  <Skeleton className="h-3 w-1/2 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex min-h-0 flex-col overflow-hidden border border-black/10 bg-white shadow-[0_20px_70px_rgba(17,17,17,0.06)]">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="h-6 w-40 rounded-full" />
            </div>
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <div className="flex-1 px-5 py-6 sm:px-8">
            <MessageThreadSkeleton />
          </div>
          <div className="border-t border-black/10 p-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </main>
      </div>
    </div>
  );
}

function ConversationListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MessageThreadSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={`flex ${index % 2 === 0 ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[75%] space-y-2 rounded-2xl px-4 py-3 ${index % 2 === 0 ? "bg-black/5" : "bg-zinc-100"}`}>
            <Skeleton className="h-4 w-64 rounded-full" />
            <Skeleton className="h-4 w-36 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
