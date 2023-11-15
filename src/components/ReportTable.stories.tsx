import type { Meta, StoryObj } from "@storybook/react";

import { ReportTable } from "./ReportTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/ReportTable",
  component: ReportTable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {},
  render: (args) => (
    <QueryClientProvider client={new QueryClient()}>
      <ReportTable {...args} />
    </QueryClientProvider>
  ),
} satisfies Meta<typeof ReportTable>;

export default meta;
type Story = StoryObj<typeof meta>;

import GatewayAddressRegistryItem from "../fixtures/GatewayAddressRegistryItem.json";
import { zGatewayAddressRegistryItem } from "@/types";
const item = zGatewayAddressRegistryItem.parse(GatewayAddressRegistryItem);
export const ExampleReport: Story = {
  args: {
    observer: item,
  },
};
