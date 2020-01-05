#!/usr/bin/env node
const yargs = require('yargs');
const bz2 = require('unbzip2-stream');
const fs = require('fs');
const XmlStream = require('xml-stream');
const makeSections = require('./utils/wikitextSections.js');
const JSONStream = require('JSONStream');
const progress = require('progress-stream');
const makeAst = require('./utils/makeAst.js');
const cliProgress = require('cli-progress');

const keep = [];
const redirectEx = /^#redirect:?\s?\[\[[^\]]+\]\]/i;

var done = 0;
var finished;

const argv = yargs
  .options({
    'o': {
      alias: 'outputFile',
      default: './data/wiktionary.json',
      describe: 'The output file',
      type: 'string'
    },
    'n': {
      alias: 'numEntries',
      describe: 'The number of entries to process',
      type: 'number'
    },
    's': {
      alias: 'startAt',
      default: 0,
      implies: 'n',
      describe: 'An offset at which to start processing'
    },
    'a': {
      alias: 'buildAST',
      describe: 'Build an AST for each section',
      default: false,
      type: 'boolean'
    },
    'f': {
      alias: 'find',
      describe: 'Only process a specific entry',
      type: 'string' },
    'w': {
      alias: 'wikitext',
      describe: 'Write the original wikitext markup to the output',
      type: 'boolean',
      default: false
    },
    'p': {
      alias: 'prune',
      default: './.config',
      describe: 'A file with a list of sections to keep',
      type: 'string'
    }
  })
  .argv;

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar1.start();

const fname = './data/enwiktionary-latest-pages-meta-current.xml.bz2';
const stat = fs.statSync(fname);
const str = progress({
  length: argv.numEntries ? argv.numEntries - argv.startAt : stat.size,
  time: 100 /* ms */
});

const inputStream = fs.createReadStream(fname)
  .pipe(str)
  .pipe(bz2());

const xmlStream = new XmlStream(inputStream);
xmlStream._preserveWhitespace = 1;

const parseSections = (sections) => {
  if (sections) {
    sections.forEach(section => {
      section.ast = makeAst(section.contents);
      parseSections(section.sections);
    });
  }
};

const outputStream = fs.createWriteStream(argv.outputFile);

const transformStream = JSONStream.stringify('[\n', ',\n', '\n]');
transformStream
  .pipe(outputStream);

if (argv.prune) {
  const f = fs.readFileSync(argv.prune, 'utf8');
  const lines = f.split('\n');
  lines.forEach(l => {
    const t = l.trim();
    if (t !== '' && !t.startsWith('//')) {
      keep.push(t);
    }
  });
}

str.on('progress', ({ percentage }) => {
  if (!argv.numEntries) {
    bar1.update(percentage);
  }
});


xmlStream.on('endElement: page', (item) => {
  if (item.ns === '0' && !finished) {
    const entry = makeSections(item.revision.text.$text, argv.prune ? keep : undefined);
    const out = { word: item.title };

    // redirects
    const redirectMatch = redirectEx.exec(entry.contents);
    if (redirectMatch) {
      out.redirectsTo = redirectMatch[1];
    }
    else {
      out.entry = entry;
      if (argv.wikitext) {
        out.wikitext = item.revision.text.$text;
      }
      if (argv.buildAST) { parseSections(out.entry.sections); }
    }
    if (argv.find) {
      if (argv.find === item.title) {
        transformStream.write(out);
        xmlStream.emit('end');
        inputStream.destroy();
      }
    }
    else if (done >= argv.startAt) {
      if (!transformStream.write(out)) {
        xmlStream.pause();
        transformStream.once('drain', () => xmlStream.resume());
      }
    }
    if (argv.numEntries) {
      done++;
      // console.log('update')
      bar1.update(100 * done / (argv.numEntries - argv.startAt));
      if (done === argv.numEntries + argv.startAt) {
        // bar1.update(100);
        xmlStream.emit('end');
        inputStream.destroy();
        finished = true;
      }
    }
  }
});

xmlStream.on('end', (item) => {
  transformStream.end();
  bar1.stop();
});
