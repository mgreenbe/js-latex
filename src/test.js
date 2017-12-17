let { lex } = require('./lex.js');
let { document } = require('./parse.js');
let { render } = require('./render.js');
let { prettyPrint } = require('html');

// let tex = `\\begin{itemize}\\item This is an item.\\item This is a second item.\\end{itemize}\\section{One}This is a sentence. It's part of a paragraph.

//   Having skipped a line, we're now in a \\textbf{new} paragraph!\\section{Two }

//   Section two has a subsection:
//   \\subsection{Here is is.}
//   This is the subsection's content.

//   \\subsection{Another subsection}
//   Blah blah.

//   \\section{Final section}
//   Closing text.`;

let tex = '\\begin{itemize}\\end{enumerate}';
let toks = lex(tex);

console.log(toks);

// let output = toks.map(t => JSON.stringify(t)).join('\n');

// let doc = document(toks);

// console.log(JSON.stringify(doc, null, 2));

// let html = render(doc);

// console.log(
//   prettyPrint(html, {
//     indent_size: 2,
//     indent_char: ' ',
//     max_char: 78,
//     brace_style: 'expand',
//     unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
//   })
// );
