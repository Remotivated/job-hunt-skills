// assets/animations/src/primitives/tokens.ts
export const colors = {
  navy:     '#1a2548',
  white:    '#ffffff',
  red:      '#d63846',
  lavender: '#b2b7c8',
  inkDark:  '#0f1530',
  inkSoft:  '#7a83a3',
} as const;

export const fonts = {
  headline: 'Inter Tight',
  body:     'Inter',
  mono:     'JetBrains Mono',
} as const;

export const timing = {
  fps:           30,
  beatDuration: 105, // frames = 3.5s at 30fps
  crossfade:     12, // 0.4s
  letterStagger:  2,
} as const;

export const layout = {
  safeMargin: 80, // px from edges in 16:9
  cornerRadius: 16,
} as const;
