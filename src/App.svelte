<script>
  //App.svelte
  import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query";
  import { Router } from "svelte-router-spa";
  import { routes } from "./routes/index";

  // Create a client
  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <Router {routes} />
</QueryClientProvider>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
