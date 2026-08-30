// @ts-nocheck
import * as __fd_glob_7 from "../content/docs/rules/project-structure.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/rules/lighthouse-ci.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/rules/engineering.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/rules/contribution.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/rules/commit-guidelines.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/rules/codebase.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_0 from "../content/docs/getting-started.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {}, {"getting-started.mdx": __fd_glob_0, "index.mdx": __fd_glob_1, "rules/codebase.mdx": __fd_glob_2, "rules/commit-guidelines.mdx": __fd_glob_3, "rules/contribution.mdx": __fd_glob_4, "rules/engineering.mdx": __fd_glob_5, "rules/lighthouse-ci.mdx": __fd_glob_6, "rules/project-structure.mdx": __fd_glob_7, });