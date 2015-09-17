const assign = require('object-assign');
const find = require('array-find');
const drop = require('this-drop');
const arrayFrom = require('array-from');

const DOCUMENT_FRAGMENT_NODE = 11;

 /**
  * If you use tape, you’ll feel right at home. We don’t change [the API][] in any way.
  *
  * We add a couple of options to the `test` function:
  *
  * - `dom` – an Element or DocumentFragment. We’ll add it to the `<body>`
  *   before your test and clean it up after your test has ended.
  *   Default: nothing.
  *
  * - `styles` – a string of CSS. We’ll add it as a `<style>` to the `<head>`
  *   before your test – and clean it up after your test has ended.
  *   Default: nothing.
  *
  * - `document` – a custom implementation of `document`. It may be useful
  *   for testing outside a browser. Default: `window.document`.
  *
  * [the API]:     https://github.com/substack/tape#methods
  *
  * @jsig
  *   tapeCss(tape) => (
  *     name?: String,
  *     options?: {
  *       // All `tape` options +
  *       dom?:       Element | DocumentFragment
  *       styles?:    String
  *       document?:  Document
  *     },
  *     callback: Function
  *   ) => void
  */
export default (tape) => {
  const tapeCss = (...args) => {
    // Determine arguments – based on
    // https://github.com/substack/tape/blob/aadcf4a9/lib/test.js .
    const name = find(args, (arg) => typeof arg === 'string');
    const options = find(args, (arg) => typeof arg === 'object') || {};
    const callback = find(args, (arg) => typeof arg === 'function');

    const {dom} = options;

    // Get the `document` implementation.
    const document = (
      options.document ||
      (typeof window !== 'undefined' && window.document) ||
      null
    );
    // TODO: Throw if there’s no `document`;

    const wrappedCallback = (is) => {
      if (dom) {
        const domToRemove = (dom.nodeType === DOCUMENT_FRAGMENT_NODE ?
          arrayFrom(dom.children) :
          [dom]
        );

        document.body.appendChild(dom);

        is.on('end', () => {
          domToRemove.forEach(element => document.body.removeChild(element));
        });
      }

      callback(is);
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
