import { Type, apply } from 'free-types-core';
import { test } from 'ts-test';

interface $ArgsField extends Type<[number, string, boolean, number[]]> {
    type: this['arguments']
}

test('apply free type' as const, t => [
    t.equal<apply<$ArgsField, [1, 'foo', true, 2[]]>, [1, 'foo', true, 2[]]>(),
])

// @ts-expect-error: check incomplete input
type inconplete = apply<$ArgsField, [1, 'foo', true]>

// @ts-expect-error: check overshoot
type overshoot = apply<$ArgsField, [1, 'foo', true, 2[], undefined]>

// @ts-expect-error: check 1st arg
type wrong1stArg = apply<$ArgsField, [[1], 'foo', true, 2[]]>

// @ts-expect-error: check 2nd arg
type wrong2ndArg = apply<$ArgsField, [1, ['foo'], true, 2[]]>

// @ts-expect-error: check 3rd arg
type wrong3rdArg = apply<$ArgsField, [1, 'foo', [true], 2[]]>

// @ts-expect-error: check final arg
type wrongFinalArg = apply<$ArgsField, [1, 'foo', true, [2[]]]>
