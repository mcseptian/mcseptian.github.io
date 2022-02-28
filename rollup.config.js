import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import { generateSW } from "rollup-plugin-workbox";
import dotenv from "dotenv";

dotenv.config();

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        sourceMap: !production,
        postcss: true,
        replace: [
          [
            /process\.env\.(\w+)/g,
            (_, prop) => JSON.stringify(process.env[prop]),
          ],
          // blade-like syntax:support
          [/@if\s*\((.*?)\)$/gim, "{#if $1}"],
          [/@elseif\s*\((.*?)\)$/gim, "{:else if $1}"],
          [/@else$/gim, "{:else}"],
          [/@endif$/gim, "{/if}"],
          [/@each\s*\((.*?)\)$/gim, "{#each $1}"],
          [/@endeach$/gim, "{/each}"],
          [/@await\s*\((.*?)\)$/gim, "{#await $1}"],
          [/@then\s*(?:\((.*?)\))?$/gim, "{:then $1}"],
          [/@catch\s*(?:\((.*?)\))?$/gim, "{:catch $1}"],
          [/@endawait$/gim, "{/await}"],
          [/@debug\s*\((.*?)\)$/gim, "{@debug $1}"],
          [/@html\s*\((.*?)\)$/gim, "{@html $1}"],
        ],
      }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    typescript({
      sourceMap: production,
      inlineSources: production,
    }),

    // generate service worker automatically, details:
    // https://developers.google.com/web/tools/workbox/modules/workbox-build#generatesw_mode
    generateSW({
      swDest: "public/build/sw.js",
      globDirectory: "public/",
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
