module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: "pug-plain-loader"
        }
      ]
    }
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Diablo 3 Season Countdown Timer";
      return args;
    });
  }
};
