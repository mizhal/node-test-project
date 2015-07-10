// utilities

var Utils = {
  
  "filterFields": function(object, fields){
    var res = {};
    for(var i in fields){
      res[fields[i]] = object[fields[i]];
    }
    return res;
  }

};

module.exports = Utils;
