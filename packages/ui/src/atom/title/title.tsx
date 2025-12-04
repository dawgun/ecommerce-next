import clsx from "clsx";
import type { JSX } from "react";
import type { TitleProps } from "./title.d";

export const Title = ({ text, className, title_tag }: TitleProps) => {
  const Tag = `${title_tag || "h2"}` as keyof JSX.IntrinsicElements;

  const tagStyles = {
    h1: "",
    h2: "",
    h3: "",
    h4: "",
    h5: "",
    h6: "",
  }[title_tag || "h2"];

  return <Tag className={clsx(tagStyles, className)}>{text}</Tag>;
};
