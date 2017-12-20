let t = require('./tokens.js');

let default_ = (type, match) => ({ type });

let rule = [
  [t.PAR, /^[ \t]*(?:\n[ \t]*){2,}/, default_],
  [t.SPACE, /^[ \t]*\n[ \t]*|^[ \t]+/, default_],
  [
    'ESCAPED',
    /^\\(#|\$|%|\^|&|_|{|}|~|\\)/,
    (name, match) => ({ type: t.NONLETTER, value: match[1] })
  ],
  [
    'BEGIN_ENVIRONMENT',
    /^\\begin\{([A-Za-z]+)\}\s*/,
    (name, match) => ({ type: `BEGIN_${match[1].toUpperCase()}` })
  ],
  [
    'END_ENVIRONMENT',
    /^\\end\{([A-Za-z]+)\}/,
    (name, match) => ({ type: `END_${match[1].toUpperCase()}` })
  ],
  [
    'STRUCTURE',
    /^\\(subsection|section|item)\s*/,
    (name, match) => ({ type: match[1].toUpperCase })
  ],
  [t.CWORD, /^\\([a-zA-Z]+)\s*/, (name, match) => ({ value: match[1] })],
  [t.LETTER, /^[A-Za-z]/, (name, match) => ({ value: match[0] })],
  [t.NONLETTER, /^(?![A-Za-z#$%^&_{}~])[\u0021-\u007E]/, default_],
  [t.LBRACE, /^{/, default_],
  [t.RBRACE, /^}/, default_]
];

module.exports = { rule };
