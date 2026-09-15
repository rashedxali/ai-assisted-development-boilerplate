import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/globals/buttons/button";

const meta: Meta<typeof Button> = {
  title: "Globals/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Get started",
    icon: true,
    isLoading: false,
  },
  argTypes: {
    href: {
      control: "text",
      description: "Render as a Next.js Link when provided",
    },
    icon: {
      control: "boolean",
      description: "Show the trailing arrow icon",
    },
    isLoading: {
      control: "boolean",
      description: "Replace icon with a spinner and disable the button",
    },
    className: {
      control: "text",
      description: "Additional Tailwind classes",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const NoIcon: Story = {
  args: {
    icon: false,
    children: "Continue",
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: "Submitting",
  },
};

export const AsLink: Story = {
  args: {
    href: "/about",
    children: "Learn more",
    icon: false,
  },
};
