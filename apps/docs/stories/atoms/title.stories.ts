import type { Meta, StoryObj } from "@storybook/react-vite";
import { Title } from "@repo/ui/title";

export default {
  title: "Atom/Title",
  component: Title,
} satisfies Meta<typeof Title>;

export const Primary: StoryObj<typeof Title> = {
  args: {
    text: "Title Test Component",
  },
};
