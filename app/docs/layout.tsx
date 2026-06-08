import "./docs.css";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <RootProvider>
      <DocsLayout tree={source.getPageTree()} sidebar={{ className: "w-fit" }}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
