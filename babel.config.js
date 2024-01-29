module.exports = (api) => {
  const target = api.caller((caller) => caller.target);

  api.cache.using(() => JSON.stringify({ target }));

  const presets = [require.resolve("next/babel")];
  const plugins = [];

  plugins.push(
    ...[
      "babel-plugin-transform-typescript-metadata",
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      "babel-plugin-parameter-decorator",
    ]
  );

  // Enable optimizations only for the `web` bundle.
  if (target === "web") {
    plugins.push([
      require.resolve("babel-plugin-direct-import"),
      {
        modules: [
          "@mui/lab",
          "@mui/material",
          "@mui/system",
          "@mui/icons-material",
          "react-feather",
        ],
      },
    ]);
  }

  return { presets, plugins };
};
