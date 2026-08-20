export const REACTIONS = ["❤️", "🌱", "😲", "👏"] as const;
export type ReactionEmoji = (typeof REACTIONS)[number];

export const AVATAR_COLORS = [
  { name: "Terracota", value: "#c1502e" },
  { name: "Oliva", value: "#767a2e" },
  { name: "Ciruela", value: "#5c3a82" },
  { name: "Esmeralda", value: "#1f6e5c" },
  { name: "Berenjena", value: "#8a2856" },
  { name: "Ambar", value: "#a85c14" },
  { name: "Noche", value: "#2f3a52" },
] as const;

export const AVATAR_EMOJIS = [
  "🌻", "🐢", "🎨", "🌙", "✨", "🌊", "🔥", "🍃", "🌸", "⭐", "🍄", "🦋",
] as const;

export const SESSION_COOKIE = "mers_session";
export const ADMIN_COOKIE = "mers_admin_session";
export const SESSION_MAX_AGE_DAYS = 60;
export const ADMIN_MAX_AGE_HOURS = 12;
export const ENTRY_MAX_LENGTH = 500;
