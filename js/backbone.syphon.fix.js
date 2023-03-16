(function (Syphon) {
  Syphon.keySplitter = function (key) {
    var matches = key.match(/[^\[\]]+/g);

    if (key.indexOf("[]") === key.length - 2 && key.length > 1){
      var lastKey = matches.pop();
      matches.push([lastKey]);
    }

    return matches;
  };
}(Backbone.Syphon));
