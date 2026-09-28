export const priorityRecord: Record<string, string> = {
  LOW: "Niski",
  MEDIUM: "Średni",
  HIGH: "Wysoki",
  URGENT: "Nagły",
};

export const setStyle = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "SLATE";

    case "MEDIUM":
      return "YELLOW";

    case "HIGH":
      return "ORANGE";

    case "URGENT":
      return "RED";

    default:
      return "bg-muted text-muted-foreground";
  }
};
