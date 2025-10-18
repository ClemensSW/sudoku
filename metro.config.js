const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Use custom transformer for .md and .svg files
config.transformer.babelTransformerPath = path.resolve(__dirname, 'metro.transformer.js');

// Remove svg and md from assetExts and add to sourceExts
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg' && ext !== 'md');
config.resolver.sourceExts.push('svg', 'md');

module.exports = config;
