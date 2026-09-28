export const projectColors = [
  { value: "BLUE", color: "#3B82F6" },
  { value: "PURPLE", color: "#8B5CF6" },
  { value: "PINK", color: "#EC4899" },
  { value: "RED", color: "#EF4444" },
  { value: "ORANGE", color: "#F97316" },
  { value: "YELLOW", color: "#EAB308" },
  { value: "GREEN", color: "#22C55E" },
  { value: "TEAL", color: "#14B8A6" },
  { value: "CYAN", color: "#06B6D4" },
  { value: "SLATE", color: "#64748B" },
] as const;

export const colorRecord: Record<string, string> = {
  BLUE: "#3B82F6",
  PURPLE: "#8B5CF6",
  PINK: "#EC4899",
  RED: "#EF4444",
  ORANGE: "#F97316",
  YELLOW: "#EAB308",
  GREEN: "#22C55E",
  TEAL: "#14B8A6",
  CYAN: "#06B6D4",
  SLATE: "#64748B",
};
