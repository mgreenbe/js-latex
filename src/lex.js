let t = require('./tokens.js');

let debug = false;

let lex = str => {
  let s = str.trim();
  let ts = [];
  while (s.length > 0) {
    let match;
    if ((match = /^[ \t]*(?:\n[ \t]*){2,}/.exec(s))) {
      // whitespace including >= 2 newlines
      ts.push({ type: t.PAR });
      debug && console.log(`Matched ${t.PAR}.`);
    } else if ((match = /^[ \t]*\n[ \t]*|^[ \t]+/.exec(s))) {
      // whitespace including <= 1 newline
      ts.push({ type: t.SPACE, value: ' ' });
      debug && console.log(`Matched ${t.SPACE}.`);
    } else if (
      (match = /^(?:\\#|\\\$|\\%|\\\^|\\&|\\_|\\{|\\}|\\~|\\\\)/.exec(s))
    ) {
      ts.push({ type: t.OTHER, value: match[0][1] });
      debug && console.log(`Matched escaped character: '${match[0][1]}'.`);
    } else if ((match = /^\$\$/.exec(s))) {
      // display math
      ts.push({ type: t.DMATH });
      debug && console.log(`Matched DMATH.`);
    } else if ((match = /^\\begin\{([A-Za-z]+)\}\s*/.exec(s))) {
      // control word; throw out subsequent whitespace
      ts.push({ type: `BEGIN_${match[1].toUpperCase()}` });
      debug && console.log(`Matched command: ${match[1].toUpperCase()}.`);
    } else if ((match = /^\\end\{([A-Za-z]+)\}/.exec(s))) {
      // control word; throw out subsequent whitespace
      ts.push({ type: `END_${match[1].toUpperCase()}` });
      debug && console.log(`Matched command: ${match[1].toUpperCase()}.`);
    } else if (
      (match = /^\\(subsection|section|title|author|begin|end|item)\s*/.exec(s))
    ) {
      // control word; throw out subsequent whitespace
      ts.push({ type: t[match[1].toUpperCase()] });
      debug && console.log(`Matched command: ${match[1].toUpperCase()}.`);
    } else if ((match = /^\\([a-zA-Z]+)\s*/.exec(s))) {
      // control word; throw out subsequent whitespace
      ts.push({ type: t.CWORD, value: match[1] });
      debug && console.log(`Matched control word: ${match[1]}.`);
    } else if (
      (match = /^\\(?![A-Za-z#$%^&_{}~])([\u0020-\u007E\n])/.exec(s))
    ) {
      // control symbol
      ts.push({ type: t.CSYMBOL, value: match[1] });
      debug && console.log(`Matched nonletter: '${match[0]}'}.`);
    } else if ((match = /^[A-Za-z]/.exec(s))) {
      // letter
      ts.push({ type: t.LETTER, value: match[0] });
      debug && console.log(`Matched letter: '${match[0]}'.`);
    } else if ((match = /^(?![A-Za-z#$%^&_{}~])[\u0021-\u007E]/.exec(s))) {
      // nonletter character
      ts.push({ type: t.OTHER, value: match[0] });
      debug && console.log(`Matched nonletter: '${match[0]}'}.`);
    } else if ((match = /^{/.exec(s))) {
      ts.push({ type: t.LBRACE });
      debug && console.log(`Matched ${t.LBRACE}.`);
    } else if ((match = /^}/.exec(s))) {
      ts.push({ type: t.RBRACE });
      debug && console.log(`Matched ${t.RBRACE}.`);
    } else if ((match = /^#/.exec(s))) {
      ts.push({ type: t.PARAM });
      debug && console.log(`Matched ${t.PARAM}.`);
    } else if ((match = /^\$/.exec(s))) {
      ts.push({ type: t.IMATH });
      debug && console.log(`Matched ${t.IMATH}.`);
    } else if ((match = /^%/.exec(s))) {
      ts.push({ type: t.COMMENT });
      debug && console.log(`Matched ${t.COMMENT}.`);
    } else if ((match = /^\^/.exec(s))) {
      ts.push({ type: t.SUP });
      debug && console.log(`Matched ${t.SUP}.`);
    } else if ((match = /^_/.exec(s))) {
      ts.push({ type: t.SUB });
      debug && console.log(`Matched ${t.SUB}.`);
    } else if ((match = /^&/.exec(s))) {
      ts.push({ type: t.ALIGN });
      debug && console.log(`Matched ${t.ALIGN}.`);
    } else {
      throw new Error("Lexing error: couldn't match.");
    }

    if (match) {
      s = s.slice(match[0].length);
    }
  }
  return ts.reverse();
};

module.exports = { lex };
