export interface StatQueryOptions {
  stat: string; // Ej: "points", "wins", "podiums"
  nationality?: string;
  fromYear?: number;
  toYear?: number;
  seasonYear?: number;
  limit?: number;
  order?: "ASC" | "DESC";
  team?: string;
}
