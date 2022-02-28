import sveltePreprocess from "svelte-preprocess";

const preprocessOptions = {
  defaults: {
    script: "typescript",
  },
  postcss: true,
};

export default {
  preprocess: sveltePreprocess(preprocessOptions),
  preprocessOptions,
};
