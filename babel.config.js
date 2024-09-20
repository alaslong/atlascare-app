module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Other plugins, if any, should be added here
      'react-native-reanimated/plugin', // Add this as the last plugin
    ],
  };
};
