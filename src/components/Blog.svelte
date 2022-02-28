<script type="ts">
  import { useQuery } from "@sveltestack/svelte-query";
  import { getPost } from "../api/blog";
  import CardPlaceholder from "./CardPlaceholder.svelte";
  import Card from "./Card.svelte";
  import type { ArticleList } from "./Blog.svelte";

  const queryResult = useQuery<unknown, Error, ArticleList>("posts", () =>
    getPost({ key: process.env.BLOGGER_KEY })
  );
</script>

<div id="blog-wrapper">
  {#if $queryResult.isLoading}
    <CardPlaceholder />
  {:else if $queryResult.error}
    <span>An error has occurred: {$queryResult.error.message}</span>
  {:else}
    <ul class="flex flex-wrap">
      {#each $queryResult.data.items as article}
        <Card {article} />
      {/each}
    </ul>
  {/if}
</div>
