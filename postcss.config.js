module.exports = {
  plugins: {
    tailwindcss: {
      purge: {
        content: ["_site/**/*.html"],
        options: {
          whitelist: [],
        },
      },
      theme: {
        extend: {
          colors: {
            change: "black",
          },
        },
      },
      variants: {},
      plugins: [],
    },
    autoprefixer: {},
  }
}
