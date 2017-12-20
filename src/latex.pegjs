Document = [ \t\n]* children:(Section / Paragraph)* {return {type: "Document", children}}

Section = Section_t [ \t]* titleGroup:BracedGroup [ \t\n]* children:(Subsection / Paragraph)* 
{return {type: "Section", title: titleGroup.children, children}}

Subsection = Subsection_t [ \t]* titleGroup:BracedGroup [ \t\n]* children:Paragraph*
{return {type: "Subsection", title: titleGroup.children, children}}

Itemize = BeginItemize_t children:(Item)* EndItemize_t {return {type: "Itemize", children}}

Item = Item_t children:Paragraph* {return {type: "Item", children}}

Text = text:(Letter_t / Nonletter_t / Space_t)+ {return {type: "Text", content: text.join("")}}

Paragraph = children:(Itemize / DisplayMath / InlineMath / Text)+ EndPar_t? 
{console.log(JSON.stringify(children)); return {type: "Paragraph", children}} 

BracedGroup = LBrace_t content:Text RBrace_t {return {type: "BracedGroup", children: [content]}}

EndPar_t = (space_or_tab* "\n" space_or_tab* ("\n" space_or_tab*)+) {return "END_PAR"}

Section_t = "\\section" {return "SECTION"}

Subsection_t = "\\subsection" ws? {return "SUBSECTION"}

Item_t = "\\item" [ \t\n]* {return "ITEM"}

BeginItemize_t = "\\begin{itemize}" ws? { return "BEGIN_ITEMIZE" }

EndItemize_t = "\\end{itemize}" (Space_t ! "\n")? { return "END_ITEMIZE" }

BeginEnumerate_t = "\\begin{enumerate}" ws? { return "BEGIN_ENUMERATE" }

EndEnumerate_t = "\\end{enumerate}" (Space_t ! "\n")? { return "END_ENUMERATE" }

BeginEnv_t = "\\begin{" env:Letter_t+ "}" Space_t? {return "BEGIN_" + env.join("").toUpperCase()}

EndEnv_t = "\\end{" env:Letter_t+ "}" Space_t? {return "END_" + env.join("").toUpperCase()}

Space_t =  (space_or_tab* "\n" space_or_tab* / space_or_tab+) ! "\n" {return " "}

Nonletter_t = symbol:("." / "," / "!" / "?" / "@" / "'" / '"' / ":") {return symbol} / "\\" symbol:( "#" / "$" / "%" / "^" / "&" / "_" / "{" / "}" / "\\" ) {return symbol}

DisplayMath = "$$" math:[^$]* "$$" {return {type: "DisplayMath", content: math.join("")}}

InlineMath = "$" math:[^$]* "$" {return {type: "InlineMath", content: math.join("")}}

Letter_t = letter:[A-Za-z] {return letter}

LBrace_t = "{" {return "LBRACE"}

RBrace_t = "}" {return "RBRACE"}

space_or_tab = [ \t]

ws = [ \t\n]+