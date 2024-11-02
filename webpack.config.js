const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
//const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  const minimize = env && env.minimize === "true";

  return {
    mode: minimize ? "production" : "development",
    entry: "./src/scripts/app.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/", //TODO: Adjust if needed
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
          // generator: {
          //   filename: 'images/[name][ext][query]', // Ensure filenames remain unchanged
          // }
        },
        {
          test: /\.(ttf|woff|woff2)$/,
          type: "asset/resource",
          // generator: {
          //   filename: 'fonts/[name][ext][query]', // Ensure filenames remain unchanged
          // }
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
      // new MiniCssExtractPlugin({
      //   filename: "bundle.css",
      // }),
      new HtmlInlineCSSWebpackPlugin(),
      // new CopyWebpackPlugin({
      //   patterns: [{ from: "src/images/emoticons", to: "images/emoticons" }],
      // }),
      new webpack.HotModuleReplacementPlugin(), // Ensure HMR plugin is enabled
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      compress: true,
      port: 9000,
      open: false, // Prevents the browser from opening automatically
      hot: true, // Enables hot module replacement
      liveReload: true,
      watchFiles: {
        paths: ["src/**/*.html"], // Watch only HTML files for live reload
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
