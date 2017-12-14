let lex = str => {
  let s = str.trim();
  let ts = [];
  while (s.length > 0) {
    let match;
    if ((match = /^[ \t]*(?:\n[ \t]*){2,}/.exec(s))) {
      ts.push({ type: 'PAR' });
    } else if ((match = /^[ \t]*\n[ \t]*|^[ \t]+/.exec(s))) {
      ts.push({ type: 'SPACE' });
    } else if ((match = /^\\([a-zA-Z]+)\s*/.exec(s))) {
      ts.push({ type: 'CONTROL_WORD', value: match[1] });
    } else if ((match = /^[A-Za-z]/.exec(str))) {
      ts.push({ type: 'LETTER', value: match[0] });
    } else if ((match = /^[!"'\(\)\*\+,\-\./0-9:;<=>\?@`\|]/.exec(s))) {
      ts.push({ type: 'OTHER', value: match[0] });
    } else if (
      (match = /^(?:\\#|\\\$|\\%|\\\^|\\&|\\_|\\{|\\}|\\~|\\\\)/.exec(s))
    ) {
      ts.push({ type: 'ESCAPED', value: match[0][1] });
    } else if ((match = /^{/.exec(s))) {
      ts.push({ type: 'LBRACE' });
    } else if ((match = /^}/.exec(s))) {
      ts.push({ type: 'RBRACE' });
    } else {
      throw new Error("Lexing error: couldn't match.");
    }

    if (match) {
      str = str.slice(match[0].length);
    }
  }
  return ts;
};

module.exports = { lex };
