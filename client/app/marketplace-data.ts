export type ProductKind =
  | "headphones"
  | "bike"
  | "laptop"
  | "phone"
  | "desk"
  | "camera"
  | "keyboard"
  | "speaker";

export type Product = {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  kind: ProductKind;
  price: string;
  condition: string;
  location: string;
  posted: string;
  description: string;
  longDescription: string;
  highlights: string[];
  specs: Array<{ label: string; value: string }>;
  tags: string[];
  seller: {
    name: string;
    verified: boolean;
    response: string;
    rating: string;
    location: string;
  };
  stats: {
    views: string;
    chats: string;
  };
  palette: {
    light: string;
    mid: string;
    dark: string;
  };
  image: string;
};

export type Conversation = {
  id: string;
  name: string;
  productSlug: string;
  productTitle: string;
  updatedAt: string;
  price: string;
  status: string;
  snippet: string;
  messages: Array<{
    id: string;
    from: "buyer" | "seller";
    text: string;
    time: string;
  }>;
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function productArt(kind: ProductKind, title: string) {
  const label = escapeXml(title);
  const shared = `
    <defs>
      <linearGradient id="bg" x1="120" y1="60" x2="1080" y2="840" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#ffffff" />
      </linearGradient>
    </defs>
    <rect width="1200" height="900" rx="72" fill="url(#bg)" />
    <rect x="72" y="72" width="1056" height="756" rx="48" fill="none" stroke="#111111" stroke-opacity="0.14" />
    <text x="88" y="122" fill="#111111" font-family="Geist, Arial, sans-serif" font-size="28" letter-spacing="3">${label}</text>
  `;

  const silhouettes: Record<ProductKind, string> = {
    headphones: `
      <path d="M330 362c0-150 120-270 270-270s270 120 270 270" fill="none" stroke="#111111" stroke-width="46" stroke-linecap="round"/>
      <rect x="246" y="380" width="160" height="246" rx="56" fill="#111111" />
      <rect x="794" y="380" width="160" height="246" rx="56" fill="#111111" />
      <rect x="280" y="416" width="92" height="168" rx="42" fill="#ffffff" />
      <rect x="828" y="416" width="92" height="168" rx="42" fill="#ffffff" />
      <rect x="438" y="520" width="324" height="30" rx="15" fill="#111111" />
    `,
    bike: `
      <circle cx="340" cy="646" r="120" fill="none" stroke="#111111" stroke-width="30" />
      <circle cx="852" cy="646" r="120" fill="none" stroke="#111111" stroke-width="30" />
      <path d="M340 646 510 466 662 646 852 646" fill="none" stroke="#111111" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M510 466h120l64 180" fill="none" stroke="#111111" stroke-width="30" stroke-linecap="round"/>
      <rect x="500" y="356" width="92" height="92" rx="30" fill="#111111" />
    `,
    laptop: `
      <rect x="286" y="216" width="628" height="410" rx="44" fill="#111111" />
      <rect x="336" y="268" width="528" height="286" rx="28" fill="#ffffff" />
      <rect x="220" y="648" width="760" height="72" rx="28" fill="#111111" />
      <path d="M362 718h476" stroke="#ffffff" stroke-width="18" stroke-linecap="round"/>
    `,
    phone: `
      <rect x="394" y="142" width="412" height="616" rx="72" fill="#111111" />
      <rect x="452" y="212" width="296" height="444" rx="36" fill="#ffffff" />
      <circle cx="600" cy="694" r="26" fill="#ffffff" />
    `,
    desk: `
      <rect x="240" y="318" width="720" height="108" rx="32" fill="#111111" />
      <rect x="306" y="426" width="54" height="302" rx="24" fill="#111111" />
      <rect x="840" y="426" width="54" height="302" rx="24" fill="#111111" />
      <rect x="416" y="460" width="368" height="40" rx="20" fill="#ffffff" />
      <rect x="466" y="540" width="86" height="112" rx="24" fill="#ffffff" />
      <rect x="650" y="540" width="86" height="112" rx="24" fill="#ffffff" />
    `,
    camera: `
      <rect x="250" y="250" width="700" height="420" rx="88" fill="#111111" />
      <rect x="338" y="182" width="190" height="96" rx="34" fill="#111111" />
      <circle cx="608" cy="466" r="146" fill="#ffffff" />
      <circle cx="608" cy="466" r="108" fill="#111111" />
      <circle cx="608" cy="466" r="64" fill="#ffffff" />
      <rect x="760" y="324" width="112" height="76" rx="28" fill="#ffffff" />
    `,
    keyboard: `
      <rect x="170" y="330" width="860" height="296" rx="58" fill="#111111" />
      <g fill="#ffffff">
        <rect x="248" y="398" width="104" height="68" rx="20" />
        <rect x="370" y="398" width="104" height="68" rx="20" />
        <rect x="492" y="398" width="104" height="68" rx="20" />
        <rect x="614" y="398" width="104" height="68" rx="20" />
        <rect x="736" y="398" width="104" height="68" rx="20" />
        <rect x="858" y="398" width="104" height="68" rx="20" />
        <rect x="306" y="494" width="548" height="44" rx="18" />
      </g>
    `,
    speaker: `
      <rect x="348" y="174" width="504" height="612" rx="90" fill="#111111" />
      <circle cx="600" cy="364" r="112" fill="#ffffff" />
      <circle cx="600" cy="364" r="72" fill="#111111" />
      <circle cx="600" cy="590" r="134" fill="#ffffff" />
      <circle cx="600" cy="590" r="90" fill="#111111" />
      <rect x="520" y="760" width="160" height="20" rx="10" fill="#111111" />
    `,
  };

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" fill="none" role="img" aria-label="${label}">
      ${shared}
      ${silhouettes[kind]}
      <text x="88" y="806" fill="#111111" font-family="Geist, Arial, sans-serif" font-size="42" font-weight="600">${label}</text>
      <text x="88" y="846" fill="#111111" fill-opacity="0.68" font-family="Geist, Arial, sans-serif" font-size="22" letter-spacing="1.4">Local resale preview</text>
    </svg>
  `)}`;
}

export const products: Product[] = [
  {
    slug: "sony-wh-1000xm5",
    title: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    categorySlug: "electronics",
    kind: "headphones",
    price: "₹18,999",
    condition: "Like new",
    location: "Bengaluru",
    posted: "2 hours ago",
    description:
      "Premium noise cancelling headphones with clean sound, original box, and barely used ear pads.",
    longDescription:
      "A good fit for long commutes, work calls, and focused listening. The seller kept the headphones in a hard case and used them only a handful of times. Battery health is excellent, all cables are included, and the original packing is available for pickup.",
    highlights: [
      "Active noise cancellation",
      "Original charging cable included",
      "Clean, scratch-free finish",
    ],
    specs: [
      { label: "Condition", value: "Like new" },
      { label: "Warranty", value: "Not available" },
      { label: "Accessories", value: "Case, cable, box" },
      { label: "Pickup", value: "Today in Indiranagar" },
    ],
    tags: ["Verified seller", "Open to offers", "Fast pickup"],
    seller: {
      name: "Aarav Mehta",
      verified: true,
      response: "Usually replies in 14 mins",
      rating: "4.9/5",
      location: "Indiranagar, Bengaluru",
    },
    stats: {
      views: "1.2k",
      chats: "34",
    },
    palette: {
      light: "#f5f4f1",
      mid: "#b7b7b1",
      dark: "#565656",
    },
    image: "/headphones.png",
  },
  {
    slug: "royal-enfield-classic-350",
    title: "Royal Enfield Classic 350",
    category: "Vehicles",
    categorySlug: "vehicles",
    kind: "bike",
    price: "₹1,72,000",
    condition: "Excellent",
    location: "Pune",
    posted: "5 hours ago",
    description:
      "Well maintained cruiser with new tyres, service records, and a calm riding feel for city or highway runs.",
    longDescription:
      "Single-owner bike with clean papers and regular service history. The seller is looking for a serious buyer and is open to inspection at a nearby service point. The bike starts easily, rides smoothly, and has been kept covered.",
    highlights: [
      "Single owner",
      "Service history available",
      "New tyres fitted",
    ],
    specs: [
      { label: "Year", value: "2022" },
      { label: "Odometer", value: "8,300 km" },
      { label: "Fuel", value: "Petrol" },
      { label: "RTO", value: "MH-12" },
    ],
    tags: ["Verified papers", "Test ride available", "Negotiable"],
    seller: {
      name: "Nikhil Patil",
      verified: true,
      response: "Usually replies in 21 mins",
      rating: "4.8/5",
      location: "Kharadi, Pune",
    },
    stats: {
      views: "980",
      chats: "19",
    },
    palette: {
      light: "#f7f5f0",
      mid: "#beb8ad",
      dark: "#606060",
    },
    image: "/royal-enfield.png",
  },
  {
    slug: "macbook-air-m2",
    title: "MacBook Air M2 512GB",
    category: "Electronics",
    categorySlug: "electronics",
    kind: "laptop",
    price: "₹79,500",
    condition: "Excellent",
    location: "Delhi",
    posted: "1 day ago",
    description:
      "Slim 13-inch MacBook with a bright screen, silent performance, and enough storage for creative work.",
    longDescription:
      "This machine has been used for college work and light editing. It includes the original charger, and the battery cycle count is low. Ideal for students, freelancers, or anyone who wants a compact everyday laptop without paying new-device prices.",
    highlights: [
      "Low battery cycles",
      "Original charger included",
      "No dents or scratches",
    ],
    specs: [
      { label: "Chip", value: "Apple M2" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "512 GB SSD" },
      { label: "Display", value: "13.6 inch" },
    ],
    tags: ["Fast shipping", "Open to meetup", "Best for students"],
    seller: {
      name: "Sara Khan",
      verified: true,
      response: "Usually replies in 9 mins",
      rating: "5.0/5",
      location: "South Delhi",
    },
    stats: {
      views: "1.5k",
      chats: "41",
    },
    palette: {
      light: "#f3f1ed",
      mid: "#b5b2ab",
      dark: "#66635f",
    },
    image: "/macbook.png"
  },
  {
    slug: "iphone-14-128gb",
    title: "iPhone 14 128GB",
    category: "Electronics",
    categorySlug: "electronics",
    kind: "phone",
    price: "₹49,900",
    condition: "Very good",
    location: "Hyderabad",
    posted: "3 hours ago",
    description:
      "Unlocked iPhone in very good condition with battery health above 90% and a clean display.",
    longDescription:
      "This phone has been used with a case and screen guard from day one. It is fully functional, unlocked, and ready for a quick handoff. The seller can share extra photos, IMEI details, and a short video on request.",
    highlights: [
      "Battery health above 90%",
      "Unlocked for all carriers",
      "Protected with case and glass",
    ],
    specs: [
      { label: "Storage", value: "128 GB" },
      { label: "Color", value: "Midnight" },
      { label: "Battery", value: "92%" },
      { label: "Condition", value: "Very good" },
    ],
    tags: ["Quick deal", "Genuine photos", "Open to chat"],
    seller: {
      name: "Imran Ali",
      verified: true,
      response: "Usually replies in 11 mins",
      rating: "4.9/5",
      location: "Gachibowli, Hyderabad",
    },
    stats: {
      views: "1.9k",
      chats: "52",
    },
    palette: {
      light: "#f7f6f2",
      mid: "#b9b6af",
      dark: "#64615c",
    },
    image: "/iPhone.png"
  },
  {
    slug: "ikea-hemnes-desk",
    title: "IKEA HEMNES Study Desk",
    category: "Home",
    categorySlug: "home",
    kind: "desk",
    price: "₹8,200",
    condition: "Good",
    location: "Ahmedabad",
    posted: "6 hours ago",
    description:
      "Compact study desk with a clean top, storage space, and a minimal profile that fits small rooms.",
    longDescription:
      "A practical desk for students or home offices. There are a few light marks on the surface, but the structure is solid and stable. The buyer can collect it disassembled or request a local pickup assistance option.",
    highlights: [
      "Solid structure",
      "Easy to place in small rooms",
      "Clean matte finish",
    ],
    specs: [
      { label: "Material", value: "Solid wood" },
      { label: "Width", value: "120 cm" },
      { label: "Condition", value: "Good" },
      { label: "Pickup", value: "Ground floor" },
    ],
    tags: ["Furniture", "Home office", "Pickup only"],
    seller: {
      name: "Priya Shah",
      verified: false,
      response: "Usually replies in 32 mins",
      rating: "4.7/5",
      location: "Navrangpura, Ahmedabad",
    },
    stats: {
      views: "610",
      chats: "14",
    },
    palette: {
      light: "#f7f4ef",
      mid: "#bdb5a7",
      dark: "#615950",
    },
    image: "/desk.png"
  },
  {
    slug: "nikon-z50-kit",
    title: "Nikon Z50 Mirrorless Kit",
    category: "Camera",
    categorySlug: "camera",
    kind: "camera",
    price: "₹54,000",
    condition: "Excellent",
    location: "Kolkata",
    posted: "4 hours ago",
    description:
      "A clean mirrorless setup with the kit lens, battery, charger, and a bag for creators on the move.",
    longDescription:
      "Ideal for travel, portraits, and social content. The camera has been used gently and cleaned after every shoot. The seller is happy to show sample images and a short video of the body, lens, and sensor condition.",
    highlights: [
      "Kit lens included",
      "Sensor and lens cleaned",
      "Travel bag included",
    ],
    specs: [
      { label: "Sensor", value: "APS-C" },
      { label: "Lens", value: "16-50mm" },
      { label: "Condition", value: "Excellent" },
      { label: "Shutter count", value: "Low" },
    ],
    tags: ["Creative gear", "Bundle deal", "Verified seller"],
    seller: {
      name: "Rahul Basu",
      verified: true,
      response: "Usually replies in 16 mins",
      rating: "4.9/5",
      location: "Salt Lake, Kolkata",
    },
    stats: {
      views: "870",
      chats: "23",
    },
    palette: {
      light: "#f3f2ee",
      mid: "#bbb7af",
      dark: "#5f5c58",
    },
    image: "/camera.png"
  },
  {
    slug: "yamaha-psr-e373",
    title: "Yamaha PSR-E373 Keyboard",
    category: "Music",
    categorySlug: "music",
    kind: "keyboard",
    price: "₹11,000",
    condition: "Very good",
    location: "Chennai",
    posted: "1 day ago",
    description:
      "Portable keyboard with adapter, stand, and clean keys. Great for practice and early stage home recording.",
    longDescription:
      "The keyboard is in excellent playing condition with all keys and functions working perfectly. It has been used indoors only and stored carefully. The buyer gets a stand and power adapter, so it is ready to use right away.",
    highlights: [
      "Stand and adapter included",
      "All keys working",
      "Good for practice",
    ],
    specs: [
      { label: "Keys", value: "61" },
      { label: "Mode", value: "Portable" },
      { label: "Condition", value: "Very good" },
      { label: "Location", value: "Adyar" },
    ],
    tags: ["Music gear", "Ready to play", "Best offer"],
    seller: {
      name: "Anita Reddy",
      verified: true,
      response: "Usually replies in 18 mins",
      rating: "4.8/5",
      location: "Adyar, Chennai",
    },
    stats: {
      views: "530",
      chats: "12",
    },
    palette: {
      light: "#f6f4ef",
      mid: "#bcb6aa",
      dark: "#605c55",
    },
    image: productArt("keyboard", "Yamaha PSR-E373 Keyboard")
  },
  {
    slug: "marshall-acton-iii",
    title: "Marshall Acton III Speaker",
    category: "Audio",
    categorySlug: "audio",
    kind: "speaker",
    price: "₹21,500",
    condition: "Excellent",
    location: "Mumbai",
    posted: "8 hours ago",
    description:
      "Compact speaker with warm sound, iconic styling, and a neat shelf-friendly footprint.",
    longDescription:
      "This speaker is a clean, well-kept unit with no crackle and no cosmetic damage. It has been used in a smoke-free room and pairs quickly with phones or laptops. The seller can share a demo video before the meetup.",
    highlights: [
      "Warm room-filling sound",
      "No cosmetic damage",
      "Demo video available",
    ],
    specs: [
      { label: "Connectivity", value: "Bluetooth" },
      { label: "Use", value: "Indoor" },
      { label: "Condition", value: "Excellent" },
      { label: "Pickup", value: "Bandra" },
    ],
    tags: ["Audio", "Demo ready", "Verified seller"],
    seller: {
      name: "Karan Desai",
      verified: true,
      response: "Usually replies in 13 mins",
      rating: "4.9/5",
      location: "Bandra, Mumbai",
    },
    stats: {
      views: "740",
      chats: "28",
    },
    palette: {
      light: "#f5f4ef",
      mid: "#bab4a7",
      dark: "#5d5952",
    },
    image: productArt("speaker", "Marshall Acton III Speaker")
  },
];

export const featuredProducts = products.slice(0, 6);

export const categories = [
  { label: "Electronics", slug: "electronics", detail: "Phones, laptops, audio, and accessories." },
  { label: "Vehicles", slug: "vehicles", detail: "Bikes and cars with clean paperwork." },
  { label: "Home", slug: "home", detail: "Furniture, decor, and daily-use essentials." },
  { label: "Camera", slug: "camera", detail: "Creators gear, lenses, and kits." },
  { label: "Music", slug: "music", detail: "Keyboards, amps, and studio basics." },
  { label: "Audio", slug: "audio", detail: "Speakers, headphones, and sound gear." },
];

export const marketplaceStats = [
  { label: "Active listings", value: "12.4K" },
  { label: "Avg. response", value: "< 15 min" },
  { label: "Local cities", value: "120+" },
];

export const trustCards = [
  {
    title: "Verified sellers",
    text: "Profile badges, response times, and ratings help buyers pick with confidence.",
  },
  {
    title: "Direct chat",
    text: "Ask questions, request more photos, and negotiate without leaving the listing.",
  },
  {
    title: "Safe handoff",
    text: "Meet nearby, inspect the item, and confirm the deal before you pay.",
  },
];

export const sellSteps = [
  {
    title: "Create your listing",
    text: "Add photos, price, condition, and a clear description in one focused flow.",
  },
  {
    title: "Chat with buyers",
    text: "Answer questions, share extra details, and negotiate the final price.",
  },
  {
    title: "Close the deal",
    text: "Choose pickup, delivery, or meetup and complete the sale locally.",
  },
];

export const authHighlights = [
  "Saved searches and favorite listings",
  "Seller dashboard with active ads",
  "Order tracking and chat history",
];

export const sellChecklist = [
  "At least 3 clear photos",
  "Exact condition and brand",
  "Pickup location or shipping note",
  "Honest pricing for faster replies",
];

export const conversations: Conversation[] = [
  {
    id: "sony-wh-1000xm5",
    name: "Aarav Mehta",
    productSlug: "sony-wh-1000xm5",
    productTitle: "Sony WH-1000XM5 Headphones",
    updatedAt: "2 mins ago",
    price: "₹18,999",
    status: "Active",
    snippet: "Can you share the original bill and confirm battery health?",
    messages: [
      {
        id: "m1",
        from: "buyer",
        text: "Hi, are these still available?",
        time: "10:12 AM",
      },
      {
        id: "m2",
        from: "seller",
        text: "Yes, they are. I can share more photos and the bill if you want.",
        time: "10:14 AM",
      },
      {
        id: "m3",
        from: "buyer",
        text: "Great. Can we meet near Indiranagar metro today?",
        time: "10:18 AM",
      },
      {
        id: "m4",
        from: "seller",
        text: "That works. The headphones are packed and ready for pickup.",
        time: "10:19 AM",
      },
    ],
  },
  {
    id: "iphone-14-128gb",
    name: "Imran Ali",
    productSlug: "iphone-14-128gb",
    productTitle: "iPhone 14 128GB",
    updatedAt: "18 mins ago",
    price: "₹49,900",
    status: "Negotiating",
    snippet: "Would you consider ₹47,500 if I pick it up this evening?",
    messages: [
      {
        id: "m1",
        from: "buyer",
        text: "Any scratches on the screen or frame?",
        time: "09:40 AM",
      },
      {
        id: "m2",
        from: "seller",
        text: "No scratches. It has been used with a case and screen guard only.",
        time: "09:45 AM",
      },
      {
        id: "m3",
        from: "buyer",
        text: "Nice. Can you share battery health and box photos?",
        time: "09:52 AM",
      },
    ],
  },
  {
    id: "marshall-acton-iii",
    name: "Karan Desai",
    productSlug: "marshall-acton-iii",
    productTitle: "Marshall Acton III Speaker",
    updatedAt: "1 hour ago",
    price: "₹21,500",
    status: "New inquiry",
    snippet: "Can you send a short demo video so I can hear the sound?",
    messages: [
      {
        id: "m1",
        from: "buyer",
        text: "Does the speaker have any crackling at high volume?",
        time: "08:15 AM",
      },
      {
        id: "m2",
        from: "seller",
        text: "No crackling. I can send a short video demo right now.",
        time: "08:17 AM",
      },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getConversationById(id: string) {
  return conversations.find((conversation) => conversation.id === id);
}

export function getCategoryLabel(slug: string) {
  return categories.find((category) => category.slug === slug)?.label ?? "All";
}

export type NewListingInput = {
  title: string;
  price: string;
  category: string;
  condition: string;
  location: string;
  description: string;
  sellerName: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferKind(title: string, category: string): ProductKind {
  const text = `${title} ${category}`.toLowerCase();

  if (text.includes("headphone") || text.includes("earbud") || text.includes("audio")) {
    return "headphones";
  }
  if (text.includes("bike") || text.includes("scooter") || text.includes("royal")) {
    return "bike";
  }
  if (text.includes("laptop") || text.includes("macbook") || text.includes("computer")) {
    return "laptop";
  }
  if (text.includes("phone") || text.includes("iphone") || text.includes("mobile")) {
    return "phone";
  }
  if (text.includes("desk") || text.includes("table") || text.includes("chair")) {
    return "desk";
  }
  if (text.includes("camera") || text.includes("dslr") || text.includes("lens")) {
    return "camera";
  }
  if (text.includes("keyboard") || text.includes("piano") || text.includes("synth")) {
    return "keyboard";
  }

  return "speaker";
}

function paletteFor(kind: ProductKind) {
  switch (kind) {
    case "headphones":
      return { light: "#f3f2ef", mid: "#b9b4aa", dark: "#5d5a54" };
    case "bike":
      return { light: "#f5f3ef", mid: "#bdb6ab", dark: "#655f57" };
    case "laptop":
      return { light: "#f4f2ee", mid: "#b8b4ad", dark: "#5f5c57" };
    case "phone":
      return { light: "#f5f4f1", mid: "#bcb7ae", dark: "#67615a" };
    case "desk":
      return { light: "#f5f1ea", mid: "#b8b0a2", dark: "#625b52" };
    case "camera":
      return { light: "#f2f1ed", mid: "#bbb6ad", dark: "#5f5b56" };
    case "keyboard":
      return { light: "#f4f2ec", mid: "#b9b3a8", dark: "#615c55" };
    case "speaker":
    default:
      return { light: "#f4f2ec", mid: "#bab4a8", dark: "#5e5952" };
  }
}

export function buildListingFromInput(input: NewListingInput): Product {
  const kind = inferKind(input.title, input.category);
  const cleanTitle = input.title.trim();
  const slug = `${slugify(cleanTitle)}-${Date.now().toString(36)}`;
  const palette = paletteFor(kind);

  return {
    slug,
    title: cleanTitle,
    category: input.category.trim() || "General",
    categorySlug: slugify(input.category || "general"),
    kind,
    price: input.price.trim(),
    condition: input.condition.trim() || "Good",
    location: input.location.trim() || "Your city",
    posted: "Just now",
    description: input.description.trim(),
    longDescription: input.description.trim(),
    highlights: [
      input.condition.trim() || "Good condition",
      "Posted by a real seller",
      "Open to direct chat",
    ],
    specs: [
      { label: "Condition", value: input.condition.trim() || "Good" },
      { label: "Location", value: input.location.trim() || "Your city" },
      { label: "Seller", value: input.sellerName.trim() || "You" },
      { label: "Listing", value: "New" },
    ],
    tags: ["New listing", "Direct chat", "Pickup ready"],
    seller: {
      name: input.sellerName.trim() || "You",
      verified: false,
      response: "Replies when online",
      rating: "New seller",
      location: input.location.trim() || "Your city",
    },
    stats: {
      views: "0",
      chats: "0",
    },
    palette,
    image: productArt(kind, cleanTitle),
  };
}
