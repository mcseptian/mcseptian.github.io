<script lang="ts">
  import type { NotFoundLink } from "./NotFound.svelte";
  export let link: NotFoundLink = {
    label: "Home",
    url: "/",
  };
</script>

<div
  class="h-screen w-screen mx-auto flex flex-grow items-center justify-center flex-column"
>
  <h1 class="font-sans tracking-tight font-bold text-xl mb-10">404</h1>
  <h2 class="font-sans tracking-tight font-bold text-lg">
    Hello there, The page you're looking for is nonexistent. Here is the link to
    <a href={link.url}>{link.label}</a>
  </h2>
</div>
