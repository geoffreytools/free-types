import { Type, apply } from 'free-types-core';
import { test } from 'ts-test';

interface $NumFields extends Type<[number, string, boolean, number[]]> {
    type: [this[0], this[1], this[2], this[3]]
}

test('apply free type' as const, t => [
    t.equal<apply<$NumFields, [1, 'foo', true, 2[]]>, [1, 'foo', true, 2[]]>(),
])

// @ts-expect-error: check incomplete input
type inconplete = apply<$NumFields, [1, 'foo', true]>

// @ts-expect-error: check overshoot
type overshoot = apply<$NumFields, [1, 'foo', true, 2[], undefined]>

// @ts-expect-error: check 1st arg
type wrong1stArg = apply<$NumFields, [[1], 'foo', true, 2[]]>

// @ts-expect-error: check 2nd arg
type wrong2ndArg = apply<$NumFields, [1, ['foo'], true, 2[]]>

// @ts-expect-error: check 3rd arg
type wrong3rdArg = apply<$NumFields, [1, 'foo', [true], 2[]]>

// @ts-expect-error: check final arg
type wrongFinalArg = apply<$NumFields, [1, 'foo', true, [2[]]]>
