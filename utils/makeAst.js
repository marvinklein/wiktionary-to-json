const parse = require('../utils/wikitext.js');

const tail = (arr) => {
  if (!arr || arr.length < 1) {
    return undefined;
  }
  return arr[arr.length - 1];
};

const makeStackToDepth = (stack, depth) => {
  while (stack.length < depth) {
    const l = { list: [], depth: stack.length + 1 };
    if (tail(stack)) {
      // add as last item in parent list item
      if (tail(tail(stack).list)) {
        tail(tail(stack).list).i.push(l);
      }
      // create parent list item if necessary
      else {
        tail(stack).list.push({ li: '', i: [ l ] });
      }
    }
    stack.push(l);
  }
};
const postprocess = (ast) => {
  let stack = [];
  const res = [];

  ast.forEach(item => {
    const depth = item.li && item.li.length;
    if (!depth) {
      // not a list item, just push
      res.push(item);
      stack = [];
    }
    else if (!tail(stack) || depth > tail(stack).depth) {
      makeStackToDepth(stack, depth);
      tail(stack).list.push(item);
      if (depth === 1) { res.push(tail(stack)); }
    }
    else if (depth === tail(stack).depth) {
      tail(stack).list.push(item);
    }
    else if (depth < tail(stack).depth) {
      stack = stack.slice(0, depth - tail(stack).depth);
      tail(stack).list.push(item);
    }
  });
  return res;
};

const work = (wikitext) => {
  return postprocess(parse(wikitext));
};

module.exports = work;
