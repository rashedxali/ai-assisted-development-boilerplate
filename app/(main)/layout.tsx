import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";
import { AppProviders } from "@/providers/app-providers";
import { WebVitals } from "@/components/globals/others/web-vitals";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <WebVitals />
      <Header />
      {children}
      <Footer />
    </AppProviders>
  );
}
