import tapeCss_ from './module';

const test = require('tape-catch');
const clone = require('clone');
const {freeze} = Object;

const tape = require('tape');

test('Doesn’t change the `tape` instance', (is) => {
  const tapeClone = clone(tape);
  freeze(tapeClone.Test);
  freeze(tapeClone);

  is.doesNotThrow(
    () => tapeCss_(tapeClone),
    'doesn’t attempt to change any property'
  );

  is.end();
});

test('Doesn’t change the `tape` API', (is) => {
  const localTape = tape.createHarness({exit: false});
  const localTapeCss = tapeCss_(localTape);

  const tapStream = localTape.createStream({objectMode: true});

  is.plan(13);

  localTapeCss('1', (localIs) => {
    is.fail('`tape.only` works as before');
    localIs.end();
  });

  localTapeCss.only('2', (localIs) => {
    localIs.pass();
    localIs.ok(true);
    localIs.notOk(false);
    localIs.equal(1, 1);
    localIs.deepEqual([1], [1]);
    localIs.throws(() => { throw new Error('whatever'); });

    localIs.comment('Yeeaah!');
    localIs.skip('Whooah!');

    localIs.fail();
    localIs.ok(false);
    localIs.deepEqual([1], [2]);

    localIs.end();
  });

  const registerStreams = [
    ({type}) => is.equal(
      type, 'test',
      '`tape` works as before'
    ),

    ({operator, ok}) => is.deepEqual(
      [operator, ok],
      ['pass', true],
      '`t.pass` succeeds as before'
    ),

    ({operator, ok}) => is.deepEqual(
      [operator, ok],
      ['ok', true],
      '`t.ok` succeeds as before'
    ),

    ({operator, ok}) => is.deepEqual(
      [operator, ok],
      ['notOk', true],
      '`t.notOk` succeeds as before'
    ),

    ({operator, ok}) => is.deepEqual(
      [operator, ok],
      ['equal', true],
      '`t.equal` succeeds as before'
    ),

    ({operator, ok}) => is.deepEqual(
      [operator, ok],
      ['deepEqual', true],
      '`t.deepEqual` succeeds as before'
    ),

    ({operator, ok}) => is.deepEqual(
      [operator, ok],
      ['throws', true],
      '`t.throws` succeeds as before'
    ),

    (data) => is.equal(
      data,
      'Yeeaah!',
      '`t.comment` outputs as before'
    ),

    ({operator, skip}) => is.deepEqual(
      [operator, skip],
      ['skip', true],
      '`t.skip` skips as before'
    ),

    ({operator, ok}) => is.deepEqual(
      [operator, ok],
      ['fail', false],
      '`t.fail` fails as before'
    ),

    ({operator, ok}) => is.deepEqual(
      [operator, ok],
      ['ok', false],
      '`t.ok` fails as before'
    ),

    ({operator, ok}) => is.deepEqual(
      [operator, ok],
      ['deepEqual', false],
      '`t.deepEqual` fails as before'
    ),

    ({type}) => is.deepEqual(
      type,
      'end',
      '`t.end` ends as before'
    ),
  ].reduceRight(
    (callback, assertion) => () => tapStream.once('data', (data) => {
      assertion(data);
      callback();
    }),
    () => {}
  );

  registerStreams();
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
