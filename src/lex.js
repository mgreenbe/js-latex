let t = require('./tokens.js');
let { endPoint } = require('./position.js');

let debug = false;

let lex = str => {
  let match = /^\s*/.exec(str);
  let end = endPoint({ line: 1, column: 1, offset: 0 }, match[0]);
  let newStr = str.slice(match[0].length);

  let ts = [];
  let start;
  while (newStr.length > 0) {
    let match;
    start = end;
    if ((match = /^[ \t]*(?:\n[ \t]*){2,}/.exec(newStr))) {
      // whitespace including >= 2 newlines
      end = endPoint(start, match[0]);
      ts.push({ type: t.PAR, position: { start, end } });
      debug && console.log(`Matched ${t.PAR}.`);
    } else if ((match = /^[ \t]*\n[ \t]*|^[ \t]+/.exec(newStr))) {
      // whitespace including <= 1 newline
      end = endPoint(start, match[0]);
      ts.push({ type: t.SPACE, value: ' ', position: { start, end } });
      debug && console.log(`Matched ${t.SPACE}.`);
    } else if (
      (match = /^(?:\\#|\\\$|\\%|\\\^|\\&|\\_|\\{|\\}|\\~|\\\\)/.exec(newStr))
    ) {
      end = endPoint(start, match[0]);
      ts.push({ type: t.OTHER, value: match[0][1], position: { start, end } });
      debug && console.log(`Matched escaped character: '${match[0][1]}'.`);
    } else if ((match = /^\$\$/.exec(newStr))) {
      // display math
      end = endPoint(start, match[0]);
      ts.push({ type: t.DMATH, position: { start, end } });
      debug && console.log(`Matched DMATH.`);
    } else if ((match = /^\\begin\{([A-Za-z]+)\}\s*/.exec(newStr))) {
      // control word; throw out subsequent whitespace
      end = endPoint(start, match[0]);
      ts.push({
        type: `BEGIN_${match[1].toUpperCase()}`,
        position: { start, end }
      });
      debug && console.log(`Matched command: ${match[1].toUpperCase()}.`);
    } else if ((match = /^\\end\{([A-Za-z]+)\}/.exec(newStr))) {
      // control word; throw out subsequent whitespace
      end = endPoint(start, match[0]);
      ts.push({
        type: `END_${match[1].toUpperCase()}`,
        position: { start, end }
      });
      debug && console.log(`Matched command: ${match[1].toUpperCase()}.`);
    } else if (
      (match = /^\\(subsection|section|title|author|begin|end|item)\s*/.exec(
        newStr
      ))
    ) {
      // control word; throw out subsequent whitespace
      end = endPoint(start, match[0]);
      ts.push({ type: t[match[1].toUpperCase()], position: { start, end } });
      debug && console.log(`Matched command: ${match[1].toUpperCase()}.`);
    } else if ((match = /^\\([a-zA-Z]+)\s*/.exec(newStr))) {
      // control word; throw out subsequent whitespace
      end = endPoint(start, match[0]);
      ts.push({ type: t.CWORD, value: match[1], position: { start, end } });
      debug && console.log(`Matched control word: ${match[1]}.`);
    } else if (
      (match = /^\\(?![A-Za-z#$%^&_{}~])([\u0020-\u007E\n])/.exec(newStr))
    ) {
      // control symbol
      end = endPoint(start, match[0]);
      ts.push({ type: t.CSYMBOL, value: match[1], position: { start, end } });
      debug && console.log(`Matched nonletter: '${match[0]}'}.`);
    } else if ((match = /^[A-Za-z]/.exec(newStr))) {
      // letter
      end = endPoint(start, match[0]);
      ts.push({ type: t.LETTER, value: match[0], position: { start, end } });
      debug && console.log(`Matched letter: '${match[0]}'.`);
    } else if ((match = /^(?![A-Za-z#$%^&_{}~])[\u0021-\u007E]/.exec(newStr))) {
      // nonletter character
      end = endPoint(start, match[0]);
      ts.push({ type: t.OTHER, value: match[0], position: { start, end } });
      debug && console.log(`Matched nonletter: '${match[0]}'}.`);
    } else if ((match = /^{/.exec(newStr))) {
      end = endPoint(start, match[0]);
      ts.push({ type: t.LBRACE, position: { start, end } });
      debug && console.log(`Matched ${t.LBRACE}.`);
    } else if ((match = /^}/.exec(newStr))) {
      end = endPoint(start, match[0]);
      ts.push({ type: t.RBRACE, position: { start, end } });
      debug && console.log(`Matched ${t.RBRACE}.`);
    } else if ((match = /^#/.exec(newStr))) {
      end = endPoint(start, match[0]);
      ts.push({ type: t.PARAM, position: { start, end } });
      debug && console.log(`Matched ${t.PARAM}.`);
    } else if ((match = /^\$/.exec(newStr))) {
      end = endPoint(start, match[0]);
      ts.push({ type: t.IMATH, position: { start, end } });
      debug && console.log(`Matched ${t.IMATH}.`);
    } else if ((match = /^%/.exec(newStr))) {
      end = endPoint(start, match[0]);
      ts.push({ type: t.COMMENT, position: { start, end } });
      debug && console.log(`Matched ${t.COMMENT}.`);
    } else if ((match = /^\^/.exec(newStr))) {
      end = endPoint(start, match[0]);
      ts.push({ type: t.SUP, position: { start, end } });
      debug && console.log(`Matched ${t.SUP}.`);
    } else if ((match = /^_/.exec(newStr))) {
      end = endPoint(start, match[0]);
      ts.push({ type: t.SUB, position: { start, end } });
      debug && console.log(`Matched ${t.SUB}.`);
    } else if ((match = /^&/.exec(newStr))) {
      end = endPoint(start, match[0]);
      ts.push({ type: t.ALIGN, position: { start, end } });
      debug && console.log(`Matched ${t.ALIGN}.`);
    } else {
      throw new Error("Lexing error: couldn't match.");
    }

    if (match) {
      newStr = newStr.slice(match[0].length);
    }
  }
  return ts.reverse();
};

module.exports = { lex };
