# Engineering rules and standards

This document defines **non-negotiable engineering rules** for this Next.js project. All contributors and AI agents must follow these guidelines strictly.

---

## 1. Performance first (non-negotiable)

We **never compromise on performance**.

- Follow Google Lighthouse performance practices.
- Targets: **LCP < 2.5s**, **CLS < 0.1** (adjust per environment; treat regressions seriously).
- Minimize JS bundle size (aim for lean routes; avoid unnecessary client JS).
- Avoid heavy or unnecessary dependencies.
- Use lazy loading for non-critical components.
- Optimize images (modern formats, responsive sizes).
- Avoid render-blocking resources where you control them.

**Rule:** Any change that degrades performance must be justified or rejected.

---

## 2. UI and design system rules

### Mandatory globals components

**Always** use the prebuilt typography, button, and input components from **`components/globals/`**. Custom typography, buttons, or inputs are **prohibited** unless there is genuinely no existing component that can satisfy the requirement.

| Category | Required source |
|----------|----------------|
| Typography | `BodyText`, `HeadingText`, `LeadText` in `components/globals/typography/` |
| Buttons | `Button`, `SizeButton`, `QuantityButton`, `PrintSelectButton` in `components/globals/buttons/` |
| Inputs | `AppInput` and its variants in `components/globals/inputs/app-input.tsx` |

**Prohibited without exception:**

- Raw Tailwind typography classes (`text-lg`, `font-bold`, etc.) when a typography variant exists
- One-off `<button>`, `<input>`, `<textarea>`, or `<select>` elements styled inline in feature or scope code
- Duplicate button/input/typography components in `components/scope/` or route files

**Allowed only when no alternative exists:**

- A genuinely new control type with no globals equivalent — extend `components/globals/` first; do not ship a one-off custom component in feature code
- shadcn/ui primitives from `components/ui/` for low-level building blocks (dialogs, accordions, etc.) that are not covered by globals

### General UI rules

- No inline styles unless unavoidable.
- Use design tokens (spacing, colors, typography) from the design system / `globals.css`.
- Maintain visual consistency across the app.
- Always merge conditional classes with `cn()` from `lib/utils.ts` — never string-concatenate Tailwind classes directly.

---

## 3. Component architecture

- Do **not** create components longer than roughly **200–300 lines**; split instead.
- Prefer **small, reusable units**.
- Follow **DRY**, **SRP**, **SOLID**, **KISS**, **YAGNI**.
- Extract reusable logic into **`utils/`**, **`hooks/`**, and shared components.
- Avoid overengineering: **simplicity over abstraction**.
- No `any` — ever. Type all props, return values, and API responses explicitly. Use `unknown` at trust boundaries and narrow from there.

---

## 4. Server vs client components

- **Default to Server Components.** Every component is a Server Component unless it explicitly needs the client.
- Add `"use client"` **only** when the component requires browser APIs, event handlers, or client hooks (`useState`, `useEffect`, `useRef`, etc.).
- Push the `"use client"` boundary **as far down the tree as possible** — isolate client interactivity in small leaf components, not large parent trees.
- Never add `"use client"` speculatively or as a default.

---

## 5. State management rules

- Keep state **as local as possible**.
- Avoid unnecessary global state.
- Maintain a **single source of truth**.
- Do **not** store derived state when it can be computed.
- Prevent duplicate or conflicting state.

---

## 6. Data fetching and caching

- No unnecessary API calls.
- Prefer caching and deduplication for repeated data.
- When introducing client/server data libraries, use a **unified strategy** (React Query / SWR-style patterns are recommended).
- Prevent duplicate requests across components.

### Header / footer rule

Data used in header or footer must be **cached**, **optimized**, and **not refetched on every navigation** without cause.

---

## 7. SEO best practices

- Use semantic HTML (`header`, `main`, `section`, etc.).
- Proper meta tags (`title`, `description`) via Next.js metadata where applicable.
- Use structured data when the feature warrants it.
- Optimize for crawlability.
- Avoid client-only rendering for content that must be indexed.

---

## 8. Accessibility (a11y)

- Prefer semantic elements (`button`, `nav`, landmark regions).
- Provide **`alt`** text for meaningful images.
- Ensure keyboard navigation works for interactive UI.
- Maintain adequate color contrast.
- Avoid common accessibility anti-patterns (click-only divs, missing labels, etc.).

---

## 9. Error handling and resilience

- Handle API failures gracefully with user-visible fallback UI (no blank screens).
- Use **error boundaries** where trees can fail independently (root layout wrapper or route-level `error.tsx`).
- Implement retry logic when appropriate.
- Log errors properly for production diagnostics — no `console.log` in production code paths; use structured logging.

---

## 10. Security rules

- Never expose secrets (API keys, tokens) in client bundles or commits.
- Environment variables intended for the client must use the `NEXT_PUBLIC_` prefix — all others are server-only. Never commit `.env` files.
- Validate inputs at trust boundaries.
- Sanitize user-generated content where it is rendered (mitigate XSS).
- Avoid insecure assumptions in client-only logic.

