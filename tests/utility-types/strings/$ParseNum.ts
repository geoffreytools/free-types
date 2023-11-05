import { test } from 'ts-spec';
import { apply } from 'free-types-core';
import { $ParseNum } from 'src/utility-types/strings/$ParseNum';

test('Parse numbers', t => [
    t.equal<apply<$ParseNum, ['0']>, 0>(),
    t.equal<apply<$ParseNum, ['-16']>, -16>(),
    t.equal<apply<$ParseNum, ['300']>, 300>(),
    t.equal<apply<$ParseNum, ['6.4']>, 6.4>(),
])

test('Return `number` otherwise' as const, t => [
    t.equal<apply<$ParseNum, ['foo']>, number>(),
])

test('Signature', t => [
    t.equal<$ParseNum['constraints'], [string]>(),
    t.equal<$ParseNum['type'], number>(),
])
