let { endPoint } = require('./position.js');

let lex = (rule, str) => {
  let ts = [];
  let newStr = str;
  let end = { line: 1, column: 1, offset: 0 };
  while (newStr.length > 0) {
    let match, name, regEx, makeToken;
    let start = end;
    for ([name, regEx, makeToken] of rule) {
      if ((match = regEx.exec(newStr))) {
        break;
      }
    }
    if (match) {
      end = endPoint(start, match[0]);
      let token = Object.assign(
        { type: name, position: { start, end }, lexeme: match[0] },
        makeToken(name, match)
      );
      ts.push(token);
      newStr = newStr = newStr.slice(match[0].length);
    } else {
      throw new Error(
        `Token not found.\nStarting point: ${JSON.stringify(
          end
        )}\nString: ${newStr.slice(0, 60)}...`
      );
    }
  }
  return ts.reverse();
};

module.exports = { lex };
