type AvatarProps = {
  emoji: string;
  color: string;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASSES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-9 w-9 text-base",
  md: "h-14 w-14 text-2xl",
  lg: "h-16 w-16 text-3xl",
};

export function Avatar({ emoji, color, size = "md" }: AvatarProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full shadow-sm ${SIZE_CLASSES[size]}`}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {emoji}
    </span>
  );
}
