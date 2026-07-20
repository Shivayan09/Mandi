"use client";

import { Search } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="mx-auto">

      <div className="grid lg:min-h-[calc(100vh-13rem)] lg:grid-cols-[360px_1fr]">
        <aside className="flex min-h-128 flex-col overflow-hidden border border-black/10 bg-white shadow-[0_20px_70px_rgba(17,17,17,0.06)]">
          <div className="border-b border-black/10 p-4">
            <div className="flex items-center gap-3 rounded-[1.4rem] border border-black/10 bg-zinc-50 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-zinc-400" />
              <input
                type="search"
                placeholder="Search chats"
                aria-label="Search chats"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-[1.4rem] border border-dashed border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-zinc-200" />
                    <div className="min-w-0 flex-1">
                      <div className="h-3 w-2/3 rounded-full bg-zinc-200" />
                      <div className="mt-3 h-3 w-1/2 rounded-full bg-zinc-200" />
                    </div>
                    <div className="h-3 w-10 rounded-full bg-zinc-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex min-h-128 flex-col overflow-hidden border border-black/10 bg-white shadow-[0_20px_70px_rgba(17,17,17,0.06)]">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-5">
            <div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">
                Select a thread
              </h2>
            </div>
            <div className="rounded-full border border-dashed border-zinc-300 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">
              Empty
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-6 h-16 w-16 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50" />
              <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                No conversation is selected yet.
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Pick a chat from the left once live threads are available. Messages, buyer details,
                and replies will render here.
              </p>
            </div>
          </div>

          <div className="border-t border-black/10 p-4 sm:p-5">
            <div className="flex items-end gap-3 rounded-3xl border border-black/10 bg-zinc-50 p-3">
              <input
                type="text"
                disabled
                placeholder="Write a message..."
                className="h-12 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                disabled
                className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
