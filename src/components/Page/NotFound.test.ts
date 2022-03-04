import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import NotFound from "./NotFound.svelte";

test("have home link on render", () => {
  const { getByRole } = render(NotFound);
  const anchor = getByRole("link");

  expect(anchor).toHaveTextContent("Home");
});
