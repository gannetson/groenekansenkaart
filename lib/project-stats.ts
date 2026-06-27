const DUTCH_MONTHS = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

export function formatDeliveryDate(month: number, year: number): string {
  const name = DUTCH_MONTHS[month - 1] ?? "";
  return `${name} ${year}`;
}

export function generateProjectStats(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash);

  const now = new Date();
  const monthsBack = h % 24;
  const delivery = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);

  return {
    deliveryMonth: delivery.getMonth() + 1,
    deliveryYear: delivery.getFullYear(),
    treesAdded: h % 6,
    squareMetersGreen: 5 + (h % 146),
  };
}

export type ProjectStats = {
  deliveryMonth: number;
  deliveryYear: number;
  treesAdded: number;
  squareMetersGreen: number;
};

export function parseProjectStatsFromForm(formData: FormData): ProjectStats {
  return {
    deliveryMonth: parseInt(formData.get("deliveryMonth") as string, 10),
    deliveryYear: parseInt(formData.get("deliveryYear") as string, 10),
    treesAdded: parseInt(formData.get("treesAdded") as string, 10),
    squareMetersGreen: parseInt(formData.get("squareMetersGreen") as string, 10),
  };
}
