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

test('Doesn’t change the `tape` API', (is) => {
  const localTape = tape.createHarness({exit: false});
  const localTest = tapeCss_(localTape);

  const tapStream = localTape.createStream({objectMode: true});
  tapStream.on('data', console.log);  // TODO: Test the output.

  localTest('1', (localIs) => {
    is.fail('`tape.only` works as before');
    localIs.end();
  });

  localTest.only('2', (localIs) => {
    localIs.pass();
    localIs.ok(true);
    localIs.notOk(false);
    localIs.equal(1, 1);
    localIs.deepEqual([1], [1]);
    localIs.throws(() => { throw new Error('whatever'); });

    localIs.skip('Whooah!');

    localIs.fail();
    localIs.ok(false);
    localIs.deepEqual([1], [2]);
    localIs.doesNotThrow(() => { throw new Error('whatever'); });

    localIs.end();
  });

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
