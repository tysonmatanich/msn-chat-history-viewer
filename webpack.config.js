const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

const publicPath = process.env.PUBLIC_PATH || "/";

module.exports = (env) => {
  const minimize = env && env.minimize === "true";

  return {
    mode: minimize ? "production" : "development",
    entry: "./src/scripts/app.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: publicPath,
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
            "style-loader",
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
                    minimize ? require("cssnano")({ preset: "default" }) : false,
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
      new HtmlInlineCSSWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
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
