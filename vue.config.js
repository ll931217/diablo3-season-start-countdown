module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Diablo 3 Season Countdown Timer";
      return args;
    });
  }
};
