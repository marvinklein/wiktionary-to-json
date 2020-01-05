/* eslint-disable */
// Generated automatically by nearley, version undefined
// http://github.com/Hardmath123/nearley
const moo = require('moo');
const nearley = require('nearley');

function id(x) { return x[0]; }
var appendItem = function(a, b) { return function(d) { return d[a].concat([ d[b] ]); }; };
var append = function(d) {
  if (d[0].length && typeof d[0][d[0].length - 1] === 'string') {
    d[0][d[0].length - 1] = d[0][d[0].length - 1] + d[1];
  }
  else {
    d[0].push(d[1]);
  }
  return d[0];
};
var lists = function(d) {
  return d[0].concat({ li: d[1].text.trim(), i: d[2] });
};

const protocols = [
  'bitcoin:',
  'ftp://',
  'ftps://',
  'geo:',
  'git://',
  'gopher://',
  'http://',
  'https://',
  'irc://',
  'ircs://',
  'magnet:',
  'mailto:',
  'mms://',
  'news:',
  'nntp://',
  'redis://',
  'sftp://',
  'sip:',
  'sips:',
  'sms:',
  'ssh://',
  'svn://',
  'tel:',
  'telnet://',
  'urn:',
  'worldwind://',
  'xmpp:',
  '//'
];

