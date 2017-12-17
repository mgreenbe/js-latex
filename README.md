| Node        | Children                                                   | Opener                                 | Closers                                              |
| ----------- | ---------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| Document    | Section, Subsection, Environment, Paragraph, Title, Author | -                                      | EOF                                                  |
| Section     | Subsection, Environment, Paragraph, Title                  | SECTION                                | EOF, SECTION                                         |
| Subsection  | Environment, Paragraph, Title                              | SUBSECTION                             | EOF, SECTION, SUBSECTION                             |
| Itemize     | Item                                                       | BEGIN_ITEMIZE                          | END_ITEMIZE                                          |
| Enumerate   | Item                                                       | BEGIN_ENUMERATE                        | END_ENUMERATE                                        |
| Item        | Paragraph                                                  | ITEM, END\_\*                          | ITEM                                                 |
| BracedGroup | Text, Command, InlineMath                                  | LBRACE                                 | RBRACE                                               |
| Paragraph   | Text, Command, InlineMath                                  | LETTER, CWORD, CSYMBOL, OTHER, ESCAPED | EOF, SECTION, SUBSECTION, PAR, ITEM, END\_\*, RBRACE |
| Text        | -                                                          | LETTER, OTHER, ESCAPED                 | EOF, SECTION, SUBSECTION, PAR, ITEM, END\_\*, RBRACE |

Encode espaced characters naturally as tokens.

Environments: Itemize, Enumerate, Theorem, Center, Displaymath, Equation, Equation*, Align, Align*, Multline, Multline\*
