// Custom Metro transformer for markdown files
const upstreamTransformer = require('@expo/metro-config/babel-transformer');
const svgTransformer = require('react-native-svg-transformer');

module.exports.transform = async function({ src, filename, options }) {
  // Handle .md files as raw text - return directly without Babel
  if (filename.endsWith('.md')) {
    // Return the markdown content as a CommonJS module export
    // Using module.exports for compatibility with require()
    return upstreamTransformer.transform({
      src: `module.exports = ${JSON.stringify(src)};`,
      filename: filename.replace('.md', '.js'), // Treat as JS to avoid complex transformations
      options: {
        ...options,
        // Minimal Babel config to avoid transformation issues
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    });
  }

  // Handle .svg files
  if (filename.endsWith('.svg')) {
    return svgTransformer.transform({ src, filename, options });
  }

  // Handle everything else with default transformer
  return upstreamTransformer.transform({ src, filename, options });
};
