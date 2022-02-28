import Index from "../components/Index.svelte";
import Blog from "../components/Blog.svelte";
import NotFound from "../components/NotFound.svelte";
import MainLayout from "../layout/MainLayout.svelte";

const routes = [
  {
    name: "/",
    component: Index,
    layout: MainLayout,
  },
  { name: "blog", component: Blog, layout: MainLayout },
  { name: "404", component: NotFound },
];

export { routes };
