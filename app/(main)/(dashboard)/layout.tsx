type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r">Sidebar</aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
