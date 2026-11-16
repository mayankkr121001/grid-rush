// Curated vibrant, accessible colors that contrast well against dark backgrounds
export const PLAYER_COLORS: string[] = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#A855F7', // Violet
  '#E11D48', // Rose
  '#6366F1', // Indigo
  '#84CC16', // Lime
];

export const getRandomColor = (): string => {
  const index = Math.floor(Math.random() * PLAYER_COLORS.length);
  return PLAYER_COLORS[index];
};

