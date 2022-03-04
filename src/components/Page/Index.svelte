<script lang="ts">
  export let user: string = new Date().toLocaleString("en-us", {
    weekday: "long",
  });
</script>

<div
  class="flex-grow mx-auto flex items-center justify-center flex-column h-96"
>
  <h1 class="font-sans tracking-tight font-bold text-xl">
    Welcome, {user}
  </h1>
</div>
