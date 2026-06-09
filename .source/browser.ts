// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"getting-started.mdx": () => import("../content/docs/getting-started.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "rules/codebase.mdx": () => import("../content/docs/rules/codebase.mdx?collection=docs"), "rules/commit-guidelines.mdx": () => import("../content/docs/rules/commit-guidelines.mdx?collection=docs"), "rules/contribution.mdx": () => import("../content/docs/rules/contribution.mdx?collection=docs"), "rules/engineering.mdx": () => import("../content/docs/rules/engineering.mdx?collection=docs"), "rules/lighthouse-ci.mdx": () => import("../content/docs/rules/lighthouse-ci.mdx?collection=docs"), "rules/project-structure.mdx": () => import("../content/docs/rules/project-structure.mdx?collection=docs"), }),
};
export default browserCollections;