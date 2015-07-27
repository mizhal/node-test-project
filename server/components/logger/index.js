// Bunyan logger configuration
var bunyan = require("bunyan");
var path = require("path");

module.exports = exports = {
  // {IPFCLaminasConfig} config
  config: null,
  setConfig: function(config){
    /**
      @param {IPFCLaminasConfig} config
    **/
    this.config = config;
  },
  getLogger: function() {
    var logger = bunyan.createLogger({
      name: "pfc-laminas", 
      streams: [
        {
          level: "trace",
          path: path.join(this.config.root, this.config.log.path)
        }
      ]
    });

    return logger;
  }
};