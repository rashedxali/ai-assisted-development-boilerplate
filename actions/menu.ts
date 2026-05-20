export type MenuItem = {
  title: string;
  url: string;
  target?: string | null;
  children: MenuItem[];
};
