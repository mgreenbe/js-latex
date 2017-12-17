let t = require('./tokens.js');
let n = require('./nodeTypes.js');
let c = require('./commands.js');

let debug = true;

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let peek = a => a[a.length - 1];

function document(ts) {
  debug && console.log('Parsing document...');
  let toks = [...ts];
  let children = [];
  let tok;
  while ((tok = peek(toks))) {
    debug && console.log(`n.Document/peek: ${JSON.stringify(tok)}`);
    switch (tok.type) {
      case t.BEGIN_ITEMIZE:
        debug && console.log('Calling env from document.');
        toks.pop();
        children.push(list(n.Itemize, toks));
        console.log(children);
        break;
      case t.BEGIN_ENUMERATE:
        debug && console.log('Calling env from document.');
        toks.pop();
        children.push(list(n.Enumerate, toks));
        console.log(children);
        break;
      case t.TITLE:
        debug && console.log('Calling title from document.');
        children.push({
          type: n.DocumentTitle,
          children: bracedGroup(toks).children
        });
        break;
      case t.AUTHOR:
        debug && console.log('Calling author from document.');
        children.push({
          type: n.Author,
          children: bracedGroup(toks).children
        });

        break;
      case t.LETTER:
      case t.OTHER:
      case t.CWORD:
      case t.CSYMBOL:
      case t.ESCAPED:
        debug && console.log('Calling paragraph from document.');
        children.push(paragraph(toks));
        debug && console.log('Returned to document from paragraph.');
        break;
      case t.SECTION:
        debug && console.log('Calling section from document.');
        children.push(section(toks));
        break;
      case t.SUBSECTION:
        debug && console.log('Calling subsection from document.');
        children.push(subsection(toks));
        break;
      default:
        throw new Error(`Unexpected token in n.Document: ${tok.type}`);
    }
  }
  return {
    type: n.Document,
    children
  };
}

function section(toks) {
  let children = [];

  console.assert(
    toks.pop().type === 'SECTION',
    'Expected a section to start with a SECTION token.'
  );

  let tok = peek(toks);
  if (tok.type === t.LBRACE) {
    debug && console.log('Getting section title.');
    children.push({
      type: n.SectionTitle,
      children: bracedGroup(toks).children
    });
  }
  tok = peek(toks);
  if (tok.type === t.SPACE || tok.type === t.PAR) {
    toks.pop();
  }
  console.assert(peek(toks).type !== t.SPACE && peek(toks).type !== t.PAR);

  while ((tok = peek(toks)) && tok.type !== t.SECTION) {
    switch (tok.type) {
      case t.LETTER:
      case t.OTHER:
      case t.CWORD:
      case t.CSYMBOL:
      case t.ESCAPED:
        debug && console.log('Calling paragraph from section.');
        children.push(paragraph(toks));
        break;
      case t.SUBSECTION:
        debug && console.log('Calling subsection from section.');
        children.push(subsection(toks));
        break;
      default:
        throw new Error(`Unexpected token in n.Section: ${tok.type}.`);
    }
  }
  return {
    type: n.Section,
    children
  };
}

function subsection(toks) {
  let children = [];

  console.assert(
    toks.pop().type === 'SUBSECTION',
    'Expected a subsection to start with a SUBSECTION token.'
  );

  let tok = peek(toks);
  if (tok.type === t.LBRACE) {
    debug && console.log('Getting subsection title.');
    children.push({
      type: n.SubsectionTitle,
      children: bracedGroup(toks).children
    });
  }

  tok = peek(toks);
  if (tok.type === t.SPACE || tok.type === t.PAR) {
    toks.pop();
  }
  console.assert(peek(toks).type !== t.SPACE && peek(toks).type !== t.PAR);

  while (
    (tok = peek(toks)) &&
    tok.type !== t.SECTION &&
    tok.type !== t.SUBSECTION
  ) {
    debug && console.log(`n.Subsection/peek: ${JSON.stringify(tok)}`);
    switch (tok.type) {
      case t.LETTER:
      case t.OTHER:
      case t.CWORD:
      case t.CSYMBOL:
      case t.ESCAPED:
        debug && console.log('Calling paragraph from subsection.');
        children.push(paragraph(toks));
        break;
      default:
        throw new Error(`Unexpected token in n.Subsection: ${tok.type}`);
    }
  }
  return {
    type: n.Subsection,
    children
  };
}

function bracedGroup(toks) {
  let children = [];

  let tok = toks.pop();
  console.assert(
    tok.type === t.LBRACE,
    'bracedGroup must start with a LBRACE token.'
  );

  while ((tok = peek(toks)) && tok.type !== t.RBRACE) {
    debug && console.log(`n.BracedGroup/peek: ${JSON.stringify(tok)}`);
    switch (tok.type) {
      case t.LETTER:
      case t.OTHER:
      case t.CWORD:
      case t.CSYMBOL:
      case t.ESCAPED:
        debug && console.log('Calling text from bracedgroup.');
        children.push(text(toks));
        break;
      default:
        throw new Error(`Unexpected token in bracedGroup: ${tok.type}`);
    }
  }
  let rBrace = toks.pop();
  console.assert(
    rBrace.type === t.RBRACE,
    'n.BracedGroup must start with a LBRACE token.'
  );
  return {
    type: n.BracedGroup,
    children
  };
}

