<script lang="ts">
  import type { Article } from "./Card.svelte";
  export let article: Article;
</script>

<li class="p-4 w-full md:w-1/2 lg:w-1/3">
  <article class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
    <div
      class="w-full h-48 h-36 object-cover object-center flex align-center justify-center bg-gray-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="m-auto block"
        ><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle
          cx="8.5"
          cy="8.5"
          r="1.5"
        /><polyline points="21 15 16 10 5 21" /></svg
      >
    </div>
    <div class="p-6">
      {#each article.labels as label}
        <span
          class="tracking-widest text-xs title-font font-medium text-gray-500 mb-1 mr-2"
        >
          {label}
        </span>
      {/each}
      <h2 class="title-font text-lg font-medium text-gray-900 mb-3">
        {article.title}
      </h2>
      <p class="leading-relaxed mb-3 h-full md:h-35 lg:h-40 overflow-hidden">
        {@html article.content}
      </p>
      <div class="flex items-center flex-wrap ">
        <a
          class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
          href={article.url}
          >Read More
          <svg
            class="w-4 h-4 ml-2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </a>
        <span
          class="text-gray-600 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-300"
        >
          <svg
            class="w-4 h-4 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><circle cx="12" cy="12" r="10" /><polyline
              points="12 6 12 12 16 14"
            /></svg
          >{new Date(article.published).toDateString()}
        </span>
        <span
          class="text-gray-600 inline-flex items-center leading-none text-sm"
        >
          <svg
            class="w-4 h-4 mr-1"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
            />
          </svg>{article.replies.totalItems}
        </span>
      </div>
    </div>
  </article>
</li>
