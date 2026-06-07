"use client";

import React from "react";
import { BodyText } from "@/components/globals/typography/body-text";
import { Button } from "@/components/globals/buttons/button";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <BodyText variant="16r" className="text-muted-foreground">
              Something went wrong.
            </BodyText>
            <Button onClick={() => this.setState({ hasError: false })} icon={false}>
              Try again
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
