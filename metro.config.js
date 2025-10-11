const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg' && ext !== 'md');
config.resolver.sourceExts.push('svg');
config.resolver.assetExts.push('md');

module.exports = config;
