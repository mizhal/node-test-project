// Winston logger configuration
var winston = require("winston");
var expressWinston = require('express-winston');
var path = require("path");

module.exports = {
  logger: null,
  initialize: function(config){
    this.logger = new winston.Logger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(config.root, config.log.path) })
      ]
    });
    this.logger.log("Winston logger initialized");
  },
  getLogger: function(){
    return this.logger;
  },
  getMiddleware: function(config){
    return expressWinston.errorLogger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        }),
        new winston.transports.File({ filename: config.log.path })
      ]
    });
  }
};