import { Eye, EyeOff } from "lucide-react";

const ICONS = {
  mail: "✉️",
  lock: "🔒",
  user: "👤",
  "user-check": "✅",
  menu: "☰",
  x: "✕",
  "log-out": "↩",
  "bar-chart-3": "📊",
  heart: "♥",
  search: "🔎",
  filter: "⚙️",
  star: "⭐",
  users: "👥",
  clock: "🕒",
  "book-open": "📘",
  "shopping-cart": "🛒",
  plus: "➕",
  "edit-2": "✏️",
  "trash-2": "🗑️",
  "arrow-right": "➜",
  trophy: "🏆",
  zap: "⚡",
  eye: Eye,
  "eye-off": EyeOff,
};

export default function AppIcon({ name = "user", className = "" }) {
  const icon = ICONS[name];

  if (name === "eye") {
    return (
      <Eye
        className={`inline-flex items-center justify-center ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (name === "eye-off") {
    return (
      <EyeOff
        className={`inline-flex items-center justify-center ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center ${className}`}
    >
      {icon || "•"}
    </span>
  );
}
