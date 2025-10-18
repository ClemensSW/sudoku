// Custom Metro transformer for markdown files
const upstreamTransformer = require('@expo/metro-config/babel-transformer');
const svgTransformer = require('react-native-svg-transformer');

module.exports.transform = function({ src, filename, options }) {
  // Handle .md files as raw text
  if (filename.endsWith('.md')) {
    // Escape the content properly for JavaScript
    const escapedContent = JSON.stringify(src);

    return upstreamTransformer.transform({
      src: `module.exports = ${escapedContent};`,
      filename,
      options,
    });
  }

  // Handle .svg files
  if (filename.endsWith('.svg')) {
    return svgTransformer.transform({ src, filename, options });
  }

  // Handle everything else with default transformer
  return upstreamTransformer.transform({ src, filename, options });
};
