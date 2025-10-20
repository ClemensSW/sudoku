const IS_DEV = process.env.EAS_BUILD_PROFILE === 'development';
const IS_PREVIEW = process.env.EAS_BUILD_PROFILE === 'preview';
const fs = require('fs');
const path = require('path');

// Check if Google Services files exist
const hasIOSGoogleServices = fs.existsSync(path.join(__dirname, 'GoogleService-Info.plist'));
const hasAndroidGoogleServices = fs.existsSync(path.join(__dirname, 'google-services.json'));

export default {
  expo: {
    name: IS_DEV ? 'Sudoku Duo DEV' : IS_PREVIEW ? 'Sudoku Duo PREVIEW' : 'Sudoku Duo',
    slug: 'sudoku-duo',
    version: '1.3.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'sudokuduo',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    jsEngine: 'hermes',
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission: 'Die App benötigt Zugriff auf deine Fotos, um ein Profilbild auszuwählen.',
          cameraPermission: 'Die App benötigt Zugriff auf die Kamera, um ein Profilbild aufzunehmen.',
        },
      ],
      'expo-router',
      'expo-font',
      'expo-web-browser',
      'expo-localization',
      '@react-native-firebase/app',
    ],
    androidStatusBar: {
      hidden: true,
      translucent: true,
      backgroundColor: '#00000000',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourdomain.sudoku',
      jsEngine: 'hermes',
      associatedDomains: ['applinks:sudokuduo.com'],
      ...(hasIOSGoogleServices && { googleServicesFile: './GoogleService-Info.plist' }),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/splash-icon.png',
        backgroundColor: '#ffffff',
      },
      softwareKeyboardLayoutMode: 'pan',
      package: 'de.playfusiongate.sudokuduo',
      versionCode: 1,
      permissions: ['com.android.vending.BILLING'],
      intentFilters: [
        {
          action: 'MAIN',
          category: ['LAUNCHER', 'DEFAULT'],
        },
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'sudokuduo',
              host: '*',
            },
            {
              scheme: 'https',
              host: 'sudokuduo.com',
              pathPrefix: '/join',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
      ...(hasAndroidGoogleServices && { googleServicesFile: './google-services.json' }),
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '1b6add40-870a-4135-9786-bc0120501791',
      },
    },
  },
};
