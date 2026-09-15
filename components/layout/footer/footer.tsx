import { BodyText } from "@/components/globals/typography/body-text";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <BodyText variant="14r" className="text-muted-foreground">
          © {new Date().getFullYear()} AI-Assisted Development Boilerplate. All rights reserved.
        </BodyText>
      </div>
    </footer>
  );
}
