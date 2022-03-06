import { Index, NotFound } from "../components/Page";
import Blog from "../components/Blog";
import MainLayout from "../layout";

const routes = [
  {
    name: "/",
    path: "/",
    component: Index,
    layout: MainLayout,
  },
  {
    name: "blog",
    path: "/blog",
    component: Blog,
    layout: MainLayout,
  },
  { name: "404", path: "*", component: NotFound },
];

export { routes };
