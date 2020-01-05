// `parse` takes an input string of wiktionary markup
// and returns a nested array of the document's sections.
// we do this step manually before the complete lexing/parsing
// step so that we can filter based on sections and we don't
// have to process entire sections we don't need.
/* eslint-disable no-magic-numbers */

const sectionExp = /(={2,5}.{1,200}?={2,5})/;
const titleExp = /(={2,5})(.{1,200}?)={2,5}/;

const parse = (wikiStr, filter) => {
  // each chunk is either a section heading or body
  const chunks = wikiStr.split(sectionExp);
  const depth = [ {} ];
  var ignore = 0;
  chunks.forEach((chunk, i) => {
    const matches = titleExp.exec(chunk);
    if (matches) {
      const matchDepth = matches[1].length;
      const newSection = { title: matches[2] };
      if (filter && ignore && matchDepth > ignore) {
        //
      }
      else if (filter && !filter.includes(newSection.title.trim())) {
        ignore = matchDepth;
      }
      else if (matchDepth === depth.length) {
        ignore = 0;
        depth[depth.length - 2].sections.push(newSection);
        depth[depth.length - 1] = newSection;
      }
      else if (matchDepth > depth.length) {
        ignore = 0;
        depth[depth.length - 1].sections = depth[depth.length - 1].sections || [];
        depth[depth.length - 1].sections.push(newSection);
        depth.push(newSection);
      }
      else if (matchDepth < depth.length) {
        ignore = 0;
        depth.splice(matchDepth - depth.length, depth.length - matchDepth);
        depth[depth.length - 2].sections.push(newSection);
        depth[depth.length - 1] = newSection;
      }
    }
    else if (!ignore) {
      depth[depth.length - 1].contents = chunk.trim();
    }
  });
  return depth[0];
};

module.exports = parse;
