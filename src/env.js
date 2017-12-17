let t = require('./tokens.js');
let c = require('./commands.js');
let { document } = require('./parse.js');

console.log(document);

let itemize = 'itemize';

let peek = a => a[a.length - 1];

function word(toks) {
  let word = '';
  while ((tok = peek(toks)) && tok.type === t.LETTER) {
    debug && console.log(`Word/peek: ${JSON.stringify(tok)}`);
    word = word + tok.value;
    let t = toks.pop();
  }
  return word;
}

let debug = true;

module.exports = {
  itemize: toks => {
    // console.log(toks.reverse());
    let tok;

    console.assert(
      toks.length > 0,
      'End of token stream encountered while parsing list environment.'
    );

    // while (tok.type === t.SPACE || tok.type === t.PAR) {
    //   toks.pop();
    // }

    tok = peek(toks);
    console.assert(
      tok.type === t.ITEM,
      `List environment must begin with an \\item. Encountered ${JSON.stringify(
        tok
      )}`
    );

    let children = [];
    while ((tok = peek(toks)) && tok.type !== t.END) {
      switch (tok.type) {
        case t.ITEM:
          toks.pop();
          children.push(item(toks));
          break;
        default:
          throw new Error(
            `Expected \\item or \\end{itemize} in the top level of an itemize environment.
          Encountered the token ${JSON.stringify(tok)}.`
          );
      }
    }
    tok = toks.pop();
    console.assert(tok, 'Token stream ended before itemize environment did.');
    console.assert(
      toks.pop().type === t.END,
      'Expected END token to terminate itemize environment.'
    );
    console.assert(
      toks.pop().type === t.LBRACE,
      'Expected LBRACE token following \\end command.'
    );
    let envName = word(toks);
    console.assert(
      envName === itemize,
      `Encountered \\end{${envName}}, expected \\end{itemize}.`
    );
    console.assert(
      toks.pop().type === t.RBRACE,
      'Expected LBRACE token following \\end{itemize.'
    );
    return { type: n.Itemize, children };
  }
};

function item(toks) {
  let children = [];
  while ((tok = peek(toks))) {
    debug && console.log(`n.item/peek: ${JSON.stringify(tok)}`);
    switch (tok.type) {
      case t.BEGIN:
        console.assert(false, 'Not implemented yet.');
        break;
      case t.ITEM:
      case t.END:
        break;
      case t.LETTER:
      case t.OTHER:
      case t.CWORD:
      case t.CSYMBOL:
      case t.ESCAPED:
        debug && console.log('Calling paragraph from item.');
        children.push(paragraph(toks));
        break;
      default:
        throw new Error(`Unexpected token in n.Item: ${tok.type}`);
    }
  }
  return { type: n.item, children };
}
