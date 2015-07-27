'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/pfclaminasnode-dev'
  },

  log: {
    path: "/log/development.log",
    format: ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  },

  attachments: {
    base_path: "/client/assets/attached_files"
  },

  seedDB: true
};
