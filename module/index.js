const assign = require('object-assign');
const find = require('array-find');
const drop = require('this-drop');

export default (tape) => {
  const tapeCss = (...args) => {
    // Determine arguments – based on
    // https://github.com/substack/tape/blob/aadcf4a9/lib/test.js .
    const name = find(args, (arg) => typeof arg === 'string');
    const options = find(args, (arg) => typeof arg === 'object') || {};
    const callback = find(args, (arg) => typeof arg === 'function');

    const {dom} = options;

    const document = (
      options.document ||
      (typeof window !== 'undefined' && window.document) ||
      null
    );

    // TODO: Throw if there’s no `document`;

    const wrappedCallback = (is) => {
      if (dom) document.body.appendChild(dom);
      callback(is);
      if (dom) document.body.removeChild(dom);
    };

    tape(
      name,
      options::drop(['dom']),
      wrappedCallback
    );
  };
  assign(tapeCss, tape);

  return tapeCss;
};
