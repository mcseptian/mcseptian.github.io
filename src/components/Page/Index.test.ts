import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import Index from "./Index.svelte";

test("shows welcome text when rendered", () => {
  const { getByRole } = render(Index);
  const heading = getByRole("heading");
  expect(heading).toBeInTheDocument();
});
