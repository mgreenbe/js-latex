let Document = 'Document',
  Section = 'Section',
  Subsection = 'Subsection',
  Paragraph = 'Paragraph',
  BracedGroup = 'BracedGroup',
  Command = 'Command',
  Text = 'Text';

let containments = {
  Document: [Section, Subsection, Paragraph],
  Section: [Subsection, Paragraph],
  Paragraph: [Command]
};

let peek = a => a[a.length - 1];

let document = ts => {
  let children = [];
};