function paragraph(toks) {
  let children = [];

  let tok;
  while (
    (tok = peek(toks)) &&
    tok.type !== t.PAR &&
    tok.type !== t.SECTION &&
    tok.type !== t.SUBSECTION &&
    tok.type !== t.ITEM &&
    tok.type !== t.END_ITEMIZE &&
    tok.type !== t.END_ENUMERATE
  ) {
    debug && console.log(tok.type, t.END_ITEMIZE, tok.type !== t.END_ITEMIZE);
    debug && console.log(`n.Paragraph/peek: ${JSON.stringify(tok)}`);
    switch (tok.type) {
      case t.LETTER:
      case t.SPACE:
      case t.OTHER:
      case t.ESCAPED:
        debug && console.log('Calling text from paragraph.');
        children.push(text(toks));
        break;
      case t.BEGIN_ITEMIZE:
        debug && console.log('Calling list (itemize) from document.');
        toks.pop();
        children.push(list(n.Itemize, toks));
        console.log(children);
        break;
      case t.BEGIN_ENUMERATE:
        debug && console.log('Calling list (enumerate) from document.');
        toks.pop();
        children.push(list(n.Enumerate, toks));
        console.log(children);
        break;
      case t.CWORD:
        debug && console.log('Calling command from paragraph.');
        children.push(command(toks));
        break;
      case t.CSYMBOL:
        throw new Error("I haven't implemented control symbols yet.");
        break;
      case t.IMATH:
        throw new Error("I haven't implemented inline math yet.");
        break;
      case t.DMATH:
        throw new Error("I haven't implemented displayed math yet.");
        break;
      default:
        throw new Error(`Unexpected token in bracedGroup: ${tok.type}`);
    }
  }
  console.assert(
    !tok ||
      tok.type === t.PAR ||
      tok.type === t.SECTION ||
      tok.type === t.SUBSECTION ||
      tok.type === t.ITEM ||
      tok.type === t.END_ITEMIZE ||
      tok.type === t.END_ENUMERATE,
    `n.Paragraph must end with a PAR, ITEM, END, SECTION, or SUBSECTION token, or with the end of the token stream. Encountered ${JSON.stringify(
      tok
    )}.`
  );
  if (tok && tok.type === t.PAR) {
    toks.pop();
  }
  return {
    type: n.Paragraph,
    children
  };
}

function command(toks) {
  let children = [];

  let tok = toks.pop();
  console.assert(
    tok.type === t.CWORD,
    'A command must start with a CWORD token.'
  );
  let name = tok.value;

  while ((tok = peek(toks)) && tok.type === t.LBRACE) {
    debug && console.log(`Command/peek: ${JSON.stringify(tok)}`);
    debug && console.log('Calling bracedGroup from command.');

    children.push(bracedGroup(toks));
  }
  return {
    type: name,
    children
  };
}

function text(toks) {
  let textBuf = '';
  let tok;
  while (
    (tok = peek(toks)) &&
    (tok.type === t.LETTER ||
      tok.type === t.SPACE ||
      tok.type === t.OTHER ||
      tok.type === t.ESCAPED)
  ) {
    debug && console.log(`Text/peek: ${JSON.stringify(tok)}`);
    textBuf = textBuf + tok.value;
    let t = toks.pop();
  }
  return textBuf;
}

function word(toks) {
  let word = '';
  while ((tok = peek(toks)) && tok.type === t.LETTER) {
    debug && console.log(`Word/peek: ${JSON.stringify(tok)}`);
    word = word + tok.value;
    let t = toks.pop();
  }
  return word;
}

function env(toks) {
  let tok;

  tok = toks.pop();
  console.assert(
    tok.type === t.LBRACE,
    '\\begin must be followed by an LBRACE token.'
  );

  let envName = word(toks);

  tok = toks.pop();
  console.assert(
    tok.type === t.RBRACE,
    'Environment name can only contain letters, [A-Za-z].'
  );
  console.log(envName);
  debug && console.log(`Calling e.${envName} from env.`);
  return e[envName](toks);
}

function list(env, toks) {
  let tok;

  console.assert(
    toks.length > 0,
    'End of token stream encountered while parsing list environment.'
  );

  let closer = t['END' + '_' + env.toUpperCase()];
  console.log(`Closer: ${closer}`);
  let children = [];
  while ((tok = peek(toks)) && tok.type !== closer) {
    console.log(`e.${env}/peek: ${JSON.stringify(tok)}`);
    switch (tok.type) {
      case t.ITEM:
        toks.pop();
        console.log(`Calling item from e.itemize.`);
        children.push(item(closer, toks));
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
    tok.type === closer,
    `Expected ${closer} token to terminate ${env} environment. Encountered ${JSON.stringify(
      tok
    )}`
  );
  return { type: n[env], children };
}

function item(closer, toks) {
  let children = [];
  while ((tok = peek(toks)) && tok.type !== t.ITEM && tok.type !== closer) {
    debug && console.log(`n.item/peek: ${JSON.stringify(tok)}`);
    switch (tok.type) {
      case t.BEGIN:
        console.assert(false, 'Not implemented yet.');
        break;
      case t.ITEM:
        break;
      case closer:
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
  return { type: n.Item, children };
}

module.exports = { document, paragraph };
