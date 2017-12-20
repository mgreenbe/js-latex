let { lex } = require('./lexer.js');
let { rule } = require('./rules.js');
let { document } = require('./parse.js');
let { render } = require('./render.js');
let { prettyPrint } = require('html');
let vfile = require('to-vfile');

let file = vfile.readSync('test.tex', 'utf-8');
let tex = file.contents;

// let tex = `This paragraph contains an enumerate environment.\\begin{enumerate}
// \\item This is an item.

// This item has a second paragraph.  \\begin{itemize}
// \\item This is a nested environment.
// \\item It is unordered.
// \\begin{enumerate}
// \\item More!
// \\item Enumeration!
// \\end{enumerate}
// \\end{itemize}
// \\item This is a second item.
// \\end{enumerate}
// The paragraph continues here.

// \\section{One}This is a sentence. It's part of a paragraph.

//   Having skipped a line, we're now in a \\textbf{new} paragraph!\\section{Two }

//   Section two has a subsection:
//   \\subsection{Here is is.}
//   This is the subsection's content.

//   \\subsection{Another subsection}
//   Blah blah.

//   \\section{Final section}
//   Closing text.`;

// let tex = '\\#\\$\\%\\^\\&\\{\\}\\_\\begin{itemize}\\end{enumerate}';

let toks = lex(rule, tex);

console.log(toks.map(JSON.stringify).reverse());

// let output = toks.map(t => JSON.stringify(t)).join('\n');

// let doc = document(toks);

// // console.log(JSON.stringify(doc, null, 2));

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
