<script lang="ts">
  import type { SocialIcons } from "./Footer.svelte";

  export let icons: SocialIcons[];
</script>

<footer
  class="container mx-auto pt-3 pb-6 border-t-2 border-solid border-white border-opacity-10 sm:flex justify-between"
>
  <div class="pt-4 mx-3 text-center">
    {#if icons.length !== 0}
      <ul class="flex justify-center sm:justify-start">
        {#each icons as icon}
          <li class="mr-3">
            <a href={icon.url} title={icon.title}>{@html icon.content}</a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  <div class="footer_copyright_content pt-4 text-center">
    <p class="text-gray-400">
      Crafted by <a
        href="/"
        rel="nofollow"
        title="author"
        class="text-gray-400 hover:text-gray-700">mcseptian</a
      >
    </p>
  </div>
</footer>
