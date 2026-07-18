import Link from "next/link";
import { notFound } from "next/navigation";
import { conversations, getConversationById } from "@/app/marketplace-data";
import { SectionHeading, Surface } from "@/app/components/marketplace";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const threadParam = typeof params.thread === "string" ? params.thread : conversations[0]?.id;
  const activeConversation = getConversationById(threadParam);

  if (!activeConversation) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Messages"
        title="Talk to sellers without losing the listing context."
        description="This layout keeps the chat list, the active conversation, and the product reference together."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
        <Surface className="overflow-hidden">
          <div className="border-b border-black/10 px-5 py-4">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">
              Conversations
            </p>
          </div>
          <div className="divide-y divide-black/10">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages?thread=${conversation.id}`}
                className={`block px-5 py-4 transition ${
                  conversation.id === activeConversation.id ? "bg-zinc-50" : "hover:bg-black/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-zinc-950">{conversation.name}</h2>
                    <p className="mt-1 text-sm text-zinc-600">{conversation.productTitle}</p>
                  </div>
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-zinc-600">
                    {conversation.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{conversation.snippet}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                  <span>{conversation.price}</span>
                  <span>{conversation.updatedAt}</span>
                </div>
              </Link>
            ))}
          </div>
        </Surface>

        <Surface className="overflow-hidden">
          <div className="border-b border-black/10 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">Chat</p>
                <h2 className="mt-1 text-xl font-semibold text-zinc-950">
                  {activeConversation.name}
                </h2>
              </div>
              <Link
                href={`/products/${activeConversation.productSlug}`}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-black/20 hover:bg-black/5"
              >
                Open listing
              </Link>
            </div>
          </div>

          <div className="grid gap-4 p-5">
            <div className="rounded-[1.4rem] border border-black/10 bg-zinc-50 p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">
                Product reference
              </p>
              <p className="mt-2 text-base font-semibold text-zinc-950">
                {activeConversation.productTitle}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                Asking price {activeConversation.price} · keep the deal and condition discussion
                in the same thread.
              </p>
            </div>

            <div className="grid gap-3">
              {activeConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-[1.4rem] px-4 py-3 text-sm leading-6 ${
                    message.from === "buyer"
                      ? "ml-auto bg-zinc-950 text-white"
                      : "bg-zinc-100 text-zinc-900"
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`mt-2 text-[0.72rem] ${
                      message.from === "buyer" ? "text-white/60" : "text-zinc-500"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.4rem] border border-black/10 bg-white p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  type="text"
                  placeholder="Write a message"
                  className="h-12 rounded-[1.1rem] border border-black/10 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-black/30 focus:bg-white"
                />
                <button
                  type="button"
                  className="h-12 rounded-[1.1rem] bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
}
