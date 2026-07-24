const fs = require("fs");
const path = require("path");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // Rewrite root-relative URLs (/assets, /products, …) at build time to include
  // the pathPrefix, so the site works when served from the /gflexipack/ subpath
  // on GitHub Pages. Set pathPrefix below to "/" if a custom root domain is added.
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Inline a project file's raw contents (used to embed CSS/JS into the one-page build)
  eleventyConfig.addFilter("inlineFile", function (p) {
    try {
      return fs.readFileSync(path.join(__dirname, p), "utf8");
    } catch (e) {
      return "";
    }
  });

  // Base64 data-URI for a binary asset (used to embed images into the standalone build)
  eleventyConfig.addFilter("dataUri", function (p) {
    try {
      const abs = path.join(__dirname, p);
      const ext = path.extname(abs).slice(1).toLowerCase();
      const mime =
        ext === "webp" ? "image/webp" :
        ext === "png" ? "image/png" :
        ext === "svg" ? "image/svg+xml" :
        ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
        ext === "gif" ? "image/gif" : "application/octet-stream";
      return "data:" + mime + ";base64," + fs.readFileSync(abs).toString("base64");
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
    pathPrefix: "/gflexipack/",
  };
};
