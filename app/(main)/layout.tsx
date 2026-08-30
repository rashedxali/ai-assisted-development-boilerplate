import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";
import { AppProviders } from "@/providers/app-providers";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <Header />
      {children}
      <Footer />
    </AppProviders>
  );
}
