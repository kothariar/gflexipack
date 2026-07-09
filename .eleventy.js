const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Inline a project file's raw contents (used to embed CSS/JS into the one-page build)
  eleventyConfig.addFilter("inlineFile", function (p) {
    try {
      return fs.readFileSync(path.join(__dirname, p), "utf8");
    } catch (e) {
      return "";
    }
  });

  // Static assets (css, js, images) → /assets/…
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // Root files
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });

  // --- filters ---
  eleventyConfig.addFilter("year", () => "2026");

  // Absolute URL helper for canonical / OG / sitemap
  eleventyConfig.addFilter("absUrl", function (path, base) {
    try {
      return new URL(path, base).toString();
    } catch (e) {
      return path;
    }
  });

  // Collection of every page that should appear in sitemap.xml
  eleventyConfig.addCollection("sitemap", function (collectionApi) {
    return collectionApi.getAll().filter((item) => item.data.eleventyExcludeFromCollections !== true && item.url && !item.data.noindex);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: "/",
  };
};
