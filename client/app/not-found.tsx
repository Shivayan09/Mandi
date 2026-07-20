import Link from "next/link";
import { Surface } from "@/components/marketplace";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Surface className="p-8 sm:p-10 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">Not found</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
          That listing does not exist.
        </h1>
        <p className="mt-4 text-sm leading-6 text-zinc-600">
          It may have been removed or the link may be outdated. Head back to the marketplace
          to keep browsing.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Browse products
          </Link>
          <Link
            href="/"
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-black/20 hover:bg-black/5"
          >
            Go home
          </Link>
        </div>
      </Surface>
    </div>
  );
}