const chars = { match: /.|\s/u, lineBreaks: true };
const schars = /[']/u;
const urlchars = /\S/u;
const inturlchars = chars;
const lexer = moo.states({
  main: {
    li: { match: /(?:^|\n)\s*[*#:;]+\s*/u, lineBreaks: true },
    nl: { match: /\n/u, lineBreaks: true },
    lparen: { match: /\{\{/u, lineBreaks: true, push: 'template' },
    lbrackd: { match: /\[\[/u, lineBreaks: true, push: 'link' },
    lbrack: { match: new RegExp('\\[(?=(?:' + protocols.join('|') + '))', 'u'), lineBreaks: true, push: 'extlink' },
    quotes: { match: /'{2,}/u },
    tagopen: { match: /<(?:small|sup|sub|ref)(?: \w+=\w+)*>\s*/u, lineBreaks: true, push: 'tag' },
    tag: { match: /<ref(?: \w+=\w+)*\/>/u },
    commentopen: { match: /<!--/u, push: 'comment' },
    char: chars,
    schar: schars
  },
  comment: {
    commentclose: { match: /-->/u, pop: true },
    char: { match: /(?:.|\s)/u, lineBreaks: true }
  },
  tag: {
    tagclose: { match: /\s*<\/(?:small|sup|sub|ref|math)>/u, lineBreaks: true, pop: true },
    lparen: { match: /\{\{/u, lineBreaks: true, push: 'template' },
    char: chars
  },
  template: {
    lparen: { match: /\{\{/u, lineBreaks: true, push: 'template' },
    rparen: { match: /\s*\}\}/u, lineBreaks: true, pop: true },
    lbrackd: { match: /\[\[/u, lineBreaks: true, push: 'link' },
    lbrack: { match: new RegExp('\\[(?=(?:' + protocols.join('|') + '))', 'u'), lineBreaks: true, push: 'extlink' },
    tagopen: { match: /<(?:small|sup|sub|ref|math)(?: \w+=\w+)*>\s*/u, lineBreaks: true, push: 'tag' },
    tag: { match: /<ref(?: \w+=\w+)*\/>/u },
    bar: { match: /\s*\|\s*/u, lineBreaks: true },
    eq: { match: /\s*=\s*/u, lineBreaks: true },
    char: chars,
    schar: schars
  },
  link: {
    rbrackd: { match: /\s*\]\]/u, lineBreaks: true, pop: true },
    bar: { match: '|', next: 'link2' },
    char: inturlchars
  },
  link2: {
    rbrackd: { match: /\s*\]\]/u, lineBreaks: true, pop: true },
    char: chars
  },
  extlink: {
    rbrack: { match: /\s*\]/u, lineBreaks: true, pop: true },
    space: { match: ' ', next: 'extlink2' },
    char: urlchars
  },
  extlink2: {
    rbrack: { match: /\s*\]/u, lineBreaks: true, pop: true },
    char: chars
  }
});
var grammar = {
  Lexer: lexer,
  ParserRules: [
    { 'name': 'lines', 'symbols': [ 'line' ], 'postprocess': id },
    { 'name': 'lines', 'symbols': [ 'lines', lexer.has('li') ? { type: 'li' } : li, 'line' ], 'postprocess': lists },
    { 'name': 'lines', 'symbols': [ 'lines', lexer.has('nl') ? { type: 'nl' } : nl, 'line' ], 'postprocess': d => d[0].concat(d[2]) },
    { 'name': 'line', 'symbols': [ 'w' ], 'postprocess': id },
    { 'name': 'comment', 'symbols': [ lexer.has('commentopen') ? { type: 'commentopen' } : commentopen, 'str', lexer.has('commentclose') ? { type: 'commentclose' } : commentclose ], 'postprocess': d => ({ tag: d[1] }) },
    { 'name': 'tag', 'symbols': [ lexer.has('tagopen') ? { type: 'tagopen' } : tagopen, 'w', lexer.has('tagclose') ? { type: 'tagclose' } : tagclose ], 'postprocess': d => ({ tag: d[1] }) },
    { 'name': 'link', 'symbols': [ lexer.has('lbrackd') ? { type: 'lbrackd' } : lbrackd, 'str', lexer.has('rbrackd') ? { type: 'rbrackd' } : rbrackd ], 'postprocess': d => ({ l: d[1] }) },
    { 'name': 'link', 'symbols': [ lexer.has('lbrackd') ? { type: 'lbrackd' } : lbrackd, 'str', lexer.has('bar') ? { type: 'bar' } : bar, 'str', lexer.has('rbrackd') ? { type: 'rbrackd' } : rbrackd ], 'postprocess': d => ({ l: d[1], t: d[3] }) },
    { 'name': 'extlink', 'symbols': [ lexer.has('lbrack') ? { type: 'lbrack' } : lbrack, 'str', lexer.has('rbrack') ? { type: 'rbrack' } : rbrack ], 'postprocess': d => ({ l: d[1] }) },
    { 'name': 'extlink', 'symbols': [ lexer.has('lbrack') ? { type: 'lbrack' } : lbrack, 'str', lexer.has('space') ? { type: 'space' } : space, 'str', lexer.has('rbrack') ? { type: 'rbrack' } : rbrack ], 'postprocess': d => ({ l: d[1], t: d[3] }) },
    { 'name': 'template', 'symbols': [ lexer.has('lparen') ? { type: 'lparen' } : lparen, 'title', 'templateParts', lexer.has('rparen') ? { type: 'rparen' } : rparen ], 'postprocess': d => ({ t: d[1], p: d[2] }) },
    { 'name': 'title', 'symbols': [ 'titlestr' ], 'postprocess': id },
    { 'name': 'w$ebnf$1', 'symbols': [] },
    { 'name': 'w$ebnf$1$subexpression$1$ebnf$1', 'symbols': [ 'str' ], 'postprocess': id },
    { 'name': 'w$ebnf$1$subexpression$1$ebnf$1', 'symbols': [], 'postprocess': function(d) { return null; } },
    { 'name': 'w$ebnf$1$subexpression$1', 'symbols': [ 'w$ebnf$1$subexpression$1$ebnf$1', 'nonstr' ] },
    { 'name': 'w$ebnf$1', 'symbols': [ 'w$ebnf$1$subexpression$1', 'w$ebnf$1' ], 'postprocess': function arrconcat(d) { return [ d[0] ].concat(d[1]); } },
    { 'name': 'w$ebnf$2', 'symbols': [ 'str' ], 'postprocess': id },
    { 'name': 'w$ebnf$2', 'symbols': [], 'postprocess': function(d) { return null; } },
    { 'name': 'w', 'symbols': [ 'w$ebnf$1', 'w$ebnf$2' ], 'postprocess': d => [ ...d[0].flat(), d[1] ].filter(i => i !== null) },
    { 'name': 'nonstr', 'symbols': [ 'template' ], 'postprocess': id },
    { 'name': 'nonstr', 'symbols': [ 'link' ], 'postprocess': id },
    { 'name': 'nonstr', 'symbols': [ 'extlink' ], 'postprocess': id },
    { 'name': 'nonstr', 'symbols': [ 'tag' ], 'postprocess': id },
    { 'name': 'nonstr', 'symbols': [ 'comment' ], 'postprocess': id },
    { 'name': 'nonstr', 'symbols': [ lexer.has('quotes') ? { type: 'quotes' } : quotes ], 'postprocess': id },
    { 'name': 'nonstr', 'symbols': [ lexer.has('tag') ? { type: 'tag' } : tag ], 'postprocess': id },
    { 'name': 'templateParts', 'symbols': [], 'postprocess': d => [] },
    { 'name': 'templateParts', 'symbols': [ 'templateParts', lexer.has('bar') ? { type: 'bar' } : bar, 'templatePart' ], 'postprocess': d => d[0].concat(d[2]) },
    { 'name': 'templatePart', 'symbols': [ 'w' ] },
    { 'name': 'templatePart$ebnf$1', 'symbols': [ 'str' ], 'postprocess': id },
    { 'name': 'templatePart$ebnf$1', 'symbols': [], 'postprocess': function(d) { return null; } },
    { 'name': 'templatePart$ebnf$2', 'symbols': [] },
    { 'name': 'templatePart$ebnf$2$subexpression$1', 'symbols': [ lexer.has('eq') ? { type: 'eq' } : eq, 'w' ], 'postprocess': d => [ '=', ...d[1] ] },
    { 'name': 'templatePart$ebnf$2', 'symbols': [ 'templatePart$ebnf$2$subexpression$1', 'templatePart$ebnf$2' ], 'postprocess': function arrconcat(d) { return [ d[0] ].concat(d[1]); } },
    { 'name': 'templatePart', 'symbols': [ 'templatePart$ebnf$1', lexer.has('eq') ? { type: 'eq' } : eq, 'w', 'templatePart$ebnf$2' ], 'postprocess': d => ({ [d[0]]: [ d[2], ...d[3] ].flat() }) },
    { 'name': 'titlestr$ebnf$1$subexpression$1', 'symbols': [ lexer.has('char') ? { type: 'char' } : char ] },
    { 'name': 'titlestr$ebnf$1$subexpression$1', 'symbols': [ lexer.has('schar') ? { type: 'schar' } : schar ] },
    { 'name': 'titlestr$ebnf$1$subexpression$1', 'symbols': [ lexer.has('eq') ? { type: 'eq' } : eq ] },
    { 'name': 'titlestr$ebnf$1', 'symbols': [ 'titlestr$ebnf$1$subexpression$1' ] },
    { 'name': 'titlestr$ebnf$1$subexpression$2', 'symbols': [ lexer.has('char') ? { type: 'char' } : char ] },
    { 'name': 'titlestr$ebnf$1$subexpression$2', 'symbols': [ lexer.has('schar') ? { type: 'schar' } : schar ] },
    { 'name': 'titlestr$ebnf$1$subexpression$2', 'symbols': [ lexer.has('eq') ? { type: 'eq' } : eq ] },
    { 'name': 'titlestr$ebnf$1', 'symbols': [ 'titlestr$ebnf$1$subexpression$2', 'titlestr$ebnf$1' ], 'postprocess': function arrconcat(d) { return [ d[0] ].concat(d[1]); } },
    { 'name': 'titlestr', 'symbols': [ 'titlestr$ebnf$1' ], 'postprocess': d => d[0].map(t => t[0].value).join('') },
    { 'name': 'str$ebnf$1$subexpression$1', 'symbols': [ lexer.has('char') ? { type: 'char' } : char ] },
    { 'name': 'str$ebnf$1$subexpression$1', 'symbols': [ lexer.has('schar') ? { type: 'schar' } : schar ] },
    { 'name': 'str$ebnf$1', 'symbols': [ 'str$ebnf$1$subexpression$1' ] },
    { 'name': 'str$ebnf$1$subexpression$2', 'symbols': [ lexer.has('char') ? { type: 'char' } : char ] },
    { 'name': 'str$ebnf$1$subexpression$2', 'symbols': [ lexer.has('schar') ? { type: 'schar' } : schar ] },
    { 'name': 'str$ebnf$1', 'symbols': [ 'str$ebnf$1$subexpression$2', 'str$ebnf$1' ], 'postprocess': function arrconcat(d) { return [ d[0] ].concat(d[1]); } },
    { 'name': 'str', 'symbols': [ 'str$ebnf$1' ], 'postprocess': d => d[0].map(t => t[0].value).join('') }
  ],
  ParserStart: 'lines'
};

module.exports = str => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  return parser.feed(str).results[0];
};
