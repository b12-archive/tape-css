const assign = require('object-assign');
const find = require('array-find');
const drop = require('this-drop');
const arrayFrom = require('array-from');
const insertCss = require('insert-css');

const DOCUMENT_FRAGMENT_NODE = 11;

const getArgsAndOptions = (args) => {
  // Get args. Based on
  // https://github.com/substack/tape/blob/aadcf4a9/lib/test.js .
  const name = find(args, (arg) => typeof arg === 'string');
  const options = find(args, (arg) => typeof arg === 'object') || {};
  const callback = find(args, (arg) => typeof arg === 'function');

  // Get options.
  const {dom, styles} = options;
  const document = (
    options.document ||
    (typeof window !== 'undefined' && window.document) ||
    null
  );
  // TODO: Throw if there’s no `document`.

  return {
    name, callback, dom, styles, document,
    options: options::drop(['dom', 'styles', 'document']),
  };
};

const wrappedCallback = ({
  dom,
  styles,
  callback,
  document,
  only,
}) => (t) => {
  // Wrap the `callback` with our candy floss wonders:
  if (dom) {
    // Save the contents of our DocumentFragment before they get nuked.
    const domToRemove = (dom.nodeType === DOCUMENT_FRAGMENT_NODE ?
      arrayFrom(dom.children) :
      [dom]
    );

    // Add the DOM.
    document.body.appendChild(dom);

    // Schedule the cleanup.
    if (!only) t.on('end', () => {
      domToRemove.forEach(element => document.body.removeChild(element));
    });
  }

  if (styles) {
    const styleElement = insertCss(styles, {document});
    if (!only) t.on('end', () => {
      styleElement.parentNode.removeChild(styleElement);
    });
  }

  // Run the original callback.
  callback(t);
};

const tapeFunction = ({tape, only}) => (...args) => {
  const {name, options, callback, dom, styles, document} = (
    getArgsAndOptions(args)
  );

  (only ?
    tape.only :
    tape
  )(name, options,
    wrappedCallback({dom, styles, document, callback, only})
  );
};

 /**
  * If you use tape, you’ll feel right at home. Give us an instance of `tape`.
  * We won’t change its [existing API][] in any way. We just add a couple
  * of `options`:
  *
  * - `dom` – one or more DOM elements. We’ll add it to the `<body>`
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
  * [existing API]:     https://github.com/substack/tape#methods
  *
  * @jsig
  *   test(tape) => (
  *     name?        : String,
  *     options?: {
  *       // All original `tape` options, and:
  *       dom?       : Element | DocumentFragment
  *       styles?    : String
  *       document?  : Document
  *     },
  *     callback     : Function
  *   ) => void
  */
export default (tape) => assign(
  tapeFunction({tape, only: false}),
  tape,
  {
    only: tapeFunction({tape, only: true}),
  }
);
