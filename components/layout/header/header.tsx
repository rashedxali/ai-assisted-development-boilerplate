import Link from "next/link";
import HeadingText from "@/components/globals/typography/heading-text";
import { BodyText } from "@/components/globals/typography/body-text";
import { ROUTES } from "@/constants/routes";

const NAV_LINKS = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Style Guide", href: ROUTES.STYLE_GUIDE },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={ROUTES.HOME}>
          <HeadingText variant="24l" as="p">
            Boilerplate
          </HeadingText>
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <BodyText
                variant="14m"
                className="text-foreground transition-colors duration-200 hover:text-muted-foreground"
              >
                {link.label}
              </BodyText>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
