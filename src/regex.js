module.exports = {
  space: /^[ \t]*\n[ \t]*|[ \t]+/,
  newLine: /^[ \t]*(?:\n[ \t]*){2,}/,
  controlWord: /^\\([a-zA-Z]+)\s*/,
  letter: /^[a-zA-Z]/,
  nonletter: /^[0-9]/,
  lbrace: /^{/,
  rbrace: /^}/
};
