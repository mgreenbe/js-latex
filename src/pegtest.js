let { parse } = require('./latex.js');

let tex = `This is a paragraph.

\\section{Section One}
This is a section.

This is a new paragraph. Here is an itemized list:
\\begin{itemize}
\\item Point one.
\\item Point two.
\\end{itemize}
The list is actually $a^2 + b^2 = c^2$ part $$\\int_a^x f'(t)dt = f(x) - f(a)$$ of the paragraph.


$$\\nabla f = \\lambda f$$
\\subsection{Subsection One Point One}
The first section contains a subsection.

This subsection contains two paragraphs.

\\section{Section Two}
And, one more section.`;

let ast = parse(tex);

let visit = node => {
  switch (node.type) {
    case 'Text':
      return node.content;
    case 'InlineMath':
      return `<span class="InlineMath">${node.content}</span>`;
    case 'DisplayMath':
      return `<div class="DisplayMath">${node.content}</div>`;
    case 'Itemize':
      return `<ul>${node.children.map(visit).join('')}</ul>`;
    case 'Item':
      return `<li>${node.children.map(visit).join('')}</li>`;
    case 'Section':
      return `<div class="Section"><h2>${node.title
        .map(visit)
        .join('')}</h2>${node.children.map(visit).join('')}</div>`;
    case 'Subsection':
      return `<div class="Subsection"><h3>${node.title
        .map(visit)
        .join('')}</h3>${node.children.map(visit).join('')}</div>`;
    default:
      return `<div class=${node.type}>${node.children
        .map(visit)
        .join('')}</div>`;
  }
};

console.log(visit(ast));
