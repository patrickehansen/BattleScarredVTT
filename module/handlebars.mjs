
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
  'toLowerCase' : (str) => str.toLowerCase(),
  'switchAbilityLabelClass': (type, ...params) => {
    return new Handlebars.SafeString(`${type}Label ${params.slice(0, -1).join(' ')}`);
  },
  "json": (data) => {
    return Handlebars.SafeString(JSON.stringify(data));
  },
  "isDefined": (data) => data !== undefined,
  "concatenate": (...params) => new Handlebars.SafeString(params.join(' '))
}
