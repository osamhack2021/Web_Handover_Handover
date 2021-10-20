const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const resolve = (dir) => path.join(__dirname, "../../", dir);

const env = process.env.NODE_ENV || "development";
const isDev = env === "development";

const WebpackDefinePluginConfig = new webpack.DefinePlugin({
  "process.env": {
    NODE_ENV: JSON.stringify(env),
  },
});

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: resolve("frontend/index.html"),
  favicon: resolve("frontend/assets/icons/favicon.ico"),
  filename: "index.html",
  inject: "body",
});

module.exports = {
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
    magicHtml: true, // route all requests to /dist/index.js
    client: {
      webSocketURL: "ws://0.0.0.0/ws",
    },
    // allowedHosts: [
    //   '.githubpreview.dev',
    //   '.github.dev',
    //   'nginx',
    //   'localhost',
    //   '0.0.0.0',
    // ],
    allowedHosts: "all", // DEV: Temporary fix for "Invalid Host header" message
  },
  watchOptions: {
    ignored: "**/node_modules",
    aggregateTimeout: 200,
    poll: 500,
  },
  entry: [
    resolve("frontend/styles/index.scss"),
    resolve("frontend/assets/index.js"),
    resolve("frontend/index.js"),
  ],
  output: {
    filename: isDev ? "[name].js" : "[name].[fullhash].js",
    path: resolve("frontend/dist"),
    publicPath: "/",
    clean: true,
  },
  resolve: {
    alias: {
      _frontend: resolve("frontend"),
      _assets: resolve("frontend/assets/"),
      _styles: resolve("frontend/styles/"),
      _utils: resolve("frontend/utils/"),
      _api: resolve("frontend/api/"),
      _hooks: resolve("frontend/hooks/"),
      _atoms: resolve("frontend/components/atoms/"),
      _molecules: resolve("frontend/components/molecules/"),
      _organisms: resolve("frontend/components/organisms/"),
      _templates: resolve("frontend/components/templates/"),
      _pages: resolve("frontend/components/pages/"),
      _environment: resolve("frontend/components/environment/"),
      _store: resolve("frontend/store/"),
      _actions: resolve("frontend/store/actions/"),
      _reducers: resolve("frontend/store/reducers/"),
      _thunks: resolve("frontend/store/thunks/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        include: [resolve("frontend")],
        exclude: [resolve("frontend/node_modules")],
      },
      {
        test: /\.css$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
        generator: {
          filename: "icons/[name][ext]",
        },
      },
      {
        test: /\.(woff(2)|ttf|eot|otf)?(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
    ],
  },
  plugins: [HtmlWebpackPluginConfig, WebpackDefinePluginConfig],
  performance: {
    hints: false,
  },
};