---

## 11. Testing and reliability

- Keep logic **testable** (pure functions in `utils/`).
- Avoid unnecessary coupling between components.
- Mock external APIs in tests when needed.
- Critical paths should be verifiable with automated checks where the team adopts them.

---

## 12. Folder structure and naming

- Use **clear, descriptive naming** (e.g. `getUserProfile`, not `getData`).
- Follow the repository layout documented in [project-structure.md](project-structure.md) (`components/ui`, `common`, `layout`, `scope`, etc.).
- Keep structure predictable and documented.

---

## 13. Code splitting and loading strategy

- Lazy-load non-critical components.
- Split routes appropriately so users do not download unused code eagerly.
- Avoid loading unnecessary code on first paint.

---

## 14. API contract safety

- Never assume API response shape without validation.
- Type and validate responses at boundaries where feasible.
- Handle backend changes without crashing the UI.

---

## 15. Observability (monitoring)

- Track performance signals where tooling exists (**LCP**, **TTFB**, etc.).
- Monitor API failure rates.
- Log important user flows in a structured way when observability stack exists.

---

## 16. No breaking changes rule

Before modifying shared behavior:

- Ensure existing functionality remains intact where feasible.
- Prefer backward-compatible changes.
- Exercise impacted surfaces (manual or automated).

---

## 17. No overengineering rule

- Do **not** introduce abstractions prematurely.
- Avoid unnecessary complexity.
- Ship the simplest solution that meets requirements; evolve when patterns repeat.

---

## 18. Reusability enforcement

- If a pattern appears **more than twice**, extract it.
- Prefer reusable utilities over duplicated logic.
- Centralize shared behavior in the right layer (`utils/`, `hooks/`, shared components).

---

## 19. Production mindset rule

Code is written for **real-world usage**.

- Handle edge cases, empty states, slow networks, and failures gracefully.

---

## 20. Scale and cost awareness

Write every operation as if it will run against millions of records and thousands of concurrent users.

- **Loops over data** — never fetch all records then filter in JS; filter, paginate, and sort at the database/API level.
- **N+1 queries** — always think about how many requests or DB calls a single render triggers; batch or aggregate.
- **Expensive operations** — heavy computation, file processing, and third-party calls belong in background jobs or cached, not in the request path.
- **Server Component data fetching** — each `await` in a Server Component is a round-trip; deduplicate and parallelize with `Promise.all` where independent.
- **Unbounded queries** — always apply limits and pagination; never allow a query without a `LIMIT` or equivalent.
- **Cache deliberately** — know which data is static, per-user, or real-time; apply the correct caching strategy (`cache`, `revalidate`, CDN headers) rather than defaulting to no-cache.

**Rule:** Before shipping any data operation, ask: *what does this cost at 100× the current load?*

---

## 22. Component = UI only (separation of concerns)

Components are responsible for **rendering UI and surfacing user events**. They must not contain business logic, data transformations, API calls, or complex state derivations.

### What belongs where

| Concern | Where |
|---------|-------|
| Stateful logic, derived values, side effects | `hooks/` (`use-*.ts`) |
| Pure transforms, formatting, validation | `utils/` |
| API calls, domain operations | `services/` |
| Context, providers | `providers/` |
| UI rendering, event wiring | `components/` |

### Demo

**Wrong** — component holds fetch logic, filtering, and derived state:

```tsx
// components/scope/orders/order-list.tsx
export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.filter((o: Order) => o.status === "active")));
  }, []);

  const total = orders.reduce((sum, o) => sum + o.price, 0);

  return (
    <ul>
      {orders.map((o) => (
        <li key={o.id}>{o.name} — ${total}</li>
      ))}
    </ul>
  );
}
```

**Right** — logic extracted; component only renders:

```ts
// services/orders.ts
export async function fetchActiveOrders(): Promise<Order[]> {
  const data = await fetch("/api/orders").then((r) => r.json());
  return data.filter((o: Order) => o.status === "active");
}
```

```ts
// hooks/use-orders.ts
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchActiveOrders().then(setOrders);
  }, []);

  const total = orders.reduce((sum, o) => sum + o.price, 0);
  return { orders, total };
}
```

```tsx
// components/scope/orders/order-list.tsx
export function OrderList() {
  const { orders, total } = useOrders();

  return (
    <ul>
      {orders.map((o) => (
        <li key={o.id}>{o.name} — ${total}</li>
      ))}
    </ul>
  );
}
```

**Rule:** If you can unit-test the logic without rendering a component, it should not live inside a component.

---

## 21. Development principles summary

Every decision should align with:

- Performance first  
- Simplicity over complexity  
- Reusability over duplication  
- Stability over reckless speed  
- Real-world reliability over ideal scenarios  

---

## Final rule

If a change:

- hurts performance,
- breaks consistency,
- or introduces unnecessary complexity,

**it should not be implemented** without explicit alignment and mitigation.
