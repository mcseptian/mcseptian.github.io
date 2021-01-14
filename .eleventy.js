const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./tmp/style.css");

  eleventyConfig.addPassthroughCopy({ "./tmp/style.css": "./style.css" });

  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/alpine.js": "./script/alpine.js",
    "./node_modules/alpine-magic-helpers/dist/component.js": "./script/component.js",
    "./node_modules/alpine-magic-helpers/dist/fetch.js": "./script/fetch.js",
    "./node_modules/alpine-magic-helpers/dist/interval.js": "./script/interval.js",
    "./node_modules/alpine-magic-helpers/dist/range.js": "./script/range.js",
    "./node_modules/alpine-magic-helpers/dist/screen.js": "./script/screen.js",
    "./node_modules/alpine-magic-helpers/dist/scroll.js": "./script/scroll.js",
    "./node_modules/alpine-magic-helpers/dist/truncate.js": "./script/truncate.js",
    "./node_modules/@ryangjchandler/spruce/dist/spruce.js": "./script/spruce.js",
  });

  eleventyConfig.addShortcode("version", function () {
    return String(Date.now());
  });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });
};
