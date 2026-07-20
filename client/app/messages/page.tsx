"use client";

import { Search, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import socket from "@/lib/socket";
import { fetchConversations, fetchMessages, type Conversation, type Message } from "@/services/chat/api";

export default function MessagesPage() {
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
  const selectedConversationId = conversationIdFromQuery ?? manualConversationId;
  const selectedConversationIdRef = useRef<string | null>(selectedConversationId);

  const getParticipantId = (participant?: { _id?: string; userId?: string } | null) =>
    participant?._id ?? participant?.userId ?? null;

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

    const refreshConversations = () => {
      void fetchConversations()
        .then((items) => {
          setConversations(items);
          if (!selectedConversationIdRef.current && items.length > 0) {
            setManualConversationId(items[0]._id);
          }
        })
        .catch(() => undefined);
    };

    socket.on("message:new", handleMessage);
    socket.on("conversation:new", refreshConversations);
    socket.on("conversation:updated", refreshConversations);

    return () => {
      socket.off("message:new", handleMessage);
      socket.off("conversation:new", refreshConversations);
      socket.off("conversation:updated", refreshConversations);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedConversationId) return;
    socket.emit("joinConversation", selectedConversationId);
  }, [selectedConversationId]);

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

  return (
    <div className="mx-auto h-[calc(100dvh-10rem)] min-h-150">
      <div className="grid h-full min-h-0 lg:grid-cols-[360px_1fr]">
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
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-[1.4rem] border border-dashed border-zinc-200 bg-zinc-50 p-4"
                  >
                    <div className="h-4 w-2/3 rounded-full bg-zinc-200" />
                    <div className="mt-3 h-3 w-1/2 rounded-full bg-zinc-200" />
                  </div>
                ))}
              </div>
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
                      onClick={() => setManualConversationId(conversation._id)}
                      className={`w-full rounded-[1.4rem] border p-4 text-left transition ${
                        isActive
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
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-14 w-3/4 animate-pulse rounded-3xl bg-zinc-100" />
                  ))}
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const mine = message.sender === user?.userId;
                    return (
                      <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                            mine ? "bg-black text-white" : "bg-zinc-100 text-zinc-950"
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    );
                  })}
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
    </div>
  );
}
