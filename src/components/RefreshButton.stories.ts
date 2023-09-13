import type { Meta, StoryObj } from "@storybook/react";

import { RefreshButton } from "./RefreshButton";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/RefreshButton",
  component: RefreshButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof RefreshButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Ready: Story = {
  args: {
    isRefreshing: false,
    onClick: () => console.log("Clicked"),
  },
};

export const Refreshing: Story = {
  args: {
    isRefreshing: true,
    onClick: () => console.log("Clicked"),
  },
};
