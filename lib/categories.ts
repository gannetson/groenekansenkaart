export const CATEGORIES = [
  { id: "natuur", label: "Natuur", color: "#4CAF50", icon: "🌿" },
  { id: "water", label: "Water", color: "#4DA6D9", icon: "💧" },
  { id: "ontmoeting", label: "Ontmoeting", color: "#FFC857", icon: "👥" },
  { id: "biodiversiteit", label: "Biodiversiteit", color: "#9B7ED9", icon: "🐦" },
  { id: "gezondheid", label: "Gezondheid", color: "#E57373", icon: "❤️" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function getCategoryForProject(projectId: string) {
  let hash = 0;
  for (let i = 0; i < projectId.length; i++) {
    hash = projectId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CATEGORIES[Math.abs(hash) % CATEGORIES.length];
}
