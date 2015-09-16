import tapeCss_ from './module';

const test = require('tape-catch');
const clone = require('clone');
const deepFreeze = require('deep-freeze');

const tape = require('tape');

test('Doesn’t change the `tape` instance', (is) => {
  const tapeClone = deepFreeze(clone(tape));

  is.doesNotThrow(
    () => tapeCss_(tapeClone),
    'doesn’t attempt to change any property'
  );

  is.end();
});

test.skip('Adds and removes DOM', (is) => {
  is.end();
});

test.skip('Adds and removes styles', (is) => {
  is.end();
});

test.skip('`test.only` works as they say in the ads', (is) => {
  is.end();
});
