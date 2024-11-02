const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  const MINIMIZE = env && env.MINIMIZE === "true";
  const INLINE = env && env.INLINE === "true";
  const PUBLIC_PATH = process.env.PUBLIC_PATH || (env && env.PUBLIC_PATH) || "/";

  return {
    mode: MINIMIZE ? "production" : "development",
    //devtool: MINIMIZE ? "source-map" : "eval-source-map",
    entry: "./src/scripts/app.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: PUBLIC_PATH,
      assetModuleFilename: (pathData) => {
        const filepath = path.dirname(pathData.filename).split("/").slice(1).join("/");
        return `${filepath}/[name][ext]?v=[contenthash]`;
      },
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: "html-loader",
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    require("postcss-preset-env")({
                      stage: false,
                      features: {
                        "nesting-rules": true,
                        "custom-properties": false,
                        "custom-selectors": false,
                        "is-pseudo-class": false,
                      },
                    }),
                    MINIMIZE ? require("cssnano")({ preset: "default" }) : false,
                  ].filter(Boolean),
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|ico|svg|webp|bmp|webmanifest)$/,
          type: "asset/resource",
        },
        {
          test: /\.(ttf|woff|woff2)$/,
          type: "asset/resource",
        },
        {
          test: /\.xslt$/,
          use: "string-loader",
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        inject: "body",
      }),
      INLINE ? new HtmlInlineCSSWebpackPlugin() : null, // Inline CSS into HTML
      new MiniCssExtractPlugin({ filename: "[name].css" }),
      INLINE ? new HtmlInlineScriptPlugin() : null, // Inline JS into HTML
      new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean), // Filter out null values
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      compress: true,
      port: 9000,
      open: false, // Prevents the browser from opening automatically
      hot: true,
      liveReload: true,
      watchFiles: {
        paths: ["src/**/*.html"], // Watch only HTML files for live reload (don't want page refresh on CSS or JS)
        options: {
          ignored: /node_modules/,
        },
      },
    },
    stats: {
      children: true,
    },
  };
};
