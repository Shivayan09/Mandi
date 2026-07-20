import { apiFetch } from "@/services/api";

type Conversation = {
  _id: string;
  participants: Array<{
    _id?: string;
    userId?: string;
    name?: string;
    username?: string;
    profilePic?: string;
  }>;
  lastMessage?: {
    _id: string;
    text?: string;
    createdAt?: string;
  } | null;
  updatedAt?: string;
};

type Message = {
  _id: string;
  conversation: string;
  sender: string;
  text: string;
  read: boolean;
  createdAt: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  conversation?: T;
  conversations?: T[];
  messages?: Message[];
};

async function readEnvelope<T>(response: Response) {
  return (await response.json()) as ApiEnvelope<T>;
}

export async function createConversation(receiverId: string) {
  const response = await apiFetch("/chat/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ receiverId }),
  });
  const data = await readEnvelope<Conversation>(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not open conversation");
  }

  return data.conversation ?? null;
}

export async function fetchConversations() {
  const response = await apiFetch("/chat/conversations", {
    cache: "no-store",
  });
  const data = await readEnvelope<Conversation>(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not load conversations");
  }

  return data.conversations ?? [];
}

export async function fetchMessages(conversationId: string) {
  const response = await apiFetch(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`, {
    cache: "no-store",
  });
  const data = await readEnvelope<Conversation>(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not load messages");
  }

  return data.messages ?? [];
}

export type { Conversation, Message };
