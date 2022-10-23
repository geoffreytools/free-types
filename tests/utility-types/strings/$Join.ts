import { test } from 'ts-test';
import { apply } from 'free-types-core';
import { $Join } from '../../../utility-types/strings/$Join';

test('Intersperse a tuple of showables with the supplied separator and merge the result into one string' as const, t => [
    t.equal<apply<$Join<'-'>, [['A', 'B']]>, 'A-B'>(),
    t.equal<apply<$Join<'-'>, [[1, false, null]]>, '1-false-null'>(),
])

test('Return `""` when the input is empty' as const, t => [
    t.equal<apply<$Join<'-'>, [[]]>, ''>(),
])

test('Return the first element when the input has a length of 1' as const, t => [
    t.equal<apply<$Join<'-'>, [['A']]>, 'A'>(),
])