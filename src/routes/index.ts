import Index from "../components/Page/Index.svelte";
import Blog from "../components/Blog/Blog.svelte";
import NotFound from "../components/Page/NotFound.svelte";
import MainLayout from "../layout/MainLayout.svelte";

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
