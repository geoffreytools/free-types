import { test } from 'ts-test';
import { apply } from 'free-types-core';
import { $ParseNat } from '../../../utility-types/strings/$ParseNat';

test('Parse numbers in the range [0, 64]' as const, t => [
    t.equal<apply<$ParseNat, ['0']>, 0>(),
    t.equal<apply<$ParseNat, ['32']>, 32>(),
    t.equal<apply<$ParseNat, ['64']>, 64>(),
])

test('Return `number` otherwise' as const, t => [
    t.equal<apply<$ParseNat, ['-1']>, number>(),
    t.equal<apply<$ParseNat, ['length']>, number>(),
])

test('Signature' as const, t => [
    t.equal<$ParseNat['constraints'], [string]>(),
    t.equal<$ParseNat['type'], number>(),
])
