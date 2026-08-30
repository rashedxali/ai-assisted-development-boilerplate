import Link from "next/link";
import { BodyText } from "@/components/globals/typography/body-text";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <BodyText variant="14r" className="text-muted-foreground">
          © {new Date().getFullYear()} Boilerplate. All rights reserved.
        </BodyText>
        <div className="flex items-center gap-6">
          <Link href="/privacy-policy">
            <BodyText
              variant="14r"
              className="text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
            >
              Privacy Policy
            </BodyText>
          </Link>
          <Link href="/terms">
            <BodyText
              variant="14r"
              className="text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
            >
              Terms
            </BodyText>
          </Link>
        </div>
      </div>
    </footer>
  );
}
