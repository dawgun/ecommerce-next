import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Title } from "./title";

describe("Title Component", () => {
  it("renders with default h2 tag", () => {
    render(<Title text="Hello World" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Hello World");
  });

  it("renders with h1 tag when specified", () => {
    render(<Title text="Main Title" title_tag="h1" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Main Title");
  });

  it("renders with h3 tag when specified", () => {
    render(<Title text="Subtitle" title_tag="h3" />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Subtitle");
  });

  it("renders with h4 tag when specified", () => {
    render(<Title text="Section Title" title_tag="h4" />);
    const heading = screen.getByRole("heading", { level: 4 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Section Title");
  });

  it("renders with h5 tag when specified", () => {
    render(<Title text="Subsection" title_tag="h5" />);
    const heading = screen.getByRole("heading", { level: 5 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Subsection");
  });

  it("renders with h6 tag when specified", () => {
    render(<Title text="Minor Heading" title_tag="h6" />);
    const heading = screen.getByRole("heading", { level: 6 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Minor Heading");
  });

  it("applies custom className", () => {
    render(<Title text="Styled Title" className="custom-class" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("custom-class");
  });

  it("renders the correct text content", () => {
    const testText = "Test Content";
    render(<Title text={testText} />);
    expect(screen.getByText(testText)).toBeInTheDocument();
  });
});
