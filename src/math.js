let fs = require('fs');

let topOf = stack => stack[stack.length - 1];

let tex = fs.readFileSync('test.tex', { encoding: 'UTF-8' });

let re = /\$\$|\$|\\\[|\\]|\{|}|\\\{|\\}/g;

let delims = {
  $: '$',
  $$: '$$',
  '\\[': '\\]'
};

let isCloser = (opener, match) =>
  match.text === delims[opener.text] && match.depth === opener.depth;

let makeMath = (tex, opener, match) => {
  let { text: oText, start: oStart, end: oEnd } = opener;
  let { text: mText, start: mStart, end: mEnd } = match;
  let n = oText.length;
  console.assert(
    mText.length === n,
    `Start delimiter, ${oText}, and end delimiter, ${mText}, have different lengths.`
  );
  return {
    openingDelimiter: oText,
    start: oStart,
    end: mEnd,
    content: tex.slice(oEnd, mStart).trim()
  };
};

let depth = 0;
let maths = [];
let opener;
let match;
while ((m = re.exec(tex)) !== null) {
  let match = {
    text: m[0],
    start: m.index,
    end: m.index + m[0].length,
    depth
  };

  if (match.text === '{') {
    depth += 1;
  }
  if (match.text === '}') {
    depth -= 1;
  }

  if (opener === undefined && match.text in delims) {
    opener = match;
    console.log(`opener: ${JSON.stringify(opener)}`);
  } else if (opener !== undefined && isCloser(opener, match)) {
    console.log(`closer: ${JSON.stringify(match)}`);
    maths.push(makeMath(tex, opener, match));
    opener = undefined;
  }
}

console.log(maths.map(o => JSON.stringify(o, null, 2)).join('\n'));

let newTex = maths.reverse().reduce((acc, math, i) => {
  let next = `${acc.slice(0, math.start)}__MATH__${maths.length -
    i -
    1}__${acc.slice(math.end)}`;
  return next;
}, tex);

console.log(newTex);
