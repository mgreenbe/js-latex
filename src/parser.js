let n = require('./nodeTypes.js');
let Document = {
  LETTER: n.Paragraph,
  NONLETTER: n.Paragraph,
  BEGIN_ITEMIZE: n.Itemize,
  BEGIN_ENUMERATE: n.Enumerate,
  SECTION: n.Section,
  SUBSECTION: n.Subsection
};
