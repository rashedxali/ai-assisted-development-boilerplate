import { Button } from "@/components/globals/buttons/button";
import { BodyText } from "@/components/globals/typography/body-text";
import HeadingText from "@/components/globals/typography/heading-text";
import { LeadText } from "@/components/globals/typography/lead-text";
import {
  Bot,
  GitBranch,
  GitPullRequest,
  Layers,
  Shield,
  Workflow,
} from "lucide-react";

const workflowStates = [
  { name: "Planning", detail: "Spec, plan, user approval" },
  { name: "Developing", detail: "Developer agent implements with lint" },
  { name: "Reviewing", detail: "Reviewer runs diff, build, and checks" },
  { name: "Committing", detail: "Commit and push on feature branch" },
  { name: "Blocked", detail: "Pause for user decisions" },
  { name: "Complete", detail: "Feature ready for your review" },
] as const;

const stackItems = [
  { label: "Next.js 16", detail: "App Router, React 19, TypeScript strict" },
  { label: "Cursor Hooks", detail: "State machine enforced in the agent loop" },
  { label: "Feature Team CLI", detail: "Lead, developer, and reviewer agents" },
  { label: "Husky + rules/", detail: "Lint, typecheck, build, and engineering standards" },
] as const;

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
        {icon}
      </div>
      <HeadingText as="h3" variant="24l">
        {title}
      </HeadingText>
      <BodyText variant="16r" className="text-muted-foreground">
        {description}
      </BodyText>
    </article>
  );
}

export function Homepage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-20 md:py-28">
          <div className="flex flex-col gap-4">
            <LeadText variant="16b" className="text-muted-foreground">
              Next.js + Cursor
            </LeadText>
            <HeadingText as="h1" variant="44l">
              Agent-driven development
            </HeadingText>
            <BodyText variant="16r" className="max-w-2xl text-muted-foreground">
              A reference repo for building features with a hook-driven workflow:
              a lead coordinates planning and state transitions, a developer
              implements, and a reviewer gates quality before anything reaches{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm">main</code>.
            </BodyText>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button href="#workflow">Explore workflow</Button>
            <Button
              href="#getting-started"
              className="border border-border bg-background text-foreground hover:bg-muted hover:text-foreground"
              icon={false}
            >
              Get started
            </Button>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-b border-border bg-muted/30">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-20">
          <div className="flex flex-col gap-3">
            <HeadingText as="h2" variant="34l">
              Six-state feature team
            </HeadingText>
            <BodyText variant="16r" className="max-w-2xl text-muted-foreground">
              Every session follows the same state machine. Hooks enforce the
              rules so agents cannot skip review or push directly to production.
            </BodyText>
          </div>

          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflowStates.map((state, index) => (
              <li
                key={state.name}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-5"
              >
                <BodyText variant="14m" className="text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </BodyText>
                <HeadingText as="h3" variant="24l">
                  {state.name}
                </HeadingText>
                <BodyText variant="14r" className="text-muted-foreground">
                  {state.detail}
                </BodyText>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-20">
          <div className="flex flex-col gap-3">
            <HeadingText as="h2" variant="34l">
              What this repo includes
            </HeadingText>
            <BodyText variant="16r" className="max-w-2xl text-muted-foreground">
              Opinionated tooling for agentic workflows — not a generic framework,
              but a working example you can run locally today.
            </BodyText>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FeatureCard
              icon={<Workflow className="h-5 w-5" />}
              title="Hook-driven enforcement"
              description="Cursor hooks block commits during development, stop the lead outside BLOCKED or COMPLETE, and guard pushes to main."
            />
            <FeatureCard
              icon={<Bot className="h-5 w-5" />}
              title="Three-agent team"
              description="Lead orchestrates via CLI transitions. Developer and reviewer run as cursor-agent subprocesses with isolated prompts."
            />
            <FeatureCard
              icon={<GitBranch className="h-5 w-5" />}
              title="Branch-only delivery"
              description="All changes flow through feature branches. Husky pre-commit, pre-push, and pre-merge-commit hooks back up the rules."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Engineering rules"
              description="Mandatory globals for typography, buttons, and inputs. Performance, a11y, and security standards live in rules/."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-20">
          <div className="flex flex-col gap-3">
            <HeadingText as="h2" variant="34l">
              Stack
            </HeadingText>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {stackItems.map((item) => (
              <li
                key={item.label}
                className="flex items-start gap-3 rounded-2xl border border-border bg-background p-5"
              >
                <Layers className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  <BodyText variant="16m">{item.label}</BodyText>
                  <BodyText variant="14r" className="text-muted-foreground">
                    {item.detail}
                  </BodyText>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="getting-started">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-20">
          <div className="flex flex-col gap-3">
            <HeadingText as="h2" variant="34l">
              Getting started
            </HeadingText>
            <BodyText variant="16r" className="max-w-2xl text-muted-foreground">
              Run the dev server, then start a feature team session in Cursor
              with{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                /start-feature-team
              </code>
              .
            </BodyText>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <GitPullRequest className="h-5 w-5 text-muted-foreground" />
                <BodyText variant="16m">Start a feature session</BodyText>
              </div>
              <BodyText variant="14r" className="mt-2 text-muted-foreground">
                Open Cursor and run{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                  /start-feature-team
                </code>{" "}
                from the command palette.
              </BodyText>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <BodyText variant="16m">Local commands</BodyText>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-muted p-4 text-sm leading-6">
                {`bun run dev\nbun run feature-team inspect\nbun run lint && bun run typecheck`}
              </pre>
            </div>
          </div>

          <BodyText variant="14r" className="text-muted-foreground">
            Read{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              rules/getting-started.md
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">AGENTS.md</code>
            , and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              .cursor/feature-team/
            </code>{" "}
            for project conventions and workflow config.
          </BodyText>
        </div>
      </section>
    </div>
  );
}
