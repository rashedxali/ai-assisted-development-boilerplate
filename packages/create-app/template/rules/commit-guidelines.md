# Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification to keep our git history clean, consistent, and easy to navigate.

---

## Format

```
type(scope)!: short description

[optional body]

[optional footer]
```

---

## Types

| Type | When to use |
|------|-------------|
| `feat` | A new feature — new page, component, API endpoint, etc. |
| `fix` | A bug fix — correcting broken behaviour |
| `feat!` / `fix!` | Breaking change — existing callers must update |
| `chore` | Maintenance — deps, config, tooling. No production code change |
| `refactor` | Code restructure — no new feature, no bug fix |
| `docs` | Documentation only — README, JSDoc, comments |
| `style` | Formatting, linting — no logic change |
| `test` | Adding or updating tests |
| `ci` | CI/CD pipeline changes — GitHub Actions, Vercel config |
| `perf` | Performance improvements |
| `wip` | Unfinished works or business |

---

## Scope (optional but recommended)

Use the part of the codebase you touched.

```
# React / Next.js
ui, auth, dashboard, api, layout, config

# Backend / shared
db, middleware, services, hooks
```

---

## Examples

```bash
# New feature
feat(auth): add Google OAuth login

# Bug fix
fix(api): handle null user in session middleware

# Breaking change with ! and footer
feat(api)!: rename /users to /accounts

BREAKING CHANGE: all clients must update endpoint from /users to /accounts

# Chore
chore: upgrade Next.js to v15

# Refactor
refactor(cart): extract pricing logic to utils

# With a body (explain why, not what)
fix(db): retry failed transactions on deadlock

Deadlocks were occurring under high concurrency on the orders table.
Added exponential backoff retry logic (max 3 attempts).

Refs: #214
```

---

## Rules

- Use **lowercase** for type and description
- Keep the description **under 72 characters** — be specific, not vague
- Use **imperative mood** — `add feature` not `added feature` or `adds feature`
- No period at the end of the description
- Body is optional — use it to explain *why*, not what
- **One logical change per commit** — don't bundle unrelated fixes

### Disallowed vague subjects (enforced by Commitlint)

Do **not** use descriptions that are **only** “updated” / “fixed”, or that **start with capitalised** “Updated” / “Fixed” after the colon. Always pair the **type** (`fix:`, `feat:`, …) with a **specific** description.

**Bad**

```text
Updated dashboard
Fixed
fix: Fixed login redirect
fix: Updated, copy on landing page
chore: fixed
```

**Good**

```text
fix(dashboard): resolve tab change for active and inactive users
fix: fixed the dashboard tab behaviour for active and inactive users
docs(readme): clarify environment variable setup
```

Prefer **imperative**, lowercase descriptions and **no trailing period** on the first line (see above).

---

## Breaking Changes

Indicate a breaking change by either:

1. Appending `!` after the type/scope: `feat(api)!: ...`
2. Adding a `BREAKING CHANGE:` footer in the commit body

```bash
feat!: drop support for Node 16

BREAKING CHANGE: the build now requires Node 18 or higher
```

---

## Reference

[https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)