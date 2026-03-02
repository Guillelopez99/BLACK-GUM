export function parseInteger(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export function parseStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item)).filter(Boolean);
      }
    } catch {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [] as string[];
}

export function parseDeliverables(value: string | null) {
  if (!value) return [] as string[];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item)).filter(Boolean);
    }
  } catch {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

const RENTAL_CATEGORIES = ["camera", "lens", "audio", "lighting", "grip", "other"] as const;

export type RentalCategory = (typeof RENTAL_CATEGORIES)[number];

export function parseRentalCategory(value: unknown): RentalCategory | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return RENTAL_CATEGORIES.includes(normalized as RentalCategory)
    ? (normalized as RentalCategory)
    : null;
}

const PROJECT_TYPES = ["social", "videoclip", "shortfilm", "film", "corporate"] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export function parseProjectType(value: unknown): ProjectType | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return PROJECT_TYPES.includes(normalized as ProjectType)
    ? (normalized as ProjectType)
    : null;
}

export function parsePublishedAt(value: unknown) {
  if (!value) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}
