let endPoint = (
  { line: startLine, column: startColumn, offset: startOffset },
  substr
) => {
  let lines = substr.split('\n');
  let endLine = startLine + lines.length - 1;
  let n = lines.length;
  let endColumn = (n === 1 ? startColumn : 1) + lines[n - 1].length;
  let endOffset = startOffset + substr.length;
  return { line: endLine, column: endColumn, offset: endOffset };
};

let substr = (position, str) =>
  str.slice(position.start.offset, position.end.offset);

module.exports = { endPoint, substr };

let str = '1234567890';
console.log(endPoint({ line: 1, column: 1, offset: 0 }, ''));
// let str = '1   \n   \n   2';

// let s = str.slice(0, 10);
// console.log(`\nsubstr: ^${s}$`);
// let P = { line: 1, column: 1, offset: 0 };
// let Q = endPoint(P, s);
// console.log(`start: ${JSON.stringify(P)}`);
// console.log(`end: ${JSON.stringify(Q)}`);
// let PQ = { start: P, end: Q };
// console.log(`computed substr: ^${substr(PQ, str)}$`);
// console.log(`substr === computed substr: ${substr(PQ, str) === s}\n`);

// s = str.slice(10);
// console.log(`\nsubstr: ^${s}$`);
// let R = endPoint(Q, s);
// console.log(`start: ${JSON.stringify(Q)}`);
// console.log(`end: ${JSON.stringify(R)}`);
// let QR = { start: Q, end: R };
// console.log(`computed substr: ^${substr(QR, str)}$`);
// console.log(`substr === computed substr: ${substr(QR, str) === s}\n`);
