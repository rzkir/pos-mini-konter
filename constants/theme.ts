export const Fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
} as const;

export type FontKey = keyof typeof Fonts;
