<script lang="ts">
  export let name: string;
  let buttonClose = false;

  /**
   *
   */
  function handleClick() {
    buttonClose = !buttonClose;
  }
</script>

<header class="navbar bg-white sticky">
  <div class="container relative mx-auto">
    <div class="row items-center">
      <div class="w-full">
        <nav
          class="flex items-center justify-between py-4"
          class:active={buttonClose}
        >
          <a class="navbar-brand mr-5" href="/">
            <img src="logo.png" alt={name} class="h-10 w-10" />
          </a>
          <button
            class="block navbar-toggler focus:outline-none lg:hidden"
            type="button"
            aria-controls="navbarOne"
            aria-expanded="false"
            aria-label="Toggle navigation"
            on:click={handleClick}
          >
            <span class="toggler-icon" />
            <span class="toggler-icon" />
            <span class="toggler-icon" />
          </button>
          <div
            class="absolute left-0 z-20 hidden w-full px-5 py-3 duration-300 bg-white lg:w-auto lg:block top-full mt-full lg:static lg:bg-transparent shadow lg:shadow-none"
            class:hidden={!buttonClose}
            class:ml-7={buttonClose}
          >
            <ul
              id="nav"
              class="items-center content-start mr-auto lg:justify-end lg:flex"
              on:click={handleClick}
            >
              <li class="nav-item ml-5 lg:ml-11">
                <a class="mb-5" href="/">Home</a>
              </li>
              <li class="nav-item ml-5 lg:ml-11">
                <a class="mb-5" href="/blog">Blog</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </div>
</header>

<style lang="postcss">
  .active .toggler-icon:nth-child(2) {
    opacity: 0;
  }
  .toggler-icon {
    @apply block relative;
    background-color: rgba(56, 66, 77, 1);
    transition-duration: 300ms;
    height: 2px;
    width: 30px;
    margin: 6px 0;
  }
  .active .toggler-icon:nth-child(1) {
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    transform: translateX(var(--tw-translate-x))
      translateY(var(--tw-translate-y)) rotate(var(--tw-rotate))
      skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
      scaleY(var(--tw-scale-y));
    --tw-rotate: 45deg;
    top: 7px;
  }
  .active .toggler-icon:nth-child(3) {
    top: -8px;
    transform: rotate(135deg);
  }
</style>
