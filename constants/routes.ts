export const ROUTES = {
  HOME: "/",
  STYLE_GUIDE: "/style-guide",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
