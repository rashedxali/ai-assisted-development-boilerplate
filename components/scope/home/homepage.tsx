import HeadingText from "@/components/globals/typography/heading-text";
import { BodyText } from "@/components/globals/typography/body-text";
import { LeadText } from "@/components/globals/typography/lead-text";
import { Button } from "@/components/globals/buttons/button";

const STACK = [
  { label: "Framework", value: "Next.js 16 — App Router" },
  { label: "UI", value: "React 19" },
  { label: "Language", value: "TypeScript (strict)" },
  { label: "Styling", value: "Tailwind CSS v4" },
  { label: "Components", value: "shadcn/ui — radix-nova" },
  { label: "Linting", value: "ESLint + Commitlint + Husky" },
];

const STRUCTURE = [
  { path: "app/", description: "Routes, layouts, global CSS" },
  { path: "components/globals/", description: "Mandatory design system primitives" },
  { path: "components/ui/", description: "shadcn/ui base components" },
  { path: "components/layout/", description: "Header, footer, page chrome" },
  { path: "components/scope/", description: "Components owned by one parent" },
  { path: "components/common/", description: "Shared cross-cutting helpers" },
  { path: "hooks/", description: "Shared custom React hooks" },
  { path: "lib/", description: "Third-party library config" },
  { path: "utils/", description: "Pure stateless helpers" },
  { path: "types/", description: "Shared TypeScript types" },
  { path: "services/", description: "Domain logic and API calls" },
  { path: "providers/", description: "React context and query clients" },
  { path: "constants/", description: "App-wide constants" },
];

export function Homepage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-16 flex flex-col gap-20">
      <section className="flex flex-col gap-6 max-w-2xl">
        <HeadingText variant="44l">
          Next.js boilerplate
        </HeadingText>
        <LeadText variant="16l" className="text-muted-foreground">
          A structured starting point for Next.js App Router projects with a strict design system, enforced conventions, and AI-agent-ready rules.
        </LeadText>
        <div className="flex items-center gap-4">
          <Button
            href="https://github.com/rashedxali/agent-driven-development"
            icon={false}
            className="bg-muted text-foreground hover:bg-muted/80"
          >
            GitHub
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <HeadingText variant="24l" as="h2">
          Stack
        </HeadingText>
        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 bg-background p-5">
              <BodyText variant="12m" className="text-muted-foreground uppercase tracking-widest">
                {item.label}
              </BodyText>
              <BodyText variant="14m">{item.value}</BodyText>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <HeadingText variant="24l" as="h2">
          Folder structure
        </HeadingText>
        <div className="flex flex-col divide-y divide-border border border-border">
          {STRUCTURE.map((item) => (
            <div key={item.path} className="flex items-baseline justify-between gap-8 px-5 py-3">
              <code className="font-mono text-[13px] text-foreground shrink-0">
                {item.path}
              </code>
              <BodyText variant="14r" className="text-muted-foreground text-right">
                {item.description}
              </BodyText>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
