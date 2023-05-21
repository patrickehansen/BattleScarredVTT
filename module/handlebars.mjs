
export const helpers = {
  'concat':  function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  },
  'toLowerCase' : function(str) {
    return str.toLowerCase();
  },
  'switchAbilityLabelClass': (type, ...params) => {
    return new Handlebars.SafeString(`${type}Label ${params.slice(0, -1).join(' ')}`);
  },
  "json": (data) => {
    return Handlebars.SafeString(JSON.stringify(data));
  }
}
