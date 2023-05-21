
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
  'splitAbilities': (abilities, type) => {
    return Object.entries(abilities).reduce((output, [key, ability]) => {
      if (ability.type !== type) return output;
      output[key] = ability;
      return output;
    }, {})
  },
  'sumAbilityPoints': (abilities, type) => {
    return Object.values(abilities).reduce((sum, ability) => {
      if (ability.type !== type) return sum;
      return sum + ability.value;
    }, 0);
  },
  "json": (data) => {
    return Handlebars.SafeString(JSON.stringify(data));
  }
}
