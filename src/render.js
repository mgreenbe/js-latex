let Document = 'Document',
  DocumentTitle = 'DocumentTitle',
  SectionTitle = 'SectionTitle',
  SubsectionTitle = 'SubsectionTitle',
  Author = 'Author',
  Section = 'Section',
  Subsection = 'Subsection',
  Paragraph = 'Paragraph',
  BracedGroup = 'BracedGroup';

let tags = {
  Document: 'div',
  DocumentTitle: 'h1',
  SectionTitle: 'h2',
  SubsectionTitle: 'h3',
  Author: 'span',
  Section: 'div',
  Subsection: 'div',
  Paragraph: 'p',
  BracedGroup: 'span',
  Itemize: 'ul',
  Item: 'li'
};

let commands = {
  textbf: node => `<b>${node.children[0].children.map(render).join('\n')}</b>`
};
function render(node) {
  if (typeof node === 'string') {
    return node;
  } else if (node.type in commands) {
    return commands[node.type](node);
  } else {
    return `<${tags[node.type]} class="${node.type}">${node.children
      .map(render)
      .join('\n')}</${tags[node.type]}>`;
  }
}

module.exports = { render };
