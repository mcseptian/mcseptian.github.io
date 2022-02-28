import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import Navbar from "./Navbar.svelte";

test("shows proper navlink when rendered", () => {
  const { getByText } = render(Navbar);

  expect(getByText("Home")).toBeInTheDocument();
});
